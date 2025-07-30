import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ExchangeScreen from '../screens/ExchangeScreen';
import StockDetailScreen from '../screens/StockDetailScreen';
import TradeDetailsScreen from '../screens/TradeDetailsScreen';

// Define the stack parameter types
export type ExchangeStackParamList = {
  'exchange': undefined;
  'stock-detail': undefined;
  'trade-detail': undefined;
};

const Stack = createStackNavigator<ExchangeStackParamList>();

export default function ExchangeStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="exchange"
        component={ExchangeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="stock-detail"
        component={StockDetailScreen}
        options={{ headerShown: false }}
      />
            <Stack.Screen
        name="trade-detail"
        component={TradeDetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
