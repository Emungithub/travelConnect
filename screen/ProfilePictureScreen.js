import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Modal, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfilePictureScreen = () => {
    const [profileImage, setProfileImage] = useState(null);
    const [imageList, setImageList] = useState([]); // Store picked images
    const [modalVisible, setModalVisible] = useState(false);

    // 📂 Pick Images from Device
    const pickImages = async () => {
        console.log('📂 Opening document picker...');
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                quality: 1,
            });

            console.log('📂 Picker Result:', result);

            if (!result.canceled && result.assets.length > 0) {
                setImageList(result.assets); // Store picked images in list
                setModalVisible(true); // Show modal for selection
            } else {
                console.warn('⚠️ Image picking was canceled.');
            }
        } catch (error) {
            console.error('❌ Error picking image:', error);
            Alert.alert('Error', 'Failed to pick images. Please try again.');
        }
    };

    // ✅ Select Image from List
    const selectImage = async (imageUri) => {
        console.log('✅ Selected Image:', imageUri);
        setProfileImage(imageUri);
        await AsyncStorage.setItem('profileImage', imageUri);
        setModalVisible(false); // Close modal
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
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => selectImage(item.uri)}>
                                        <Image source={{ uri: item.uri }} style={styles.imagePreview} />
                                    </TouchableOpacity>
                                )}
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
    
    imageContainer: { width: 120, height: 120, alignItems: 'center', justifyContent: 'center' },
    profileImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: '#a88bf5' },
    placeholderCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#444', alignItems: 'center', justifyContent: 'center' },
    placeholderText: { fontSize: 40, color: '#fff', fontWeight: 'bold' },

    modalBackground: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center' },
    modalContainer: { width: '90%', backgroundColor: '#222', padding: 20, borderRadius: 10, alignItems: 'center' },
    modalHeader: { fontSize: 18, color: '#fff', marginBottom: 15, fontWeight: 'bold' },
    imagePreview: { width: 90, height: 90, margin: 5, borderRadius: 10, borderWidth: 2, borderColor: '#a88bf5' },
    noImagesText: { color: '#aaa', fontSize: 16, marginTop: 10 },
    
    closeButton: { marginTop: 15, backgroundColor: '#a88bf5', padding: 10, borderRadius: 10, alignItems: 'center', width: '50%' },
    closeButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default ProfilePictureScreen;