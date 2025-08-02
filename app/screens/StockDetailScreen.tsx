import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';

const StockDetailScreen = () => {
  const route = useRoute();
  const { companyId } = route.params || {};

  const [isFavorite, setIsFavorite] = useState(false);
  const [companyData, setCompanyData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const navigation = useNavigation();

  const chartConfig = {
    backgroundGradientFrom: "#0A0F2C", // deep navy
    backgroundGradientTo: "#0A0F2C",
    color: (opacity = 1) => `rgba(0, 255, 163, ${opacity})`,
    strokeWidth: 2,
    propsForDots: {
      r: "0", // Hide dots
    },
    propsForBackgroundLines: {
      strokeWidth: 0, // Remove grid lines
    },
    fillShadowGradientFrom: "#00FFA3",
    fillShadowGradientTo: "#0A0F2C",
    fillShadowGradientFromOpacity: 0.3,
    fillShadowGradientToOpacity: 0,
    decimalPlaces: 2,
    labelColor: () => "#888", // label text
  };
  
  const data = {
    datasets: [
      {
        data: [330, 340.31, 310, 335],
        color: (opacity = 1) => `rgba(0, 255, 163, ${opacity})`,
      },
    ],
  };

    useEffect(() => {
      const fetchCompany = async () => {
        try {
          setLoading(true)
          const res = await fetch(`https://ethiostocklink-lite-1.onrender.com/api/companies/details/${companyId}`);
          if (!res.ok) throw new Error('Failed to load company data');
          const data = await res.json();
          setCompanyData(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

  fetchCompany();
}, [companyId]);

    if (loading) {
      return (
        <SafeAreaView style={[
                   styles.container,
                  { justifyContent: "center", alignItems: "center" },
                ]}>
          <ActivityIndicator color="#00E1D9" size="large" style={{ marginTop: 100 }} />
        </SafeAreaView>
      );
    }

    if (error || !companyData) {
      return (
        <SafeAreaView style={styles.container}>
          <Text style={{ color: 'red', marginTop: 100, textAlign: 'center' }}>{error || 'No data found.'}</Text>
        </SafeAreaView>
      );
    }


  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
          <Ionicons
            name={isFavorite ? 'star' : 'star-outline'}
            size={24}
            color={isFavorite ? 'yellow' : '#fff'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Title & Price */}
        <View style={styles.titleSection}>
          <Text style={styles.symbol}>{companyData.symbol}</Text>
          <Text style={styles.company}>{companyData.name}</Text>
          <Text style={styles.price}>{companyData.currentPrice} ETB</Text>
          <Text style={styles.change}>+0.15%</Text>
        </View>

        {/* Chart */}
        <View>
        <LineChart
  data={data}
  width={screenWidth - 32}
  height={220}
  chartConfig={chartConfig}
  bezier
  withInnerLines={false}
  withOuterLines={false}
  withDots={false}
  withVerticalLabels={true}
  withHorizontalLabels={false}
  style={{
    marginVertical: 8,
    borderRadius: 16,
    alignSelf: 'center',
  }}
/>
    </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {['1 Day', '1 Week', '1 Month', '1 Year'].map((label, idx) => (
            <Text key={idx} style={label === '1 Week' ? styles.activeTab : styles.tab}>
              {label}
            </Text>
          ))}
        </View>
        {/* Company Snapshot */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>📊 Snapshot</Text>
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>Sector</Text>
    <Text style={styles.detailValue}>{companyData.sector}</Text>
  </View>
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>Price</Text>
    <Text style={styles.detailValue}>{companyData.currentPrice} ETB</Text>
  </View>
  <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Change %</Text>
            <Text style={styles.detailValue}>+0.15%</Text>
          </View>
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>Min Investment</Text>
    <Text style={styles.detailValue}>{companyData.minimumStockAmount}</Text>
  </View>
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>Market Cap</Text>
    <Text style={styles.detailValue}>{companyData.marketCap?.toLocaleString()} ETB</Text>
  </View>
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>Volume</Text>
    <Text style={styles.detailValue}>{companyData.volume?.toLocaleString()} Shares</Text>
  </View>
</View>

{/* Timeline */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>🗓️ Offering Timeline</Text>
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>Opens</Text>
    <Text style={styles.detailValue}>{moment(companyData.openingDate).format('MMMM D, YYYY')}</Text>
  </View>
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>Closes</Text>
    <Text style={styles.detailValue}>{moment(companyData.closingDate).format('MMMM D, YYYY')}   </Text>
  </View>
</View>

{/* Investor Breakdown Chart */}
{/* <View style={styles.section}>
  <Text style={styles.sectionTitle}>👥 Investor Distribution</Text>
  {companyData.investmentBreakdown?.length > 0 ?
  <PieChart
  data={[
    { name: 'Small', population: companyData.investmentBreakdown?.small, color: '#00FFA3', legendFontColor: '#fff', legendFontSize: 12 },
    { name: 'Medium', population: companyData.investmentBreakdown?.medium, color: '#0085FF', legendFontColor: '#fff', legendFontSize: 12 },
    { name: 'Large', population: companyData.investmentBreakdown?.large, color: '#FF7A00', legendFontColor: '#fff', legendFontSize: 12 },
  ]}
  width={Dimensions.get('window').width - 40}
  height={160}
  chartConfig={chartConfig}
  accessor="population"
  backgroundColor="transparent"
  paddingLeft="16"
  absolute
/> : 
<Text style={{ color: '#AAA', textAlign: 'center', marginVertical: 16 }}>No Investment Breakdown data</Text>}
  
</View> */}

{/* Top Buyers */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>🏆 Top Buyers</Text>
  {companyData.topBuyers?.map((buyer, index) => (
  <Text key={index} style={styles.bodyText}>
    {`🥇🥈🥉`.charAt(index) || '🔹'} Buyer {index + 1} — {buyer._sum.quantity.toLocaleString()} shares
  </Text>
))}

</View>

{/* About */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>🏛️ About {companyData.name}</Text>
  <Text style={styles.bodyText}>
  {companyData.about}
  </Text>
  <Text style={[styles.bodyText, { marginTop: 6 }]}>
    🌐 Visit: <Text style={{ color: '#00FFA3' }}>{companyData.companyLink}</Text>
  </Text>
</View>


        {/* Exchange Button */}
        <TouchableOpacity onPress={() => navigation.navigate('trade-detail', { company: companyData})}>
        <LinearGradient
          colors={['#00FFA3', '#0085FF']}
          style={styles.exchangeBtn}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
            <Text style={styles.exchangeText}>Exchange</Text>
        </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StockDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1220',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleSection: {
    alignItems: 'center',
    marginVertical: 16,
  },
  symbol: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  company: {
    fontSize: 16,
    color: '#B0B6C3',
    marginTop: 2,
  },
  price: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 8,
  },
  change: {
    fontSize: 16,
    color: '#00FFA3',
    marginTop: 2,
  },
  chart: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
  },
  tab: {
    color: '#888',
  },
  activeTab: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  section: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#60acf2',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  detailLabel: {
    color: '#B0B6C3',
  },
  detailValue: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  bodyText: {
    color: '#D1D5DB',
    marginBottom: 4,
    fontSize: 14,
  },
  exchangeBtn: {
    marginHorizontal: 100,
    marginTop: 24,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  exchangeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
