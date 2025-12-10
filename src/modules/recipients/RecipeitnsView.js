import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import RecipientsList from '../../components/campaignComponents/RecipientsList';
import { useTheme } from '../../hooks/useTheme';

const RecipeitnsView = () => {
  const theme = useTheme();
  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <RecipientsList />
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
