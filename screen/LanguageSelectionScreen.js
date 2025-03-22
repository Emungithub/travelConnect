import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const popularLanguages = [
  { name: 'English', native: 'English' },
  { name: 'Chinese Simplified', native: '中文 (简体)' },
  { name: 'Japanese', native: '日本語' },
  { name: 'Korean', native: '한국어' },
  { name: 'Spanish', native: 'Español' },
  { name: 'French', native: 'Français' },
  { name: 'Portuguese', native: 'Português' },
  { name: 'German', native: 'Deutsch' },
  { name: 'Italian', native: 'Italiano' },
];

const LanguageSelectionScreen = () => {
  const navigation = useNavigation();
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
  };

  const handleConfirm = async () => {
    if (!selectedLanguage) {
      alert('Please select a language before confirming.');
      return;
    }

    await AsyncStorage.setItem('selectedLanguage', selectedLanguage);
    navigation.navigate('BasicInfo', { selectedLanguage });
};

  const renderLanguage = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.languageItem, 
        selectedLanguage === item.name && styles.selectedLanguage
      ]}
      onPress={() => handleLanguageSelect(item.name)}
    >
      <View style={styles.textContainer}>
        <Text style={styles.languageText}>{item.name}</Text>
        <Text style={styles.nativeText}>{item.native}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Native Language</Text>
      <Text style={styles.subHeader}>POPULAR</Text>
      <FlatList
        data={popularLanguages}
        keyExtractor={(item) => item.name}
        renderItem={renderLanguage}
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
  languageItem: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  selectedLanguage: {
    borderColor: '#a88bf5',
    borderWidth: 2,
  },
  textContainer: {
    flexDirection: 'column',
  },
  languageText: {
    fontSize: 18,
    color: '#fff',
  },
  nativeText: {
    fontSize: 14,
    color: '#aaa',
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

export default LanguageSelectionScreen;
