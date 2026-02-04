import { Linking } from 'react-native';

/**
 * Normalize phone number to last 10 digits for comparison
 */
export const normalizePhone = phone => {
  if (!phone) return '';

  // Keep digits only
  const digits = phone.replace(/\D/g, '');

  // Take last 10 digits (most reliable universal match)
  return digits.slice(-10);
};

/**
 * Process raw device contacts into structured format
 */
export const processContacts = deviceContacts => {
  return deviceContacts
    .map(contact => {
      const phoneNumbers =
        contact.phoneNumbers
          ?.map(p => p.number.replace(/[\s\-\(\)]/g, ''))
          .filter(num => /^[0-9+]+$/.test(num)) || [];

      const emails = contact.emailAddresses?.map(e => e.email) || [];

      const name =
        contact.displayName ||
        `${contact.givenName ?? ''} ${contact.familyName ?? ''}`.trim();

      return {
        id: contact.recordID,
        name: name || null,
        phoneNumbers,
        emails,
        primaryContact: phoneNumbers[0] || emails[0] || null,
        type: phoneNumbers[0] ? 'phone' : 'email',
      };
    })
    .filter(contact => contact.primaryContact)
    .filter(contact => {
      const len = contact.primaryContact.length;
      return !(len >= 1 && len <= 4);
    })
    .filter(contact => contact.name && contact.name.length > 1)
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return nameA.localeCompare(nameB);
    });
};

/**
 * Get contact types (phone and/or email)
 */
export const getContactTypes = contact => {
  const types = [];
  if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
    types.push('phone');
  }
  if (contact.emails && contact.emails.length > 0) {
    types.push('email');
  }
  return types;
};

/**
 * Get network IDs for contact type
 * Network IDs: 1 = SMS, 2 = WhatsApp, 3 = Email
 */
export const getNetworkIdsForContactType = type => {
  if (type === 'phone') return [1, 2]; // SMS, WhatsApp
  if (type === 'email') return [3]; // Email
  return [];
};

/**
 * Check if contact exists in specific album
 */
export const existsInAlbum = (contact, albumId, recipients) => {
  if (!recipients || !Array.isArray(recipients)) return false;
  return recipients.some(
    r => r.contentId === contact.primaryContact && r.albumId === albumId,
  );
};

/**
 * Check if album is compatible with selected contacts
 */
export const isAlbumCompatibleWithContacts = (album, selectedContactsList) => {
  const albumNetworkId = album.networkid;
  return selectedContactsList.some(contact => {
    const contactTypes = getContactTypes(contact);
    return contactTypes.some(type => {
      const networkIds = getNetworkIdsForContactType(type);
      return networkIds.includes(albumNetworkId);
    });
  });
};

/**
 * Check if all selected contacts exist in album
 */
export const allContactsExistInAlbum = (
  album,
  selectedContactsList,
  recipients,
) => {
  const compatibleContacts = selectedContactsList.filter(contact => {
    const contactTypes = getContactTypes(contact);
    return contactTypes.some(type => {
      const networkIds = getNetworkIdsForContactType(type);
      return networkIds.includes(album.networkid);
    });
  });

  if (compatibleContacts.length === 0) return false;

  return compatibleContacts.every(contact =>
    existsInAlbum(contact, album.id, recipients),
  );
};

/**
 * Count how many selected contacts exist in album
 */
export const countContactsInAlbum = (
  album,
  selectedContactsList,
  recipients,
) => {
  const compatibleContacts = selectedContactsList.filter(contact => {
    const contactTypes = getContactTypes(contact);
    return contactTypes.some(type => {
      const networkIds = getNetworkIdsForContactType(type);
      return networkIds.includes(album.networkid);
    });
  });

  const existingCount = compatibleContacts.filter(contact =>
    existsInAlbum(contact, album.id, recipients),
  ).length;

  return { existing: existingCount, total: compatibleContacts.length };
};

/**
 * Check if contact exists in all selected albums
 */
export const contactExistsInAllSelectedAlbums = (
  contact,
  selectedAlbums,
  albumList,
  recipients,
) => {
  if (selectedAlbums.size === 0) return false;

  const contactTypes = getContactTypes(contact);
  const compatibleAlbums = Array.from(selectedAlbums)
    .map(albumId => albumList.find(a => a.id === albumId))
    .filter(
      album =>
        album &&
        contactTypes.some(type => {
          const networkIds = getNetworkIdsForContactType(type);
          return networkIds.includes(album.networkid);
        }),
    );

  if (compatibleAlbums.length === 0) return false;

  return compatibleAlbums.every(album =>
    existsInAlbum(contact, album.id, recipients),
  );
};

/**
 * Count albums contact is in
 */
export const countAlbumsForContact = (contact, albumList, recipients) => {
  if (!albumList) return 0;
  return albumList.filter(album => existsInAlbum(contact, album.id, recipients))
    .length;
};

/**
 * Deduplicate contacts using normalized phone
 */
export const deduplicateContacts = contacts => {
  const seen = new Set();

  return contacts.filter(contact => {
    const key = normalizePhone(contact.primaryContact);

    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

/**
 * Filter contacts by search text
 */
export const filterContactsBySearch = (contacts, searchText) => {
  if (!searchText?.trim()) return contacts;

  const searchLower = searchText.toLowerCase();
  const searchDigits = searchText.replace(/\D/g, '');
  const searchKey = searchDigits ? searchDigits.slice(-10) : '';

  return contacts.filter(contact => {
    const nameMatch = contact.name?.toLowerCase().includes(searchLower);

    const phoneMatch =
      searchKey &&
      normalizePhone(contact.primaryContact).includes(
        searchKey.replace(/^0/, ''),
      );

    return nameMatch || phoneMatch;
  });
};

/**
 * Sort contacts (selected first, then by name)
 */
export const sortContacts = (contacts, selectedContacts) => {
  return [...contacts].sort((a, b) => {
    const aSelected = selectedContacts.has(a.id);
    const bSelected = selectedContacts.has(b.id);

    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;

    return (a.name ?? '').localeCompare(b.name ?? '');
  });
};
