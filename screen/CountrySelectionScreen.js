import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import * as Progress from 'react-native-progress';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const popularCountries = [
  { name: 'USA', flag: '🇺🇸' },
  { name: 'UK', flag: '🇬🇧' },
  { name: 'China', flag: '🇨🇳' },
  { name: 'Japan', flag: '🇯🇵' },
  { name: 'Korea', flag: '🇰🇷' },
  { name: 'Malaysia', flag: '🇲🇾' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'Italy', flag: '🇮🇹' },
  { name: 'Spain', flag: '🇪🇸' },
];

const CountrySelectionScreen = () => {
  const navigation = useNavigation();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [progress, setProgress] = useState(0.0);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
  };

  const handleConfirm = async () => {
    if (!selectedCountry) {
      alert('Please select a country before confirming.');
      return;
    }

    await AsyncStorage.setItem('selectedCountry', selectedCountry);
    navigation.navigate('BasicInfo', { selectedCountry });
};

  const renderCountry = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.countryItem, 
        selectedCountry === item.name && styles.selectedCountry
      ]}
      onPress={() => handleCountrySelect(item.name)}
    >
      <Text style={styles.flag}>{item.flag}</Text>
      <Text style={styles.countryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      

      <Text style={styles.header}>I'm from</Text>
      <Text style={styles.subHeader}>POPULAR</Text>

      <FlatList
        data={popularCountries}
        keyExtractor={(item) => item.name}
        renderItem={renderCountry}
      />

      {/* Confirm Button */}
      <TouchableOpacity 
        style={styles.confirmButton}
        onPress={handleConfirm}
      >
        <Text style={styles.confirmText}>Confirm</Text>
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
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
  },
  header: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 10,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  selectedCountry: {
    borderColor: '#a88bf5',
    borderWidth: 2,
  },
  flag: {
    fontSize: 24,
    marginRight: 10,
  },
  countryText: {
    fontSize: 18,
    color: '#fff',
  },
  confirmButton: {
    backgroundColor: '#a88bf5',
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CountrySelectionScreen;
