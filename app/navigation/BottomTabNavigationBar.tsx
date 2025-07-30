import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import IPOScreen from '../screens/IPOScreen';
import PortfolioScreen from '../screens/MyPortfolioScreen';
import ExchangeStackScreen from './ExchangeStackScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigationBar() {
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: { backgroundColor: '#0A0E2E', borderTopColor: '#333' },
          tabBarActiveTintColor: '#2d7cff',
          tabBarInactiveTintColor: '#aaa',
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'IPO') iconName = 'stats-chart';
            else if (route.name === 'Exchange') iconName = 'swap-horizontal';
            else iconName = 'briefcase-outline';

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="IPO" component={IPOScreen} />
        <Tab.Screen name="Exchange" component={ExchangeStackScreen} />
        <Tab.Screen name="Portfolio" component={PortfolioScreen} />
      </Tab.Navigator>
  );
}
