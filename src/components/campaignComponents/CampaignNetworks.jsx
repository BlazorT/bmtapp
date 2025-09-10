import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { safeJSONParse } from '../../helper/dateFormatter';
import NetworkMycampaign from '../../components/NetworkMycampaign';

const CampaignNetworks = ({ campaign }) => {
  const theme = useTheme();
  const compaignsdetails = safeJSONParse(campaign?.compaignsdetails, []);

  const renderHeader = () => (
    <View style={styles.container}>
      {['Network', 'Total', 'Delivered', 'Remaining'].map((label, index) => (
        <Text
          key={label}
          style={[
            styles.headerText,
            {
              color: theme.textColor,
              width:
                index === 0
                  ? '17%'
                  : index === 1
                    ? '23%'
                    : index === 2
                      ? '22%'
                      : '23%',
            },
          ]}
        >
          {label}
        </Text>
      ))}
    </View>
  );

  const renderItem = ({ item }) => <NetworkMycampaign {...item} />;

  return (
    <View>
      {renderHeader()}
      <FlatList
        data={compaignsdetails}
        keyExtractor={(item, id) => id.toString()}
        renderItem={renderItem}
        numColumns={1}
        horizontal={false}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width - 20,
    marginHorizontal: 10,
    marginTop: 6,
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default CampaignNetworks;
