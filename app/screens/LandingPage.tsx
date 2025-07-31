import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  goToSignUp: () => void;
};

export default function LandingPageScreen({ goToSignUp }: Props) {
  const route = useRouter();
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/landing-bg.png')} // Replace with actual background image path
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.topContainer}>
        <View style={styles.indicators}>
            <View style={styles.activeDot} />
            <View style={styles.inactiveDot} />
            <View style={styles.inactiveDot} />
          </View>
        </View>
        <View style={{position: 'absolute', top: 150, alignItems: 'center', left: 0, right: 0,}}>
        <Text style={styles.brandTitle}>
            EthioStockLink <Text style={styles.brandLite}>Lite</Text>
          </Text>
          </View>

        <View style={styles.overlay}>

          <Text style={styles.motto}>Discover. Invest. <Text style={styles.bold}>Succeed</Text></Text>

          <Text style={styles.description}>
            Welcome to EthioStockLink Lite — your gateway to exploring Ethiopian stocks, tracking your portfolio,
            and making smarter investment decisions. Let’s get started!
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={() => route.replace('/(auth)/LoginScreen')}>
              <LinearGradient colors={["#147efb", "#0a60dc"]} style={styles.gradient}>
                <Text style={styles.buttonText}>Login</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={goToSignUp}>
              <LinearGradient colors={["#147efb", "#0a60dc"]} style={styles.gradient}>
                <Text style={styles.buttonText}>Sign up</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  topContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  brandLite: {
    color: '#f9d97a',
    fontWeight: '600',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 50, 0.75)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 10
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  activeDot: {
    width: 50,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2d7cff',
    marginHorizontal: 4,
  },
  inactiveDot: {
    width: 50,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1c2b4a',
    marginHorizontal: 4,
  },
  motto: {
    fontSize: 30,
    color: '#cfd8ff',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  bold: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
  description: {
    color: '#d3d3d3',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
