import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useIpoCompanies } from '../hooks/useIpoCompanies';

interface Company {
  id: string;
  name: string;
  symbol: string;
}

export default function ExchangeScreen() {
  const { companies, loading, error } = useIpoCompanies();
  const navigation = useNavigation();

  const renderItem = ({ item }: { item: Company }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.companyName}>{item.name}</Text>
        <Text style={styles.symbol}>{item.symbol}</Text>
      </View>
  
      <View style={styles.actions}>
        <LinearGradient
          colors={['#00FFA3', '#0085FF']}
          style={styles.ipoButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <TouchableOpacity
            style={styles.exchangeButton}
            onPress={() => navigation.navigate('trade-detail', { companyId: item.id })}
          >
            <Text style={styles.buttonText}>Exchange</Text>
          </TouchableOpacity>
        </LinearGradient>
  
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => navigation.navigate('stock-detail', { companyId: item.id })}
        >
          <Text style={styles.moreText}>More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={['#00FFA3', '#0085FF']}
          style={styles.tradeButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.tradeText}>Trade</Text>
        </LinearGradient>
        <View style={{ flex: 1 }} />
        <Ionicons name="search-outline" size={20} color="#fff" style={{ marginRight: 16 }} />
        <Ionicons name="language-outline" size={20} color="#fff" />
      </View>

      {/* Loading State */}
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      {loading && <ActivityIndicator size="large" color="#00E1D9" style={{ marginTop: 50 }} />}
      </View>

      {/* Error State */}
      <View style={{flex: 1, alignItems: "center"}}>
      {error && <Text style={{ color: 'red', textAlign: 'center'}}>{error}</Text>}
      </View>

      {/* Companies List */}
      {!loading && !error && (
        <FlatList
          data={companies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0D1020', 
    padding: 16,
    paddingTop: 20, 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  tradeButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  tradeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: '#1C1F30',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  info: {
    flex: 1,
    paddingRight: 8,
  },
  companyName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  symbol: {
    color: '#AAA',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ipoButton: {
    borderRadius: 8,
  },
  exchangeButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  moreButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  moreText: {
    color: '#2d7cff',
    fontWeight: '600',
  },
});
