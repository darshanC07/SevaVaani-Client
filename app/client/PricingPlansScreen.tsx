import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const PLANS = [
  {
    id: 'basic',
    title: 'Basic',
    tagline: 'Ideal for Beginners',
    price: '199',
    period: '/mo',
    benefits: ['Demo', 'Demo', 'Demo', 'Demo'],
    colors: ['#FFFFFF', '#F0F5FF'],
    itemColor: '#4560F4',
  },
  {
    id: 'standard',
    title: 'Standard',
    tagline: 'Our Best Seller',
    price: '499',
    period: '/mo',
    benefits: ['Demo', 'Demo', 'Demo', 'Demo'],
    colors: ['#FFFFFF', '#E8F9FF'],
    itemColor: '#00C6FF',
  },
  {
    id: 'premium',
    title: 'Premium',
    tagline: 'Maximum Growth',
    price: '899',
    period: '/mo',
    benefits: ['Demo', 'Demo', 'Demo', 'Demo'],
    colors: ['#FFFFFF', '#F6EFFF'],
    itemColor: '#7210EA',
  },
];

const PricingPlansScreen = () => {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);

  const cardWidth = width * 0.88;
  const cardHeight = height * 0.54;
  const spacing = (width - cardWidth) / 2;

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderPlanCard = ({ item, index }: { item: typeof PLANS[0], index: number }) => {
    const inputRange = [
      (index - 1) * cardWidth,
      index * cardWidth,
      (index + 1) * cardWidth,
    ];

    const stackShift = scrollX.interpolate({
      inputRange: [index * cardWidth, (index + 1) * cardWidth],
      outputRange: [0, -cardWidth],
      extrapolate: 'clamp',
    });

    const translateX = Animated.add(
        scrollX.interpolate({
            inputRange,
            outputRange: [0, 0, cardWidth * 0.9],
            extrapolate: 'clamp',
        }),
        stackShift
    );

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 1],
      extrapolate: 'clamp',
    });

    const rotate = scrollX.interpolate({
      inputRange,
      outputRange: ['-3deg', '0deg', '4deg'],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange: [
        (index - 1) * cardWidth,
        index * cardWidth,
        (index + 1) * cardWidth,
      ],
      outputRange: [0.4, 1, 1],
      extrapolate: 'clamp',
    });

    const zIndex = PLANS.length - index;

    return (
      <View style={{ width: cardWidth, height: cardHeight, zIndex }}>
        <Animated.View
          style={[
            styles.cardWrapper,
            {
              width: cardWidth,
              height: cardHeight,
              opacity,
              transform: [
                { perspective: 1200 },
                { translateX },
                { scale },
                { rotate },
              ],
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowRadius: 15,
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.04)']}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardContent}>
              <View style={styles.topSection}>
                <Text style={styles.cardTitle}>{item.title} Plan</Text>
              </View>

              <View style={styles.benefitsList}>
                {item.benefits.map((benefit, i) => (
                  <View key={`benefit-${index}-${i}`} style={styles.benefitItem}>
                    <View style={styles.bulletPoint} />
                    <Text style={styles.benefitLabel}>{benefit}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.pricingSection}>
                <View style={styles.pricingSeparator} />
                <Text style={styles.priceHighlight}>
                  ₹ {item.price}{item.period} after 3-day trial
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#3B3299', '#2D2675', '#1E1B4B']} style={StyleSheet.absoluteFill} />
      
      {/* Top Left Glow Orb */}
      <View style={styles.glowOrbContainer}>
        <LinearGradient
          colors={['#FDE68A', 'transparent']}
          style={styles.glowOrb}
        />
      </View>

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
            <Ionicons name="close" size={32} color="#FFF" />
          </TouchableOpacity>
          <View />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.titleHeadline}>Go Premium</Text>
          <Text style={styles.titleSub}>No commitment. Cancel anytime.</Text>
        </View>
      </View>

      <View style={styles.stackWrapper}>
        <Animated.FlatList
          data={PLANS}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={cardWidth}
          decelerationRate="fast"
          contentContainerStyle={{
            paddingHorizontal: spacing,
            height: cardHeight + 60,
            alignItems: 'center',
          }}
          renderItem={renderPlanCard}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          scrollEventThrottle={16}
          pagingEnabled
        />

        <View style={styles.dotsRow}>
          {PLANS.map((_, index) => (
            <View
              key={`dot-${index}`}
              style={[
                styles.progressDot,
                activeIndex === index ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.footerAction}>
        <TouchableOpacity 
          style={styles.primaryButton}
          activeOpacity={0.92}
          onPress={() => router.push('/client/PlanSuccessScreen')}
        >
          <LinearGradient
            colors={['#FAE68E', '#FACC15']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>Start Plan</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PricingPlansScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1B4B',
  },
  glowOrbContainer: {
    position: 'absolute',
    top: -100,
    left: -150,
    width: 400,
    height: 400,
  },
  glowOrb: {
    flex: 1,
    borderRadius: 200,
    opacity: 0.5,
  },
  header: {
    paddingHorizontal: 25,
    marginTop: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  closeBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restoreText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.9,
  },
  headerContent: {
    alignItems: 'center',
  },
  titleHeadline: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  titleSub: {
    fontSize: 18,
    color: '#FFF',
    marginTop: 8,
    fontWeight: '400',
    opacity: 0.8,
  },
  stackWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  cardWrapper: {
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    position: 'absolute',
  },
  cardGradient: {
    flex: 1,
    padding: 30,
  },
  cardContent: {
    flex: 1,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  cardTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FFF',
  },
  benefitsList: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FACC15',
    marginRight: 15,
  },
  benefitLabel: {
    fontSize: 19,
    color: '#FFF',
    fontWeight: '500',
  },
  pricingSection: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  pricingSeparator: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 25,
  },
  priceHighlight: {
    fontSize: 22,
    color: '#FFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  progressDot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  dotActive: {
    backgroundColor: '#FFF',
    width: 10,
  },
  dotInactive: {
    backgroundColor: '#FFF',
    opacity: 0.3,
    width: 10,
  },
  footerAction: {
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  primaryButton: {
    height: 65,
    borderRadius: 32,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#2D2675',
    fontSize: 22,
    fontWeight: '700',
  },
});
