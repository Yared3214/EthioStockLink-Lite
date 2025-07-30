import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSignInPress = async () => {
    if (!emailAddress || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://ethiostocklink-lite-1.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailAddress,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const { accessToken, refreshToken } = data;

      // Save token to storage (you can use SecureStore for more security)
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);

      // Navigate to main/home screen
      // navigation.navigate('Home'); Adjust route name to your app structure
      router.replace('/')

    } catch (error) {
      Alert.alert('Login Failed', error.message);
      console.error('Login Failed', error.message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ backgroundColor: '#0a0f2c', flex: 1, padding: 20 }}>
      <Text style={styles.logo}>EthioStockLink <Text style={styles.logoLite}>Lite</Text></Text>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.title}>Nice to see you!</Text>
            <Text style={styles.subtitle}>Enter your email and password to sign in</Text>
          </View>

          <Text style={styles.label}>Email / Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Your email or phone number"
            placeholderTextColor="#888"
            value={emailAddress}
            onChangeText={setEmailAddress}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Your password"
              placeholderTextColor="#888"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Image source={require('../../assets/eye.png')} style={{ width: 20, height: 20 }} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot?</Text>
          </TouchableOpacity>

          <View style={styles.rememberContainer}>
            <Switch
              value={rememberMe}
              onValueChange={setRememberMe}
              trackColor={{ false: '#767577', true: '#007bff' }}
            />
            <Text style={styles.rememberText}>Remember me</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={onSignInPress} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'SIGN IN'}</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Don’t have an account?{' '}
            <Text style={styles.signUpText} onPress={() => router.replace('/screens/IntroScreens')}>Sign up</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f2c',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 30,
    fontWeight: '700',
  },
  logoLite: {
    color: '#f4d35e',
  },
  card: {
    backgroundColor: '#121a3a',
    borderRadius: 15,
    padding: 20,
    width: '100%',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 20,
  },
  label: {
    color: 'white',
    marginBottom: 5,
    marginLeft: 5,
  },
  input: {
    backgroundColor: '#1c2445',
    borderRadius: 10,
    color: '#fff',
    padding: 15,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c2445',
    borderRadius: 10,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: 15,
  },
  forgotPassword: {
    color: '#4dabf7',
    textAlign: 'right',
    marginBottom: 15,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  rememberText: {
    color: '#fff',
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  footerText: {
    color: '#aaa',
    textAlign: 'center',
  },
  signUpText: {
    color: '#4dabf7',
  },
});

