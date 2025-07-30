import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const router = useRouter()
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          // Token exists: navigate to home/dashboard
          router.replace('/navigation/BottomTabNavigationBar')
        } else {
          // No token: navigate to login screen
          router.replace('/(auth)/LoginScreen');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return null;
  // (
  // <View
  //     style={{
  //       flex: 1,
  //       // marginBottom: 40
  //       // justifyContent: "center",
  //       // alignItems: "center",
  //     }}
  //   >
  //     <LoginSignupStackScreen/>
  //   </View>
  // );
}