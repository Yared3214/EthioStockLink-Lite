import { fetchIPOCompanies, fetchUserBalance } from "@/api/services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";



interface IPOCompany {
  id: number;
  name: string;
  symbol: string;
  sector: string;
  stockAmount: number;
  marketCap: number | null;
  currentPrice: number;
  openingDate: string;
  closingDate: string;
  minimumStockAmount: number;
  status: string;
  about: string;
  volume: number;
  change: number;
  changePercent: number;
}

export default function IPOScreen({ navigation }: any) {
  const [slideAnim] = useState(new Animated.Value(300)); // start off-screen
  const [popupVisible, setPopupVisible] = useState(false);
  const [company, setCompany] = useState({});
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buyPrice, setBuyPrice] = useState(0);
  const [shares, setShares] = useState(1);
  const [balance, setBalance] = useState(0);
  const [buyLoading, SetBuyLoading] = useState(false);

  useEffect(() => {
    loadBalance();
    loadIPOCompanies();
  }, []);

  const loadBalance = async () => {
    try {
      const data = await fetchUserBalance();
      setBalance(data.balance);
    } catch (error) {
      Alert.alert("Error", "Could not load balance");
    }
  };

  const loadIPOCompanies = async() => {
    try{
      const data = await fetchIPOCompanies();

    setCompanies(data.companies || []);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    } 
  }

  const increaseShares = () => setShares(shares + 1);
  const decreaseShares = () => setShares(shares > 1 ? shares - 1 : 1);

  const showPopup = () => {
    setPopupVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  };
  
  const hidePopup = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.in(Easing.ease),
    }).start(() => setPopupVisible(false));
  };

  const handleBuy = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      SetBuyLoading(true);

      const response = await fetch('https://ethiostocklink-lite-1.onrender.com/api/companies/stock/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Optionally add Authorization header if required:
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          companyId: company.id,
          quantity: shares
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(data);
        throw new Error(data.error.message || 'Something went wrong.');
      }

      Alert.alert('Success', `Successfully bought ${shares} shares of ${company.symbol}`);
      // Optionally update state like balance or owned shares

    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to buy stock');
    } finally {
      SetBuyLoading(false);
    }
  };

  const renderItem = ({ item }: { item: IPOCompany }) => (
    <View style={styles.card}>
      <Text style={styles.companyName}>{item.name}</Text>
      <Text style={styles.symbol}>{item.symbol}</Text>
      <View style={styles.separator} />
      <Text style={styles.info}>Closes on {item.closingDate}</Text>
      <Text style={styles.info}>
        Starting at {item.currentPrice} ETB per share
      </Text>
      <Text style={styles.info}>
        Minimum: {item.minimumStockAmount} shares
      </Text>
      <TouchableOpacity
        style={styles.buyButton}
        onPress={() => {
          showPopup();
          setCompany(item);
          setBuyPrice(item.currentPrice)
        }}
      >
        <LinearGradient
          colors={["#FFD700", "#00BFFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.buyText}>Buy Shares</Text>
        </LinearGradient>
      </TouchableOpacity>

    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient 
        colors={['#00FFA3', '#0085FF']} 
        style={styles.ipoButton}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
          <Text style={styles.ipoText}>IPO</Text>
        </LinearGradient>
        <View style={{ flex: 1 }} />
      </View>

      <Text style={styles.heading}>Open IPOs — Join Before They Close!</Text>

      {/* Loading State */}
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        {loading && <ActivityIndicator size="large" color="#00E1D9" style={{ marginTop: 50 }} />}
      </View>

      {/* Error State */}
      <View style={{flex: 1, alignItems: "center"}}>
        {error && <Text style={{ color: 'red', textAlign: 'center'}}>{error}</Text>}
      </View>

      <FlatList
        data={companies}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      {popupVisible && (
  <TouchableOpacity
    activeOpacity={1}
    style={styles.backdrop}
    onPressOut={hidePopup}
  >
    <Animated.View style={[styles.popupContainer, { transform: [{ translateY: slideAnim }] }]}>
      {/* Your Buy Section goes here */}
      <View style={styles.buySection}>
      <Text style={styles.buyTitle}>Buy {company.symbol}</Text>
      <Text style={styles.label}>PRICE</Text>
      <Text style={styles.input}>{company.currentPrice}</Text>
      <Text style={styles.minPrice}>Minimum Stock : {company.minimumStockAmount}</Text>

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
          <Text style={styles.totalPrice}>{(buyPrice * shares).toFixed(2)} ETB</Text>
        </View>
      </View>

      <View style={styles.quickInfo}>
        <Text style={styles.quickInfoText}>Available balance: {balance}</Text>
        {/* <Text style={styles.quickInfoText}>Shares owned: 0</Text> */}
      </View>

      <TouchableOpacity
  onPress={() =>
    Alert.alert(
      'Confirm Purchase',
      `Are you sure you want to buy ${shares} shares of ${company.symbol}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Buy',
          onPress: handleBuy
        }
      ],
      { cancelable: true }
    )
  }
  disabled={loading}
  style={{ alignItems: 'center' }}
>
      <LinearGradient
        colors={['#00FFA3', '#0085FF']}
        style={styles.buyConfirmButton}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        
  {buyLoading ? (
    <ActivityIndicator color="white" />
  ) : (
    <Text style={styles.buySellText}>Buy</Text>
  )}
  </LinearGradient>
</TouchableOpacity>
    </View>
    </Animated.View>
  </TouchableOpacity>
)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1020",
    padding: 16,
    // paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  ipoButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  ipoText: {
    color: "#fff",
    fontWeight: "bold",
  },
  heading: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 16,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#1B2246",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  companyName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  symbol: {
    color: "#aaa",
    marginBottom: 8,
  },
  separator: {
    borderBottomColor: "#555",
    borderBottomWidth: 1,
    marginVertical: 8,
  },
  info: {
    color: "#ddd",
    fontSize: 14,
    marginBottom: 4,
  },
  buyButton: {
    marginTop: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  gradient: {
    paddingVertical: 10,
    alignItems: "center",
  },
  buyText: {
    color: "#000",
    fontWeight: "600",
  },
  popupContainer: {
    backgroundColor: '#1A1D29',           // Matches your dark theme
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: 32,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
    justifyContent: 'flex-end',
    zIndex: 999,                           // Ensure it's above other content
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
    buySellText: {
      color: "#fff",
      fontWeight: "bold",
    },
    buyConfirmButton: {
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: "center",
      width: '30%',
      marginHorizontal: 100
    },
});
