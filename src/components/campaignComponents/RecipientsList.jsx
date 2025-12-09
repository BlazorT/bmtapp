import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import { useSelector } from 'react-redux';
import { useTheme } from '../../hooks/useTheme';
import { useUser } from '../../hooks/useUser';
import servicesettings from '../../modules/dataservices/servicesettings';
import RNSButton from '../Button';
import ContactsModal from '../ContactsModal';
import RNSDropDown from '../Dropdown';
import RNSTextInput from '../TextInput';

const RecipientsList = () => {
  const { user } = useUser();
  const theme = useTheme();
  const lovs = useSelector(state => state.lovs).lovs;
  const networks = lovs?.lovs?.networks;

  const [loading, setLoading] = useState(false);
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [filteredRecipients, setFilteredRecipients] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterNetworkId, setFilterNetworkId] = useState([]);

  const toggleContactsOpen = () => setIsContactsOpen(prev => !prev);

  const onImport = data => {
    console.log({ data });
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
        Toast.show('Something went wrong, please try again');
        return;
      }

      const res = await response.json();
      console.log({ res });
      setRecipients(res?.data || []);
    } catch (error) {
      console.error('Error fetching recipients:', error);
      Toast.show('Something went wrong, please try again');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...recipients];

    // Apply search filter
    if (searchText.trim()) {
      filtered = filtered.filter(recipient =>
        recipient.contentId?.toLowerCase().includes(searchText.toLowerCase()),
      );
    }
    // Apply network filter
    if (Array.isArray(filterNetworkId) && filterNetworkId.length > 0) {
      filtered = filtered.filter(recipient =>
        filterNetworkId?.map(fn => fn + 1).includes(recipient?.networkId),
      );
    }

    setFilteredRecipients(filtered);
  };

  const getNetworkName = networkId => {
    const network = networks?.find(n => n.id === networkId);
    return network?.name || 'Unknown Network';
  };

  useEffect(() => {
    fetchRecipients();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchText, filterNetworkId, recipients]);

  // The main content (everything inside the modal)

  // Non-modal mode: render directly (e.g. full screen)
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <View
        style={[
          styles.fullScreenContainer, // full screen when not modal
          {
            backgroundColor: theme.backgroundColor,
          },
        ]}
      >
        <ContactsModal
          isOpen={isContactsOpen}
          onClose={toggleContactsOpen}
          onImportComplete={onImport}
          recipients={recipients}
          fetchRecipients={fetchRecipients}
        />
        {/* Close button only shown in modal */}

        {/* Non-modal header (optional - if you want a back button or title when full screen) */}

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <View style={[styles.row]}>
            <RNSTextInput
              placeholder="Search by number or email..."
              placeholderTextColor={theme.placeholderColor}
              value={searchText}
              onChangeText={setSearchText}
              keyboardShouldPersistTaps="handled"
              style={[
                styles.searchInput,
                {
                  width: 245,
                  backgroundColor: theme.inputBackColor,
                  color: theme.textColor,
                  borderColor: theme.containerBorderColor,
                },
              ]}
            />
            <RNSButton
              style={{ width: 'auto' }}
              bgColor={theme.buttonBackColor}
              caption="Contacts"
              onPress={toggleContactsOpen}
              small
              nIcon={
                <AntdIcon name="contacts" size={20} color={theme.tintColor} />
              }
            />
          </View>

          <RNSDropDown
            items={networks || []}
            selectedIndex={filterNetworkId}
            disabled={loading}
            multipleSelect
            onSelect={value => {
              const current = filterNetworkId || [];
              const exists = current.includes(value);
              setFilterNetworkId(
                exists ? current.filter(v => v !== value) : [...current, value],
              );
            }}
            borderColor={theme.containerBorderColor}
            style={[
              styles.networkDropdown,
              {
                backgroundColor: theme.inputBackColor,
                color: theme.textColor,
                borderRadius: 6,
                paddingHorizontal: 10,
                fontSize: 16,
              },
            ]}
            placeholder="Filter by Network..."
          />
        </View>

        {!loading && (
          <Text style={[styles.resultsCount, { color: theme.textColor }]}>
            {filteredRecipients.length} recipient
            {filteredRecipients.length !== 1 ? 's' : ''} found
          </Text>
        )}

        <View style={styles.listContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={theme.buttonBackColor} size="large" />
              <Text style={[styles.loadingText, { color: theme.textColor }]}>
                Loading recipients...
              </Text>
            </View>
          ) : (
            <FlatList
              keyboardShouldPersistTaps="handled"
              blurOnSubmit={false}
              data={filteredRecipients}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={fetchRecipients}
                  colors={[theme.textColor, theme.modalBackColor]}
                  progressBackgroundColor={theme.buttonBackColor}
                />
              }
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.recipientCard,
                    {
                      backgroundColor: theme.modalBackColor,
                    },
                  ]}
                >
                  <View style={styles.recipientHeader}>
                    <Text
                      style={[styles.contentId, { color: theme.textColor }]}
                    >
                      {item.contentId}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            item.status === 1
                              ? theme.green + '30'
                              : theme.darkGray + '30',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color:
                              item.status === 1 ? theme.green : theme.darkGray,
                          },
                        ]}
                      >
                        {getNetworkName(item.networkId)}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.listContent}
              style={{ maxHeight: '90%' }}
              ListEmptyComponent={() => (
                <View style={styles.emptyState}>
                  <Text style={[styles.emptyText, { color: theme.focusText }]}>
                    No recipients found
                  </Text>
                  <Text
                    style={[
                      styles.emptySubText,
                      { color: theme.placeholderColor },
                    ]}
                  >
                    {searchText || filterNetworkId.length > 0
                      ? 'Try adjusting your filters'
                      : 'Add recipients to get started'}
                  </Text>
                </View>
              )}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

// Updated styles
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxHeight: '85%',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    alignSelf: 'center',
    marginTop: 50, // space for status bar in modal
  },
  fullScreenContainer: {
    flex: 1,
    width: '100%',
    marginTop: 0,
    borderRadius: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  // ... rest of your styles remain the same ...
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  filtersContainer: {
    gap: 10,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchInput: {
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    height: 40,
    borderWidth: 1,
  },
  networkDropdown: {
    width: '100%',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    borderWidth: 1,
  },
  resultsCount: {
    fontSize: 13,
    marginBottom: 10,
    fontWeight: '500',
  },
  listContainer: {
    flexGrow: 1,
  },
  listContent: {
    paddingBottom: 10,
    flexGrow: 1,
  },
  recipientCard: {
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  recipientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 10,
  },
  contentId: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  recipientDetails: {
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    marginRight: 6,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default RecipientsList;
