import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Alert } from 'react-native';

import { WEB_CLIENT_ID, IOS_CLIENT_ID } from '@env';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ }) {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and register

  const handleRegister = async () => {
    console.log("Attempting to Register...");

    try {
      const response = await fetch('http://10.0.2.2:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      console.log("Response Status:", response.status);

      const data = await response.json();
      console.log("Server Response Data:", data);

      if (response.ok) {
        Alert.alert('Success', 'Registration successful!');
        // Store email after successful login
        await AsyncStorage.setItem('userEmail', data.email);

      } else {
        Alert.alert('Error', data.error || 'Unknown error occurred.');
      }
    } catch (error) {
      console.error('Registration Error:', error);
      Alert.alert('Error', 'Failed to connect to server.');
    }
  };
  //http://10.0.2.2:3000/login
  //http://172.20.10.3:3000
  const handleLogin = async () => {
    try {
      const response = await fetch('http://10.0.2.2:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('userEmail', email); // ✅ Save the email
        // await AsyncStorage.setItem('userId', data.id.toString()); // ✅ this is what you need

        Alert.alert('Success', 'Login successful!');
        navigation.navigate('BasicInfo');
        // // Check if the user has already chosen a recommendation
        // const hasChosenRecommendation = await AsyncStorage.getItem('hasChosenRecommendation');
        // if (hasChosenRecommendation) {
        //   navigation.navigate('Explore');
        // } else {
        //   navigation.navigate('BasicInfo');
        // }
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Login failed');
    }
  };


  return (
    <View style={styles.container}>

      {/* Logo */}
      <Image source={require("../assets/travelConnectLogo.png")} style={styles.logo} />

      {/* Title */}
      <Text style={styles.title}>
        <Text style={styles.purpleText}>Travel</Text>Connect
      </Text>
      <Text style={styles.subtitle}>With Locals</Text>

      {/* Description */}
      <Text style={styles.description}>Connect with locals, explore like never before.</Text>
      <Text>Sign in with Google</Text>
      {/* <GoogleSigninButton
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
            /> */}

      <Text style={styles.loginText}>Log in or sign up</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholderTextColor="#A3A3A3"  // Light gray for better visibility
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#A3A3A3"  // Light gray for better visibility
      />


      {isLogin ? (
        <>
          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <Text style={styles.switchText}>
            Don't have an account?{" "}
            <Text style={styles.linkText} onPress={() => setIsLogin(false)}>Sign up now</Text>
          </Text>
        </>
      ) : (
        <>
          <TouchableOpacity onPress={handleRegister} style={styles.button}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <Text style={styles.switchText}>
            Already have an account?{" "}
            <Text style={styles.linkText} onPress={() => setIsLogin(true)}>Go to login</Text>
          </Text>
        </>
      )}


      {/* Terms */}
      <Text style={styles.termsText}>
        By continuing, you agree to our{" "}
        <Text style={styles.linkText}>Terms of Service</Text> and{" "}
        <Text style={styles.linkText}>Privacy Policy</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logo: {
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  purpleText: {
    color: "#A855F7",
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 20,
  },
  loginText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 10,
    paddingHorizontal: 10,
    width: "100%",
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#1E1E1E',  // Darker background for better contrast
    color: '#FFF',               // White text for readability
    borderColor: '#A855F7',      // Purple border for better visibility
    borderWidth: 1,
    borderRadius: 12,            // Rounded corners for a modern look
    paddingHorizontal: 15,       // Comfortable spacing inside input
    marginBottom: 15,            // Space between inputs
    fontSize: 16,                // Larger text for better readability
    shadowColor: '#A855F7',      // Soft glowing shadow for an elegant touch
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  button: {
    backgroundColor: "#A855F7",
    paddingVertical: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#555",
  },
  orText: {
    marginHorizontal: 10,
    color: "#fff",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    paddingVertical: 15,
    borderRadius: 10,
    width: "100%",
    justifyContent: "center",
    marginBottom: 15,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 15,
    borderRadius: 10,
  },
  googleText: {
    color: "#fff",
    fontSize: 16,
  },
  termsText: {
    fontSize: 12,
    color: "#aaa",
    textAlign: "center",
    marginTop: 10,
  },
  linkText: {
    color: "#A855F7",
    textDecorationLine: "underline",
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  flagContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  flagIcon: {
    width: 30,
    height: 20,
    marginRight: 5,
  },
  countryCode: {
    color: "white",
    fontSize: 16,
  },
});
