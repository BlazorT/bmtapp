// screens/PricingDetailsScreen.js
import React, { useMemo, useState } from 'react';
import {
  FlatList,
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

const DURATION = [
  { id: 1, name: '1 Month' },
  { id: 3, name: '3 Months (10% off)' },
  { id: 6, name: '6 Months (20% off)' },
];

export default function PricingDetailsScreen() {
  const theme = useTheme();
  const networks = useSelector(state => state.lovs?.lovs?.lovs?.networks) || [];

  // =======================
  // STATE
  // =======================
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

  // =======================
  // PRICING DATA
  // =======================
  const pricingPlans = {
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
  // CALCULATION LOGIC
  // =======================
  const pricingMatrix = useMemo(() => {
    if (pricingMode === 'individual') {
      if (!selectedNetwork || !messages || Number(messages) <= 0) {
        return [];
      }

      const basePricePerMsg = 1;
      let discount = 1;
      if (duration === 3) discount = 0.9;
      if (duration === 6) discount = 0.8;

      const pricePerMsg = basePricePerMsg * discount;
      const totalPrice = Number(messages) * pricePerMsg;

      const networkName =
        networks.find(n => n.id == selectedNetwork)?.name || '';

      return [
        {
          id: 1,
          network: networkName,
          messages: Number(messages),
          duration: `${duration} Month(s)`,
          pricePerMsg: `$${pricePerMsg.toFixed(2)}`,
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
  ]);

  // =======================
  // HELPERS
  // =======================
  const toggleSection = section => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // =======================
  // COMPONENTS
  // =======================
  const PricingCard = ({ plan }) => (
    <View style={[styles.card, { backgroundColor: theme.inputBackColor }]}>
      {plan.badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{plan.badge}</Text>
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

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>
          {plan.name === 'Enterprise' ? 'Contact Sales' : 'Buy Now'}
        </Text>
      </TouchableOpacity>

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

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
      showsVerticalScrollIndicator={false}
    >
      {/* <Text style={[styles.title, { color: theme.textColor }]}>
        Pricing Plans
      </Text> */}

      {/* SMS Plans */}
      <View style={styles.sectionContainer}>
        <SectionHeader title="📱 SMS Marketing" section="sms" />
        {expandedSections.sms && (
          <FlatList
            scrollEnabled={false}
            data={pricingPlans.sms}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => <PricingCard plan={item} />}
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
            renderItem={({ item }) => <PricingCard plan={item} />}
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
            renderItem={({ item }) => <PricingCard plan={item} />}
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
            renderItem={({ item }) => <PricingCard plan={item} />}
          />
        )}
      </View>

      {/* Instagram Plans */}
      <View style={styles.sectionContainer}>
        <SectionHeader title="📸 Instagram Marketing" section="instagram" />
        {expandedSections.instagram && (
          <FlatList
            scrollEnabled={false}
            data={pricingPlans.instagram}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => <PricingCard plan={item} />}
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
            renderItem={({ item }) => <PricingCard plan={item} />}
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
            renderItem={({ item }) => <PricingCard plan={item} />}
          />
        )}
      </View>

      {/* Pricing Calculator */}
      <View style={styles.sectionContainer}>
        <SectionHeader title="🧮 Pricing Calculator" section="calculator" />
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
                  { borderColor: theme.textColor },
                ]}
                onPress={() => setPricingMode('individual')}
              >
                <Text
                  style={[
                    styles.modeButtonText,
                    pricingMode === 'individual' && styles.modeButtonTextActive,
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
                  { borderColor: theme.textColor },
                ]}
                onPress={() => setPricingMode('combo')}
              >
                <Text
                  style={[
                    styles.modeButtonText,
                    pricingMode === 'combo' && styles.modeButtonTextActive,
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
                  selectedIndex={DURATION.findIndex(d => d.id === duration)}
                  style={[
                    {
                      backgroundColor: theme.inputBackColor,
                      color: theme.textColor,
                    },
                  ]}
                  items={DURATION}
                  placeholder="Select Currency..."
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
                  <Text style={[styles.label, { color: theme.textColor }]}>
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
                      style={{ flex: 1, backgroundColor: theme.inputBackColor }}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: theme.textColor }]}>
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
                  <Text style={[styles.label, { color: theme.textColor }]}>
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
                  <Text style={[styles.label, { color: theme.textColor }]}>
                    Include in Bundle
                  </Text>
                  <View style={styles.checkboxRow}>
                    <View style={styles.checkbox}>
                      <Switch
                        value={includeSMS}
                        onValueChange={setIncludeSMS}
                        trackColor={{ false: '#ccc', true: colors.green }}
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
                        trackColor={{ false: '#ccc', true: colors.green }}
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
                <Text style={[styles.summaryTitle, { color: theme.textColor }]}>
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
                            Price/Msg:
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
                style={[styles.emptyText, { color: theme.placeholderColor }]}
              >
                Enter details above to calculate pricing
              </Text>
            )}
          </View>
        )}
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
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
    marginBottom: 12,
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
    fontSize: 14,
    fontWeight: '600',
  },
  features: {
    gap: 8,
  },
  feature: {
    marginVertical: 4,
  },
  featureText: {
    fontSize: 13,
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
});
