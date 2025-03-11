import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { WEB_CLIENT_ID, IOS_CLIENT_ID } from '@env';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID, // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
  scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  hostedDomain: '', // specifies a hosted domain restriction
  forceCodeForRefreshToken: false, // [Android] related to `serverAuthCode`, read the docs link below *.
  iosClientId: IOS_CLIENT_ID, // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
});

export default function LoginScreen({}) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigation = useNavigation();

  const handleContinue = () => {
    navigation.navigate('Recommendation');
  }

  return (
    <View style={styles.container}>
      
      {/* Logo */}
      <Image source={require("./assets/travelConnectLogo.png")} style={styles.logo} />

      {/* Title */}
      <Text style={styles.title}>
        <Text style={styles.purpleText}>Travel</Text>Connect
      </Text>
      <Text style={styles.subtitle}>With Locals</Text>

      {/* Description */}
      <Text style={styles.description}>Connect with locals, explore like never before.</Text>
      <Text>Sign in with Google</Text>
      <GoogleSigninButton
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
            />
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
      {/* Phone Number Input Section */}
      <View style={styles.phoneInputContainer}>
        <View style={styles.flagContainer}>
          <Image source={{ uri: "https://flagcdn.com/w40/my.png" }} style={styles.flagIcon} />
          <Text style={styles.countryCode}>+60</Text>
        </View>
        <TextInput
          style={styles.phoneInput}
          placeholder="Enter Mobile Number"
          placeholderTextColor="#bbb"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>

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
        <Image source={require("./assets/google.png")} style={styles.googleIcon} />
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
