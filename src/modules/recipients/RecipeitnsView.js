import { Dimensions, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import RecipientsList from '../../components/campaignComponents/RecipientsList';

const RecipeitnsView = () => {
  const theme = useTheme();
  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <RecipientsList isModal={false} isOpen={true} />
    </View>
  );
};

export default RecipeitnsView;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    textAlign: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    flex: 1,
    backgroundColor: 'white',
    width: Dimensions.get('window').width,
  },
});
