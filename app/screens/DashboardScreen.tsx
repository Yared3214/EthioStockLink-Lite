import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useState } from 'react';
import { Animated, FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MyPortfolioScreen from './MyPortfolioScreen';

const Tab = createBottomTabNavigator();

const Sidebar = ({ isOpen, toggleSidebar }: { isOpen: boolean; toggleSidebar: () => void }) => {
  return (
    <Animated.View style={[styles.sidebar, { left: isOpen ? 0 : -250 }]}>
      <TouchableOpacity onPress={toggleSidebar} style={styles.sidebarClose}>
        <Ionicons name="close" size={28} color="#fff" />
      </TouchableOpacity>
      {['Dashboard', 'Company Overview', 'My Portfolio', 'Settings', 'Help', 'Logout'].map((item, index) => (
        <TouchableOpacity key={index} style={styles.sidebarItem}>
          <Text style={styles.sidebarText}>{item}</Text>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
};

const DashboardScreen = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const topGainers = [
    { symbol: 'ETL', name: 'EthioTech Ltd.', price: '101.49', change: '+2.53', changePercent: '+44.87%' },
    { symbol: 'LUF', name: 'Lucy Food Plc.', price: '186.90', change: '-0.15', changePercent: '-0.15%' },
  ];

  const watchlist = [
    { name: 'EthioTech Ltd.', changePercent: '+80.15%' },
    { name: 'Lucy Food Plc.', changePercent: '-0.15%' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />
      
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => setSidebarOpen(!sidebarOpen)}>
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Dashboard</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Welcome Card */}
        <View style={styles.card}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.username}>Selam Tesfaye</Text>
          <Text style={styles.subText}>Glad to see you again!</Text>
        </View>

        {/* New IPO Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>New IPO</Text>
          <Text style={styles.ipoName}>EthioTel</Text>
          <Text style={styles.ipoDetails}>Sep 06 - Sep 10, 2025</Text>
          <TouchableOpacity style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>

        {/* Top Gainers */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Top Gainers</Text>
          <FlatList
            data={topGainers}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={styles.symbol}>{item.symbol}</Text>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>{item.price}</Text>
                <Text style={[styles.change, { color: item.change.startsWith('+') ? '#4CAF50' : '#F44336' }]}>{item.change}</Text>
              </View>
            )}
          />
        </View>

        {/* Watchlist */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>My Watchlist</Text>
          {watchlist.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={[styles.change, { color: item.changePercent.startsWith('+') ? '#4CAF50' : '#F44336' }]}>{item.changePercent}</Text>
            </View>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Activity</Text>
          <Text style={styles.activityItem}>✓ Bought 10 shares of EthioBank @ 120 ETB</Text>
          <Text style={styles.activityItem}>✓ Sold 5 shares of AgroGrow Ltd @ 98 ETB</Text>
          <Text style={styles.activityItem}>⭐ Portfolio up by 3.2%</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const App = () => {
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName = 'home';
            if (route.name === 'Dashboard') iconName = 'home';
            else if (route.name === 'Portfolio') iconName = 'briefcase';
            else if (route.name === 'Settings') iconName = 'settings';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarStyle: { backgroundColor: '#13254A' },
          tabBarActiveTintColor: '#00C2FF',
          tabBarInactiveTintColor: '#ccc',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Portfolio" component={MyPortfolioScreen} />
        <Tab.Screen name="Settings" component={() => <View style={styles.container}><Text style={styles.text}>Settings Screen</Text></View>} />
      </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1A3C',
    paddingTop: 30
  },
  scrollContent: {
    padding: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#13254A',
  },
  topBarTitle: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 16,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: '#13254A',
    paddingTop: 50,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  sidebarClose: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  sidebarItem: {
    paddingVertical: 15,
  },
  sidebarText: {
    color: '#fff',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#13254A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 18,
  },
  username: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  subText: {
    color: '#aaa',
    marginTop: 4,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  ipoName: {
    color: '#00C2FF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  ipoDetails: {
    color: '#aaa',
    marginBottom: 8,
  },
  applyButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  symbol: { color: '#fff', fontWeight: 'bold' },
  name: { color: '#fff' },
  price: { color: '#00C2FF' },
  change: { color: '#4CAF50' },
  activityItem: {
    color: '#fff',
    marginVertical: 4,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 20,
  },
});

export default App;
