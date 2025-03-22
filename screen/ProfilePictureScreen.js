import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Progress from 'react-native-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';



const ProfilePictureScreen = () => {
  const navigation = useNavigation();

  const [profileImage, setProfileImage] = useState(null);

  const pickImage = async () => {
    console.log('📸 Attempting to open image picker...');

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        console.error('❌ Permission denied');
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
    }

    console.log('✅ Permission granted, opening picker...');

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
    });

    console.log('📂 Picker Result:', result);

    if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        console.log('✅ Image selected:', imageUri);

        setProfileImage(imageUri);

        // Save profile image locally in AsyncStorage
        await AsyncStorage.setItem('profileImage', imageUri);
    } else {
        console.warn('⚠️ Image picking canceled by user.');
    }
};

const handleSaveAllData = async () => {
  const email = await AsyncStorage.getItem('userEmail');
  const country = await AsyncStorage.getItem('selectedCountry');
  const language = await AsyncStorage.getItem('selectedLanguage');
  const name = await AsyncStorage.getItem('name');
  const gender = await AsyncStorage.getItem('gender');
  const profileImage = await AsyncStorage.getItem('profileImage');

  console.log('🔍 Data to Save:', { email, country, language, name, gender, profileImage });

  if (!email || !country || !language || !name || !gender || !profileImage) {
      alert('Please complete all required steps first.');
      return;
  }

  const userData = {
      email,
      country,
      language,
      name,
      gender,
      profileImage: encodeURIComponent(profileImage)
  };

  try {
      const response = await fetch('http://10.0.2.2:3000/saveUserData', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
      });

      const data = await response.json();

      console.log('📥 Server Response:', data);

      if (response.ok) {
          console.log('✅ Profile saved:', data);

          
          navigation.navigate('Explore');
      } else {
          Alert.alert('Error', data.error || 'Failed to save data.');
      }
  } catch (error) {
      console.error('❌ Error saving data:', error);
      Alert.alert('Error', 'Failed to save data. Please try again.');
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        <Progress.Bar progress={0.8} width={null} color="#a88bf5" />
      </View>

      <Text style={styles.header}>Add a profile picture</Text>
      <Text style={styles.description}>Last step! A real photo helps others get to know you better.</Text>

      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderCircle} />
        )}

        <View style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
    style={[
      styles.startButton,
      profileImage ? styles.activeStartButton : styles.disabledStartButton,
    ]}
    disabled={!profileImage}
    onPress={handleSaveAllData}  // ✅ Now includes navigation
>
    <Text style={styles.startButtonText}>Start Asking</Text>
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
    marginBottom: 20,
  },
  imageContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#000',
  },
  addButton: {
    position: 'absolute',
    right: -5,
    bottom: -5,
    backgroundColor: '#a88bf5',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  startButton: {
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeStartButton: {
    backgroundColor: '#a88bf5',
  },
  disabledStartButton: {
    backgroundColor: '#333333',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfilePictureScreen;
