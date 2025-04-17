import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
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
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const checkUserLogin = async () => {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
      console.log('Stored auth data:', { userId, token });
      if (userId && token) {
        navigation.navigate('Explore');
      }
    };
    checkUserLogin();
  }, [navigation]);

  const handleRegister = async () => {
    console.log("Attempting to Register...");

    try {
      const response = await fetch('http://192.168.35.214:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      console.log("Response Status:", response.status);

      const data = await response.json();
      console.log("Server Response Data:", data);

      if (response.ok) {
        Alert.alert('Success', 'Registration successful!');
        console.log("🧠 Registered user ID:", data.id.toString());

        await AsyncStorage.setItem('userEmail', data.email);
        await AsyncStorage.setItem('userId', data.id.toString());
      } else {
        Alert.alert('Error', data.error || 'Unknown error occurred.');
      }
    } catch (error) {
      console.error('Registration Error:', error);
      Alert.alert('Error', 'Failed to connect to server.');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.35.214:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log("Login Response Data:", data);
      
      if (response.ok) {
        await AsyncStorage.setItem('userEmail', email);
        await AsyncStorage.setItem('userId', data.id.toString());
        await AsyncStorage.setItem('token', data.token);
        
        const storedToken = await AsyncStorage.getItem('token');
        console.log("Stored Token:", storedToken);
        
        Alert.alert('Success', 'Login successful!');
        navigation.navigate('BasicInfo');
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert('Error', 'Login failed');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <Image source={require("../assets/travelConnectLogo.png")} style={styles.logo} />

          {/* Title */}
          <Text style={styles.title}>
            <Text style={styles.purpleText}>Travel</Text>Connect
          </Text>
          <Text style={styles.subtitle}>With Locals</Text>

          {/* Description */}
          <Text style={styles.description}>Connect with locals, explore like never before.</Text>
          <Text style={styles.googleText}>Sign in with Google</Text>

          <Text style={styles.loginText}>Log in or sign up</Text>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholderTextColor="#A3A3A3"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              placeholderTextColor="#A3A3A3"
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
          </View>

          {/* Terms */}
          <Text style={styles.termsText}>
            By continuing, you agree to our{" "}
            <Text style={styles.linkText}>Terms of Service</Text> and{" "}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
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
    width: "100%",
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#1E1E1E',
    color: '#FFF',
    borderColor: '#A855F7',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    shadowColor: '#A855F7',
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
  switchText: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
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
  googleText: {
    color: "#fff",
    marginBottom: 20,
  },
});
