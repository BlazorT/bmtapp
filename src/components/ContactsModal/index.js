// Main exports for ContactsModal module

// Main component
export { default as ContactsModal } from './ContactsModal';

// Sub-components (if needed individually)
export { default as PermissionRequest } from './PermissionRequest';
export { default as SearchAndActions } from './SearchAndActions';
export { default as SelectedAlbumBanner } from './SelectedAlbumBanner';
export { default as FloatingActionButton } from './FloatingActionButton';
export { default as ContactsList } from './ContactsList';
export { default as AlbumSelector } from './AlbumSelector';
export { default as NewAlbumForm } from './NewAlbumForm';
export { default as ConfirmationModal } from './ConfirmationModal';

// Hooks
export { useContactsData } from './hooks/useContactsData';
export { useAlbumOperations } from './hooks/useAlbumOperations';
export { useWhatsAppVerification } from './hooks/useWhatsAppVerification';

// Utilities
export * from './utils/contactUtils';
