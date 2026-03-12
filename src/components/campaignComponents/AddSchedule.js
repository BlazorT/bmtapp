import CheckBox from '@react-native-community/checkbox';
import moment from 'moment';
import React, { useEffect } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Toast from 'react-native-simple-toast';
import { useSelector } from 'react-redux';
import { useTheme } from '../../hooks/useTheme';
import { useUser } from '../../hooks/useUser';
import RNSButton from '../Button';
import RNSDropDown from '../Dropdown';
import AlbumSelectionModal from './AlbumSelectionModal';
import CampaignNetwork from './CampaignNetwork';
import { padding } from 'aes-js';
import QuotaBadge from './QuotaBadge';

// Reduces font size by 2 on iOS
const fs = size => (Platform.OS === 'ios' ? size - 2 : size);

const ALL_DAY_INDICES = [1, 2, 3, 4, 5, 6, 7];

const AddSchedule = ({
  campaignInfo,
  setCampaignInfo,
  setIndex,
  setScheduleTab,
  scheduleList,
  setScheduleList,
  isUpdate,
  setIsUpdate,
  priceData,
  recipients,
  fetchRecipients,
}) => {
  const theme = useTheme();
  const themeMode = useSelector(state => state.theme.mode);

  const { user } = useUser();
  const lovs = useSelector(state => state.lovs).lovs;
  const [showStartDatePicker, setShowStartDatePicker] = React.useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = React.useState(false);
  const [showRecipientAlbumMdl, setShowRecipientAlbumMdl] =
    React.useState(false);
  const [selectedAlbums, setSelectedAlbums] = React.useState({});

  const onCloseAlbumMdl = () => {
    setShowRecipientAlbumMdl(false);
  };
  const onSubmitAlbum = albums => {
    setScheduleList(prev => ({ ...prev, albums }));
    setTimeout(() => {
      fetchRecipients();
    }, 1000);
  };
  const days = [
    { name: 'Sun' },
    { name: 'Mon' },
    { name: 'Tue' },
    { name: 'Wed' },
    { name: 'Thu' },
    { name: 'Fri' },
    { name: 'Sat' },
  ];

  // Change 2: Select All helpers
  const allDaysSelected = ALL_DAY_INDICES.every(d =>
    scheduleList.days.includes(d),
  );
  const toggleAllDays = value => {
    setScheduleList(prev => ({
      ...prev,
      days: value ? [...ALL_DAY_INDICES] : [],
    }));
  };

  useEffect(() => {
    if (isUpdate && scheduleList?.albums?.length) {
      const albumsMap = scheduleList.albums.reduce((acc, album) => {
        if (!acc[album.networkid]) {
          acc[album.networkid] = [];
        }

        if (album.id != null) {
          acc[album.networkid].push(album.id);
        }

        return acc;
      }, {});

      // console.log({ albumsMap }, scheduleList.albums);
      setSelectedAlbums(albumsMap);
    }
  }, [isUpdate, scheduleList]);

  // Change 1: Auto-select all days when interval is "daily" (intervalTypeId == 2)
  useEffect(() => {
    if (scheduleList.intervalTypeId == 1) {
      setScheduleList(prev => ({ ...prev, days: [...ALL_DAY_INDICES] }));
    }
  }, [scheduleList.intervalTypeId]);

  useEffect(() => {
    calculateBudget();
  }, [
    scheduleList.startTime,
    scheduleList.finishTime,
    scheduleList.days,
    scheduleList.intervalTypeId,
    scheduleList.interval,
    scheduleList.albums,
    scheduleList?.CompaignNetworks?.length,
  ]);

  const addSchedule = () => {
    if (scheduleList.CompaignNetworks.length == 0) {
      Toast.show('Please select atleast one network');
      return;
    }
    if (scheduleList.days.length == 0) {
      Toast.show('Please select a day');
      return;
    }

    if (!scheduleList.finishTime) {
      Toast.show('Select end time');
      return;
    }

    const selectedNetworkSet = new Set(
      scheduleList.albums?.map(al => al?.networkid),
    );

    if (
      scheduleList.albums?.length === 0 ||
      scheduleList.CompaignNetworks.length !== selectedNetworkSet?.size
    ) {
      Toast.show('Please select contact list for selected networks');
      return;
    }

    setCampaignInfo(prevState => ({
      ...prevState,
      schedules: [
        ...prevState.schedules,
        ...(scheduleList.CompaignNetworks?.map(cn => ({
          ...scheduleList,
          ...cn,
          networkId: cn.networkId,
          CompaignNetworks: [cn],
          randomId: Math.floor(100000 + Math.random() * 900000),
        })) ?? []),
      ],
    }));
    setScheduleTab(1);

    setScheduleList({
      CompaignNetworks: [],
      id: 0,
      budget: 0,
      rowVer: 0,
      messageCount: 0,
      orgId: user.orgId,
      days: [],
      networkId: 0,
      compaignDetailId: 0,
      isFixedTime: 1,
      startTime: campaignInfo.campaignStartDate,
      finishTime: campaignInfo.campaignEndDate,
      interval: 0,
      status: 1,
      intervalTypeId: 0,
      randomId: Math.floor(100000 + Math.random() * 900000),
    });
  };

  const updateSchedule = () => {
    if (scheduleList.CompaignNetworks.length == 0) {
      Toast.show('Please select atleast one network');
      return;
    }
    setCampaignInfo(prevState => {
      const updatedSchedules = prevState.schedules.map(schedule =>
        schedule.randomId == scheduleList.randomId
          ? { ...scheduleList }
          : schedule,
      );

      return {
        ...prevState,
        schedules: updatedSchedules,
      };
    });
    setScheduleTab(1);
    setIsUpdate(false);
  };

  const calculateBudget = () => {
    const { numberOfDays, daysOfWeek } = getDaysBetweenDates(
      scheduleList.startTime,
      scheduleList.finishTime,
    );

    let validDays = 0;
    let totalValidDuration = 0;
    const scheduleDays = scheduleList.days.map(day => days[day - 1].name);

    const interval = scheduleList.intervalTypeId;
    if (interval == 0) {
      scheduleDays.forEach(day => {
        if (daysOfWeek.includes(day)) {
          validDays++;
        }
      });
    } else if (interval == 1) {
      const startDate = new Date(scheduleList.startTime);
      const endDate = new Date(scheduleList.finishTime);
      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const currentDayName = [
          'Sun',
          'Mon',
          'Tue',
          'Wed',
          'Thu',
          'Fri',
          'Sat',
        ][currentDate.getDay()];
        if (scheduleDays.includes(currentDayName)) {
          validDays++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } else if (interval == 2) {
      const weeks = Math.floor(numberOfDays / 7);
      const remainingDays = numberOfDays % 7;

      scheduleDays.forEach(day => {
        validDays += weeks;
        if (daysOfWeek.slice(0, remainingDays).includes(day)) {
          validDays++;
        }
      });
    } else if (interval === 3) {
      const startDate = new Date(scheduleList.startTime);
      const endDate = new Date(scheduleList.finishTime);
      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        while (
          currentDate.getMonth() === currentMonth &&
          currentDate <= endDate
        ) {
          const currentDayName = [
            'Sun',
            'Mon',
            'Tue',
            'Wed',
            'Thu',
            'Fri',
            'Sat',
          ][currentDate.getDay()];
          if (scheduleDays.includes(currentDayName)) {
            validDays++;
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }

        if (currentMonth === 11) {
          currentDate.setFullYear(currentYear + 1, 0, 1);
        } else {
          currentDate.setMonth(currentMonth + 1, 1);
        }
      }
    } else if (interval == 4) {
      const startDate = new Date(scheduleList.startTime);
      const endDate = new Date(scheduleList.finishTime);
      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const currentYear = currentDate.getFullYear();

        while (
          currentDate.getFullYear() === currentYear &&
          currentDate <= endDate
        ) {
          const currentDayName = [
            'Sun',
            'Mon',
            'Tue',
            'Wed',
            'Thu',
            'Fri',
            'Sat',
          ][currentDate.getDay()];
          if (scheduleDays.includes(currentDayName)) {
            validDays++;
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }

        currentDate.setFullYear(currentYear + 1, 0, 1);
      }
    } else if (interval == 5) {
      const startDate = new Date(scheduleList.startTime);
      const endDate = new Date(scheduleList.finishTime);
      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const currentDayName = [
          'Sun',
          'Mon',
          'Tue',
          'Wed',
          'Thu',
          'Fri',
          'Sat',
        ][currentDate.getDay()];
        if (scheduleDays.includes(currentDayName)) {
          validDays++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      validDays = validDays * calculateFractionOfDay(scheduleList.interval);
    }

    setScheduleList(prevState => {
      let totalBudget = 0;
      let messageCount = 0;
      const updatedNetworks = prevState.CompaignNetworks.map(item => {
        const matchedPrice =
          priceData?.find(pd => pd.networkId === item.networkId)?.unitPrice ||
          0;
        const isSpecial = [1, 2, 3].includes(item.networkId);

        const albumIdsForNetwork = prevState?.albums
          ?.filter(al => al?.networkid === item.networkId)
          ?.map(al => al?.id);

        let recipientsForNetwork = albumIdsForNetwork?.length
          ? recipients?.filter(
              r =>
                r?.networkId === item.networkId &&
                albumIdsForNetwork.includes(r?.albumid),
            )
          : [];

        if (!isSpecial) {
          recipientsForNetwork = [1];
        }

        const usedQuota = validDays * (recipientsForNetwork.length || 1);
        messageCount += validDays * (recipientsForNetwork.length || 1);
        totalBudget += matchedPrice * usedQuota;

        return {
          ...item,
          budget: matchedPrice * usedQuota,
          messageCount: validDays * (recipientsForNetwork.length || 1),
        };
      });

      const formattedBudget = Math.round(totalBudget * 100) / 100;
      return {
        ...prevState,
        messageCount: messageCount,
        CompaignNetworks: updatedNetworks,
        budget: formattedBudget,
      };
    });
  };

  const calculateFractionOfDay = durationInMinutes => {
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const durationInMilliseconds = durationInMinutes * 60 * 1000;
    const fractionOfDay = durationInMilliseconds / millisecondsPerDay;
    return fractionOfDay.toFixed(2);
  };

  function getDaysBetweenDates(startDateString, endDateString) {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const daysBetween =
      Math.floor((endDate - startDate) / millisecondsPerDay) + 1;
    const daysOfWeek = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < daysBetween; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      daysOfWeek.push(dayNames[currentDate.getDay()]);
    }

    return { numberOfDays: daysBetween, daysOfWeek };
  }

  const currencyId = lovs['orgs']?.find(c => c.id === user?.orgId)?.currencyId;
  // console.log(lovs['lovs'].intervals);

  return (
    <View style={{ marginTop: 10 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          flexWrap: 'wrap',
          columnGap: 10,
          rowGap: 5,
          marginBottom: 10,
        }}
      >
        {campaignInfo.networks.map((network, index) => {
          const networkMessageCount = campaignInfo?.schedules?.reduce(
            (sum, item) =>
              item.networkId === network?.networkId
                ? (sum = sum + item?.messageCount)
                : 0,
            0,
          );
          return (
            <View
              key={index}
              style={{
                backgroundColor: theme.cardBackColor,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 6,
                paddingVertical: 6,
                borderRadius: 6,
              }}
            >
              <Text
                style={{
                  color: theme.textColor,
                  fontSize: fs(16),
                  marginRight: 1,
                }}
              >
                {network.desc || network.networkName || network?.name}
              </Text>
              <QuotaBadge
                remainingQuota={
                  network?.purchasedQouta -
                  (network?.usedQuota + networkMessageCount)
                }
                usedQuota={network?.usedQuota + networkMessageCount}
                totalQuota={network?.purchasedQouta}
              />
              <CheckBox
                style={{
                  transform: [{ scale: Platform.OS === 'ios' ? 0.8 : 1.2 }],
                }}
                boxType={'square'}
                tintColors={{
                  true: theme.selectedCheckBox,
                  false: theme.buttonBackColor,
                }}
                onValueChange={value => {
                  if (value) {
                    setScheduleList({
                      ...scheduleList,
                      networkId: network.networkId,
                      CompaignNetworks: [
                        ...scheduleList.CompaignNetworks,
                        {
                          networkId: network.networkId,
                          orgId: user.orgId,
                          rowVer: 0,
                          purchasedQouta: network.purchasedQouta,
                          unitPriceInclTax: network.unitPriceInclTax,
                          usedQuota: network.usedQuota,
                          compaignId: 0,
                          id: 0,
                          desc: network.desc,
                          status: network.status,
                          createdBy: parseInt(user.id),
                          lastUpdatedBy: parseInt(user.id),
                          createdAt: moment().format(),
                          lastUpdatedAt: moment().format(),
                        },
                      ],
                    });
                  } else {
                    setScheduleList({
                      ...scheduleList,
                      networkId:
                        CampaignNetwork.length == 0
                          ? CampaignNetwork[0].networkId
                          : 0,
                      CompaignNetworks: scheduleList.CompaignNetworks.filter(
                        item => item.networkId != network.networkId,
                      ),
                    });
                  }
                }}
                value={
                  scheduleList.CompaignNetworks.length > 0
                    ? scheduleList.CompaignNetworks.some(
                        item => item.networkId == network.networkId,
                      )
                    : false
                }
              />
            </View>
          );
        })}
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          flex: 1,
        }}
      >
        <View style={{ width: '60%' }}>
          <RNSDropDown
            items={lovs['lovs'].intervals}
            selectedIndex={scheduleList.intervalTypeId}
            onSelect={value => {
              setScheduleList({ ...scheduleList, intervalTypeId: value });
            }}
            style={{
              backgroundColor: theme.inputBackColor,
              color: theme.textColor,
              borderRadius: 6,
              height: 45,
              fontSize: fs(16),
              borderColor: '#ff00003d',
              borderWidth: 1,
            }}
            placeholder="Interval Type..."
            clearTextOnFocus={true}
            keyboardAppearance={'dark'}
          />
        </View>
        <View style={{ width: '35%' }}>
          <TextInput
            placeholder="Seconds"
            placeholderTextColor={theme.placeholderColor}
            defaultValue={scheduleList.intervalTypeId == 5 ? '' : '0'}
            value={scheduleList.interval}
            editable={scheduleList.intervalTypeId == 5 ? true : false}
            onChangeText={value => {
              setScheduleList({ ...scheduleList, interval: value });
            }}
            style={{
              width: '100%',
              marginLeft: 15,
              paddingHorizontal: 10,
              backgroundColor: theme.inputBackColor,
              color: theme.textColor,
              borderRadius: 6,
              fontSize: fs(16),
              height: 45,
            }}
            keyboardType="number-pad"
            maxLength={4}
          />
        </View>
      </View>
      <RNSButton
        caption={
          scheduleList?.albums?.length > 0
            ? `Albums : ${scheduleList?.albums?.map(a => `${a.name} (${lovs['lovs'].networks?.find(n => n?.id === a?.networkid)?.name || ''})`)?.join(', ')}`
            : 'Select Albums'
        }
        bgColor={theme.buttonBackColor}
        style={{
          marginTop: 10,
          height: scheduleList?.albums?.length > 0 ? 'auto' : 40,
        }}
        textStyle={{ fontSize: fs(15), padding: 4 }}
        onPress={() => setShowRecipientAlbumMdl(true)}
      />
      <AlbumSelectionModal
        visible={showRecipientAlbumMdl}
        onClose={onCloseAlbumMdl}
        onSubmit={onSubmitAlbum}
        networkIds={campaignInfo.networks?.map(n => n.networkId)}
        selectedAlbums={selectedAlbums}
        setSelectedAlbums={setSelectedAlbums}
      />

      {/* ── Days section ── */}
      <View
        style={{
          marginTop: 30,
          backgroundColor: theme.cardBackColor,
          paddingHorizontal: 10,
          paddingVertical: 10,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          flexWrap: 'wrap',
          columnGap: 10,
          rowGap: 10,
          borderRadius: 6,
        }}
      >
        {/* Change 2: "Days" label + Select-All checkbox in the floating header */}
        <View
          style={{
            position: 'absolute',
            top: -24,
            left: 0,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.cardBackColor,
            paddingHorizontal: 10,
            paddingVertical: 2,
            borderTopRightRadius: 6,
            borderTopLeftRadius: 6,
          }}
        >
          <Text
            style={{
              color: theme.textColor,
              fontSize: fs(18),
              fontWeight: 'bold',
              marginRight: 8,
            }}
          >
            Days
          </Text>
          <CheckBox
            style={{
              transform: [{ scale: Platform.OS === 'ios' ? 0.7 : 1.0 }],
            }}
            value={allDaysSelected}
            onValueChange={toggleAllDays}
            boxType={'square'}
            tintColors={{
              true: theme.selectedCheckBox,
              false: theme.buttonBackColor,
            }}
          />
          <Text
            style={{
              color: theme.textColor,
              fontSize: fs(14),
            }}
          >
            All
          </Text>
        </View>

        {days.map((day, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              height: 40,
            }}
          >
            <CheckBox
              style={{
                transform: [{ scale: Platform.OS === 'ios' ? 0.8 : 1.4 }],
              }}
              onValueChange={value => {
                if (value) {
                  setScheduleList({
                    ...scheduleList,
                    days: [...scheduleList.days, index + 1],
                  });
                } else {
                  setScheduleList({
                    ...scheduleList,
                    days: scheduleList.days.filter(item => item != index + 1),
                  });
                }
              }}
              value={scheduleList.days.includes(index + 1)}
              boxType={'square'}
              tintColors={{
                true: theme.selectedCheckBox,
                false: theme.buttonBackColor,
              }}
            />
            <Text
              style={{
                color: theme.textColor,
                fontSize: fs(18),
                textAlign: 'center',
              }}
            >
              {day.name}
            </Text>
          </View>
        ))}
      </View>

      {/* ── Date pickers ── */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginTop: 6,
        }}
      >
        {/* Start date */}
        <View style={{ width: '48%' }}>
          <TouchableOpacity
            onPress={() => setShowStartDatePicker(true)}
            style={{
              backgroundColor: theme.inputBackColor,
              paddingHorizontal: 5,
              paddingVertical: 5,
              borderRadius: 6,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                color: theme.textColor,
                fontSize: fs(15),
                textAlign: 'center',
              }}
            >
              {scheduleList.startTime
                ? moment(scheduleList.startTime).format('MMM DD, YYYY') +
                  '\n' +
                  moment(scheduleList.startTime).format('hh:mm A')
                : 'Start Time'}
            </Text>
          </TouchableOpacity>
        </View>

        <DateTimePicker
          isVisible={showStartDatePicker}
          date={
            scheduleList.startTime
              ? new Date(scheduleList.startTime)
              : new Date()
          }
          mode="datetime"
          display="inline"
          onConfirm={date => {
            setShowStartDatePicker(false);
            const campaignStart = new Date(campaignInfo.campaignStartDate);
            const campaignEnd = new Date(campaignInfo.campaignEndDate);

            if (date < campaignStart) {
              Toast.show(
                `Start date cannot be before campaign start (${moment(campaignStart).format('MMM DD, YYYY')})`,
              );
              return;
            }
            if (date > campaignEnd) {
              Toast.show(
                `Start date cannot be after campaign end (${moment(campaignEnd).format('MMM DD, YYYY')})`,
              );
              return;
            }
            // If finish time already set and new start is after it, clear finish
            if (
              scheduleList.finishTime &&
              date > new Date(scheduleList.finishTime)
            ) {
              setScheduleList({
                ...scheduleList,
                startTime: date,
                finishTime: '',
              });
              Toast.show('End time cleared — please re-select it');
              return;
            }
            setScheduleList({ ...scheduleList, startTime: date });
          }}
          onCancel={() => setShowStartDatePicker(false)}
          // accentColor={theme.selectedCheckBox}
          themeVariant={themeMode}
          pickerStyleIOS={{ backgroundColor: theme.cardBackColor }}
          textColor={theme.textColor}
          buttonTextColorIOS={theme.textColor}
          pickerContainerStyleIOS={{ backgroundColor: theme.cardBackColor }}
          customCancelButtonIOS={e => (
            <TouchableOpacity
              onPress={() => setShowStartDatePicker(false)}
              style={{
                width: '100%',
                backgroundColor: theme.cardBackColor,
                borderRadius: 10,
                paddingVertical: 15,
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: fs(20),
                  color: theme.textColor,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* End date */}
        <View style={{ width: '48%' }}>
          <TouchableOpacity
            onPress={() => setShowEndDatePicker(true)}
            style={{
              backgroundColor: theme.inputBackColor,
              paddingHorizontal: 5,
              paddingVertical: 5,
              borderRadius: 6,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: theme.textColor,
                fontSize: fs(15),
                textAlign: 'center',
              }}
            >
              {scheduleList.finishTime
                ? moment(scheduleList.finishTime).format('MMM DD, YYYY') +
                  '\n' +
                  moment(scheduleList.finishTime).format('hh:mm A')
                : 'End Time'}
            </Text>
          </TouchableOpacity>
          <DateTimePicker
            isVisible={showEndDatePicker}
            date={
              scheduleList.finishTime
                ? new Date(scheduleList.finishTime)
                : scheduleList.startTime
                  ? new Date(scheduleList.startTime)
                  : new Date()
            }
            mode="datetime"
            display="inline"
            themeVariant={themeMode}
            onConfirm={date => {
              setShowEndDatePicker(false);
              const campaignEnd = new Date(campaignInfo.campaignEndDate);

              if (date > campaignEnd) {
                Toast.show(
                  `End date cannot be after campaign end (${moment(campaignEnd).format('MMM DD, YYYY')})`,
                );
                return;
              }

              // Same calendar day → allow any time freely (no start-time comparison)
              const isSameDay =
                scheduleList.startTime &&
                moment(date).isSame(moment(scheduleList.startTime), 'day');

              if (
                !isSameDay &&
                scheduleList.startTime &&
                date < new Date(scheduleList.startTime)
              ) {
                Toast.show('End date cannot be before start date');
                return;
              }

              setScheduleList({ ...scheduleList, finishTime: date });
            }}
            onCancel={() => setShowEndDatePicker(false)}
            pickerStyleIOS={{ backgroundColor: theme.cardBackColor }}
            textColor={theme.textColor}
            buttonTextColorIOS={theme.textColor}
            pickerContainerStyleIOS={{ backgroundColor: theme.cardBackColor }}
            customCancelButtonIOS={e => (
              <TouchableOpacity
                onPress={() => setShowEndDatePicker(false)}
                style={{
                  width: '100%',
                  backgroundColor: theme.cardBackColor,
                  borderRadius: 10,
                  paddingVertical: 15,
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: fs(20),
                    color: theme.textColor,
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ marginTop: 10 }}>
        <View style={{ rowGap: 5 }}>
          {scheduleList.CompaignNetworks.map((item, index) => (
            <View
              key={index}
              style={{
                backgroundColor: theme.cardBackColor,
                width: '100%',
                paddingVertical: 8,
                paddingHorizontal: 5,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                borderRadius: 6,
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: fs(16),
                  color: theme.textColor,
                }}
              >
                {item.desc || item.networkName} :{' '}
                {item.purchasedQouta ||
                  item.compaignQouta - item.usedQuota ||
                  0}{' '}
                / {item.messageCount}
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: fs(16),
                  color: theme.textColor,
                }}
              >
                Budget: {(item?.budget || 0).toFixed(2)}{' '}
                {lovs['lovs']?.currencies?.find(c => c.id === currencyId)
                  ?.code || ''}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 10,
        }}
      >
        <RNSButton
          style={{ width: '46%' }}
          bgColor={theme.buttonBackColor}
          caption={isUpdate ? 'Cancel' : 'Back'}
          onPress={() => {
            if (isUpdate) {
              setScheduleList({
                CompaignNetworks: [],
                id: 0,
                budget: 0,
                rowVer: 0,
                messageCount: 0,
                orgId: user.orgId,
                days: [],
                networkId: 0,
                compaignDetailId: 0,
                isFixedTime: 1,
                startTime: campaignInfo.campaignStartDate,
                finishTime: campaignInfo.campaignEndDate,
                interval: 0,
                status: 1,
                intervalTypeId: 1,
                randomId: Math.floor(100000 + Math.random() * 900000),
              });
              setIsUpdate(false);
            } else {
              setIndex(1);
            }
          }}
        />
        <RNSButton
          style={{ width: '46%' }}
          bgColor={theme.buttonBackColor}
          caption={isUpdate ? 'Update' : '+ Schedule'}
          onPress={isUpdate ? updateSchedule : addSchedule}
        />
      </View>
    </View>
  );
};

export default AddSchedule;

const styles = StyleSheet.create({
  dateNote: {
    fontSize: 10,
    marginBottom: 3,
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.8,
  },
});
