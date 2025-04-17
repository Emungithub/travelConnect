import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import { useNavigation, useRoute } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const BasicInfoScreen = () => {
  const navigation = useNavigation();

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  useEffect(() => {
      const fetchData = async () => {
          const country = await AsyncStorage.getItem('selectedCountry');
          const language = await AsyncStorage.getItem('selectedLanguage');
          if (country) setSelectedCountry(country);
          if (language) setSelectedLanguage(language);
      };
      fetchData();
  }, []);

  const progress = (selectedCountry ? 0.2 : 0) + (selectedLanguage ? 0.2 : 0);
  const isNextEnabled = selectedCountry && selectedLanguage;

  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        <Progress.Bar progress={progress} width={null} color="#a88bf5" />
      </View>

      <Text style={styles.header}>Basic Info</Text>
      <Text style={styles.description}>
        Accurate information ensures you get personalized content and services.
      </Text>
      <Text style={styles.subText}>
        You cannot change your region and mother tongue after selecting it. Please provide authentic personal information.
      </Text>

      {/* Country Selection */}
      <TouchableOpacity 
                style={styles.optionItem} 
                onPress={() => navigation.navigate('CountrySelection')}
            >
                <Text style={styles.optionText}>
                    {selectedCountry ? `I'm from ${selectedCountry}` : "I'm from"}
                </Text>
                <View style={styles.rightContainer}>
                    <View style={[styles.redDot, selectedCountry && { backgroundColor: 'green' }]} />
                    {!selectedCountry && <Text style={styles.arrow}>{'>'}</Text>}
                </View>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.optionItem}
                onPress={() => navigation.navigate('LanguageSelection')}
            >
                <Text style={styles.optionText}>
                    {selectedLanguage ? `Native: ${selectedLanguage}` : "Native"}
                </Text>
                <View style={styles.rightContainer}>
                    <View style={[styles.redDot, selectedLanguage && { backgroundColor: 'green' }]} />
                    {!selectedLanguage && <Text style={styles.arrow}>{'>'}</Text>}
                </View>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.nextButton, isNextEnabled && { backgroundColor: '#a88bf5' }]}
                disabled={!isNextEnabled}
                onPress={() => navigation.navigate('Introduction')}
            >
                <Text style={[styles.nextText, isNextEnabled && { color: '#fff' }]}>Next</Text>
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
    fontSize: 16,
    color: '#E0E0E0',
    marginBottom: 10,
    lineHeight: 24,
  },
  subText: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 20,
    lineHeight: 20,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    marginBottom: 10,
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  redDot: {
    width: 8,
    height: 8,
    backgroundColor: 'red',
    borderRadius: 4,
  },
  arrow: {
    color: '#fff',
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#333333',
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  nextText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BasicInfoScreen;
