import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from '../hooks/useTheme';
import { dateFormatter, safeJSONParse } from '../helper/dateFormatter';
import { useUser } from '../hooks/useUser';
import TemplateViewer from './campaignComponents/TemplateViewer';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Social icons
const ICONS = {
  1: require('../../assets/images/SMS.png'),
  2: require('../../assets/images/Whatsapp.png'),
  3: require('../../assets/images/Email.png'),
  4: require('../../assets/images/Twitter.png'),
  5: require('../../assets/images/Facebook.png'),
  6: require('../../assets/images/instagram.png'),
  7: require('../../assets/images/linkedin.png'),
  8: require('../../assets/images/tiktok.png'),
  9: require('../../assets/images/snapchat.png'),
};

export default function MycampaignScheduleList(props) {
  const theme = useTheme();
  const { user } = useUser();
  const lovs = useSelector(state => state.lovs).lovs;

  const [networkIcon, setNetworkIcon] = useState(ICONS[3]); // default email

  const currencyId = lovs['orgs']?.find(c => c.id === user?.orgId)?.currencyId;

  const template = props.template;
  const [showTemplate, setShowTemplate] = useState(false);

  const openTemplate = () => {
    setShowTemplate(true);
  };

  const closeTemplate = () => {
    setShowTemplate(false);
  };

  useEffect(() => {
    if (props.networkId && ICONS[props.networkId]) {
      setNetworkIcon(ICONS[props.networkId]);
    }
  }, [props.networkId]);

  const calculateDays = dayNumberString => {
    const dayMap = {
      1: 'Sun',
      2: 'Mon',
      3: 'Tue',
      4: 'Wed',
      5: 'Thu',
      6: 'Fri',
      7: 'Sat',
    };

    if (!dayNumberString) return '';

    let cleaned = dayNumberString;

    // Handle cases like '[5,6]'
    if (cleaned.startsWith('[') && cleaned.endsWith(']')) {
      cleaned = cleaned.slice(1, -1);
    }

    return cleaned
      .split(',')
      .map(d => d.trim())
      .filter(Boolean)
      .map(Number)
      .map(day => dayMap[day] || '')
      .filter(Boolean)
      .join(', ');
  };

  const intervalName =
    lovs['lovs']?.intervals?.find(x => x.id == props.intervalTypeId + 1)
      ?.name || 'Unknown';

  const currencyCode =
    lovs['lovs']?.currencies?.find(c => c.id === currencyId)?.code || '';
  // console.log({ days: props?.days });
  return (
    <View style={[styles.card, { backgroundColor: theme.cardBackColor }]}>
      <TemplateViewer
        isOpen={showTemplate}
        onClose={closeTemplate}
        template={{ ...template, networkId: props.networkId }}
      />
      <TouchableOpacity style={styles.row}>
        {/* Network Icon */}
        <Image
          resizeMode="contain"
          source={networkIcon}
          style={styles.socialMediaIcon}
        />

        {/* Details */}
        <View style={styles.details}>
          {/* Interval + Days */}
          <View style={styles.rowSpace}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Text style={[styles.text, { color: theme.textColor }]}>
                Interval Type: {intervalName}
              </Text>
              {template ? (
                <TouchableOpacity onPress={openTemplate}>
                  <FontAwesome
                    name={'external-link'}
                    size={18}
                    color={theme.tintColor}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
            {props?.days?.length <= 10 ? (
              <Text style={[styles.text, { color: theme.textColor }]}>
                Days: {calculateDays(props.days)}
              </Text>
            ) : (
              <Text
                style={[
                  styles.text,
                  { color: theme.textColor, textAlign: 'justify' },
                ]}
              >
                Days: {calculateDays(props.days)}
              </Text>
            )}
          </View>

          {/* Message Count + Budget */}
          <View style={styles.rowSpace}>
            <Text style={[styles.text, { color: theme.textColor }]}>
              Message Count: {props.messageCount}
            </Text>
            <Text style={[styles.text, { color: theme.textColor }]}>
              Budget: {props.budget} {currencyCode}
            </Text>
          </View>

          {/* Start - Finish Time */}
          <View style={styles.rowSpace}>
            <Text style={[styles.text, { color: theme.textColor }]}>
              {dateFormatter(props.startTime)}
            </Text>
            <Text style={[styles.text, { color: theme.textColor }]}>~</Text>
            <Text style={[styles.text, { color: theme.textColor }]}>
              {dateFormatter(props.finishTime)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 0,
    marginTop: '3%',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 2,
  },
  socialMediaIcon: {
    height: 45,
    width: 45,
  },
  details: {
    flex: 1,
    marginLeft: 10,
    rowGap: 3,
  },
  text: {
    fontSize: 14,
  },
});
