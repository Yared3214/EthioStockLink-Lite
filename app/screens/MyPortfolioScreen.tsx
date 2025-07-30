import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const API_BASE = 'https://ethiostocklink-lite-1.onrender.com/api';

const PortfolioScreen = () => {
  const screenWidth = Dimensions.get('window').width;
  const router = useRouter();

  const [balance, setBalance] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState([]);
  const [performanceLabels, setPerformanceLabels] = useState([]);

  const chartConfig = {
    backgroundGradientFrom: "#1E1E1E",
    backgroundGradientTo: "#1E1E1E",
    color: (opacity = 1) => `rgba(0, 255, 163, ${opacity})`,
    labelColor: () => "#ccc",
    strokeWidth: 2,
    propsForDots: {
      r: "3",
      strokeWidth: "1",
      stroke: "#00FFA3",
    },
  };

  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        data: [300, 320, 340, 310, 350],
        color: (opacity = 1) => `rgba(0, 255, 163, ${opacity})`,
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('accessToken');
        const headers = { Authorization: `Bearer ${token}` };
  
        const [balanceRes, holdingsRes, transactionsRes, watchlistRes] = await Promise.all([
          fetch(`${API_BASE}/user/balance`, { headers }),
          fetch(`${API_BASE}/user/stocks`, { headers }),
          fetch(`${API_BASE}/transactions/history`, { headers }),
          fetch(`${API_BASE}/companies/ipo?page=1`, { headers }), // IPO list with volume
        ]);
  
        const balanceData = await balanceRes.json();
        const holdingsData = await holdingsRes.json();
        const transactionsData = await transactionsRes.json();
        const watchlistData = await watchlistRes.json();
  
        setBalance(balanceData.balance);
        setHoldings(holdingsData.stocks || []);
        setTransactions(transactionsData || []);
        console.log(transactionsData)
  
        // Pick most actively traded companies (sort by volume, take top 5)
        const sortedByVolume = (watchlistData.companies || [])
          .filter(c => c.volume !== null) // ignore if volume is missing
          .sort((a, b) => b.volume - a.volume)
          .slice(0, 5);
  
        setWatchlist(sortedByVolume);
      } catch (error) {
        Alert.alert("Error", "Failed to load portfolio data.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();

  }, []);

  useEffect(() => {
    if (holdings.length > 0) {
      const topHolding = holdings[0]; // or sort by quantity to get top
      fetchPerformance(topHolding.id);
    } else {
      setPerformanceData([]);
    }
  }, [holdings]);

  const fetchPerformance = async (companyId) => {
    try {
      if (!companyId) {
        setPerformanceData([]);
        return;
      }
  
      const token = await AsyncStorage.getItem('accessToken');
      const headers = { Authorization: `Bearer ${token}` };
  
      const res = await fetch(`${API_BASE}/stock/${companyId}/graph?timeframe=1m`, { headers });
      const data = await res.json();
  
      if (data && data.length > 0) {
        setPerformanceData(data.map(point => point.price)); // Extract prices
        setPerformanceLabels(data.map(point => point.date)); // Extract dates
      } else {
        setPerformanceData([]);
      }
    } catch (err) {
      setPerformanceData([]);
    }
  };
  

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      router.replace('/(auth)/LoginScreen');
    } catch (error) {
      Alert.alert("Logout Failed", "Could not log out. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#00E1D9" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.greetingRow}>
          <View style={styles.avatar} />
          <Text style={styles.greeting}>Morning, Selam Tesfaye 👋</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.balanceLabel}>Your Balance</Text>
        <Text style={styles.balanceAmount}>
          {balance !== null ? `${balance.toLocaleString()} ETB` : 'Loading...'}
        </Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.buttonText}>Withdraw</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.buttonText}>Deposit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Watch List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Watch List</Text>
        {watchlist?.map((item) => (
          <View key={item.id} style={styles.watchItem}>
            <View>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemSubtitle}>{item.symbol}</Text>
            </View>
            <View style={styles.watchRight}>
              <Text style={[styles.itemChange, { color: item.change >= 0 ? 'green' : 'red' }]}>
                {item.changePercent}%
              </Text>
              <Text style={styles.itemSubtitle}>{item.currentPrice} ETB</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Holdings */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Holdings</Text>

  {holdings.length === 0 ? (
    <Text style={{ color: '#AAA', textAlign: 'center', marginTop: 10 }}>
      You don’t have any holdings yet.
    </Text>
  ) : (
    <>
      <View style={styles.holdingsHeader}>
        <Text style={styles.tableHeader}>Stock</Text>
        <Text style={styles.tableHeader}>Shares Owned</Text>
        <Text style={styles.tableHeader}>Price/Share</Text>
        <Text style={styles.tableHeader}>Total Value</Text>
        <Text style={styles.tableHeader}>Daily Change</Text>
      </View>
      {holdings.map((holding, idx) => (
        <View key={idx} style={styles.holdingsRow}>
          <Text style={styles.tableCell}>{holding.company.symbol}</Text>
          <Text style={styles.tableCell}>{holding.quantity}</Text>
          <Text style={styles.tableCell}>{holding.company.currentPrice} ETB</Text>
          <Text style={styles.tableCell}>
            {holding.quantity * holding.company.currentPrice} ETB
          </Text>
          <Text style={[styles.tableCell, { color: holding.company.change >= 0 ? 'green' : 'red' }]}>
            {holding.company.changePercent}%
          </Text>
        </View>
      ))}
    </>
  )}
</View>


      {/* Performance */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Performance</Text>
  {performanceData.length > 0 ? (
    <LineChart
      data={{
        labels: performanceLabels,
        datasets: [{ data: performanceData }]
      }}
      width={screenWidth - 32}
      height={220}
      chartConfig={chartConfig}
      bezier
      style={{
        marginVertical: 8,
        borderRadius: 16,
        alignSelf: 'center',
      }}
    />
  ) : (
    <Text style={{ color: '#AAA', textAlign: 'center', marginVertical: 16 }}>
      No performance data available
    </Text>
  )}
</View>


      {/* Recent Activity */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Recent Activity</Text>
  {transactions.length === 0 ? (
    <Text style={{ color: '#AAA', fontStyle: 'italic', textAlign: 'center', marginTop: 8 }}>
      No recent transactions yet.
    </Text>
  ) : (
    transactions.map((tx, idx) => (
      <Text key={idx} style={styles.activityItem}>
        {tx.type === 'BUY' ? '🛒 Bought' : '💳 Sold'} {tx.quantity} shares of {tx.company?.name} @ {tx.priceAtTime} ETB
      </Text>
    ))
  )}
</View>
    </ScrollView>
  );
};

export default PortfolioScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1020',
    paddingHorizontal: 16,
  },
  header: {
    marginTop: 20,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: '#3f92ed',
    borderRadius: 12,
    marginRight: 12,
  },
  greeting: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  logoutButton: {
    padding: 6,
    backgroundColor: '#2E3B55',
    borderRadius: 8,
    marginLeft: 8,
  },
  logoutText: {
    color: 'white',
    fontSize: 12,
  },
  balanceLabel: {
    color: '#AAB',
    fontSize: 14,
  },
  balanceAmount: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  actionButton: {
    backgroundColor: '#1F2A44',
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  watchItem: {
    backgroundColor: '#1F2A44',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  itemTitle: {
    color: 'white',
    fontWeight: '500',
  },
  itemSubtitle: {
    color: '#AAA',
    fontSize: 12,
  },
  watchRight: {
    alignItems: 'flex-end',
  },
  itemChange: {
    fontWeight: 'bold',
  },
  holdingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  holdingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  tableHeader: {
    flex: 1,
    color: '#AAA',
    fontSize: 12,
    textAlign: 'center',
  },
  tableCell: {
    flex: 1,
    color: 'white',
    fontSize: 13,
    textAlign: 'center',
  },
  chartPlaceholder: {
    height: 160,
    backgroundColor: '#1F2A44',
    borderRadius: 10,
    marginTop: 8,
  },
  activityHeader: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 12,
  },
  activityItem: {
    color: '#CCC',
    marginVertical: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#1F2A44',
    marginTop: 24,
  },
});