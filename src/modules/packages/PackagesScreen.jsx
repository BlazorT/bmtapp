// screens/PricingDetailsScreen.js
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Dropdown } from '../../components';
import { useTheme } from '../../hooks/useTheme';
import { colors } from '../../styles';
import useFetchData from '../../hooks/useFetchData';
import Spinner from 'react-native-loading-spinner-overlay';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../hooks/useUser';
import PaymentView from '../payment/PaymentView';
import JCPaymentConfirm from '../../components/JCPaymentConfirm';
import RNSButton from '../../components/Button';
import { useJazzCash } from '../../hooks/useJazzCash';
import Toast from 'react-native-simple-toast';
import {
  extractTagValue,
  keepOnlyAlphanumeric,
} from '../../helper/dateFormatter';
import moment from 'moment';
import servicesettings from '../dataservices/servicesettings';

const DURATION = [
  { id: 1, name: '1 Month' },
  { id: 3, name: '3 Months (10% off)' },
  { id: 6, name: '6 Months (20% off)' },
];

export default function PricingDetailsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { user, isAuthenticated } = useUser();
  const { payJC, jcLoading } = useJazzCash();
  const networks = useSelector(state => state.lovs?.lovs?.lovs?.networks) || [];
  const { data, loading, fetchData } = useFetchData([
    {
      endpoint: 'Admin/bundlingdetails',
      method: 'POST',
      body: {
        orgId: '0',
      },
      key: 'bundlingDetails',
    },
    ...(isAuthenticated
      ? [
          {
            endpoint: 'Organization/orgpackagedetails',
            method: 'POST',
            body: {
              id: '0',
              orgId: user?.orgId?.toString(),
            },
            key: 'orgPackageDetails',
          },
        ]
      : []),
  ]);

  // =======================
  // STATE
  // =======================
  const [isBuying, setIsBuying] = useState(null);
  const [spinner, setspinner] = useState(false);
  const [selectedGateway, setSelectedGetway] = useState(null);
  const [easypaisaOption, setEasypaisaOption] = useState('');
  const [easyPaisaMobileNumber, setEasyPaisaMobileNumber] = useState('');
  const [jazzCashMobileNumber, setJazzCashMobileNumber] = useState('');
  const [jazzCashNic, setJazzCashNic] = useState('');
  const [jazzCashOption, setJazzCashOption] = useState('');
  const [jazzCashTxnRefNo, setJazzCashTxnRefNo] = useState('');
  const [showJCPayment, setShowJCPayment] = useState(false);
  const [pricingMode, setPricingMode] = useState('individual');
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [messages, setMessages] = useState('');
  const [waConversations, setWaConversations] = useState('');
  const [duration, setDuration] = useState(1);
  const [includeSMS, setIncludeSMS] = useState(true);
  const [includeEmail, setIncludeEmail] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    sms: true,
    email: false,
    facebook: false,
    whatsapp: false,
    instagram: false,
    tiktok: false,
    linkedin: false,
    calculator: false,
  });

  //REF
  const scrollRef = useRef();

  const bundlingDetails = useMemo(() => data?.bundlingDetails || [], [data]);
  const orgPackageDetails = useMemo(
    () => data?.orgPackageDetails || [],
    [data],
  );
  useEffect(() => {
    fetchData();
  }, []);
  // console.log({ data, user });
  // =======================
  // HELPER: Get latest bundling detail for network
  // =======================
  const getLatestBundlingDetail = networkId => {
    const networkDetails = bundlingDetails.filter(
      bd => bd.networkId === networkId && bd.status === 1,
    );
    if (networkDetails.length === 0) return null;

    // Sort by lastUpdatedAt descending and get first
    return networkDetails.sort(
      (a, b) => new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt),
    )[0];
  };

  // =======================
  // HELPER: Generate dynamic pricing plans
  // =======================
  const generateDynamicPlans = (networkId, networkName) => {
    const bundlingDetail = getLatestBundlingDetail(networkId);
    if (!bundlingDetail) return [];

    const basePrice =
      bundlingDetail.unitPrice - (bundlingDetail?.discount || 0);
    const freeAllowed = bundlingDetail.freeAllowed || 0;
    const plans = [];

    // Free plan (if freeAllowed exists)
    if (freeAllowed > 0) {
      plans.push({
        id: 0,
        name: 'Free',
        price: '$0',
        period: '/One Time',
        features: [
          `${freeAllowed} ${networkId === 3 ? 'emails' : 'credits'}/One Time`,
          networkId === 3 ? 'Basic Templates' : 'Basic support',
          'Standard delivery',
        ],
        networkId,
      });
    }

    // Special handling for Email (networkId === 3)
    if (networkId === 3) {
      plans.push({
        id: 1,
        name: 'Pay As You Go',
        price: `$${basePrice.toFixed(2)}`,
        period: '/Unit',
        features: [
          'No commitment',
          'Instant delivery',
          'Pay only for what you use',
        ],
        networkId,
      });

      // Email-specific plans
      const emailPlans = [
        {
          id: 2,
          name: 'Starter',
          qty: 5000,
          discount: 0.1,
          period: '/1 month',
          badge: 'SAVE 10%',
          features: [
            '5,000 emails/ 1 month',
            'Custom templates',
            'Advanced analytics',
          ],
        },
        {
          id: 3,
          name: 'Premium',
          qty: 10000,
          discount: 0.15,
          period: '/6 month',
          badge: 'SAVE 15%',
          features: [
            '10,000 emails/ 6 month',
            'Custom templates',
            'Advanced analytics',
          ],
        },
        {
          id: 4,
          name: 'Business',
          qty: 50000,
          discount: 0.2,
          period: '/Year',
          badge: 'SAVE 20%',
          features: [
            '50,000 emails/Year',
            'Automation workflows',
            'Priority support',
          ],
        },
      ];

      emailPlans.forEach(plan => {
        const discountedPrice = basePrice * (1 - plan.discount);
        const totalPrice = plan.qty * discountedPrice;
        const originalPrice = plan.qty * basePrice;

        plans.push({
          id: plan.id,
          name: plan.name,
          price: `$${totalPrice.toFixed(2)}`,
          originalPrice: `$${originalPrice.toFixed(2)}`,
          period: plan.period,
          badge: plan.badge,
          features: plan.features,
          qouta: plan.qty,
          networkId,
        });
      });
    } else {
      // Original logic for other networks
      // Pay As You Go
      plans.push({
        id: 1,
        name: 'Pay As You Go',
        price: `$${basePrice.toFixed(2)}`,
        period: '/Unit',
        features: [
          'No commitment',
          'Instant delivery',
          'Pay only for what you use',
        ],
        networkId,
      });

      // Bulk plans with 10%, 15%, 20% discounts
      const quantities = [1000, 5000, 10000];
      const discounts = [0.1, 0.15, 0.2]; // 10%, 15%, 20%
      const durations = ['Month', '6 Month', 'Year'];
      const featureDuration = ['1 Month', '6 Month', '1 Year'];

      quantities.forEach((qty, idx) => {
        const discountRate = discounts[idx];
        const discountedPrice = basePrice * (1 - discountRate);
        const totalPrice = qty * discountedPrice;
        const badgeText = `SAVE ${Math.round(discountRate * 100)}%`;

        plans.push({
          id: idx + 2,
          name: `Bulk ${qty / 1000}K`,
          price: `$${totalPrice.toFixed(2)}`,
          originalPrice: `$${(qty * basePrice).toFixed(2)}`,
          period: `/${durations[idx]}`,
          badge: badgeText,
          features: [
            `${qty} credits`,
            `Valid for ${featureDuration[idx].toLowerCase()}`,
            `Best value at ${Math.round(discountRate * 100)}% off`,
          ],
          qouta: qty,
          networkId,
        });
      });
    }

    return plans;
  };

  // Fallback static plans (when no dynamic data)
  const fallbackPlans = {
    sms: [
      {
        id: 1,
        name: 'Pay As You Go',
        price: '$0.02',
        period: '/SMS',
        features: [
          'No monthly commitment',
          'Instant delivery',
          'Pay only for what you send',
        ],
      },
      {
        id: 2,
        name: 'Bulk 5K',
        price: '$75',
        originalPrice: '$100',
        period: '/Monthly',
        badge: 'SAVE 10%',
        features: [
          '5,000 SMS credits',
          'Valid for 12 months',
          'Best for small campaigns',
        ],
      },
      {
        id: 3,
        name: 'Bulk 10K',
        price: '$140',
        originalPrice: '$200',
        period: '/6 Month',
        badge: 'SAVE 15%',
        features: [
          '10,000 SMS credits',
          'Valid for 6 months',
          'Ideal for growing businesses',
        ],
      },
      {
        id: 4,
        name: 'Yearly',
        price: '$50',
        period: '/Yearly',
        badge: 'SAVE 20%',
        features: ['3,000 SMS / Yearly', 'Auto-renew', 'Cancel anytime'],
      },
    ],
    email: [
      {
        id: 1,
        name: 'Free',
        price: '$0',
        period: '/One Time',
        features: ['10 emails/One Time', 'Basic templates', 'Analytics'],
      },
      {
        id: 2,
        name: 'Starter',
        price: '$10',
        period: '/1 month',
        badge: 'SAVE 10%',
        features: [
          '5,000 emails/ 1 month',
          'Custom templates',
          'Advanced analytics',
        ],
      },
      {
        id: 3,
        name: 'Premium',
        price: '$15',
        period: '/6 month',
        badge: 'SAVE 15%',
        features: [
          '10,000 emails/ 6 month',
          'Custom templates',
          'Advanced analytics',
        ],
      },
      {
        id: 4,
        name: 'Business',
        price: '$49',
        period: '/Yearly',
        badge: 'SAVE 20%',
        features: [
          '50,000 emails/Yearly',
          'Automation workflows',
          'Priority support',
        ],
      },
    ],
    facebook: [
      {
        id: 1,
        name: 'Free',
        price: '$5',
        period: '/1 Month',
        features: [
          'Organic posts & reels',
          'Page management',
          'Basic insights',
          'No ads',
        ],
      },
      {
        id: 2,
        name: 'Starter',
        price: '$29',
        period: '/3 month',
        badge: 'SAVE 10%',
        features: [
          '20 boosted posts/month',
          '5 reel promotions',
          'Basic ad manager access',
          'Audience targeting',
          'Monthly performance report',
        ],
      },
      {
        id: 3,
        name: 'Premium',
        price: '$79',
        period: '/6 month',
        badge: 'SAVE 20%',
        features: [
          'Unlimited boosted posts & reels',
          '10 full ad campaigns/month',
          'A/B testing',
          'Custom audiences & lookalikes',
          'Weekly analytics report',
          'Priority support',
        ],
      },
      {
        id: 4,
        name: 'Business',
        price: '$149',
        originalPrice: '$199',
        period: '/Yearly',
        badge: 'BEST VALUE',
        features: [
          'Everything in Premium',
          'Unlimited ad campaigns',
          'Pixel & conversion tracking',
          'Retargeting ads',
          'Dedicated account manager',
          'Daily performance insights',
        ],
      },
    ],
    whatsapp: [
      {
        id: 1,
        name: 'Per Conversation',
        price: '$0.05',
        period: '/conversation',
        features: ['Pay only for initiated chats', 'Official WhatsApp API'],
      },
      {
        id: 2,
        name: 'Bundle 1K',
        price: '$45',
        period: '/month',
        badge: 'SAVE 10%',
        features: ['1,000 conversations', 'Template messages'],
      },
      {
        id: 3,
        name: 'Bundle 5K',
        price: '$200',
        originalPrice: '$250',
        period: '/6 month',
        badge: 'SAVE 15%',
        features: ['5,000 conversations', 'Higher limits'],
      },
      {
        id: 4,
        name: 'Automation',
        price: '$99',
        period: '/Yearly',
        features: ['Chatbot included', '2,000 conversations', 'Flow builder'],
      },
    ],
    instagram: [
      {
        id: 1,
        name: 'Basic',
        price: '$7',
        period: '/month',
        features: [
          'Organic posts & stories',
          'Profile management',
          'Basic insights',
        ],
      },
      {
        id: 2,
        name: 'Growth',
        price: '$49',
        period: '/3 month',
        badge: 'SAVE 15%',
        features: [
          '30 boosted posts/ 3 month',
          'Reel promotions',
          'Hashtag & audience targeting',
          'Monthly report',
        ],
      },
      {
        id: 3,
        name: 'Premium',
        price: '$119',
        originalPrice: '$149',
        period: '/6 month',
        badge: 'POPULAR',
        features: [
          'Unlimited boosts & ads',
          'Stories & carousel ads',
          'A/B testing',
          'Shop integration',
          'Weekly analytics',
        ],
      },
      {
        id: 4,
        name: 'Pro',
        price: '$150',
        originalPrice: '$149',
        period: '/Yearly',
        badge: 'POPULAR',
        features: [
          'Unlimited boosts & ads',
          'Stories & carousel ads',
          'A/B testing',
          'Shop integration',
          'Weekly analytics',
        ],
      },
    ],
    tiktok: [
      {
        id: 1,
        name: 'Starter',
        price: '$7',
        period: '/1 month',
        features: ['Organic video posting', 'Trend access', 'Basic effects'],
      },
      {
        id: 2,
        name: 'Creator',
        price: '$69',
        period: '/3 month',
        badge: 'SAVE 20%',
        features: [
          '20 promoted videos/month',
          'Spark Ads',
          'Trend boosting',
          'Duet & Stitch promotion',
        ],
      },
      {
        id: 3,
        name: 'Viral Pro',
        price: '$159',
        originalPrice: '$199',
        period: '/6 month',
        badge: 'BEST VALUE',
        features: [
          'Unlimited promotions',
          'In-feed & TopView ads',
          'Branded effects',
          'Live stream boosting',
          'Detailed analytics',
        ],
      },
      {
        id: 4,
        name: 'Viral Premium',
        price: '$159',
        originalPrice: '$199',
        period: '/Yearly',
        badge: 'BEST VALUE',
        features: [
          'Unlimited promotions',
          'In-feed & TopView ads',
          'Branded effects',
          'Live stream boosting',
          'Detailed analytics',
        ],
      },
    ],
    linkedin: [
      {
        id: 1,
        name: 'Free',
        price: '$6',
        period: '/1 month',
        features: ['Company page posts', 'Organic reach', 'Basic analytics'],
      },
      {
        id: 2,
        name: 'Professional',
        price: '$99',
        period: '/6 month',
        badge: 'SAVE 10%',
        features: [
          '15 sponsored posts/ 6 month',
          'Lead gen forms',
          'Job title & industry targeting',
          'Monthly report',
        ],
      },
      {
        id: 3,
        name: 'Business',
        price: '$224',
        originalPrice: '$299',
        period: '/Yearly',
        badge: 'SAVE 25%',
        features: [
          'Unlimited sponsored content',
          'Carousel & video ads',
          'Company & skill targeting',
          'InMail credits',
          'Weekly insights',
        ],
      },
      {
        id: 4,
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        features: [
          'Full campaign management',
          'Account-based marketing',
          'Dedicated strategist',
          'API access',
        ],
      },
    ],
  };

  // =======================
  // PRICING DATA - Static fallback
  // =======================
  const pricingPlans = useMemo(() => {
    const networkMap = {};

    // Build dynamic plans for each network
    networks.forEach(network => {
      const dynamicPlans = generateDynamicPlans(network.id, network.name);
      if (dynamicPlans.length > 0) {
        networkMap[`network_${network.id}`] = dynamicPlans;
      }
    });
    return {
      sms: networkMap['network_1'] || fallbackPlans?.sms,
      whatsapp: networkMap['network_2'] || fallbackPlans?.whatsapp,
      email: networkMap['network_3'] || fallbackPlans?.email,
      facebook: networkMap['network_5'] || fallbackPlans?.facebook,
      instagram: networkMap['network_6'] || fallbackPlans?.instagram,
      linkedin: networkMap['network_7'] || fallbackPlans?.linkedin,
      tiktok: networkMap['network_8'] || fallbackPlans?.tiktok,
    };
  }, [networks, bundlingDetails, fallbackPlans]);

  // =======================
  // CALCULATION LOGIC
  // =======================
  const pricingMatrix = useMemo(() => {
    if (pricingMode === 'individual') {
      if (!selectedNetwork || !messages || Number(messages) <= 0) {
        return [];
      }

      const bundlingDetail = getLatestBundlingDetail(selectedNetwork);
      if (!bundlingDetail) return [];

      const basePrice =
        bundlingDetail.unitPrice - (bundlingDetail?.discount || 0);
      let discount = 1;
      if (duration === 3) discount = 0.9;
      if (duration === 6) discount = 0.8;

      const pricePerUnit = basePrice * discount;
      const totalPrice = Number(messages) * pricePerUnit;

      const networkName =
        networks.find(n => n.id == selectedNetwork)?.name || '';

      return [
        {
          id: 1,
          network: networkName,
          messages: Number(messages),
          duration: `${duration} Month(s)`,
          pricePerMsg: `$${pricePerUnit.toFixed(2)}`,
          totalPrice: `$${totalPrice.toFixed(2)}`,
        },
      ];
    } else {
      if (!waConversations || Number(waConversations) <= 0) {
        return [];
      }

      let bundlePrice = 79;
      let includedItems = ['WhatsApp Business API'];

      if (Number(waConversations) <= 500) {
        includedItems.push('500 WhatsApp Conversations');
      } else if (Number(waConversations) <= 2000) {
        bundlePrice = 149;
        includedItems.push('2,000 Conversations', '10,000 Emails');
        if (includeSMS) includedItems.push('2,000 SMS');
      } else {
        bundlePrice = 299;
        includedItems.push(
          'Unlimited (fair use)',
          '50,000 Emails',
          '10,000 SMS',
        );
      }

      if (includeSMS && Number(waConversations) <= 500) {
        bundlePrice += 20;
        includedItems.push('SMS');
      }
      if (includeEmail && Number(waConversations) <= 500) {
        bundlePrice += 15;
        includedItems.push('Email');
      }

      let discount = 1;
      if (duration === 3) discount = 0.9;
      if (duration === 6) discount = 0.8;
      const finalPrice = bundlePrice * discount;

      return [
        {
          id: 1,
          bundle: 'All-in-One Bundle',
          waConversations: Number(waConversations),
          included: includedItems.join(', '),
          duration: `${duration} Month(s)`,
          totalPrice: `$${finalPrice.toFixed(2)}`,
        },
      ];
    }
  }, [
    pricingMode,
    selectedNetwork,
    messages,
    waConversations,
    duration,
    includeSMS,
    includeEmail,
    networks,
    bundlingDetails,
  ]);

  // =======================
  // HELPERS
  // =======================
  const toggleSection = section => {
    if (section === 'calculator' && !expandedSections?.calculator) {
      scrollRef.current?.scrollToEnd({ animated: true });
      setExpandedSections({
        calculator: true,
      });
      return;
    }
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // =======================
  // HELPER: Check if package is valid
  // =======================
  const isPackageValid = (startTime, finishTime) => {
    const now = moment();
    const start = moment(startTime);
    const finish = moment(finishTime);
    return now.isBetween(start, finish);
  };

  // =======================
  // HELPER: Check if package is expired
  // =======================
  const isPackageExpired = finishTime => {
    const now = moment();
    const finish = moment(finishTime);
    return now.isAfter(finish);
  };

  // =======================
  // HELPER: Calculate remaining days
  // =======================
  const getRemainingDays = finishTime => {
    const now = moment();
    const finish = moment(finishTime);
    const days = finish.diff(now, 'days');
    return days > 0 ? days : 0;
  };

  // =======================
  // HELPER: Get current valid package for network
  // =======================
  const getCurrentValidPackage = networkId => {
    const npackage = orgPackageDetails?.find(
      op =>
        op?.networkId === networkId &&
        isPackageValid(op.startTime, op.finishTime),
    );
    return npackage || null;
  };

  // =======================
  // HELPER: Get expired package for network
  // =======================
  const getExpiredPackage = networkId => {
    const npackage = orgPackageDetails?.find(
      op => op?.networkId === networkId && isPackageExpired(op.finishTime),
    );
    return npackage || null;
  };

  // =======================
  // COMPONENTS
  // =======================
  const PricingCard = ({
    plan,
    currentValidPackage,
    expiredPackage,
    networkId,
  }) => {
    const hasValidPackage = !!currentValidPackage;
    const hasExpiredPackage = !!expiredPackage;

    const isThisCardTheExpiredPlan =
      expiredPackage && expiredPackage.purchasedQouta === plan.qouta;

    // Check if THIS specific plan card matches the purchased quota
    const isThisCardThePurchasedPlan =
      currentValidPackage &&
      currentValidPackage.purchasedQouta === plan.qouta &&
      !isThisCardTheExpiredPlan;

    const remainingDays = currentValidPackage
      ? getRemainingDays(currentValidPackage.finishTime)
      : 0;

    return (
      <View style={[styles.card, { backgroundColor: theme.inputBackColor }]}>
        {plan.badge && !isThisCardThePurchasedPlan && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{plan.badge}</Text>
          </View>
        )}

        {/* Show active badge only on the card with matching purchased quota */}
        {isThisCardThePurchasedPlan && (
          <View
            style={[
              styles.activePackageBadge,
              { backgroundColor: colors.success || '#28a745' },
            ]}
          >
            <Text style={styles.activePackageText}>
              ✓ Active ({remainingDays} days remaining)
            </Text>
          </View>
        )}

        {/* Show expired badge only on the card with matching expired quota */}
        {isThisCardTheExpiredPlan && (
          <View
            style={[
              styles.activePackageBadge,
              { backgroundColor: colors.danger || '#dc3545' },
            ]}
          >
            <Text style={styles.activePackageText}>
              ⓘ Expired on{' '}
              {moment(expiredPackage.finishTime).format('DD MMM YYYY')}
            </Text>
          </View>
        )}

        <Text style={[styles.planName, { color: theme.textColor }]}>
          {plan.name}
        </Text>

        <View style={styles.priceSection}>
          {plan.originalPrice && (
            <Text
              style={[styles.originalPrice, { color: theme.placeholderColor }]}
            >
              {plan.originalPrice}
            </Text>
          )}
          <Text style={styles.price}>{plan.price}</Text>
          <Text style={[styles.period, { color: theme.placeholderColor }]}>
            {plan.period}
          </Text>
        </View>

        {/* Show package details only if this card is the active one */}
        {isThisCardThePurchasedPlan && (
          <View
            style={[
              styles.packageDetails,
              { borderColor: colors.success || '#28a745' },
            ]}
          >
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textColor }]}>
                Purchased Quota:
              </Text>
              <Text
                style={[
                  styles.detailValue,
                  { color: colors.success || '#28a745' },
                ]}
              >
                {currentValidPackage.purchasedQouta}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textColor }]}>
                Used:
              </Text>
              <Text style={[styles.detailValue, { color: theme.textColor }]}>
                {currentValidPackage.usedQuota || 0}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textColor }]}>
                Remaining:
              </Text>
              <Text
                style={[
                  styles.detailValue,
                  { color: colors.success || '#28a745' },
                ]}
              >
                {(currentValidPackage.purchasedQouta || 0) -
                  (currentValidPackage.usedQuota || 0)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textColor }]}>
                Valid Until:
              </Text>
              <Text style={[styles.detailValue, { color: theme.textColor }]}>
                {moment(currentValidPackage.finishTime).format('DD MMM YYYY')}
              </Text>
            </View>
          </View>
        )}

        {isBuying ? null : (
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: isThisCardThePurchasedPlan
                  ? theme.placeholderColor
                  : theme.buttonBackColor,
                opacity: isThisCardThePurchasedPlan ? 0.6 : 1,
              },
            ]}
            onPress={() => {
              if (isAuthenticated) {
                if (plan.name === 'Free' || plan.name === 'Pay As You Go') {
                  navigation.navigate('Blazor Media ToolKit', {
                    screen: 'Campaign (+)',
                  });
                } else {
                  setIsBuying({
                    ...plan,
                    toPay: parseFloat(plan.price?.replace('$', '')),
                  });
                }
              } else {
                navigation.navigate('Login');
              }
            }}
            disabled={
              isThisCardThePurchasedPlan &&
              plan.name !== 'Free' &&
              plan.name !== 'Pay As You Go'
            }
          >
            <Text style={styles.buttonText}>
              {isThisCardThePurchasedPlan &&
              plan.name !== 'Free' &&
              plan.name !== 'Pay As You Go'
                ? 'Active Package'
                : plan.name?.includes('Bulk')
                  ? 'Buy Now'
                  : plan.name === 'Enterprise'
                    ? 'Contact Sales'
                    : 'Get Started'}
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.features}>
          {plan.features.map((feature, idx) => (
            <View key={idx} style={styles.feature}>
              <Text style={[styles.featureText, { color: theme.textColor }]}>
                ✓ {feature}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const SectionHeader = ({ title, section }) => (
    <TouchableOpacity
      style={[styles.sectionHeader, { backgroundColor: theme.inputBackColor }]}
      onPress={() => toggleSection(section)}
    >
      <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
        {title}
      </Text>
      <Text style={[styles.arrow, { color: theme.textColor }]}>
        {expandedSections[section] ? '▼' : '▶'}
      </Text>
    </TouchableOpacity>
  );

  const easyPaisaQuickPay = async () => {
    const orderId =
      `${keepOnlyAlphanumeric((Number(user.orgId) ?? '') + 'RBMT')}` +
      'D' +
      moment().format('YYYYMMDDHHmmss');
    const transactionAmount = parseFloat(
      ((isBuying?.toPay || 0.0) * 280.67)?.toFixed(2),
    );

    const xmlBody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:dto="http://dto.transaction.partner.pg.systems.com/"
    xmlns:dto1="http://dto.common.pg.systems.com/">
       <soapenv:Header/>
       <soapenv:Body>
          <dto:initiateTransactionRequestType>
             <dto1:username>${
               selectedGateway.merchantAccountId ?? 'Hotmealndealz.'
             }</dto1:username>
             <dto1:password>${
               selectedGateway?.primaryKey ?? '915c7b18ee8adec0393e55690c34d328'
             }</dto1:password>
             <orderId>${orderId}</orderId>
             <storeId>${`760757`}</storeId>
             <transactionAmount>${transactionAmount}</transactionAmount>
             <transactionType>MA</transactionType>
             <mobileAccountNo>${easyPaisaMobileNumber}</mobileAccountNo>
             <emailAddress>${user?.email || ''}</emailAddress>
             <paymentTokenExpiryDateTime>${moment()
               .add(5, 'minute')
               .toISOString()}</paymentTokenExpiryDateTime >
          </dto:initiateTransactionRequestType>
       </soapenv:Body>
    </soapenv:Envelope>
    `;
    try {
      setspinner(true);
      const res = await fetch(
        selectedGateway?.url ??
          'https://easypay.easypaisa.com.pk/easypay-service/PartnerBusinessService',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'text/xml',
            SOAPAction: 'initiateTransaction',
            // Credentials: `${encodeBase64('znawazch@gmail.com:Blazor@025')}`,
          },
          body: xmlBody,
        },
      );
      const data = await res.text();
      const responseCode = extractTagValue(data, 'ns2:responseCode');
      const transactionId = extractTagValue(data, 'transactionId');
      if (data && responseCode == '0000') {
        updatePurchasedQuota(btoa(data));
        Toast.show('Payment successful');
      } else {
        Toast.show(
          'Payment is not success, possible reasons, account holder acceptance is not done or easy paisa account does not exist!',
        );
        return;
      }
    } catch (e) {
      Toast.show(e?.message || 'Something went wrong, try again later!');
      await easyPaisaCheckStatus(orderId);
    } finally {
      setspinner(false);
    }
  };

  const easyPaisaCheckStatus = async orderId => {
    const xmlBody = `
    <soapenv:Envelope
      xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
      xmlns:dto="http://dto.transaction.partner.pg.systems.com/"
      xmlns:dto1="http://dto.common.pg.systems.com/"
    >
      <soapenv:Header />
      <soapenv:Body>
        <dto:inquireTransactionRequestType>
          <dto1:username>${selectedGateway?.merchantAccountId}</dto1:username>
          <dto1:password>${selectedGateway?.primaryKey}</dto1:password>
          <orderId>${orderId}</orderId>
          <accountNum>159130486</accountNum>
        </dto:inquireTransactionRequestType>
      </soapenv:Body>
    </soapenv:Envelope>
  `;

    try {
      setspinner(true);
      const res = await fetch(
        selectedGateway?.url ??
          'https://easypay.easypaisa.com.pk/easypay-service/PartnerBusinessService',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'text/xml',
            SOAPAction: 'inquireTransactionResponseType',
            // Credentials: `${encodeBase64('znawazch@gmail.com:Blazor@025')}`,
          },
          body: xmlBody,
        },
      );
      const data = await res.text();
      const responseCode = extractTagValue(data, 'ns2:responseCode');
      const transactionStatus = extractTagValue(data, 'transactionStatus');
      if (responseCode === '0000' && transactionStatus) {
        if (transactionStatus === 'PAID') {
          Toast.show('Payment successful');
          updatePurchasedQuota(btoa(data));
        }
        if (transactionStatus === 'FAILED') {
          Toast.show(
            'Payment is not success, possible reasons, account holder acceptance is not done or easy paisa account does not exist!',
          );
        }
        if (transactionStatus === 'PENDING') {
          setspinner(true);
          return;
          // Toast.show(
          //   'Payment is not success, possible reasons, account holder acceptance is not done or easy paisa account does not exist!',
          // );
        }
      } else if (responseCode) {
        Toast.show(
          'Payment is not success, possible reasons, account holder acceptance is not done or easy paisa account does not exist!',
        );
        return;
      }
    } catch (e) {
      Toast.show(e?.message || 'Something went wrong, try again later!');
    } finally {
      setspinner(false);
    }
  };

  const makeJCMwalltet = async () => {
    const now = moment().local();
    const txnDateTime = now.format('YYYYMMDDHHmmss');

    // Generate TxnRefNo (first three letters of domain + timestamp)
    const txnRef = `BMT${txnDateTime}`;
    setJazzCashTxnRefNo(txnRef);

    const jcBody = {
      amount: parseInt(
        parseFloat(((isBuying?.toPay || 0.0) * 280.67)?.toFixed(2)) * 100,
      )?.toString(), // will be sent as 200 (Rs 2.00)
      mobile: jazzCashMobileNumber,
      description: 'mobile',
      billRef:
        `${keepOnlyAlphanumeric((Number(user.orgId) ?? '') + 'RBMT')}` +
        'D' +
        moment().format('YYYYMMDDHHmmss'),
      cnic: jazzCashNic,
      ppmpf_1: keepOnlyAlphanumeric(user?.email ?? ''),
      txnRef,
      ppmpf_2: '',
    };
    console.log({ jcBody });
    const res = await payJC(jcBody);
    if (res) {
      const filteredResponse = {
        pp_TxnType: res.pp_TxnType || '',
        pp_Amount: res.pp_Amount || '',
        pp_BillReference: res.pp_BillReference || '',
        pp_ResponseCode: res.pp_ResponseCode || '',
        pp_RetreivalReferenceNo: res.pp_RetreivalReferenceNo || '',
        pp_SubMerchantID: res.pp_SubMerchantID || '',
        pp_TxnCurrency: res.pp_TxnCurrency || '',
        pp_TxnDateTime: res.pp_TxnDateTime || '',
        pp_TxnRefNo: res.pp_TxnRefNo || '',
        pp_MobileNumber: res.pp_MobileNumber || '',
        pp_CNIC: res.pp_CNIC || '',
        pp_SecureHash: res.pp_SecureHash || '',
      };
      if (res?.pp_ResponseCode === '157') {
        // toggleJCPayment();
        setShowJCPayment(true);
      } else if (res?.pp_ResponseCode === '000') {
        Toast.show(res?.pp_ResponseMessage);
        updatePurchasedQuota(1, btoa(JSON.stringify(filteredResponse)));
      } else if (res?.pp_ResponseMessage) {
        setJazzCashTxnRefNo('');
        Toast.show(res?.pp_ResponseMessage);
      }
    }
  };

  const payAndPlace = async () => {
    if (!selectedGateway) {
      Toast.show('Select a payment method to proceed');
      return;
    }
    if (selectedGateway?.name?.toLowerCase() == 'easypaisa') {
      if (easypaisaOption !== 'quickPay') {
        Toast.show('Select an EasyPaisa payment mode to continue.');
        return;
      }
      if (easyPaisaMobileNumber === '' || easyPaisaMobileNumber.length < 11) {
        Toast.show('Enter a valid EasyPaisa account number');
        return;
      }
      await easyPaisaQuickPay();
    }
    if (selectedGateway?.name?.toLowerCase() == 'jazzcash') {
      if (jazzCashOption !== 'wallet') {
        Toast.show('Select a JazzCash payment mode to continue.');
        return;
      }
      if (jazzCashMobileNumber === '' || jazzCashMobileNumber.length < 10) {
        Toast.show('Enter a valid JazzCash account number');
        return false;
      }
      if (jazzCashNic === '' || jazzCashNic.length < 6) {
        Toast.show('Please enter at least 6 digits of your cnic');
        return false;
      }
      await makeJCMwalltet();
    }
  };
  const getPackageTimeRange = () => {
    // /Monthly, /6 Month , /Yearly
    const period = isBuying?.period;

    if (period === '/Monthly') {
      return {
        startTime: moment().utc().startOf('day').format(),
        finishTime: moment().utc().add(1, 'month').startOf('day').format(),
      };
    }
    if (period === '/6 Month') {
      return {
        startTime: moment().utc().startOf('day').format(),
        finishTime: moment().utc().add(6, 'month').startOf('day').format(),
      };
    }
    if (period === '/Yearly') {
      return {
        startTime: moment().utc().startOf('day').format(),
        finishTime: moment().utc().add(1, 'year').startOf('day').format(),
      };
    }
  };

  const updatePurchasedQuota = async (ref = '') => {
    try {
      setspinner(true);
      let body;

      const findNetworkPackageDetails = orgPackageDetails?.find(
        op => op?.networkId === isBuying?.networkId,
      );

      const { startTime, finishTime } = getPackageTimeRange();
      if (findNetworkPackageDetails) {
        body = [
          {
            ...findNetworkPackageDetails,
            startTime,
            finishTime,
            purchasedQouta: isBuying.qouta,
            lastUpdatedAt: moment().utc().format(),
            lastUpdatedBy: user?.id,
          },
        ];
      } else {
        body = [
          {
            orgId: user?.orgId,
            name: '',
            description: null,
            targetAudienceId: null,
            smtpserver: '',
            smtpport: '',
            smtpcreduser: '',
            smtpcredpwd: '',
            smtpsslenabled: 0,
            smtpsecretkey: '',
            password: '',
            m2mIntervalSeconds: 0,
            apikeySecret: '',
            port: null,
            custom2: '',
            custom1: '',
            sender: '',
            unitId: 0,
            virtualAccount: 0,
            url: '',
            hashTags: null,
            networkId: isBuying?.networkId,
            autoReplyContent: '',
            replyMediaContentId: null,
            autoReplyAllowed: 1,
            postTypeId: null,
            usedQuota: 0,
            bufferQuota: null,
            status: 1,
            businessId: '',
            apiuri: '',
            apikey: '',
            webUrl: null,
            accountAuthData: '',
            id: 0,
            rowVer: 0,
            startTime,
            finishTime,
            purchasedQouta: isBuying.qouta,
            lastUpdatedBy: user?.id,
            createdBy: user?.id,
            lastUpdatedAt: moment().utc().format(),
            createdAt: moment().utc().format(),
          },
        ];
      }
      const headerFetch = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
          Authorization: servicesettings.AuthorizationKey,
        },
      };

      const response = await fetch(
        servicesettings.baseuri + 'Organization/addupdatenetworksettings',
        headerFetch,
      );

      if (!response.ok) {
        Toast.show('Failed to create album');
        return;
      }

      const res = await response.json();
      if (res?.status) {
        Toast.show(res?.message || 'updated purchased quota');
        setIsBuying(null);
        fetchData();
      } else {
        Toast.show(res?.message || 'Error updating purchased quota');
      }
    } catch (e) {
      Toast.show(e?.message || 'Error updating purchased quota');
    } finally {
      setspinner(false);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <Spinner visible={loading || spinner} />
      {isBuying ? (
        <View style={{ flex: 1 }}>
          <Modal visible={jcLoading} backdropColor={'transparent'} transparent>
            <View
              style={[
                styles.jcLoadingMdl,
                {
                  backgroundColor: theme.modalBackColor,
                  shadowColor: theme.textColor,
                },
              ]}
            >
              <Text
                style={{
                  color: theme.textColor,
                  fontSize: 22,
                  fontWeight: '700',
                }}
              >
                Jazz Cash
              </Text>
              <View style={{ width: 200 }}>
                <ActivityIndicator
                  color={theme.buttonBackColor}
                  style={{
                    transform: [{ scaleX: 5 }, { scaleY: 5 }],
                    marginVertical: 50,
                  }}
                />
              </View>
              <Text style={{ color: theme.textColor, fontSize: 18 }}>
                Confirming payment it may take some time, might be upto 10
                min....
              </Text>
              <Text
                style={{
                  color: theme.buttonBackColor,
                  fontSize: 18,
                }}
              >
                Please approve the payment request in your JazzCash app to
                complete your order.
              </Text>
            </View>
          </Modal>
          <PaymentView
            onPayComplete={updatePurchasedQuota}
            selectedGateway={selectedGateway}
            easyPaisaMobileNumber={easyPaisaMobileNumber}
            easypaisaOption={easypaisaOption}
            setEasyPaisaMobileNumber={setEasyPaisaMobileNumber}
            setEasypaisaOption={setEasypaisaOption}
            setSelectedGetway={setSelectedGetway}
            jazzCashMobileNumber={jazzCashMobileNumber}
            jazzCashNic={jazzCashNic}
            jazzCashOption={jazzCashOption}
            setJazzCashMobileNumber={setJazzCashMobileNumber}
            setJazzCashNic={setJazzCashNic}
            setJazzCashOption={setJazzCashOption}
            toPay={(isBuying?.toPay || 0.0) * 280.67}
          />
          <JCPaymentConfirm
            isVisible={showJCPayment}
            toggleModal={() => setShowJCPayment(prev => !prev)}
            setShowJCPayment={setShowJCPayment}
            onCheckout={updatePurchasedQuota}
            jazzCashTxnRefNo={jazzCashTxnRefNo}
          />
          <PricingCard plan={isBuying} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}
          >
            <RNSButton
              style={{ width: '49%' }}
              bgColor={theme.buttonBackColor}
              caption="Cancel"
              onPress={() => setIsBuying(null)}
              textStyle={{ fontSize: 14 }}
            />

            <RNSButton
              style={{ width: '49%' }}
              bgColor={theme.buttonBackColor}
              caption={`Pay PKR ${((isBuying?.toPay || 0.0) * 280.67)?.toFixed(2)}`}
              onPress={payAndPlace}
              textStyle={{ fontSize: 14 }}
            />
          </View>
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 90}
        >
          <ScrollView showsVerticalScrollIndicator={false} ref={scrollRef}>
            {/* SMS Plans */}
            <View style={styles.sectionContainer}>
              <SectionHeader title="📱 SMS Marketing" section="sms" />
              {expandedSections.sms && (
                <FlatList
                  scrollEnabled={false}
                  data={pricingPlans.sms}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({ item }) => (
                    <PricingCard
                      plan={item}
                      currentValidPackage={getCurrentValidPackage(1)}
                      expiredPackage={getExpiredPackage(1)}
                      networkId={1}
                    />
                  )}
                />
              )}
            </View>

            {/* Email Plans */}
            <View style={styles.sectionContainer}>
              <SectionHeader title="✉️ Email Marketing" section="email" />
              {expandedSections.email && (
                <FlatList
                  scrollEnabled={false}
                  data={pricingPlans.email}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({ item }) => (
                    <PricingCard
                      plan={item}
                      currentValidPackage={getCurrentValidPackage(3)}
                      expiredPackage={getExpiredPackage(3)}
                      networkId={3}
                    />
                  )}
                />
              )}
            </View>

            {/* WhatsApp Plans */}
            <View style={styles.sectionContainer}>
              <SectionHeader title="💬 WhatsApp Business" section="whatsapp" />
              {expandedSections.whatsapp && (
                <FlatList
                  scrollEnabled={false}
                  data={pricingPlans.whatsapp}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({ item }) => (
                    <PricingCard
                      plan={item}
                      currentValidPackage={getCurrentValidPackage(2)}
                      expiredPackage={getExpiredPackage(2)}
                      networkId={2}
                    />
                  )}
                />
              )}
            </View>

            {/* Facebook Plans */}
            <View style={styles.sectionContainer}>
              <SectionHeader title="👍 Facebook Marketing" section="facebook" />
              {expandedSections.facebook && (
                <FlatList
                  scrollEnabled={false}
                  data={pricingPlans.facebook}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({ item }) => (
                    <PricingCard
                      plan={item}
                      currentValidPackage={getCurrentValidPackage(5)}
                      expiredPackage={getExpiredPackage(5)}
                      networkId={5}
                    />
                  )}
                />
              )}
            </View>

            {/* Instagram Plans */}
            <View style={styles.sectionContainer}>
              <SectionHeader
                title="📸 Instagram Marketing"
                section="instagram"
              />
              {expandedSections.instagram && (
                <FlatList
                  scrollEnabled={false}
                  data={pricingPlans.instagram}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({ item }) => (
                    <PricingCard
                      plan={item}
                      currentValidPackage={getCurrentValidPackage(6)}
                      expiredPackage={getExpiredPackage(6)}
                      networkId={6}
                    />
                  )}
                />
              )}
            </View>

            {/* TikTok Plans */}
            <View style={styles.sectionContainer}>
              <SectionHeader title="🎵 TikTok Marketing" section="tiktok" />
              {expandedSections.tiktok && (
                <FlatList
                  scrollEnabled={false}
                  data={pricingPlans.tiktok}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({ item }) => (
                    <PricingCard
                      plan={item}
                      currentValidPackage={getCurrentValidPackage(8)}
                      expiredPackage={getExpiredPackage(8)}
                      networkId={8}
                    />
                  )}
                />
              )}
            </View>

            {/* LinkedIn Plans */}
            <View style={styles.sectionContainer}>
              <SectionHeader title="💼 LinkedIn Marketing" section="linkedin" />
              {expandedSections.linkedin && (
                <FlatList
                  scrollEnabled={false}
                  data={pricingPlans.linkedin}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({ item }) => (
                    <PricingCard
                      plan={item}
                      currentValidPackage={getCurrentValidPackage(7)}
                      expiredPackage={getExpiredPackage(7)}
                      networkId={7}
                    />
                  )}
                />
              )}
            </View>

            {/* Pricing Calculator */}
            <View style={styles.sectionContainer}>
              <SectionHeader
                title="🧮 Pricing Calculator"
                section="calculator"
              />
              {expandedSections.calculator && (
                <View
                  style={[
                    styles.calculatorContainer,
                    { backgroundColor: theme.inputBackColor },
                  ]}
                >
                  {/* Mode Selector */}
                  <View style={styles.modeSelector}>
                    <TouchableOpacity
                      style={[
                        styles.modeButton,
                        pricingMode === 'individual' && styles.modeButtonActive,
                        {
                          borderColor: theme.textColor,
                          backgroundColor:
                            pricingMode === 'individual'
                              ? theme.buttonBackColor
                              : 'transparent',
                        },
                      ]}
                      onPress={() => setPricingMode('individual')}
                    >
                      <Text
                        style={[
                          styles.modeButtonText,
                          pricingMode === 'individual' &&
                            styles.modeButtonTextActive,
                          {
                            color: theme.textColor,
                          },
                        ]}
                      >
                        Individual
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.modeButton,
                        pricingMode === 'combo' && styles.modeButtonActive,
                        {
                          borderColor: theme.textColor,
                          backgroundColor:
                            pricingMode === 'combo'
                              ? theme.buttonBackColor
                              : 'transparent',
                        },
                      ]}
                      onPress={() => setPricingMode('combo')}
                    >
                      <Text
                        style={[
                          styles.modeButtonText,
                          pricingMode === 'combo' &&
                            styles.modeButtonTextActive,
                          {
                            color: theme.textColor,
                          },
                        ]}
                      >
                        Combo Bundle
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Duration */}
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.textColor }]}>
                      Duration
                    </Text>
                    <View
                      style={[
                        styles.dropdown,
                        {
                          backgroundColor: theme.backgroundColor,
                          borderColor: theme.placeholderColor,
                          borderWidth: 1,
                        },
                      ]}
                    >
                      <Dropdown
                        placeholderTextColor={theme.placeholderColor}
                        onSelect={index => setDuration(DURATION[index]?.id)}
                        selectedIndex={DURATION.findIndex(
                          d => d.id === duration,
                        )}
                        style={[
                          {
                            backgroundColor: theme.inputBackColor,
                            color: theme.textColor,
                          },
                        ]}
                        items={DURATION}
                        placeholder="Select Duration..."
                        clearTextOnFocus={true}
                        keyboardAppearance="dark"
                        maxLength={5}
                      />
                    </View>
                  </View>

                  {/* Individual Mode Inputs */}
                  {pricingMode === 'individual' ? (
                    <>
                      <View style={styles.inputGroup}>
                        <Text
                          style={[styles.label, { color: theme.textColor }]}
                        >
                          Select Network
                        </Text>
                        <View
                          style={[
                            styles.dropdown,
                            {
                              backgroundColor: theme.backgroundColor,
                              borderColor: theme.placeholderColor,
                              borderWidth: 1,
                            },
                          ]}
                        >
                          <Dropdown
                            items={networks}
                            selectedIndex={networks.findIndex(
                              n => n.id == selectedNetwork,
                            )}
                            onSelect={idx =>
                              setSelectedNetwork(networks[idx]?.id || '')
                            }
                            placeholder="Select Network"
                            style={{
                              flex: 1,
                              backgroundColor: theme.inputBackColor,
                            }}
                          />
                        </View>
                      </View>

                      <View style={styles.inputGroup}>
                        <Text
                          style={[styles.label, { color: theme.textColor }]}
                        >
                          Number of Messages
                        </Text>
                        <TextInput
                          style={[
                            styles.input,
                            {
                              color: theme.textColor,
                              borderColor: theme.placeholderColor,
                            },
                          ]}
                          placeholder="e.g., 5000"
                          placeholderTextColor={theme.placeholderColor}
                          value={messages}
                          onChangeText={setMessages}
                          keyboardType="number-pad"
                        />
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.inputGroup}>
                        <Text
                          style={[styles.label, { color: theme.textColor }]}
                        >
                          WhatsApp Conversations
                        </Text>
                        <TextInput
                          style={[
                            styles.input,
                            {
                              color: theme.textColor,
                              borderColor: theme.placeholderColor,
                            },
                          ]}
                          placeholder="e.g., 1000"
                          placeholderTextColor={theme.placeholderColor}
                          value={waConversations}
                          onChangeText={setWaConversations}
                          keyboardType="number-pad"
                        />
                      </View>

                      <View style={styles.checkboxGroup}>
                        <Text
                          style={[styles.label, { color: theme.textColor }]}
                        >
                          Include in Bundle
                        </Text>
                        <View style={styles.checkboxRow}>
                          <View style={styles.checkbox}>
                            <Switch
                              value={includeSMS}
                              onValueChange={setIncludeSMS}
                              trackColor={{
                                false: theme.placeholderColor,
                                true: theme.selectedCheckBox,
                              }}
                              thumbColor={theme.selectedCheckBox}
                            />
                            <Text
                              style={[
                                styles.checkboxLabel,
                                { color: theme.textColor },
                              ]}
                            >
                              SMS
                            </Text>
                          </View>
                          <View style={styles.checkbox}>
                            <Switch
                              value={includeEmail}
                              onValueChange={setIncludeEmail}
                              trackColor={{
                                false: theme.placeholderColor,
                                true: theme.selectedCheckBox,
                              }}
                              thumbColor={theme.selectedCheckBox}
                            />
                            <Text
                              style={[
                                styles.checkboxLabel,
                                { color: theme.textColor },
                              ]}
                            >
                              Email
                            </Text>
                          </View>
                        </View>
                      </View>
                    </>
                  )}

                  {/* Pricing Summary */}
                  {pricingMatrix.length > 0 && (
                    <View
                      style={[
                        styles.summary,
                        { backgroundColor: theme.backgroundColor },
                      ]}
                    >
                      <Text
                        style={[
                          styles.summaryTitle,
                          { color: theme.textColor },
                        ]}
                      >
                        💰 Pricing Summary
                      </Text>
                      {pricingMatrix.map(item => (
                        <View key={item.id}>
                          {pricingMode === 'individual' ? (
                            <>
                              <View style={styles.summaryRow}>
                                <Text
                                  style={[
                                    styles.summaryLabel,
                                    { color: theme.placeholderColor },
                                  ]}
                                >
                                  Network:
                                </Text>
                                <Text
                                  style={[
                                    styles.summaryValue,
                                    { color: theme.textColor },
                                  ]}
                                >
                                  {item.network}
                                </Text>
                              </View>
                              <View style={styles.summaryRow}>
                                <Text
                                  style={[
                                    styles.summaryLabel,
                                    { color: theme.placeholderColor },
                                  ]}
                                >
                                  Messages:
                                </Text>
                                <Text
                                  style={[
                                    styles.summaryValue,
                                    { color: theme.textColor },
                                  ]}
                                >
                                  {item.messages}
                                </Text>
                              </View>
                              <View style={styles.summaryRow}>
                                <Text
                                  style={[
                                    styles.summaryLabel,
                                    { color: theme.placeholderColor },
                                  ]}
                                >
                                  Duration:
                                </Text>
                                <Text
                                  style={[
                                    styles.summaryValue,
                                    { color: theme.textColor },
                                  ]}
                                >
                                  {item.duration}
                                </Text>
                              </View>
                              <View style={styles.summaryRow}>
                                <Text
                                  style={[
                                    styles.summaryLabel,
                                    { color: theme.placeholderColor },
                                  ]}
                                >
                                  Price/Unit:
                                </Text>
                                <Text
                                  style={[
                                    styles.summaryValue,
                                    { color: theme.textColor },
                                  ]}
                                >
                                  {item.pricePerMsg}
                                </Text>
                              </View>
                            </>
                          ) : (
                            <>
                              <View style={styles.summaryRow}>
                                <Text
                                  style={[
                                    styles.summaryLabel,
                                    { color: theme.placeholderColor },
                                  ]}
                                >
                                  Bundle:
                                </Text>
                                <Text
                                  style={[
                                    styles.summaryValue,
                                    { color: theme.textColor },
                                  ]}
                                >
                                  {item.bundle}
                                </Text>
                              </View>
                              <View style={styles.summaryRow}>
                                <Text
                                  style={[
                                    styles.summaryLabel,
                                    { color: theme.placeholderColor },
                                  ]}
                                >
                                  Conversations:
                                </Text>
                                <Text
                                  style={[
                                    styles.summaryValue,
                                    { color: theme.textColor },
                                  ]}
                                >
                                  {item.waConversations}
                                </Text>
                              </View>
                              <View style={styles.summaryRow}>
                                <Text
                                  style={[
                                    styles.summaryLabel,
                                    { color: theme.placeholderColor },
                                  ]}
                                >
                                  Included:
                                </Text>
                                <Text
                                  style={[
                                    styles.summaryValue,
                                    { color: theme.textColor },
                                  ]}
                                  numberOfLines={2}
                                >
                                  {item.included}
                                </Text>
                              </View>
                            </>
                          )}
                          <View
                            style={[
                              styles.summaryRow,
                              styles.summaryTotal,
                              { borderTopColor: theme.placeholderColor },
                            ]}
                          >
                            <Text
                              style={[
                                styles.summaryLabel,
                                { color: theme.placeholderColor },
                              ]}
                            >
                              Total Price:
                            </Text>
                            <Text
                              style={[
                                styles.totalPrice,
                                { color: theme.selectedCheckBox },
                              ]}
                            >
                              {item.totalPrice}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}

                  {pricingMatrix.length === 0 && (
                    <Text
                      style={[
                        styles.emptyText,
                        { color: theme.placeholderColor },
                      ]}
                    >
                      Enter details above to calculate pricing
                    </Text>
                  )}
                </View>
              )}
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 6,
    paddingTop: 6,
  },
  jcLoadingMdl: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    alignSelf: 'center',
    marginTop: Platform.OS === 'ios' ? 50 : 0,
  },
  sectionContainer: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  arrow: {
    fontSize: 18,
  },
  card: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 16,
    marginBottom: 12,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    alignSelf: 'center',
    backgroundColor: colors.warning || '#FFC107',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
  },
  priceSection: {
    alignItems: 'center',
    marginVertical: 12,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.success || '#28a745',
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  period: {
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: colors.primary || '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    marginVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  features: {
    gap: 8,
  },
  feature: {
    marginVertical: 4,
  },
  featureText: {
    fontSize: 15,
    lineHeight: 20,
  },
  calculatorContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  modeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderRadius: 8,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: colors.primary || '#007AFF',
    borderColor: colors.primary || '#007AFF',
  },
  modeButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  modeButtonTextActive: {
    color: '#fff',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  dropdown: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  checkboxGroup: {
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    gap: 16,
  },
  checkbox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  summary: {
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
    marginLeft: 8,
  },
  summaryTotal: {
    paddingVertical: 12,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    marginVertical: 16,
    fontStyle: 'italic',
  },
  activePackageBadge: {
    marginBottom: 0,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  activePackageText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  packageDetails: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
    backgroundColor: 'rgba(40, 167, 69, 0.05)',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
  },
});
