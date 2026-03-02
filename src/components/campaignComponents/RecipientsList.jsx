import moment from 'moment';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Modal,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { useTheme } from '../../hooks/useTheme';
import { useUser } from '../../hooks/useUser';
import servicesettings from '../../modules/dataservices/servicesettings';
import RNSButton from '../Button';
import ContactsModal from '../ContactsModal/ContactsModal';
import RNSDropDown from '../Dropdown';
import RNSTextInput from '../TextInput';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Album Filter Dropdown ────────────────────────────────────────────────────
// Panel is rendered inside a transparent Modal so it lives in its own RN
// window layer — scroll events inside the panel are never captured by the
// parent FlatList or any other ancestor ScrollView.
const AlbumFilterDropdown = ({ albums, selectedAlbumId, onSelect, theme }) => {
  const [open, setOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [triggerLayout, setTriggerLayout] = useState(null);
  const triggerRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-8)).current;

  const filtered = useMemo(() => {
    if (!localSearch.trim()) return albums;
    return albums.filter(a =>
      a.name.toLowerCase().includes(localSearch.toLowerCase()),
    );
  }, [albums, localSearch]);

  const selectedAlbum = albums.find(a => a.id === selectedAlbumId);

  const openDropdown = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setTriggerLayout({ x, y, width, height });
      fadeAnim.setValue(0);
      slideAnim.setValue(-8);
      setOpen(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const closeDropdown = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -8,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setOpen(false);
      setLocalSearch('');
    });
  };

  const pick = id => {
    onSelect(id);
    closeDropdown();
  };

  // Position the panel just below the trigger; clamp to avoid going off screen
  const panelTop = triggerLayout
    ? triggerLayout.y + triggerLayout.height + 35
    : 0;
  const panelMaxHeight = triggerLayout
    ? Math.min(300, Dimensions.get('window').height - panelTop - 20)
    : 280;

  return (
    <View>
      {/* Trigger */}
      <TouchableOpacity
        ref={triggerRef}
        onPress={openDropdown}
        style={[
          styles.afdTrigger,
          {
            backgroundColor: theme.inputBackColor,
            borderColor: open
              ? theme.buttonBackColor
              : theme.containerBorderColor,
          },
        ]}
        activeOpacity={0.8}
      >
        <View style={styles.afdTriggerLeft}>
          <MaterialIcon
            name="folder-open"
            size={16}
            color={theme.buttonBackColor}
          />
          <Text
            style={[
              styles.afdTriggerText,
              {
                color: selectedAlbum ? theme.textColor : theme.placeholderColor,
              },
            ]}
          >
            {selectedAlbum ? selectedAlbum.name : 'Filter by Album…'}
          </Text>
        </View>
        <AntdIcon
          name={open ? 'up' : 'down'}
          size={12}
          color={theme.placeholderColor}
        />
      </TouchableOpacity>

      {/* Panel in a transparent Modal — sits above every scroll container */}
      <Modal
        visible={open}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={closeDropdown}
      >
        {/* Full-screen backdrop — tap outside to dismiss */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={closeDropdown}
        />

        {triggerLayout && (
          <Animated.View
            style={[
              styles.afdPanel,
              {
                top: panelTop,
                left: triggerLayout.x,
                width: triggerLayout.width,
                maxHeight: panelMaxHeight,
                backgroundColor: theme.modalBackColor,
                borderColor: theme.containerBorderColor,
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Search inside the dropdown */}
            <View
              style={[
                styles.afdSearchRow,
                { borderBottomColor: theme.containerBorderColor },
              ]}
            >
              <AntdIcon
                name="search1"
                size={14}
                color={theme.placeholderColor}
                style={{ marginRight: 8 }}
              />
              <RNSTextInput
                placeholder="Search albums…"
                placeholderTextColor={theme.placeholderColor}
                value={localSearch}
                onChangeText={setLocalSearch}
                autoFocus
                style={[styles.afdSearchInput, { color: theme.textColor }]}
              />
              {localSearch.length > 0 && (
                <TouchableOpacity onPress={() => setLocalSearch('')}>
                  <AntdIcon
                    name="closecircle"
                    size={14}
                    color={theme.placeholderColor}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* "All Albums" option */}
            <TouchableOpacity
              style={[
                styles.afdItem,
                !selectedAlbumId && {
                  backgroundColor: theme.buttonBackColor + '18',
                },
              ]}
              onPress={() => pick(null)}
            >
              <MaterialIcon
                name="folder-special"
                size={15}
                color={
                  !selectedAlbumId
                    ? theme.buttonBackColor
                    : theme.placeholderColor
                }
                style={{ marginRight: 8 }}
              />
              <Text
                style={[
                  styles.afdItemText,
                  {
                    color: !selectedAlbumId
                      ? theme.buttonBackColor
                      : theme.textColor,
                    fontWeight: !selectedAlbumId ? '700' : '400',
                  },
                ]}
              >
                All Albums
              </Text>
            </TouchableOpacity>

            {/* Album list — this ScrollView now owns its own touch responder */}
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {filtered.length === 0 ? (
                <View style={styles.afdEmpty}>
                  <Text style={{ color: theme.placeholderColor, fontSize: 13 }}>
                    No albums found
                  </Text>
                </View>
              ) : (
                filtered.map(album => (
                  <TouchableOpacity
                    key={album.id}
                    style={[
                      styles.afdItem,
                      selectedAlbumId === album.id && {
                        backgroundColor: theme.buttonBackColor + '18',
                      },
                    ]}
                    onPress={() => pick(album.id)}
                  >
                    <MaterialIcon
                      name="folder"
                      size={15}
                      color={
                        selectedAlbumId === album.id
                          ? theme.buttonBackColor
                          : theme.placeholderColor
                      }
                      style={{ marginRight: 8 }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.afdItemText,
                          {
                            color:
                              selectedAlbumId === album.id
                                ? theme.buttonBackColor
                                : theme.textColor,
                            fontWeight:
                              selectedAlbumId === album.id ? '700' : '400',
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {album.name}
                      </Text>
                      {album.networkName && (
                        <Text
                          style={{
                            fontSize: 11,
                            color: theme.placeholderColor,
                          }}
                        >
                          {album.networkName}
                        </Text>
                      )}
                    </View>
                    {selectedAlbumId === album.id && (
                      <AntdIcon
                        name="check"
                        size={14}
                        color={theme.buttonBackColor}
                      />
                    )}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </Animated.View>
        )}
      </Modal>
    </View>
  );
};

// ─── Recipient Card ───────────────────────────────────────────────────────────
const RecipientCard = ({ item, getNetworkName, theme, albumName }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pressIn = () =>
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 30,
    }).start();
  const pressOut = () =>
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
    }).start();

  const networkName = getNetworkName(item.networkId);
  const isActive = item.status === 1;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={[
          styles.card,
          {
            backgroundColor: theme.modalBackColor,
            borderColor: theme.containerBorderColor,
          },
        ]}
      >
        {/* Left accent bar */}
        <View
          style={[
            styles.cardAccent,
            { backgroundColor: isActive ? theme.green : theme.darkGray },
          ]}
        />

        <View style={styles.cardBody}>
          {/* Top row */}
          <View style={styles.cardTopRow}>
            <View style={styles.cardIconWrap}>
              <AntdIcon name="user" size={14} color={theme.buttonBackColor} />
            </View>
            <Text
              style={[styles.cardContentId, { color: theme.textColor }]}
              numberOfLines={1}
            >
              {item.contentId}
            </Text>
            <View
              style={[
                styles.networkPill,
                {
                  backgroundColor: theme.buttonBackColor + '20',
                  borderColor: theme.buttonBackColor + '40',
                },
              ]}
            >
              <Text
                style={[
                  styles.networkPillText,
                  { color: theme.buttonBackColor },
                ]}
              >
                {networkName}
              </Text>
            </View>
          </View>

          {/* Bottom row */}
          <View style={styles.cardBottomRow}>
            {albumName && (
              <View style={styles.cardMeta}>
                <MaterialIcon
                  name="folder"
                  size={11}
                  color={theme.placeholderColor}
                  style={{ marginRight: 3 }}
                />
                <Text
                  style={[
                    styles.cardMetaText,
                    { color: theme.placeholderColor },
                  ]}
                >
                  {albumName}
                </Text>
              </View>
            )}
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isActive ? theme.green : theme.darkGray },
              ]}
            />
            <Text
              style={[
                styles.cardMetaText,
                { color: isActive ? theme.green : theme.darkGray },
              ]}
            >
              {isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Album Tab Pill ───────────────────────────────────────────────────────────
const AlbumTab = ({ album, isSelected, count, onPress, theme }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.albumTab,
      {
        backgroundColor: isSelected
          ? theme.buttonBackColor
          : theme.inputBackColor,
        borderColor: isSelected
          ? theme.buttonBackColor
          : theme.containerBorderColor,
      },
    ]}
    activeOpacity={0.75}
  >
    <MaterialIcon
      name="folder"
      size={13}
      color={isSelected ? theme.white : theme.placeholderColor}
      style={{ marginRight: 5 }}
    />
    <Text
      style={[
        styles.albumTabText,
        { color: isSelected ? theme.white : theme.placeholderColor },
      ]}
      numberOfLines={1}
    >
      {album.name}
    </Text>
    {count > 0 && (
      <View
        style={[
          styles.albumTabBadge,
          {
            backgroundColor: isSelected
              ? theme.backgroundColor + '30'
              : theme.buttonBackColor + '20',
          },
        ]}
      >
        <Text
          style={[
            styles.albumTabBadgeText,
            {
              color: isSelected ? theme.white : theme.buttonBackColor,
            },
          ]}
        >
          {count}
        </Text>
      </View>
    )}
  </TouchableOpacity>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const RecipientsList = () => {
  const { user } = useUser();
  const theme = useTheme();
  const lovs = useSelector(state => state.lovs).lovs;
  const networks = lovs?.lovs?.networks;

  const [loading, setLoading] = useState(false);
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [albumList, setAlbumList] = useState([]);
  const [filteredRecipients, setFilteredRecipients] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterNetworkId, setFilterNetworkId] = useState([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);

  // Add Album Modal
  const [showAddAlbumModal, setShowAddAlbumModal] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumCode, setNewAlbumCode] = useState(
    moment().local().format('DDMMYYYY'),
  );
  const [newAlbumDesc, setNewAlbumDesc] = useState('');
  const [newAlbumNetworkId, setNewAlbumNetworkId] = useState(-1);
  const [creatingAlbum, setCreatingAlbum] = useState(false);

  const toggleContactsOpen = () => setIsContactsOpen(prev => !prev);
  const toggleAddAlbumModal = () => {
    setShowAddAlbumModal(prev => !prev);
    if (showAddAlbumModal) {
      setNewAlbumName('');
      setNewAlbumCode(moment().local().format('DDMMYYYY'));
      setNewAlbumDesc('');
      setNewAlbumNetworkId(-1);
    }
  };

  const onImport = () => {};

  const getNetworkName = networkId =>
    networks?.find(n => n.id === networkId)?.name || 'Unknown';

  // Enrich albumList with networkName
  const enrichedAlbums = useMemo(
    () =>
      albumList.map(a => ({ ...a, networkName: getNetworkName(a.networkid) })),
    [albumList, networks],
  );

  // Filtered albums for tabs (by network filter)
  const visibleAlbums = useMemo(
    () =>
      enrichedAlbums.filter(al =>
        filterNetworkId.length > 0
          ? filterNetworkId.includes(al.networkid - 1)
          : true,
      ),
    [enrichedAlbums, filterNetworkId],
  );

  // Count per album
  const recipientCountByAlbum = useMemo(() => {
    const counts = {};
    recipients.forEach(r => {
      counts[r.albumid] = (counts[r.albumid] || 0) + 1;
    });
    return counts;
  }, [recipients]);

  const createNewAlbum = async () => {
    if (
      !newAlbumName.trim() ||
      !newAlbumCode.trim() ||
      newAlbumNetworkId === -1
    ) {
      Toast.show('Please enter album name, code, and select network');
      return;
    }
    try {
      setCreatingAlbum(true);
      const body = {
        Id: 0,
        Orgid: user?.orgId,
        Name: newAlbumName.trim(),
        Code: newAlbumCode.trim(),
        Desc: newAlbumDesc.trim(),
        Networkid: networks[newAlbumNetworkId]?.id,
        Status: 1,
        CreatedBy: user?.id,
        LastUpdatedBy: user?.id,
        CreatedAt: moment().utc().format(),
        LastUpdatedAt: moment().utc().format(),
        RowVer: 1,
      };
      const response = await fetch(
        servicesettings.baseuri + 'Compaigns/submitalbumlist',
        {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            Accept: 'application/json',
            Authorization: servicesettings.AuthorizationKey,
          },
        },
      );
      if (!response.ok) {
        Toast.show('Failed to create album');
        return;
      }
      const res = await response.json();
      if (res?.status) {
        Toast.show('Album created successfully');
        setNewAlbumName('');
        setNewAlbumCode(moment().local().format('DDMMYYYY'));
        setNewAlbumDesc('');
        setNewAlbumNetworkId(-1);
        setShowAddAlbumModal(false);
        await fetchAlbumList();
        if (res.data?.id || res.id) setSelectedAlbumId(res.data?.id || res.id);
      } else {
        Toast.show(res?.message || 'Failed to create album');
      }
    } catch (e) {
      Toast.show('Error creating album');
    } finally {
      setCreatingAlbum(false);
    }
  };

  const fetchAlbumList = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        servicesettings.baseuri + 'Compaigns/albumlists',
        {
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
        },
      );
      if (!response.ok) {
        Toast.show('Something went wrong');
        return;
      }
      const res = await response.json();
      const albums = res?.data || [];
      setAlbumList(albums);
      if (albums.length > 0 && !selectedAlbumId)
        setSelectedAlbumId(albums[0].id);
    } catch (e) {
      Toast.show('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipients = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        servicesettings.baseuri + 'BlazorApi/campaignrecipients',
        {
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
        },
      );
      if (!response.ok) {
        Toast.show('Something went wrong');
        return;
      }
      const res = await response.json();
      setRecipients(res?.data || []);
    } catch (e) {
      Toast.show('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...recipients];
    if (selectedAlbumId !== null)
      filtered = filtered.filter(r => r.albumid == selectedAlbumId);
    if (searchText.trim())
      filtered = filtered.filter(r =>
        r.contentId?.toLowerCase().includes(searchText.toLowerCase()),
      );
    if (Array.isArray(filterNetworkId) && filterNetworkId.length > 0)
      filtered = filtered.filter(r =>
        filterNetworkId.map(fn => fn + 1).includes(r?.networkId),
      );
    setFilteredRecipients(filtered);
  };

  useEffect(() => {
    fetchAlbumList();
    fetchRecipients();
  }, []);
  useEffect(() => {
    applyFilters();
  }, [searchText, filterNetworkId, recipients, selectedAlbumId]);

  // ── Add Album Modal ──
  const renderAddAlbumModal = () => (
    <Modal
      animationType="fade"
      transparent
      visible={showAddAlbumModal}
      onRequestClose={toggleAddAlbumModal}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalCard,
            {
              backgroundColor: theme.modalBackColor,
              borderColor: theme.containerBorderColor,
            },
          ]}
        >
          {/* Header */}
          <View
            style={[
              styles.modalHeaderRow,
              { borderBottomColor: theme.containerBorderColor },
            ]}
          >
            <View style={styles.modalHeaderLeft}>
              <View
                style={[
                  styles.modalHeaderIcon,
                  { backgroundColor: theme.buttonBackColor + '20' },
                ]}
              >
                <MaterialIcon
                  name="add-box"
                  size={18}
                  color={theme.buttonBackColor}
                />
              </View>
              <Text style={[styles.modalTitle, { color: theme.textColor }]}>
                New Album
              </Text>
            </View>
            <TouchableOpacity
              onPress={toggleAddAlbumModal}
              style={styles.modalClose}
            >
              <AntdIcon name="close" size={20} color={theme.placeholderColor} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.fieldRow}>
              <Text
                style={[styles.fieldLabel, { color: theme.placeholderColor }]}
              >
                Album Name *
              </Text>
              <RNSTextInput
                placeholder="e.g. Summer Campaign"
                placeholderTextColor={theme.placeholderColor}
                value={newAlbumName}
                onChangeText={setNewAlbumName}
                style={[
                  styles.field,
                  {
                    backgroundColor: theme.inputBackColor,
                    color: theme.textColor,
                    borderColor: theme.containerBorderColor,
                  },
                ]}
              />
            </View>

            <View style={styles.fieldRow}>
              <Text
                style={[styles.fieldLabel, { color: theme.placeholderColor }]}
              >
                Album Code *
              </Text>
              <RNSTextInput
                placeholder="e.g. DDMMYYYY"
                placeholderTextColor={theme.placeholderColor}
                value={newAlbumCode}
                onChangeText={setNewAlbumCode}
                style={[
                  styles.field,
                  {
                    backgroundColor: theme.inputBackColor,
                    color: theme.textColor,
                    borderColor: theme.containerBorderColor,
                  },
                ]}
              />
            </View>

            <View style={styles.fieldRow}>
              <Text
                style={[styles.fieldLabel, { color: theme.placeholderColor }]}
              >
                Network *
              </Text>
              <RNSDropDown
                items={networks || []}
                selectedIndex={newAlbumNetworkId}
                onSelect={setNewAlbumNetworkId}
                style={[
                  styles.field,
                  {
                    backgroundColor: theme.inputBackColor,
                    color: theme.textColor,
                    borderColor: theme.containerBorderColor,
                  },
                ]}
                placeholder="Select Network"
                clearTextOnFocus
                keyboardAppearance="dark"
              />
            </View>

            <View style={styles.fieldRow}>
              <Text
                style={[styles.fieldLabel, { color: theme.placeholderColor }]}
              >
                Description
              </Text>
              <RNSTextInput
                placeholder="Optional notes…"
                placeholderTextColor={theme.placeholderColor}
                value={newAlbumDesc}
                onChangeText={setNewAlbumDesc}
                multiline
                numberOfLines={3}
                style={[
                  styles.field,
                  styles.textArea,
                  {
                    backgroundColor: theme.inputBackColor,
                    color: theme.textColor,
                    borderColor: theme.containerBorderColor,
                  },
                ]}
              />
            </View>

            <View style={styles.modalBtnRow}>
              <RNSButton
                caption="Cancel"
                bgColor={theme.darkGray}
                onPress={toggleAddAlbumModal}
                disabled={creatingAlbum}
                style={{ flex: 1 }}
              />
              <RNSButton
                caption="Create"
                bgColor={theme.buttonBackColor}
                onPress={createNewAlbum}
                loading={creatingAlbum}
                disabled={creatingAlbum}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );

  // ── Stats bar ──
  const totalContacts = recipients.length;
  const totalAlbums = albumList.length;
  const activeContacts = recipients.filter(r => r.status === 1).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <View style={[styles.root, { backgroundColor: theme.backgroundColor }]}>
        <ContactsModal
          isOpen={isContactsOpen}
          onClose={toggleContactsOpen}
          onImportComplete={onImport}
          recipients={recipients}
          fetchRecipients={fetchRecipients}
          albumList={albumList}
          fetchAlbumList={fetchAlbumList}
        />
        {renderAddAlbumModal()}

        {!loading && (
          <>
            {/* ── Stats Row ── */}
            <View
              style={[
                styles.statsRow,
                { borderBottomColor: theme.containerBorderColor },
              ]}
            >
              <View style={styles.statItem}>
                <Text style={[styles.statNum, { color: theme.textColor }]}>
                  {totalContacts}
                </Text>
                <Text
                  style={[styles.statLabel, { color: theme.placeholderColor }]}
                >
                  Contacts
                </Text>
              </View>
              <View
                style={[
                  styles.statDivider,
                  { backgroundColor: theme.containerBorderColor },
                ]}
              />
              <View style={styles.statItem}>
                <Text style={[styles.statNum, { color: theme.textColor }]}>
                  {totalAlbums}
                </Text>
                <Text
                  style={[styles.statLabel, { color: theme.placeholderColor }]}
                >
                  Albums
                </Text>
              </View>
              <View
                style={[
                  styles.statDivider,
                  { backgroundColor: theme.containerBorderColor },
                ]}
              />
              <View style={styles.statItem}>
                <Text style={[styles.statNum, { color: theme.green }]}>
                  {activeContacts}
                </Text>
                <Text
                  style={[styles.statLabel, { color: theme.placeholderColor }]}
                >
                  Active
                </Text>
              </View>
            </View>

            {/* ── Search + Action Row ── */}
            <View style={styles.topRow}>
              <View
                style={[
                  styles.searchWrap,
                  {
                    backgroundColor: theme.inputBackColor,
                    borderColor: theme.containerBorderColor,
                  },
                ]}
              >
                <AntdIcon
                  name="search1"
                  size={15}
                  color={theme.placeholderColor}
                  style={{ marginRight: 6 }}
                />
                <RNSTextInput
                  placeholder="Search contacts…"
                  placeholderTextColor={theme.placeholderColor}
                  value={searchText}
                  onChangeText={setSearchText}
                  style={[styles.searchInline, { color: theme.textColor }]}
                />
                {searchText.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchText('')}>
                    <AntdIcon
                      name="closecircle"
                      size={14}
                      color={theme.placeholderColor}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity
                onPress={toggleContactsOpen}
                style={[
                  styles.iconBtn,
                  { backgroundColor: theme.buttonBackColor },
                ]}
              >
                <AntdIcon name="contacts" size={18} color={theme.white} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={toggleAddAlbumModal}
                style={[
                  styles.iconBtn,
                  { backgroundColor: theme.buttonBackColor },
                ]}
              >
                <MaterialIcon
                  name="create-new-folder"
                  size={18}
                  color={theme.white}
                />
              </TouchableOpacity>
            </View>

            {/* ── Filters Row ── */}
            <View style={styles.filtersRow}>
              {/* Network multi-select */}
              <View style={{ flex: 1, marginRight: 8 }}>
                <RNSDropDown
                  items={networks || []}
                  selectedIndex={filterNetworkId}
                  disabled={loading}
                  multipleSelect
                  onSelect={value => {
                    const current = filterNetworkId || [];
                    const exists = current.includes(value);
                    setFilterNetworkId(
                      exists
                        ? current.filter(v => v !== value)
                        : [...current, value],
                    );
                  }}
                  borderColor={theme.containerBorderColor}
                  style={[
                    styles.filterDropdown,
                    {
                      backgroundColor: theme.inputBackColor,
                      color: theme.textColor,
                      borderColor: theme.containerBorderColor,
                    },
                  ]}
                  placeholder="Filter by Network…"
                />
              </View>
            </View>

            {/* ── Album Filter Dropdown ── */}
            <View style={[styles.albumFilterWrap, { zIndex: 100 }]}>
              <AlbumFilterDropdown
                albums={visibleAlbums}
                selectedAlbumId={selectedAlbumId}
                onSelect={setSelectedAlbumId}
                theme={theme}
              />
            </View>

            {/* ── Album Tabs (pill style) ── */}
            {visibleAlbums.length > 0 && (
              <View style={styles.tabsOuter}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.tabsContent}
                >
                  {/* "All" tab */}
                  <AlbumTab
                    album={{ id: null, name: 'All' }}
                    isSelected={selectedAlbumId === null}
                    count={0}
                    onPress={() => setSelectedAlbumId(null)}
                    theme={theme}
                  />
                  {visibleAlbums.map(album => (
                    <AlbumTab
                      key={album.id}
                      album={album}
                      isSelected={selectedAlbumId === album.id}
                      count={recipientCountByAlbum[album.id] || 0}
                      onPress={() => setSelectedAlbumId(album.id)}
                      theme={theme}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            {/* ── Results count ── */}
            {!loading && (
              <View style={styles.resultCountRow}>
                <View
                  style={[
                    styles.resultCountDot,
                    { backgroundColor: theme.buttonBackColor },
                  ]}
                />
                <Text
                  style={[
                    styles.resultCount,
                    { color: theme.placeholderColor },
                  ]}
                >
                  {filteredRecipients.length} recipient
                  {filteredRecipients.length !== 1 ? 's' : ''}
                  {selectedAlbumId
                    ? ` in "${enrichedAlbums.find(a => a.id === selectedAlbumId)?.name}"`
                    : ''}
                </Text>
              </View>
            )}
          </>
        )}

        {/* ── List ── */}
        <View style={{ flex: 1 }}>
          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color={theme.buttonBackColor} size="large" />
              <Text
                style={[styles.loadingText, { color: theme.placeholderColor }]}
              >
                Loading…
              </Text>
            </View>
          ) : (
            <FlatList
              keyboardShouldPersistTaps="handled"
              data={filteredRecipients}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={fetchRecipients}
                  colors={[theme.buttonBackColor]}
                  progressBackgroundColor={theme.modalBackColor}
                />
              }
              renderItem={({ item }) => (
                <RecipientCard
                  item={item}
                  getNetworkName={getNetworkName}
                  theme={theme}
                  albumName={
                    enrichedAlbums.find(a => a.id === item.albumid)?.name
                  }
                />
              )}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={{
                paddingBottom: 16,
                paddingTop: 4,
                flexGrow: 1,
              }}
              ListEmptyComponent={() => (
                <View style={styles.emptyWrap}>
                  <View
                    style={[
                      styles.emptyIconCircle,
                      { backgroundColor: theme.inputBackColor },
                    ]}
                  >
                    <AntdIcon
                      name="inbox"
                      size={32}
                      color={theme.placeholderColor}
                    />
                  </View>
                  <Text style={[styles.emptyTitle, { color: theme.textColor }]}>
                    No recipients found
                  </Text>
                  <Text
                    style={[styles.emptySub, { color: theme.placeholderColor }]}
                  >
                    {searchText || filterNetworkId.length > 0
                      ? 'Try adjusting your filters'
                      : 'Import contacts or add an album to get started'}
                  </Text>
                  {!searchText && filterNetworkId.length === 0 && (
                    <TouchableOpacity
                      onPress={toggleContactsOpen}
                      style={[
                        styles.emptyAction,
                        { borderColor: theme.buttonBackColor },
                      ]}
                    >
                      <Text
                        style={[
                          styles.emptyActionText,
                          { color: theme.buttonBackColor },
                        ]}
                      >
                        Import Contacts
                      </Text>
                    </TouchableOpacity>
                  )}
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

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 0 },

  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '700', letterSpacing: -0.5 },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: { width: StyleSheet.hairlineWidth, height: 36 },

  // Search row
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  searchWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    height: 40,
  },
  searchInline: { flex: 1, fontSize: 14, paddingVertical: 0 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Filters
  filtersRow: { flexDirection: 'row', marginBottom: 10 },
  filterDropdown: {
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    borderWidth: 1,
    height: 40,
  },

  // Album filter dropdown
  albumFilterWrap: { marginBottom: 10 },
  afdTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
  },
  afdTriggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  afdTriggerText: { fontSize: 14, flex: 1 },
  afdPanel: {
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
  afdSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  afdSearchInput: { flex: 1, fontSize: 13, paddingVertical: 0 },
  afdItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  afdItemText: { fontSize: 14, flex: 1 },
  afdEmpty: { padding: 16, alignItems: 'center' },

  // Album tabs
  tabsOuter: { marginBottom: 10 },
  tabsContent: { gap: 8, paddingRight: 4 },
  albumTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  albumTabText: { fontSize: 13, fontWeight: '500' },
  albumTabBadge: {
    marginLeft: 5,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  albumTabBadgeText: { fontSize: 11, fontWeight: '700' },

  // Results count
  resultCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  resultCountDot: { width: 6, height: 6, borderRadius: 3 },
  resultCount: { fontSize: 12, fontWeight: '500' },

  // Recipient card
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  cardAccent: { width: 4 },
  cardBody: { flex: 1, padding: 12 },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  cardIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  cardContentId: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  networkPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  networkPillText: { fontSize: 11, fontWeight: '600' },
  cardBottomRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  cardMetaText: { fontSize: 11 },
  statusDot: { width: 5, height: 5, borderRadius: 3 },

  // Loading
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: { fontSize: 13 },

  // Empty
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { fontSize: 16, fontWeight: '600' },
  emptySub: { fontSize: 13, textAlign: 'center', paddingHorizontal: 32 },
  emptyAction: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  emptyActionText: { fontSize: 14, fontWeight: '600' },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  modalHeaderIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: { fontSize: 17, fontWeight: '700', letterSpacing: -0.3 },
  modalClose: { padding: 4 },
  modalBody: { padding: 20, gap: 14 },
  fieldRow: { gap: 5 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 2,
  },
  field: {
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    height: 44,
    borderWidth: 1,
  },
  textArea: { height: 76, textAlignVertical: 'top', paddingTop: 10 },
  modalBtnRow: { flexDirection: 'row', gap: 10, marginTop: 6 },
});

export default RecipientsList;
