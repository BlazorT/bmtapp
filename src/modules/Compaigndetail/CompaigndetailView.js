import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import BDMT from '../../../assets/images/pepsilogo.png';
import servicesettings from '../dataservices/servicesettings';
import CampaignDetail from '../../components/campaignComponents/CampaignDetail';
import CampaignNetworks from '../../components/campaignComponents/CampaignNetworks';
import CmpaignSchedules from '../../components/campaignComponents/CmpaignSchedules';

export default function CompaigndetailScreen(props) {
  const campaign = props.route.params.campaign;
  const theme = useTheme();
  const [imgErr, setImgErr] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const imgUrl = servicesettings.Imagebaseuri + campaign?.logoAvatar;

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <View style={[styles.header, { borderBottomColor: theme.textColor }]}>
        <Image
          source={imgErr || !campaign?.logoAvatar ? BDMT : { uri: imgUrl }}
          style={styles.img}
          onError={() => setImgErr(true)}
        />
        <Text style={[styles.headerName, { color: theme.textColor }]}>
          {campaign?.name || ''}
        </Text>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab(0)}
          style={[
            styles.tab,
            {
              backgroundColor: theme.modalBackColor,
              borderBottomColor: theme.textColor,
              borderBottomWidth: activeTab === 0 ? 1 : 0,
            },
          ]}
        >
          <Text style={[styles.tabText, { color: theme.textColor }]}>
            Campaign Detail
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab(1)}
          style={[
            styles.tab,
            {
              backgroundColor: theme.modalBackColor,
              borderBottomColor: theme.textColor,
              borderBottomWidth: activeTab === 1 ? 1 : 0,
            },
          ]}
        >
          <Text style={[styles.tabText, { color: theme.textColor }]}>
            Networks
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab(2)}
          style={[
            styles.tab,
            {
              backgroundColor: theme.modalBackColor,
              borderBottomColor: theme.textColor,
              borderBottomWidth: activeTab === 2 ? 1 : 0,
            },
          ]}
        >
          <Text style={[styles.tabText, { color: theme.textColor }]}>
            Schedules
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {activeTab === 0 && <CampaignDetail campaign={campaign} />}
        {activeTab === 1 && <CampaignNetworks campaign={campaign} />}
        {activeTab === 2 && <CmpaignSchedules campaign={campaign} />}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
    rowGap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  headerName: {
    fontWeight: 'bold',
    fontSize: 18,
    flex: 1,
  },
  img: {
    borderRadius: 40,
    width: 70,
    height: 70,
    borderWidth: 1,
    borderColor: 'white',
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: { flex: 1, padding: 10 },
  tabText: { fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
});
