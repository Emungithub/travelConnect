import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen({}) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigation = useNavigation();

  const handleContinue = () => {
    navigation.navigate('Recommendation');
  }

  return (
    <View style={styles.container}>
      {/* Logo */}
      {/* <Image source={require("../assets/logo.png")} style={styles.logo} /> */}

      {/* Title */}
      <Text style={styles.title}>
        <Text style={styles.purpleText}>Travel</Text>Connect
      </Text>
      <Text style={styles.subtitle}>With Locals</Text>

      {/* Description */}
      <Text style={styles.description}>Connect with locals, explore like never before.</Text>

      {/* Phone Input */}
      <Text style={styles.loginText}>Log in or sign up</Text>
      {/* <View style={styles.phoneInputContainer}>
        <PhoneInput
          initialCountry={"my"} // Malaysia default
          textProps={{ placeholder: "Enter Mobile Number" }}
          onChangePhoneNumber={(num) => setPhoneNumber(num)}
          style={styles.phoneInput}
        />
      </View> */}

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>

      {/* OR Divider */}
      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>Or</Text>
        <View style={styles.line} />
      </View>

      {/* Google Login */}
      <TouchableOpacity style={styles.googleButton}>
        {/* <Image source={require("../assets/google.png")} style={styles.googleIcon} /> */}
        <Text style={styles.googleText}>Continue with Google</Text>
      </TouchableOpacity>

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
    width: 100,
    height: 100,
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
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 10,
    paddingHorizontal: 10,
    width: "100%",
    marginBottom: 15,
  },
  phoneInput: {
    flex: 1,
    color: "#fff",
  },
  continueButton: {
    backgroundColor: "#A855F7",
    paddingVertical: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  continueText: {
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
    marginRight: 10,
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
});
