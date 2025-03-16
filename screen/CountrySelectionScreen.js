import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';

const popularCountries = [
  { name: 'USA', flag: '🇺🇸' },
  { name: 'UK', flag: '🇬🇧' },
  { name: 'China', flag: '🇨🇳' },
  { name: 'Japan', flag: '🇯🇵' },
  { name: 'Korea', flag: '🇰🇷' },
  { name: 'France', flag: '🇫🇷' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'Italy', flag: '🇮🇹' },
  { name: 'Spain', flag: '🇪🇸' },
];

const CountrySelectionScreen = () => {
  const renderCountry = ({ item }) => (
    <TouchableOpacity style={styles.countryItem}>
      <Text style={styles.flag}>{item.flag}</Text>
      <Text style={styles.countryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>I'm from</Text>
      <Text style={styles.subHeader}>POPULAR</Text>
      <FlatList
        data={popularCountries}
        keyExtractor={(item) => item.name}
        renderItem={renderCountry}
      />
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
  header: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
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
  flag: {
    fontSize: 24,
    marginRight: 10,
  },
  countryText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default CountrySelectionScreen;
