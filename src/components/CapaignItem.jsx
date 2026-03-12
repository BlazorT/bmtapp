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
import moment from 'moment';

const CapaignItem = ({ item, loadCampiagns }) => {
  console.log({ item });
  const theme = useTheme();
  const { navigate } = useNavigation();
  const [imgErr, setImgErr] = useState(false);

  const swipeableRow = useRef(null);

  if (!item) return null;

  const imgUrl = servicesettings.Imagebaseuri + item?.logoAvatar;
  const networkCount = safeJSONParse(item?.compaignsdetails, []);

  const toCampaignDetails = () => {
    navigate('Campaign Details', {
      campaign: item,
    });
  };

  const isPaid = item?.paymentStatus === 1;
  // console.log({ item });
  return (
    <AppSwipeable
      swipeableRef={swipeableRow}
      friction={2}
      renderRightActions={() =>
        isPaid ? null : (
          <CampaignRightAction
            campaign={item}
            swipeableRow={swipeableRow}
            loadCampiagns={loadCampiagns}
          />
        )
      }
      renderLeftActions={undefined}
    >
      <TouchableOpacity
        onPress={toCampaignDetails}
        style={[
          styles.card,
          {
            backgroundColor: theme.cardBackColor,
            borderColor: item.status !== 1 ? '#8B0000' : theme.textColor,
            borderWidth: item.status !== 1 ? 1 : 0,
          },
        ]}
      >
        {isPaid ? (
          <View
            style={{
              position: 'absolute',
              zIndex: -1,
              right: 0,
              left: 0,
              top: 0,
              bottom: 0,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: theme.selectedCheckBox,
                fontWeight: 600,
                fontSize: 22,
                letterSpacing: 4,
                transform: [{ rotate: '-15deg' }],
                opacity: 0.5,
              }}
            >
              Paid
            </Text>
          </View>
        ) : null}
        <Image
          source={imgErr || !item?.logoAvatar ? BDMT : { uri: imgUrl }}
          style={styles.img}
          onError={() => setImgErr(true)}
        />
        <View style={styles.contentContainer}>
          <View style={{ rowGap: 10 }}>
            <Text style={{ color: theme.textColor }}>{item.name}</Text>
            <Text style={{ color: theme.textColor, fontSize: 12 }}>
              {moment(item.startTime).format('MMM DD, YYYY')}
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
            <Text style={{ color: theme.textColor, fontSize: 12 }}>
              {moment(item.finishTime).format('MMM DD, YYYY')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </AppSwipeable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 5,
    padding: 6,
    borderWidth: 1,
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
