import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

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
  const renderLanguage = ({ item }) => (
    <TouchableOpacity style={styles.languageItem}>
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
});

export default LanguageSelectionScreen;
