import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import { useNavigation, useRoute } from '@react-navigation/native'; 

const BasicInfoScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();  // Access route params
  const progress = route.params?.progress || 0.0;  // Default to 0 if no data received

  const handleNavigation = () => {
    navigation.navigate('CountrySelection');
  };

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

      <TouchableOpacity style={styles.optionItem} onPress={handleNavigation}>
        <Text style={styles.optionText}>I'm from</Text>
        <View style={styles.rightContainer}>
          <View style={styles.redDot} />
          <Text style={styles.arrow}>{'>'}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionItem}>
        <Text style={styles.optionText}>Native</Text>
        <View style={styles.rightContainer}>
          <View style={styles.redDot} />
          <Text style={styles.arrow}>{'>'}</Text>
        </View>
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
  progressBarContainer: {
    marginVertical: 10,
  },
  header: {
    fontSize: 24,
    color: '#a88bf5',
    fontWeight: 'bold',
    marginBottom: 10,
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
