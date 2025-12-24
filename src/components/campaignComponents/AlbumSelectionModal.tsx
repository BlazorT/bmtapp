// AlbumSelectionModal.tsx
import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import { useTheme } from '../../hooks/useTheme';
import { useUser } from '../../hooks/useUser';
import servicesettings from '../../modules/dataservices/servicesettings';
import RNSButton from '../Button';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { isTab } from '../../constants';

interface Album {
  id: number;
  name: string;
  networkid: number;
  totalContacts?: number; // we'll fetch this or assume it's in response
}

interface Props {
  visible: boolean;
  networkIds: number[]; // e.g. [1, 2, 3]
  disabled?: boolean;
  onSubmit: (selectedAlbumIds: number[]) => void;
  onClose: () => void;
  selectedAlbums: Record<number, number | null>;
  setSelectedAlbums: any;
}

const AlbumSelectionModal: React.FC<Props> = ({
  visible,
  networkIds,
  disabled = false,
  onSubmit,
  onClose,
  setSelectedAlbums,
  selectedAlbums,
}) => {
  const { navigate } = useNavigation<any>();
  const theme = useTheme();
  const { user } = useUser();
  const lovs = useSelector((state: any) => state.lovs).lovs;
  const networks = lovs?.lovs?.networks;
  const [loading, setLoading] = useState(true);
  const [albumsByNetwork, setAlbumsByNetwork] = useState<
    Record<number, Album[]>
  >({});
  const [recipients, setRecipients] = useState([]);
  const [albumList, setAlbumList] = useState([]);

  const [activeTab, setActiveTab] = useState<number>(networkIds[0]);

  // Initialize selectedAlbums state
  // useEffect(() => {
  //   const initial: Record<number, number | null> = {};
  //   networkIds.forEach(id => (initial[id] = null));
  //   setSelectedAlbums(initial);
  // }, [networkIds]);

  // Fetch albums for given networkIds
  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const headerFetch = {
        method: 'POST',
        body: JSON.stringify({
          id: 0,
          orgId: user?.orgId,
          rowVer: 1,
          networkId: 0,
          name: '',
          status: 1,
          createdAt: moment().utc().subtract(10, 'year').format('YYYY-MM-DD'),
          lastUpdatedAt: moment().utc().format('YYYY-MM-DD'),
        }),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
          Authorization: servicesettings.AuthorizationKey,
        },
      };

      const response = await fetch(
        servicesettings.baseuri + 'Compaigns/albumlists',
        headerFetch,
      );

      if (!response.ok) throw new Error('Failed to fetch albums');

      const res = await response.json();
      setAlbumList(res?.data || []);
      const allAlbums: Album[] = res?.data || [];

      // Group albums by networkId and filter only allowed networks
      const grouped: Record<number, Album[]> = {};
      networkIds.forEach(nid => {
        grouped[nid] = allAlbums.filter(a => a.networkid === nid);
      });

      setAlbumsByNetwork(grouped);
    } catch (error) {
      console.error(error);
      Toast.show('Failed to load albums', 1000);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipients = async () => {
    setLoading(true);
    try {
      let headerFetch = {
        method: 'POST',
        body: JSON.stringify({
          id: 0,
          orgId: user?.orgId,
          rowVer: 1,
          networkId: 0,
          contentId: '',
          status: 1,
          createdAt: moment().utc().subtract(10, 'year').format('YYYY-MM-DD'),
          lastUpdatedAt: moment().utc().format('YYYY-MM-DD'),
        }),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
          Authorization: servicesettings.AuthorizationKey,
        },
      };
      const response = await fetch(
        servicesettings.baseuri + 'BlazorApi/campaignrecipients',
        headerFetch,
      );

      if (!response.ok) {
        Toast.show('Something went wrong, please try again', 1000);
        return;
      }
      const res = await response.json();
      setRecipients(res?.data || []);
    } catch (error) {
      console.error('Error fetching recipients:', error);
      Toast.show('Something went wrong, please try again', 1000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchAlbums();
      fetchRecipients();
      setActiveTab(networkIds[0]);
    }
  }, [visible]);

  const handleAlbumSelect = (networkId: number, albumId: number) => {
    setSelectedAlbums(prev => ({
      ...prev,
      [networkId]: prev[networkId] === albumId ? null : albumId,
    }));
  };

  const handleSubmit = () => {
    const selectedIds = Object.values(selectedAlbums).filter(
      id => id !== null,
    ) as number[];
    const albums = albumList?.filter((al: any) => selectedIds.includes(al.id));
    onSubmit(albums);
    onClose();
  };
  const toAddAlbum = () => {
    onClose();
    navigate('Recipients', { toCampaign: true }); //@ts-ignore
  };

  const isSubmitDisabled =
    Object.values(selectedAlbums).every(v => v === null) || disabled;

  const currentAlbums = albumsByNetwork[activeTab] || [];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <SafeAreaView style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: theme.backgroundColor,
              width: isTab ? '60%' : '100%',
              alignSelf: 'center',
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.textColor }]}>
              Select Contact List
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <AntdIcon name="close" size={24} color={theme.textColor} />
            </TouchableOpacity>
          </View>

          {/* Network Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsContainer}
          >
            {networkIds.map(nid => (
              <TouchableOpacity
                key={nid}
                onPress={() => setActiveTab(nid)}
                style={[
                  styles.tab,
                  {
                    borderBottomColor:
                      activeTab === nid ? theme.textColor : 'transparent',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color:
                        activeTab === nid
                          ? theme.textColor
                          : theme.placeholderColor,
                      fontWeight: activeTab === nid ? '600' : '400',
                    },
                  ]}
                >
                  {networks?.find(n => n.id === nid)?.name || ''}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Album List */}
          <View style={styles.listContainer}>
            {loading ? (
              <View style={styles.loading}>
                <ActivityIndicator size="large" color={theme.buttonBackColor} />
                <Text style={[styles.loadingText, { color: theme.textColor }]}>
                  Loading albums...
                </Text>
              </View>
            ) : currentAlbums.length === 0 ? (
              <View style={styles.empty}>
                <Text
                  style={[styles.emptyText, { color: theme.placeholderColor }]}
                >
                  No albums found for this network
                </Text>
                <RNSButton
                  caption="Add Album"
                  onPress={toAddAlbum}
                  bgColor={theme.darkGray}
                  style={{ marginRight: 10, width: '48%' }}
                />
              </View>
            ) : (
              <FlatList
                data={currentAlbums}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => {
                  const isSelected = selectedAlbums[activeTab] === item.id;
                  return (
                    <TouchableOpacity
                      onPress={() => handleAlbumSelect(activeTab, item.id)}
                      style={[
                        styles.albumItem,
                        {
                          backgroundColor: isSelected
                            ? theme.buttonBackColor + '30'
                            : theme.modalBackColor,
                          borderColor: isSelected
                            ? theme.buttonBackColor
                            : theme.containerBorderColor,
                        },
                      ]}
                    >
                      <View style={styles.albumInfo}>
                        <Text
                          style={[styles.albumName, { color: theme.textColor }]}
                        >
                          {item.name}
                        </Text>
                        <Text
                          style={[
                            styles.contactCount,
                            { color: theme.placeholderColor },
                          ]}
                        >
                          {
                            recipients?.filter(
                              (r: any) => r?.albumid === item.id,
                            )?.length
                          }{' '}
                          contacts
                        </Text>
                      </View>
                      {isSelected && (
                        <AntdIcon
                          name="checkcircle"
                          size={20}
                          color={theme.buttonBackColor}
                        />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <RNSButton
              caption="Cancel"
              onPress={onClose}
              bgColor={theme.darkGray}
              style={{ marginRight: 10, width: '48%' }}
            />
            <RNSButton
              caption="Confirm Selection"
              onPress={handleSubmit}
              disabled={isSubmitDisabled}
              bgColor={
                isSubmitDisabled ? theme.darkGray : theme.buttonBackColor
              }
              style={{ width: '48%' }}
              textStyle={{ fontSize: Platform.OS === 'ios' ? 14 : 16 }}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '85%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeBtn: {
    padding: 6,
  },
  tabsContainer: {
    maxHeight: 50,
    marginBottom: 16,
  },
  tab: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
  },
  albumItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  albumInfo: {
    flex: 1,
  },
  albumName: {
    fontSize: 16,
    fontWeight: '600',
  },
  contactCount: {
    fontSize: 13,
    marginTop: 4,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 10,
  },
  emptyText: {
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
});

export default AlbumSelectionModal;
