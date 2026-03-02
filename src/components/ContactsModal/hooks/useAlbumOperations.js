import { useState, useMemo } from 'react';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import servicesettings from '../../../modules/dataservices/servicesettings';
import {
  getContactTypes,
  getNetworkIdsForContactType,
  existsInAlbum,
} from '../utils/contactUtils';

/**
 * Hook for managing album operations (create, submit, group)
 */
export const useAlbumOperations = ({
  albumList,
  networks,
  user,
  fetchAlbumList,
  fetchRecipients,
  recipients,
  filteredContacts,
  selectedContacts,
  selectedAlbums,
  setSelectedContacts,
  setSelectedAlbums,
  setShowAlbumSelector,
  setShowConfirmation,
  setSubmittingBatch,
}) => {
  // New album form states
  const [showNewAlbumForm, setShowNewAlbumForm] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumCode, setNewAlbumCode] = useState(
    moment().local().format('DDMMYYYY'),
  );
  const [newAlbumDesc, setNewAlbumDesc] = useState('');
  const [newAlbumNetworkId, setNewAlbumNetworkId] = useState(-1);
  const [creatingAlbumLoading, setCreatingAlbumLoading] = useState(false);

  // Group albums by network
  const groupedAlbums = useMemo(() => {
    if (!albumList || !networks) return {};

    const grouped = {};

    networks.forEach(network => {
      const networkAlbums = albumList.filter(
        album => album.networkid === network.id,
      );
      if (networkAlbums.length > 0) {
        grouped[network.id] = {
          network,
          albums: networkAlbums,
        };
      }
    });

    return grouped;
  }, [albumList, networks]);

  // Create new album
  const createNewAlbum = async (albumData = null) => {
    const albumName = albumData?.name || newAlbumName;
    const albumCode = albumData?.code || newAlbumCode;
    const albumDesc = albumData?.desc || newAlbumDesc;
    const albumNetworkId =
      albumData?.networkId !== undefined
        ? albumData.networkId
        : newAlbumNetworkId;

    if (!albumName.trim() || !albumCode.trim() || albumNetworkId === -1) {
      Toast.show('Please enter album name, code, and select network');
      return { albumId: null, networkId: null };
    }

    try {
      setCreatingAlbumLoading(true);
      const body = {
        Id: 0,
        Orgid: user?.orgId,
        Name: albumName.trim(),
        Code: albumCode.trim(),
        Desc: albumDesc.trim(),
        Networkid: networks[albumNetworkId]?.id,
        Status: 1,
        CreatedBy: user?.id,
        LastUpdatedBy: user?.id,
        CreatedAt: moment().utc().format(),
        LastUpdatedAt: moment().utc().format(),
        RowVer: 1,
      };

      const headerFetch = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
          Authorization: servicesettings.AuthorizationKey,
        },
      };

      const response = await fetch(
        servicesettings.baseuri + 'Compaigns/submitalbumlist',
        headerFetch,
      );

      if (!response.ok) {
        Toast.show('Failed to create album');
        return { albumId: null, networkId: null };
      }

      const res = await response.json();

      if (res?.status) {
        Toast.show('Album created successfully');
        setNewAlbumName('');
        setNewAlbumCode(moment().local().format('DDMMYYYY'));
        setNewAlbumDesc('');
        setNewAlbumNetworkId(-1);
        setShowNewAlbumForm(false);
        await fetchAlbumList?.();
        return { albumId: res.data?.id || res.id, networkId: body.Networkid };
      } else {
        Toast.show(res?.message || 'Failed to create album');
        return { albumId: null, networkId: null };
      }
    } catch (error) {
      console.error('Error creating album:', error);
      Toast.show('Error creating album');
      return { albumId: null, networkId: null };
    } finally {
      setCreatingAlbumLoading(false);
    }
  };

  // Calculate submission summary
  const getSubmissionSummary = () => {
    const selectedContactsList = filteredContacts.filter(c =>
      selectedContacts.has(c.id),
    );

    const summary = Array.from(selectedAlbums)
      .map(albumId => {
        const album = albumList.find(a => a.id === albumId);
        if (!album) return null;

        const compatibleContacts = selectedContactsList.filter(contact => {
          const contactTypes = getContactTypes(contact);
          return contactTypes.some(type => {
            const networkIds = getNetworkIdsForContactType(type);
            return networkIds.includes(album.networkid);
          });
        });

        const newContacts = compatibleContacts.filter(
          contact => !existsInAlbum(contact, album.id, recipients),
        );

        const existingContacts = compatibleContacts.filter(contact =>
          existsInAlbum(contact, album.id, recipients),
        );

        return {
          album,
          newCount: newContacts.length,
          existingCount: existingContacts.length,
          totalCompatible: compatibleContacts.length,
        };
      })
      .filter(Boolean);

    return summary;
  };

  // Submit selected contacts to selected albums
  const submitSelectedContactsToAlbums = async () => {
    if (selectedAlbums.size === 0) {
      Toast.show('Please select at least one album');
      return;
    }

    const selectedContactsList = filteredContacts.filter(c =>
      selectedContacts.has(c.id),
    );

    if (selectedContactsList.length === 0) {
      Toast.show('No contacts selected');
      return;
    }

    setSubmittingBatch(true);

    try {
      const requests = [];

      for (const albumId of selectedAlbums) {
        const album = albumList.find(a => a.id === albumId);
        if (!album) continue;

        const albumNetworkId = album.networkid;

        // Filter contacts compatible with this album's network
        const compatibleContacts = selectedContactsList.filter(contact => {
          // Skip if already exists
          if (existsInAlbum(contact, albumId, recipients)) return false;

          const contactTypes = getContactTypes(contact);
          return contactTypes.some(type => {
            const networkIds = getNetworkIdsForContactType(type);
            return networkIds.includes(albumNetworkId);
          });
        });

        if (compatibleContacts.length === 0) continue;

        // Separate phone and email contacts
        const phoneContacts = compatibleContacts
          .filter(c => c.phoneNumbers && c.phoneNumbers.length > 0)
          .map(c => c.primaryContact)
          .filter(p => p && /^[0-9+]+$/.test(p));

        const emailContacts = compatibleContacts
          .filter(c => c.emails && c.emails.length > 0)
          .flatMap(c => c.emails)
          .filter(email => email && email.length > 3);

        // Create request based on album network
        if ([1, 2].includes(albumNetworkId) && phoneContacts.length > 0) {
          // SMS or WhatsApp album
          requests.push({
            id: 0,
            orgId: user?.orgId,
            networkId: albumNetworkId,
            contentlst: phoneContacts,
            desc: '',
            albumid: albumId,
            createdBy: user?.id,
            createdAt: moment().utc().format(),
            lastUpdatedAt: moment().utc().format(),
            rowVer: 1,
          });
        } else if (albumNetworkId === 3 && emailContacts.length > 0) {
          // Email album
          requests.push({
            id: 0,
            orgId: user?.orgId,
            networkId: 3,
            contentlst: emailContacts,
            desc: '',
            albumid: albumId,
            createdBy: user?.id,
            createdAt: moment().utc().format(),
            lastUpdatedAt: moment().utc().format(),
            rowVer: 1,
          });
        }
      }

      if (requests.length === 0) {
        Toast.show('No new contacts to add');
        setSubmittingBatch(false);
        return;
      }

      const headerFetch = {
        method: 'POST',
        body: JSON.stringify(requests),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
          Authorization: servicesettings.AuthorizationKey,
        },
      };

      const response = await fetch(
        servicesettings.baseuri + 'Compaigns/postCompaignContactData',
        headerFetch,
      );

      if (!response.ok) {
        Toast.show('Failed to add contacts to albums');
        return;
      }
      const res = await response.json();
      if (res?.status) {
        Toast.show(
          `Successfully added contacts to ${selectedAlbums.size} album(s)`,
        );
        await fetchRecipients();
        setSelectedContacts(new Set());
        setSelectedAlbums(new Set());
        setShowAlbumSelector(false);
        setShowConfirmation(false);
      } else {
        Toast.show(res?.message || 'Failed to add contacts to albums');
      }
    } catch (error) {
      console.error('Error adding contacts to albums:', error);
      Toast.show('Error adding contacts to albums');
    } finally {
      setSubmittingBatch(false);
    }
  };

  return {
    groupedAlbums,
    createNewAlbum,
    submitSelectedContactsToAlbums,
    getSubmissionSummary,
    showNewAlbumForm,
    setShowNewAlbumForm,
    newAlbumName,
    setNewAlbumName,
    newAlbumCode,
    setNewAlbumCode,
    newAlbumDesc,
    setNewAlbumDesc,
    newAlbumNetworkId,
    setNewAlbumNetworkId,
    creatingAlbumLoading,
  };
};
