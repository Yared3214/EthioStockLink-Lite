import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRegistration } from '../context/UserRegistrationContext';

type Props = {
  goToUserDetail: () => void;
};

const SignUpScreen = ({ goToUserDetail }: Props) => {
  const router = useRouter()
  const { setData } = useRegistration();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const validateInputs = () => {
    const newErrors: typeof errors = {};
  
    if (!name.trim()) {
      newErrors.name = 'Name is required.';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }
  
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!isEmail) {
      newErrors.email = 'Enter a valid email.';
    }
  
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const onNext = () => {
    if (!validateInputs()) return;
  
    setData({ name, email, password });
    goToUserDetail();
  };
  
  
  return (
    <SafeAreaView style={{backgroundColor: '#030a24', flex: 1}}>
      <StatusBar barStyle="light-content" />
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressDot} />
        <View style={[styles.progressDot, styles.activeDot]} />
        <View style={styles.progressDot} />
      </View>
      <View style={styles.container}>

      <View style={styles.card}>
        <Text style={styles.title}>Register Here</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Your full name"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Your email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Your password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        {/* Remember Me Toggle */}
        <View style={styles.rememberContainer}>
          <Switch
            value={rememberMe}
            onValueChange={setRememberMe}
            thumbColor={rememberMe ? '#007bff' : '#ccc'}
            trackColor={{ false: '#555', true: '#007bff' }}
          />
          <Text style={styles.rememberText}>Remember me</Text>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.button} onPress={onNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>

        {/* Sign In Link */}
        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Text style={styles.signInLink} onPress={() => router.replace('/(auth)/LoginScreen')}>Sign in</Text>
        </Text>
      </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030a24',
    justifyContent: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 50
  },
  progressDot: {
    height: 6,
    width: 50,
    backgroundColor: '#1c2b4a',
    borderRadius: 3,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#007bff',
  },
  card: {
    backgroundColor: '#0b1736',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  label: {
    color: 'white',
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#101c3a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: 'white',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1c2b4a',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  rememberText: {
    color: 'white',
    marginLeft: 8,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerText: {
    color: '#aaa',
    textAlign: 'center',
  },
  signInLink: {
    color: '#4dabf7',
    fontWeight: 'bold',
  },
});
