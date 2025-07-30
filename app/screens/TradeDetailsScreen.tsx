import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TradeDetailsScreen() {
  const route = useRoute();
  const { companyId } = route.params || {};

  const [buyPrice, setBuyPrice] = useState("120");
  const [sellPrice, setSellPrice] = useState("400");
  const [shares, setShares] = useState(20);
  const [active, setActive] = useState('buy');
  const [modalVisible, setModalVisible] = useState(false);
  const [stockData, setStockData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrderBook = async () => {
      try {
        setLoading(true)
        const token = await AsyncStorage.getItem('accessToken');
        const headers = { Authorization: `Bearer ${token}` };

        const response = await fetch(`https://ethiostocklink-lite-1.onrender.com/api/tread/orderbook/${companyId}`, { headers });
        const data = await response.json();

        // Merge and format bids and asks
        const formattedOrders = [
          ...data.bids.flatMap((bid: any) =>
            bid.orders.map((order: any) => ({
              type: 'Buy',
              id: order.id,
              price: bid.price,
              shares: order.quantity,
              createdAt: order.createdAt,
            }))
          ),
          ...data.asks.flatMap((ask: any) =>
            ask.orders.map((order: any) => ({
              type: 'Sell',
              id: order.id,
              price: ask.price,
              shares: order.quantity,
              createdAt: order.createdAt,
            }))
          ),
        ];

        setStockData(formattedOrders);
      } catch (err: any) {
        setError('Failed to fetch order book');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderBook();
  }, [companyId]);

  const increaseShares = () => setShares(shares + 1);
  const decreaseShares = () => setShares(shares > 1 ? shares - 1 : 1);

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
  
  if (error) {
    return (
      <SafeAreaView style={[
                 styles.container,
                { justifyContent: "center", alignItems: "center" },
              ]}>
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.companyName}>EthioTech Ltd.</Text>
        <Text style={styles.ticker}>ETL</Text>
        <Ionicons name="search" size={20} color="#fff" style={styles.searchIcon} />
      </View>
      {stockData.length === 0 ?
      <Text style={{ color: '#ccc', textAlign: 'center', marginTop: 40 }}>No active orders at the moment.</Text> : 
      <FlatList
      data={stockData}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Type</Text>
          <Text style={styles.tableHeaderText}>Price</Text>
          <Text style={styles.tableHeaderText}>Shares</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { color: item.type === 'Buy' ? 'green' : 'red' }]}>{item.type}</Text>
          <Text style={styles.tableCell}>{item.price}</Text>
          <Text style={styles.tableCell}>{item.shares}</Text>
        </View>
      )}
    />}
      
      <View style={styles.buySellContainer}>
        {active === 'sell' ?
        <TouchableOpacity style={styles.sellButton} onPress={() => {
          setActive('buy');
          setModalVisible(true)}
        }>
        <Text style={styles.buySellText}>Buy</Text>
      </TouchableOpacity> :
        <LinearGradient
          colors={['#00FFA3', '#0085FF']}
          style={styles.buyButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.buySellText}>Buy</Text>
          </LinearGradient>}
      
        {active === 'buy' ? 
        <TouchableOpacity style={styles.sellButton} onPress={() => {
          setActive('sell');
          setModalVisible(true);
          }}>
        <Text style={styles.buySellText}>Sell</Text>
      </TouchableOpacity> : 
      <LinearGradient
        colors={['#FF3C5F', '#6528F7']} // pink to purple-ish
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.sellButton}
      >
        <Text style={styles.buySellText}>Sell</Text>
      </LinearGradient>}
      </View>

<Modal
  animationType="slide"
  transparent
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <TouchableOpacity
    style={styles.modalOverlay}
    activeOpacity={1}
    onPressOut={() => setModalVisible(false)}
  >
    <View style={styles.modalContent}>
      {/* Buy/Sell toggle header */}
      <View style={styles.buySellContainer}>
        {active === 'sell' ? (
          <TouchableOpacity style={styles.sellButton} onPress={() => setActive('buy')}>
            <Text style={styles.buySellText}>Buy</Text>
          </TouchableOpacity>
        ) : (
          <LinearGradient
            colors={['#00FFA3', '#0085FF']}
            style={styles.buyButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.buySellText}>Buy</Text>
          </LinearGradient>
        )}

        {active === 'buy' ? (
          <TouchableOpacity style={styles.sellButton} onPress={() => setActive('sell')}>
            <Text style={styles.buySellText}>Sell</Text>
          </TouchableOpacity>
        ) : (
          <LinearGradient
            colors={['#FF3C5F', '#6528F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sellButton}
          >
            <Text style={styles.buySellText}>Sell</Text>
          </LinearGradient>
        )}
      </View>

      {/* Conditional rendering for Buy or Sell content */}
      {active === 'buy' ? (
        <View style={styles.buySection}>
          <Text style={styles.buyTitle}>Buy ETL?</Text>
          <Text style={styles.label}>PRICE</Text>
          <Text style={styles.input}>120</Text>
          <Text style={styles.minPrice}>Minimum price : 100</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <View style={styles.sharesContainer}>
              <Text style={styles.label}>SHARES</Text>
              <View style={styles.selector}>
                <TouchableOpacity style={styles.side} onPress={decreaseShares}>
                  <Text style={styles.sideText}>−</Text>
                </TouchableOpacity>
                <View style={styles.middle}>
                  <Text style={styles.value}>{shares}</Text>
                </View>
                <TouchableOpacity style={styles.side} onPress={increaseShares}>
                  <Text style={styles.sideText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Text style={styles.label}>TOTAL PRICE</Text>
              <Text style={styles.totalPrice}>{(parseFloat(buyPrice) * shares).toFixed(2)} ETB</Text>
            </View>
          </View>

          <View style={styles.quickInfo}>
            <Text style={styles.quickInfoText}>Available balance: 288,648.43 ETB</Text>
            <Text style={styles.quickInfoText}>Shares owned: 0</Text>
          </View>

          <LinearGradient
            colors={['#00FFA3', '#0085FF']}
            style={styles.buyConfirmButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <TouchableOpacity>
              <Text style={styles.buySellText}>Buy</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      ) : (
        // You can insert the Sell Section here
        <View style={styles.sellSection}>
        <Text style={styles.buyTitle}>Sell ETL?</Text>

        <Text style={styles.label}>PRICE</Text>
        <Text style={styles.input}>400</Text>
        <Text style={styles.minPrice}>Minimum price : 100</Text>

        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16,}}>
        <View style={styles.sharesContainer}>
          <Text style={styles.label}>SHARES</Text>
      <View style={styles.selector}>
        <TouchableOpacity style={styles.side} onPress={decreaseShares}>
          <Text style={styles.sideText}>−</Text>
        </TouchableOpacity>
        <View style={styles.middle}>
          <Text style={styles.value}>{shares}</Text>
        </View>
        <TouchableOpacity style={styles.side} onPress={increaseShares}>
          <Text style={styles.sideText}>+</Text>
        </TouchableOpacity>
      </View>
        </View>
        <View>
            <Text style={styles.label}>TOTAL PRICE</Text>
            <Text style={styles.totalPrice}>{(parseFloat(sellPrice) * shares).toFixed(2)} ETB</Text>
          </View>
        </View>

        <View style={styles.quickInfo}>
          <Text style={styles.quickInfoText}>
            Available balance: 288,648.43 ETB
          </Text>
          <Text style={styles.quickInfoText}>Shares owned: 20</Text>
        </View>

        <LinearGradient
                          colors={['#FF3C5F', '#6528F7']} // pink to purple-ish
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.buyConfirmButton}
                        >
        <TouchableOpacity>
          <Text style={styles.buySellText}>Sell</Text>
        </TouchableOpacity>
        </LinearGradient>
      </View>
      )}
    </View>
  </TouchableOpacity>
</Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0f2c",
    padding: 16,
  },
  header: {
    marginBottom: 16,
    marginTop: 20
  },
  companyName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  ticker: {
    color: "#aaa",
    fontSize: 16,
    marginBottom: 8,
  },
  searchIcon: {
    position: "absolute",
    right: 0,
    top: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#1B2246',
  },
  tableHeaderText: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: '#444',
    backgroundColor: '#0D1020',
  },
  tableCell: {
    flex: 1,
    color: '#eee',
    textAlign: 'center',
  },
  buySellContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 12,
  },
  buyButton: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  sellButton: {
    backgroundColor: "#1e293b",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#444",
  },
  buySellText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buySection: {
    backgroundColor: "#0f114b",
    borderRadius: 16,
    padding: 16,
  },
  sellSection: {
    backgroundColor: "#250636",
    borderRadius: 16,
    padding: 16,
  },
  buyTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  label: {
    color: "#aaa",
    fontSize: 12,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#979BAE",
    color: "#fff",
    borderRadius: 8,
    padding: 8,
    marginBottom: 4,
  },
  minPrice: {
    color: "red",
    fontSize: 12,
    marginBottom: 12,
  },
  sharesContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  shareControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  selector: {
    flexDirection: 'row',
    backgroundColor: '#C3C6D1',
    borderRadius: 12,
    overflow: 'hidden',
    width: 140,
    alignItems: 'center',
  },
  side: {
    backgroundColor: '#E4E5EC',
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sideText: {
    fontSize: 20,
    fontWeight: '600',
  },
  middle: {
    flex: 1,
    backgroundColor: '#C3C6D1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E1E1E',
  },
  shareButton: {
    backgroundColor: "#1e293b",
    padding: 10,
    borderRadius: 8,
  },
  shareButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  sharesText: {
    color: "#fff",
    fontSize: 16,
    marginHorizontal: 12,
  },
  totalPrice: {
    color: "#fff",
    fontSize: 16,
    backgroundColor: "#979BAE",
    borderRadius: 8,
    padding: 8,
  },
  quickInfo: {
    marginBottom: 16,
  },
  quickInfoText: {
    color: "#aaa",
    fontSize: 14,
  },
  buyConfirmButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    width: '30%',
    marginHorizontal: 100
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#1A1D29',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  }, 
});
