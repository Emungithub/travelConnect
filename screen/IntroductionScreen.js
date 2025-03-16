import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import * as Progress from 'react-native-progress';  // <-- Correct Import

const IntroductionScreen = () => {
  const [showPicker, setShowPicker] = useState(false);
  const [gender, setGender] = useState('');

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthday;
    setShowPicker(Platform.OS === 'ios');
    setBirthday(currentDate);
  };

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <Progress.Bar progress={0.5} width={null} color="#a88bf5" />
      </View>

      <Text style={styles.header}>Introduction</Text>
      <Text style={styles.description}>
        Providing accurate personal information allows us to offer a more personalized experience.
      </Text>
      <Text style={styles.subText}>
        You cannot change your age and gender after creating it. Please provide authentic personal information.
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Name</Text>
        <TextInput style={styles.input} />
      </View>

      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[styles.genderButton, gender === 'Male' && styles.activeGender]}
          onPress={() => setGender('Male')}
        >
          <Text style={styles.genderText}>Male</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.genderButton, gender === 'Female' && styles.activeGender]}
          onPress={() => setGender('Female')}
        >
          <Text style={styles.genderText}>Female</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.nextButton}>
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  progressBarContainer: {
    marginVertical: 10,
  },
  header: {
    fontSize: 24,
    color: '#a88bf5',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
  },
  subText: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 20,
  },
  inputContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  inputLabel: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 5,
  },
  input: {
    color: '#fff',
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  genderButton: {
    backgroundColor: '#333333',
    borderRadius: 20,
    paddingVertical: 12,
    width: '45%',
    alignItems: 'center',
  },
  activeGender: {
    backgroundColor: '#a88bf5',
  },
  genderText: {
    color: '#fff',
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#a88bf5',
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default IntroductionScreen;
