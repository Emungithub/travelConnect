import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';  // ✅ Import navigation hook
import * as Progress from 'react-native-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';


const saveUserDataToDatabase = async (data) => {
    try {
        const response = await fetch('http://192.168.35.214:3000/saveUserData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error('❌ Server Response:', errorResponse);
            throw new Error(errorResponse.error || 'Failed to save data');
        }

        console.log('✅ Data saved successfully');
    } catch (error) {
        console.error('❌ Error saving data:', error.message);
        alert(`Failed to save data: ${error.message}`);
    }
};




const IntroductionScreen = () => {
    const navigation = useNavigation();  // ✅ Correctly use navigation inside the component

    const [name, setName] = useState('');
    const [gender, setGender] = useState('');

    const handleSaveIntroduction = async () => {
        await AsyncStorage.setItem('name', name.trim());
        await AsyncStorage.setItem('gender', gender);
        navigation.navigate('ProfilePicture');
    };

    const isNextEnabled = name.trim() !== '' && gender !== '';

    return (
        <View style={styles.container}>
            <View style={styles.progressBarContainer}>
                <Progress.Bar progress={0.5} width={null} color="#a88bf5" />
            </View>

            <Text style={styles.header}>Introduction</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={(text) => setName(text)}
                />
            </View>

            <View style={styles.genderContainer}>
                <TouchableOpacity
                    style={[styles.genderButton, gender === 'Male' && styles.activeGender]}
                    onPress={() => setGender('Male')}
                >
                    <Text style={styles.genderText}>Male</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.genderButton, gender === 'Female' && styles.activeGender]}
                    onPress={() => setGender('Female')}
                >
                    <Text style={styles.genderText}>Female</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={[
                    styles.nextButton,
                    isNextEnabled ? { backgroundColor: '#a88bf5' } : { backgroundColor: '#333333' }
                ]}
                disabled={!isNextEnabled}
                onPress={handleSaveIntroduction}  // ✅ Now correctly calls handleSaveToDatabase
            >
                <Text
                    style={[
                        styles.nextText,
                        isNextEnabled ? { color: '#fff' } : { color: '#666' }
                    ]}
                >
                    Next
                </Text>
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
    inputContainer: {
        backgroundColor: '#1E1E1E',
        borderRadius: 8,
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    inputLabel: {
        color: '#aaa',
        fontSize: 12,
        marginBottom: 5,
    },
    input: {
        color: '#fff',
        fontSize: 16,
    },
    genderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    genderButton: {
        backgroundColor: '#333333',
        borderRadius: 20,
        paddingVertical: 12,
        width: '45%',
        alignItems: 'center',
    },
    activeGender: {
        backgroundColor: '#a88bf5',
    },
    genderText: {
        color: '#fff',
        fontSize: 16,
    },
    nextButton: {
        borderRadius: 20,
        paddingVertical: 12,
        alignItems: 'center',
    },
    nextText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default IntroductionScreen;
