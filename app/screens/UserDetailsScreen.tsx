import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRegistration } from '../context/UserRegistrationContext';

const UserDetailsScreen = () => {
  const navigation = useNavigation();
  const { data, setData } = useRegistration();
  const [gender, setGender] = useState<string>('');
  const [ageRange, setAgeRange] = useState<string>('18 - 24');
  const [experience, setExperience] = useState<string>('');

  const onSubmit = async () => {
    const { name, email, password } = data;
    const [firstName, lastName] = name?.split(' ') || ["", ""];
  
    try {
      const response = await fetch("https://ethiostocklink-lite-1.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          ageRange,
          Sex: gender,
          Level: experience,
          password,
        }),
      });
  
      const result = await response.json();
      if (!response.ok) {
        alert("Registration failed" );
        console.error(response)
      } else {
        alert("Registered Successfully!");
        // Navigate or reset
        navigation.navigate('login');
      }
    } catch (err) {
      alert("Error submitting data.");
    }
  };

  const handleSkip = () => {
    console.log('Skipped user details');
  };

  const renderRadioOption = (label: string, value: string, selected: string, setSelected: (val: string) => void) => (
    <TouchableOpacity style={styles.radioRow} onPress={() => setSelected(value)}>
      <View style={[styles.radioCircle, selected === value && styles.radioSelected]} />
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
        <View style={[styles.progressDot, styles.activeDot]} />
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Tell Us About Yourself!</Text>
        <Text style={styles.subtitle}>
          This helps us serve you better. You can skip if you want!
        </Text>

        {/* Gender */}
        <Text style={styles.sectionTitle}>Gender</Text>
        {renderRadioOption('Male', 'male', gender, setGender)}
        {renderRadioOption('Female', 'female', gender, setGender)}
        {renderRadioOption('Prefer not to say', 'unspecified', gender, setGender)}

        {/* Age Range */}
        <Text style={styles.sectionTitle}>Age Range</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={ageRange}
            onValueChange={setAgeRange}
            dropdownIconColor="#fff"
            style={styles.picker}
          >
            <Picker.Item label="18 - 24" value="18 - 24" />
            <Picker.Item label="25 - 34" value="25 - 34" />
            <Picker.Item label="35 - 44" value="35 - 44" />
            <Picker.Item label="45+" value="45+" />
          </Picker>
        </View>

        {/* Experience */}
        <Text style={styles.sectionTitle}>Experience Level with Investing</Text>
        {renderRadioOption('Beginner', 'beginner', experience, setExperience)}
        {renderRadioOption('Intermediate', 'intermediate', experience, setExperience)}
        {renderRadioOption('Advanced', 'advanced', experience, setExperience)}

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UserDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030a24',
    paddingTop: 40
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
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
    margin: 20,
    borderRadius: 16,
    padding: 24,
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    color: '#bbb',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#fff',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    backgroundColor: '#007bff',
  },
  radioLabel: {
    color: 'white',
    fontSize: 14,
  },
  pickerContainer: {
    backgroundColor: '#101c3a',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1c2b4a',
    marginBottom: 8,
  },
  picker: {
    color: 'white',
    height: 50,
    paddingHorizontal: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'space-between',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  skipButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  skipText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});
