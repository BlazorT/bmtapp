import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { safeJSONParse } from '../../helper/dateFormatter';
import NetworkMycampaign from '../../components/NetworkMycampaign';
import servicesettings from '../../modules/dataservices/servicesettings';
import moment from 'moment';
import { useUser } from '../../hooks/useUser';
import Toast from 'react-native-simple-toast';
import { useSelector } from 'react-redux';

const CampaignNetworks = ({ campaign }) => {
  const theme = useTheme();
  const { user } = useUser();
  const lovs = useSelector(state => state.lovs).lovs;
  const deliverstatus = lovs?.lovs?.deliverstatus || [];

  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState([]);

  const headerRef = useRef(null);
  const bodyRef = useRef(null);
  const isSyncing = useRef(false);

  const handleScroll = (event, otherRef) => {
    if (isSyncing.current) return;
    isSyncing.current = true;
    otherRef.current?.scrollTo({
      x: event.nativeEvent.contentOffset.x,
      animated: false,
    });
    requestAnimationFrame(() => {
      isSyncing.current = false;
    });
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const body = {
        id: campaign?.id || 0,
        orgId: user?.orgId,
        rowVer: 1,
        recipient: '',
        deliveryStatus: '0',
        status: 1,
        createdAt: moment().utc().subtract(10, 'year').format(),
        lastUpdatedAt: moment().utc().format(),
      };
      let headerFetch = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
          Authorization: servicesettings.AuthorizationKey,
        },
      };
      const response = await fetch(
        servicesettings.baseuri + 'BlazorApi/notificationsreportdata',
        headerFetch,
      );

      if (!response.ok) {
        Toast.show('Something went wrong, please try again');
        return;
      }
      const res = await response.json();

      const ins = res?.data;
      // ?.filter(
      //   i => i?.title?.toLowerCase() === campaign?.name?.toLowerCase(),
      // );

      const statusCounts = {};
      deliverstatus?.forEach(statusObj => {
        const statusId = statusObj.id.toString();
        statusCounts[statusObj.name.toLowerCase()] = ins?.filter(
          d => d.deliveryStatus === statusId,
        ).length;
      });

      setInsights(
        (ins || [])?.map(i => ({
          ...i,
          commentsCount: i.commentsCount || 0,
          clicksCount: i.clicksCount || 0,
          sharesCount: i.sharesCount || 0,
          readCount: i.readCount || 0,
          likesCount: i.likesCount || 0,
          status:
            deliverstatus?.find(ds => ds.id == i?.deliveryStatus)?.name || '',
          sent: statusCounts['sent'] || 0,
          delivered: statusCounts['delivered'] || 0,
          failed: statusCounts['failed'] || 0,
          deleted: statusCounts['deleted'] || 0,
          read: statusCounts['read'] || 0,
          seen: statusCounts['seen'] || 0,
          undelivered: statusCounts['undelivered'] || 0,
          pending: statusCounts['pending'] || 0,
        })),
      );
    } catch (error) {
      console.error('Error fetching recipients:', error);
      Toast.show('Something went wrong, please try again');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={theme.buttonBackColor} size={'large'} />
        <Text style={[styles.loadingText, { color: theme.textColor }]}>
          Loading Insights...
        </Text>
      </View>
    );
  }

  const headers = [
    'Network',
    'Status',
    'Sent',
    'Failed',
    'Delivered',
    'Reads',
    'Comments',
    'Clicks',
    'Shares',
    'Likes',
  ];
  const columnWidths = [100, 60, 70, 70, 70, 70, 70, 70, 70];
  const totalWidth = columnWidths.reduce((a, b) => a + b, 0);

  const renderHeader = () => (
    <ScrollView
      ref={headerRef}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      onScroll={e => handleScroll(e, bodyRef)}
      scrollEventThrottle={16}
      style={[styles.headerScroll, { backgroundColor: theme.cardBackColor }]}
    >
      <View style={styles.headerRow}>
        {headers.map((label, index) => (
          <View
            key={label}
            style={[
              styles.headerCell,
              {
                width: columnWidths[index],
                backgroundColor: theme.cardBackColor,
              },
            ]}
          >
            <Text
              style={[styles.headerText, { color: theme.textColor }]}
              numberOfLines={1}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderItem = ({ item }) => <NetworkMycampaign {...item} />;

  return (
    <View style={styles.mainContainer}>
      {renderHeader()}
      <ScrollView
        ref={bodyRef}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        onScroll={e => handleScroll(e, headerRef)}
        scrollEventThrottle={16}
        style={styles.bodyScroll}
      >
        <FlatList
          data={insights}
          refreshing={loading}
          onRefresh={() => fetchInsights()}
          keyExtractor={(item, id) => id.toString()}
          renderItem={renderItem}
          numColumns={1}
          scrollEnabled={true}
          nestedScrollEnabled={true}
          style={{ width: totalWidth }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  headerScroll: {
    marginHorizontal: 10,
    marginTop: 6,
    borderRadius: 6,
  },
  bodyScroll: {
    marginHorizontal: 10,
  },
  headerRow: {
    flexDirection: 'row',
    height: 44,
  },
  headerCell: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  headerText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
});

export default CampaignNetworks;
