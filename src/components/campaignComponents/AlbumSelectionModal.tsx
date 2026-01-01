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
  totalContacts?: number;
}

interface Props {
  visible: boolean;
  networkIds: number[];
  disabled?: boolean;
  onSubmit: (selectedAlbums: Album[]) => void;
  onClose: () => void;
  selectedAlbums: Record<number, number[]>; // Changed to array
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
  const [recipientsLoading, setRecipientsLoading] = useState(true);
  const [albumsByNetwork, setAlbumsByNetwork] = useState<
    Record<number, Album[]>
  >({});
  const [recipients, setRecipients] = useState([]);
  const [albumList, setAlbumList] = useState([]);

  const [activeTab, setActiveTab] = useState<number>(networkIds[0]);

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
    setRecipientsLoading(true);
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
      setRecipientsLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchRecipients();
      fetchAlbums();
      setActiveTab(networkIds[0]);
    }
  }, [visible]);

  const handleAlbumSelect = (networkId: number, albumId: number) => {
    setSelectedAlbums((prev: Record<number, number[]>) => {
      const currentSelections = prev[networkId] || [];
      const isSelected = currentSelections.includes(albumId);

      return {
        ...prev,
        [networkId]: isSelected
          ? currentSelections.filter((id: number) => id !== albumId)
          : [...currentSelections, albumId],
      };
    });
  };

  const handleSelectAll = (networkId: number) => {
    const currentAlbums = albumsByNetwork[networkId] || [];
    const currentSelections = selectedAlbums[networkId] || [];
    const allAlbumIds = currentAlbums.map(a => a.id);

    // Check if all are selected
    const allSelected =
      allAlbumIds.length > 0 &&
      allAlbumIds.every(id => currentSelections.includes(id));

    setSelectedAlbums((prev: Record<number, number[]>) => ({
      ...prev,
      [networkId]: allSelected ? [] : allAlbumIds,
    }));
  };

  const handleSubmit = () => {
    // Flatten all selected album IDs from all networks
    const selectedIds = Object.values(selectedAlbums)
      .flat()
      .filter(id => id !== null) as number[];

    const albums = albumList?.filter((al: any) => selectedIds.includes(al.id));

    // Validate that all selected albums have contacts
    const emptyAlbums = albums.filter((album: any) => {
      const contactCount =
        recipients?.filter((r: any) => r?.albumid === album.id)?.length || 0;
      return contactCount === 0;
    });

    if (emptyAlbums.length > 0) {
      const emptyAlbumNames = emptyAlbums.map((a: any) => a.name).join(', ');
      Toast.show(`Add at least one contact to: ${emptyAlbumNames}`, Toast.LONG);
      return;
    }

    onSubmit(albums);
    onClose();
  };

  const toAddAlbum = () => {
    onClose();
    navigate('Recipients', { toCampaign: true });
  };

  const isSubmitDisabled =
    Object.values(selectedAlbums).every(
      (arr: number[]) => !arr || arr.length === 0,
    ) || disabled;

  const currentAlbums = albumsByNetwork[activeTab] || [];
  const currentSelections = selectedAlbums[activeTab] || [];

  // Check if all albums in current network are selected
  const allCurrentSelected =
    currentAlbums.length > 0 &&
    currentAlbums.every(album => currentSelections.includes(album.id));

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
            {loading || recipientsLoading ? (
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
              <>
                {/* Select All Button */}
                <TouchableOpacity
                  onPress={() => handleSelectAll(activeTab)}
                  style={[
                    styles.selectAllContainer,
                    { backgroundColor: theme.modalBackColor },
                  ]}
                >
                  <View style={styles.selectAllContent}>
                    <View
                      style={[
                        styles.checkbox,
                        {
                          borderColor: theme.containerBorderColor,
                          backgroundColor: allCurrentSelected
                            ? theme.buttonBackColor
                            : 'transparent',
                        },
                      ]}
                    >
                      {allCurrentSelected && (
                        <AntdIcon
                          name="check"
                          size={16}
                          color={theme.backgroundColor}
                        />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.selectAllText,
                        { color: theme.textColor, fontWeight: '600' },
                      ]}
                    >
                      Select All Albums ({currentSelections.length}/
                      {currentAlbums.length})
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Album List */}
                <FlatList
                  data={currentAlbums}
                  keyExtractor={item => item.id.toString()}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => {
                    const isSelected = currentSelections.includes(item.id);
                    const contactCount =
                      recipients?.filter((r: any) => r?.albumid === item.id)
                        ?.length || 0;

                    return (
                      <TouchableOpacity
                        onPress={() => handleAlbumSelect(activeTab, item.id)}
                        style={[
                          styles.albumItem,
                          {
                            backgroundColor: isSelected
                              ? theme.buttonBackColor + '20'
                              : theme.modalBackColor,
                            borderColor: isSelected
                              ? theme.buttonBackColor
                              : theme.containerBorderColor,
                          },
                        ]}
                      >
                        <View style={styles.albumItemContent}>
                          {/* Checkbox */}
                          <View
                            style={[
                              styles.checkbox,
                              {
                                borderColor: isSelected
                                  ? theme.buttonBackColor
                                  : theme.containerBorderColor,
                                backgroundColor: isSelected
                                  ? theme.buttonBackColor
                                  : 'transparent',
                              },
                            ]}
                          >
                            {isSelected && (
                              <AntdIcon
                                name="check"
                                size={16}
                                color={theme.backgroundColor}
                              />
                            )}
                          </View>

                          {/* Album Info */}
                          <View style={styles.albumInfo}>
                            <Text
                              style={[
                                styles.albumName,
                                { color: theme.textColor },
                              ]}
                            >
                              {item.name}
                            </Text>
                            <Text
                              style={[
                                styles.contactCount,
                                { color: theme.placeholderColor },
                              ]}
                            >
                              {contactCount} contact
                              {contactCount === 1 ? '' : 's'}
                            </Text>
                          </View>

                          {/* Check Icon */}
                          {isSelected && (
                            <AntdIcon
                              name="checkcircle"
                              size={22}
                              color={theme.buttonBackColor}
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />
              </>
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
  selectAllContainer: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  selectAllContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectAllText: {
    fontSize: 16,
    marginLeft: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumItem: {
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    padding: 14,
  },
  albumItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  albumInfo: {
    flex: 1,
    marginLeft: 12,
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
