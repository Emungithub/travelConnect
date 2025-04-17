import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Modal, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';


const ProfilePictureScreen = () => {
    const [profileImage, setProfileImage] = useState(null);
    const [imageList, setImageList] = useState([]); // Store picked images
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();

    // 📂 Pick Images from Device
    const pickImages = async () => {
        try {
          const result = await DocumentPicker.getDocumentAsync({
            type: "image/*", // You can change to '*/*' to allow all file types
            multiple: false, // set to true if you want multiple document selection
            copyToCacheDirectory: true
          });
      
          console.log('📂 Picker Result:', result);
      
          if (result.assets && result.assets.length > 0) {
            const selected = result.assets[0];
            setImageList([selected]); // Store in array
            setModalVisible(true);
          } else {
            console.warn("⚠️ Document picking was canceled.");
          }
        } catch (error) {
          console.error("❌ Error picking document:", error);
          Alert.alert("Error", "Failed to pick a document. Please try again.");
        }
      };
      

    // ✅ Select Image from List
    const selectImage = async (imageUri) => {
        console.log('✅ Selected Image:', imageUri);
        setProfileImage(imageUri);
        await AsyncStorage.setItem('profileImage', imageUri);
        setModalVisible(false); // Close modal
    };

    // ✅ Save Data Function (added from your snippet)
    const handleSaveAllData = async () => {
        const email = await AsyncStorage.getItem('userEmail');
        const country = await AsyncStorage.getItem('selectedCountry');
        const language = await AsyncStorage.getItem('selectedLanguage');
        const name = await AsyncStorage.getItem('name');
        const gender = await AsyncStorage.getItem('gender');
        const profileImage = await AsyncStorage.getItem('profileImage');
        const userId = await AsyncStorage.getItem('userId');
        console.log("🧠 User ID from AsyncStorage:", userId);

        console.log('🔍 Data to Save:', { userId, email, country, language, name, gender, profileImage });

        if (!userId || !email || !country || !language || !name || !gender || !profileImage) {
            alert('Please complete all required steps first.');
            return;
        }

        const userData = {
            user_id: userId,
            email,
            country,
            language,
            name,
            gender,
            profileImage: encodeURIComponent(profileImage)
        };

        try {
            const response = await fetch('http://192.168.35.214:3000/saveUserData', {
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
            <Text style={styles.header}>Choose a Profile Picture</Text>

            <TouchableOpacity style={styles.imageContainer} onPress={pickImages}>
                {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                    <View style={styles.placeholderCircle}>
                        <Text style={styles.placeholderText}>+</Text>
                    </View>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.saveButton,
                    profileImage ? styles.activeSaveButton : styles.disabledSaveButton,
                ]}
                disabled={!profileImage}
                onPress={handleSaveAllData}
            >
                <Text style={styles.saveButtonText}>Save & Continue</Text>
            </TouchableOpacity>

            {/* Modal to Show Image List */}
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalHeader}>Select an Image</Text>
                        {imageList.length > 0 ? (
                            <FlatList
                                data={imageList}
                                keyExtractor={(item) => item.uri}
                                numColumns={3}
                                renderItem={({ item }) => {
                                    const isImage = item.mimeType?.startsWith("image/");
                                    return (
                                      <TouchableOpacity onPress={() => isImage && selectImage(item.uri)}>
                                        {isImage ? (
                                          <Image source={{ uri: item.uri }} style={styles.imagePreview} />
                                        ) : (
                                          <View style={[styles.imagePreview, { justifyContent: 'center', alignItems: 'center' }]}>
                                            <Text style={{ color: '#fff', textAlign: 'center' }}>Not an image</Text>
                                          </View>
                                        )}
                                      </TouchableOpacity>
                                    );
                                  }}
                                  
                            />
                        ) : (
                            <Text style={styles.noImagesText}>No images found</Text>
                        )}
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

// 🎨 Styles
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212', padding: 20, alignItems: 'center', justifyContent: 'center' },
    header: { fontSize: 20, color: '#a88bf5', fontWeight: 'bold', marginBottom: 20 },
    
    imageContainer: { width: 120, height: 120, alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
    profileImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: '#a88bf5' },
    placeholderCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#444', alignItems: 'center', justifyContent: 'center' },
    placeholderText: { fontSize: 40, color: '#fff', fontWeight: 'bold' },

    saveButton: {
        width: '100%',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    activeSaveButton: {
        backgroundColor: '#a88bf5',
    },
    disabledSaveButton: {
        backgroundColor: '#333',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

    modalBackground: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center' },
    modalContainer: { width: '90%', backgroundColor: '#222', padding: 20, borderRadius: 10, alignItems: 'center' },
    modalHeader: { fontSize: 18, color: '#fff', marginBottom: 15, fontWeight: 'bold' },
    imagePreview: { width: 90, height: 90, margin: 5, borderRadius: 10, borderWidth: 2, borderColor: '#a88bf5' },
    noImagesText: { color: '#aaa', fontSize: 16, marginTop: 10 },
    
    closeButton: { marginTop: 15, backgroundColor: '#a88bf5', padding: 10, borderRadius: 10, alignItems: 'center', width: '50%' },
    closeButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default ProfilePictureScreen;