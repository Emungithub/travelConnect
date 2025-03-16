import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Progress from 'react-native-progress';

const ProfilePictureScreen = () => {
  const [profileImage, setProfileImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
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
