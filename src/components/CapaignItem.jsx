import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import servicesettings from '../modules/dataservices/servicesettings';
import BDMT from '../../assets/images/pepsilogo.png';
import { dateFormatter, safeJSONParse } from '../helper/dateFormatter';
import AppSwipeable from './Swipeable';
import CampaignRightAction from './CampaignRightAction';
import { useNavigation } from '@react-navigation/native';

const CapaignItem = ({ item, loadCampiagns }) => {
  const theme = useTheme();
  const { navigate } = useNavigation();
  const [imgErr, setImgErr] = useState(false);

  const swipeableRow = useRef(null);

  if (!item) return null;

  const imgUrl = servicesettings.Imagebaseuri + item?.logoAvatar;
  const networkCount = safeJSONParse(item?.compaignsdetails, []);

  //   console.log({ item });

  const toCampaignDetails = () => {
    navigate('Campaign Details', {
      campaign: item,
    });
  };
  return (
    <AppSwipeable
      swipeableRef={swipeableRow}
      friction={2}
      renderRightActions={() => (
        <CampaignRightAction
          campaign={item}
          swipeableRow={swipeableRow}
          loadCampiagns={loadCampiagns}
        />
      )}
      renderLeftActions={undefined}
    >
      <TouchableOpacity
        onPress={toCampaignDetails}
        style={[
          styles.card,
          {
            backgroundColor: theme.cardBackColor,
            borderColor: item.status !== 1 ? '#8B0000' : theme.textColor,
          },
        ]}
      >
        <Image
          source={imgErr || !item?.logoAvatar ? BDMT : { uri: imgUrl }}
          style={styles.img}
          onError={() => setImgErr(true)}
        />
        <View style={styles.contentContainer}>
          <View style={{ rowGap: 10 }}>
            <Text style={{ color: theme.textColor }}>{item.name}</Text>
            <Text style={{ color: theme.textColor }}>
              {dateFormatter(item.startTime)}
            </Text>
          </View>
          <View style={{ rowGap: 10, alignItems: 'flex-end' }}>
            <View
              style={[
                styles.bubble,
                {
                  backgroundColor: theme.buttonBackColor,
                },
              ]}
            >
              <Text
                style={{
                  color: theme.textColor,
                }}
              >
                {networkCount?.length}
              </Text>
            </View>
            <Text style={{ color: theme.textColor }}>
              {dateFormatter(item.finishTime)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </AppSwipeable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 0,
    borderRadius: 5,
    padding: 6,
    borderWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
  },
  img: {
    borderRadius: 30,
    width: 50,
    height: 50,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  bubble: {
    width: 25,
    height: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
  },
});

export default CapaignItem;
