import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const BasicInfoScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Basic Info</Text>
      <Text style={styles.description}>
        Accurate information ensures you get personalized content and services.
      </Text>
      <Text style={styles.subText}>
        You cannot change your region and mother tongue after selecting it. Please provide authentic personal information.
      </Text>

      <TouchableOpacity style={styles.optionItem}>
        <Text style={styles.optionText}>I'm from</Text>
        <View style={styles.redDot} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionItem}>
        <Text style={styles.optionText}>Native</Text>
        <View style={styles.redDot} />
      </TouchableOpacity>

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
  optionItem: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
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
