import { useMemo } from 'react';
import {
  deduplicateContacts,
  filterContactsBySearch,
  sortContacts,
} from '../utils/contactUtils';

/**
 * Hook for managing contacts data, filtering, and deduplication
 */
export const useContactsData = ({ contacts, searchText, selectedContacts }) => {
  const filteredContacts = useMemo(() => {
    // 1. Deduplicate using normalized phone
    let list = deduplicateContacts(contacts);

    // 2. Search filter (name OR normalized phone)
    list = filterContactsBySearch(list, searchText);

    // 3. Sort (selected first, then name)
    return sortContacts(list, selectedContacts);
  }, [contacts, searchText, selectedContacts]);

  return {
    filteredContacts,
  };
};
