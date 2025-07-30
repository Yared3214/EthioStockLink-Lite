import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import LoginScreen from '../(auth)/LoginScreen';
import IntroScreens from '../screens/IntroScreens';
import BottomTabNavigationBar from './BottomTabNavigationBar';

// Define the stack parameter types
export type AuthStackParamList = {
  intro: undefined;
  login: undefined;
  home: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export default function LoginSignupStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="intro"
        component={IntroScreens}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="home"
        component={BottomTabNavigationBar}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
