import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import CustomAlert from '../components/Alert';

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const [config, setConfig] = useState(null);
  const resolveRef = useRef(null);

  const showAlert = useCallback(({ title, message, type = 'default' }) => {
    return new Promise(resolve => {
      resolveRef.current = resolve;
      setConfig({ title, message, type, kind: 'alert' });
    });
  }, []);

  const showConfirm = useCallback(({ title, message, type = 'warning' }) => {
    return new Promise(resolve => {
      resolveRef.current = resolve;
      setConfig({ title, message, type, kind: 'confirmation' });
    });
  }, []);

  const handleHide = useCallback(() => {
    resolveRef.current?.(false);
    setConfig(null);
  }, []);

  const handleOK = useCallback(() => {
    resolveRef.current?.(true);
    setConfig(null);
  }, []);

  const handleConfirm = useCallback(() => {
    resolveRef.current?.(true);
    setConfig(null);
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      {config && (
        <CustomAlert
          Visible={!!config}
          Title={config.title}
          Massage={config.message}
          massagetype={config.type}
          alerttype={config.kind}
          hide={handleHide}
          OK={handleOK}
          confirm={handleConfirm}
        />
      )}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlert must be used inside <AlertProvider>');
  return ctx;
}
