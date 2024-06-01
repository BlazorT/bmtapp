import React, {useEffect} from 'react';
import {Platform, UIManager} from 'react-native';
import AppView from './AppView';

const EnhancedAppView = () => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  return <AppView />;
};

export default AppView;
