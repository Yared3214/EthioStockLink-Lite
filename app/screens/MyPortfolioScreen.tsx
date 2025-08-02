import { fetchCompanyPerformance, fetchIPOCompanies, fetchTransactionHistory, fetchUserBalance, fetchUserHoldings } from '@/api/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, Easing, KeyboardAvoidingView, Linking, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
  const [amount, setAmount] = useState('');
  const [visible, setVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current; // 0 = hidden

  const showPopup = () => {
    setVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };
  
  const hidePopup = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };
  


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
    const fetchData = async() => {
      setLoading(true);
      try{
        await loadUserHoldings();
        await loadTransactionHistory();
        await loadWatchListStocks();
        await loadBalance();
      } finally {
        setLoading(false);
      }
    }
  
    fetchData();

  }, []);

  useEffect( () => {
    loadCompanyPerformance();
  }, [holdings]);

  const loadUserHoldings = async() => {
    try{
      const data = await fetchUserHoldings();
      setHoldings(data.stocks);
    } catch (error) {
      Alert.alert("Error", "Could not load holdings", error);
    }
  }

  const loadTransactionHistory = async() => {
    try{
      const data = await fetchTransactionHistory();
      setTransactions(data);
    } catch (error){
      Alert.alert("Error", "Could not load Recent Activities", error);
    }
  }

  const loadWatchListStocks = async() => {
    try{
      const data = await fetchIPOCompanies();

    const sortedByVolume = (data.companies || [])
          .filter(c => c.volume !== null) // ignore if volume is missing
          .sort((a, b) => b.volume - a.volume)
          .slice(0, 5);
  
        setWatchlist(sortedByVolume);
    } catch (error) {
      Alert.alert("Error", "Could not load Watchlists", error)
    } 
  }

  const loadCompanyPerformance = async() => {
    if (holdings.length > 0) {
      const topHolding = holdings[0];
      const data = await fetchCompanyPerformance(topHolding.id);

      if (data && data.length > 0) {
        setPerformanceData(data.map(point => point.price)); // Extract prices
        setPerformanceLabels(data.map(point => point.date)); // Extract dates
      } else {
        setPerformanceData([]);
      }
    } else {
      setPerformanceData([]);
    }
  }

  const loadBalance = async () => {
      try {
        const data = await fetchUserBalance();
        setBalance(data.balance);
      } catch (error) {
        Alert.alert("Error", "Could not load balance");
      }
    };
  
  const handleDeposit = async () => {
    const token = await AsyncStorage.getItem('accessToken');

    if (!amount || isNaN(Number(amount))) {
      Alert.alert('Invalid', 'Enter a valid amount');
      return;
    }
  
    setLoading(true);
  
    try {
      const res = await fetch('https://ethiostocklink-lite-1.onrender.com/api/payment/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
        body: JSON.stringify({ amount: Number(amount) }),
      });
  
      const json = await res.json();
  
      if (res.ok && json.data?.checkout_url) {
        hidePopup();
        Linking.openURL(json.data.checkout_url);
        Alert.alert('Success', 'Redirecting to payment...');
      } else {
        Alert.alert('Error', json.message || 'Failed to initiate deposit');
        console.log(json)
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
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
    <KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
>
    <View style={{ flex: 1 }}>
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
          <TouchableOpacity style={styles.actionButton} onPress={showPopup}>
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
          <Text style={[styles.tableCell, { color: 'green'}]}>
            5%
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
    {visible && (
  <View style={styles.overlay}>
    <TouchableOpacity style={styles.backdropTouchable} onPress={hidePopup} />
    <Animated.View
      style={[
        styles.popupContainer,
        {
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [300, 0], // slide up from 300px below
              }),
            },
          ],
        },
      ]}
    >
      <Text style={styles.label}>Enter Deposit Amount</Text>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="e.g. 100"
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity
        style={[styles.confirmButton, loading && { opacity: 0.6 }]}
        onPress={handleDeposit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Processing...' : 'Confirm Deposit'}</Text>
      </TouchableOpacity>
    </Animated.View>
  </View>
)}
    </View>
    </KeyboardAvoidingView>
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  popupContainer: {
    backgroundColor: '#1C1F30',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  backdropTouchable: {
    flex: 1,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    color: '#000',
    marginBottom: 16,
  },
  label: {
    color: '#fff',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#00BFFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
});