import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Modal, StyleSheet, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfilePictureScreen = () => {
    const [profileImage, setProfileImage] = useState(null);
    const [imageList, setImageList] = useState([]); // Stores available images
    const [modalVisible, setModalVisible] = useState(false); // Modal visibility state

    // 📂 Pick Images from Downloads (Show all images before selection)
    const pickImages = async () => {
        try {
            console.log('📂 Opening document picker...');
            
            const result = await DocumentPicker.getDocumentAsync({
                type: 'image/*', // 📷 Pick only images
                multiple: false,  // 🚨 Set to false, as Expo-DocumentPicker does not fully support multiple
            });

            console.log('📂 Picker Result:', result);

            if (result.type !== 'cancel') {
                setImageList([result]); // Store available images in array
                setModalVisible(true); // Show modal with image previews
            } else {
                console.warn('⚠️ Image picking canceled by user.');
            }
        } catch (error) {
            console.error('❌ Error picking image:', error);
            Alert.alert('Error', 'Failed to pick images. Please try again.');
        }
    };

    // ✅ Select Image from Preview List
    const selectImage = async (imageUri) => {
        console.log('✅ Selected Image:', imageUri);
        setProfileImage(imageUri);
        await AsyncStorage.setItem('profileImage', imageUri);
        setModalVisible(false); // Close modal after selection
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Choose a Profile Picture</Text>

            <TouchableOpacity style={styles.imageContainer} onPress={pickImages}>
                {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                    <View style={styles.placeholderCircle} />
                )}
                <View style={styles.addButton}>
                    <Text style={styles.addButtonText}>+</Text>
                </View>
            </TouchableOpacity>

            {/* Modal to Show Available Images Before Selection */}
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalHeader}>Select an Image</Text>
                    <FlatList
                        data={imageList}
                        keyExtractor={(item) => item.uri}
                        numColumns={3} // Show images in a grid
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => selectImage(item.uri)}>
                                <Image source={{ uri: item.uri }} style={styles.imagePreview} />
                            </TouchableOpacity>
                        )}
                    />
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

// 🎨 Styles
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212', padding: 20 },
    header: { fontSize: 20, color: '#a88bf5', fontWeight: 'bold', marginBottom: 10 },
    imageContainer: { alignSelf: 'center', marginBottom: 20 },
    profileImage: { width: 100, height: 100, borderRadius: 50 },
    placeholderCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#000' },
    addButton: { position: 'absolute', right: -5, bottom: -5, backgroundColor: '#a88bf5', borderRadius: 15, width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
    addButtonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },

    modalContainer: { flex: 1, backgroundColor: '#222', padding: 20 },
    modalHeader: { fontSize: 18, color: '#fff', marginBottom: 10, fontWeight: 'bold' },
    imagePreview: { width: 100, height: 100, margin: 5, borderRadius: 10 },
    closeButton: { marginTop: 20, backgroundColor: '#a88bf5', padding: 10, borderRadius: 10, alignItems: 'center' },
    closeButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default ProfilePictureScreen;