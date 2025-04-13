import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  FlatList
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useEffect } from "react";
import { GOOGLE_PLACES_API_KEY } from "@env";
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const AskLocalScreen = ({ navigation }) => {
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [showSimilarQuestions, setShowSimilarQuestions] = useState(false);
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [priorityLevel, setPriorityLevel] = useState("Low");
  const route = useRoute();
  const screenTitle = route.params?.title || "Ask Local";
  const screenButton = route.params?.button || "Ask";

  const openAiApiKey = process.env.OPENAI_API_KEY;



  // Simulated function to determine priority level
  const determinePriority = () => {
    if (title.length > 20 || description.length > 100) {
      return "High";
    } else if (title.length > 10 || description.length > 50) {
      return "Medium";
    } else {
      return "Low";
    }
  };

  // Function to pick an image
  const pickImage = async () => {
    if (images.length >= 9) {
      alert("You can only upload up to 9 images.");
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access the gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]); // Add selected image
    }
  };

  // Function to remove an image
  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  // Function to handle location selection
  const handleLocationSelect = (details) => {
    const { name, vicinity, geometry } = details;
    setSelectedLocation({
      name,
      address: vicinity,
      latitude: geometry.location.lat,
      longitude: geometry.location.lng,
    });
    setShowMapModal(false); // Close the modal after selection
  };

  useEffect(() => {
    fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=starbucks&key=${process.env.GOOGLE_PLACES_API_KEY}`)
      .then(response => response.json())
      .then(data => console.log('API Response:', data))
      .catch(error => console.error('Error:', error));
  }, []);

  //here fetch user id
  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem("userId");

      if (id) {
        setUserId(Number(id));  // ✅ Convert to number
        console.log("📦 Retrieved userId:", id);
      } else {
        console.warn("⚠️ No userId found in AsyncStorage!");
      }
    };
    getUserId();
  }, []);


  const highPriorityKeywords = [
    "urgent", "urgently", "immediately", "asap", "emergency", "critical", "now", "right now",
    "quick", "fast", "important", "serious", "danger", "help", "assistance", "hospital",
    "accident", "injury", "life-threatening", "dangerous", "emergency", "911"
  ];
  
  const mediumPriorityKeywords = [
    "soon", "need help", "assistance", "guidance", "tomorrow", "this week", "moderate", 
    "important", "concern", "worry", "issue", "problem", "trouble"
  ];
  
  const analyzePriorityLevel = async (title, description) => {
    // Combine title and description for keyword checking
    const combinedText = `${title} ${description}`.toLowerCase();
    
    // First check for high priority keywords
    for (const keyword of highPriorityKeywords) {
      if (combinedText.includes(keyword.toLowerCase())) {
        return "High";
      }
    }
    
    // Then check for medium priority keywords
    for (const keyword of mediumPriorityKeywords) {
      if (combinedText.includes(keyword.toLowerCase())) {
        return "Medium";
      }
    }
    
    // If no keywords found, use OpenAI analysis
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that analyzes questions and determines their priority level. Respond with only one word: 'Low', 'Medium', or 'High'."
            },
            {
              role: "user",
              content: `Analyze this question and determine its priority level (Low, Medium, or High):\n\nTitle: ${title}\n\nDescription: ${description}`
            }
          ],
          temperature: 0.3,
          max_tokens: 10,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        const priority = data.choices[0].message.content.trim();
        return priority;
      } else {
        console.error("API Error:", data);
        return "Medium"; // Default to Medium if API call fails
      }
    } catch (error) {
      console.error("Error analyzing priority:", error);
      return "Medium"; // Default to Medium if there's an error
    }
  };
  
  
  const handleSubmit = async () => {
    if (!title || !description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // For regular response (no payment)
    const savePost = async (isPriority = false) => {
      try {
        const response = await fetch('http://10.0.2.2:3000/addPost', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            description,
            user_id: userId,
            priority: isPriority
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setShowSuccessModal(true);
        } else {
          Alert.alert('Error', data.error || 'Failed to save post');
        }
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'Failed to connect to server');
      }
    };

    // Check priority level and show modal
    const priorityLevel = await analyzePriorityLevel(title, description);
    setPriorityLevel(priorityLevel);
    setShowPriorityModal(true);

    // Handle user's choice in the modal
    setPriorityOptionSelected((choice) => {
      if (choice === 'regular') {
        // Save as regular post (priority = false)
        savePost(false);
      } else if (choice === 'priority') {
        // Navigate to payment screen for priority post
        navigation.navigate('Payment', {
          questionData: {
            title,
            description,
            user_id: userId,
            priority: true
          }
        });
      }
    });
  };
  

/*
  const handleSubmit = async () => {
    const questionData = {
      user_id: userId,
      title,
      description
    };
  
    console.log('📤 Data Sent to Server:', questionData);

    try {
      const response = await fetch('http://10.0.2.2:3000/addQuestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionData)
      });
  
      const contentType = response.headers.get('content-type');
      let data;
  
      if (contentType && contentType.includes('application/json')) {
        data = await response.json(); // ✅ Parse once here
      } else {
        const text = await response.text(); // fallback
        console.warn('⚠️ Received non-JSON response:', text);
        data = { error: text }; // Optional: wrap fallback text as error
      }
  
      console.log('📩 Server Response:', data);
  
      if (response.ok) {
        Alert.alert('Success', 'Post added successfully!');
        navigation.navigate('Explore');
      } else {
        Alert.alert('Error', data.error || 'Unknown error occurred.');
      }
  
    } catch (error) {
      console.error('❌ Network Error:', error);
      Alert.alert('Error', 'Failed to connect to the server.');
    }
  };
  
*/

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return '#F44336'; // Red
      case 'Medium':
        return '#FF9800'; // Orange
      case 'Low':
        return '#4CAF50'; // Green
      default:
        return '#FF9800'; // Default to Orange
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{screenTitle}</Text>
      </View>


      <View style={{ flex: 1 }}>
        {screenTitle === "New Post" && (
          <FlatList
            data={[...images, "add_button"]}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            contentContainerStyle={{ paddingBottom: 0 }}
            style={{ flexGrow: 0 }}  // Prevent FlatList from stretching
            renderItem={({ item, index }) => (
              item === "add_button" ? (
                images.length < 9 && (
                  <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                    <FontAwesome5 name="plus" size={20} color="white" />
                  </TouchableOpacity>
                )
              ) : (
                <View style={styles.imageWrapper}>
                  <Image source={{ uri: item }} style={styles.uploadedImage} />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeImage(index)}
                  >
                    <FontAwesome5 name="times" size={14} color="white" />
                  </TouchableOpacity>
                </View>
              )
            )}
          />
        )}


        {/* Title Input (No Margin) */}
        <TextInput
          style={[styles.titleInput, { marginTop: 0 }]}  // No top margin
          placeholder="Add a title"
          placeholderTextColor="#bbb"
          value={title}
          onChangeText={setTitle}
        />

        {/* Description Input (No Margin) */}
        <TextInput
          style={[styles.descriptionInput, { marginTop: 0 }]}  // No top margin
          placeholder="Add text"
          placeholderTextColor="#bbb"
          multiline
          value={description}
          onChangeText={setDescription}
        />


        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionText}># Topic</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.locationPrivacyContainer}>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={() => setShowMapModal(true)}
          >
            <FontAwesome5 name="map-marker-alt" size={16} color="#8A2BE2" />
            <Text style={styles.locationText}>Mark Locations</Text>
          </TouchableOpacity>

          {selectedLocation && (
            <Text style={styles.locationText}>
              Selected Location: {selectedLocation.name}, {selectedLocation.address}
            </Text>
          )}
        </View>

        {/* Modal for Location Search */}
        <Modal
          visible={showMapModal}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Search Location</Text>

              <GooglePlacesAutocomplete
                placeholder="Search Starbucks"
                fetchDetails={true}
                onPress={(data, details = null) => handleLocationSelect(details)}
                query={{
                  key: process.env.GOOGLE_PLACES_API_KEY,
                  language: 'en',
                  radius: 5000,
                  location: '3.1905,101.7133',
                }}
                keyboardShouldPersistTaps="handled"
                styles={{
                  textInput: styles.searchInput,
                  listView: styles.searchResults,
                }}
              />


              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setShowMapModal(false)}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
              <GooglePlacesAutocomplete
                placeholder="Search nearby locations..."
                fetchDetails={true}
                onPress={(data, details = null) => handleLocationSelect(details)}
                query={{
                  key: GOOGLE_PLACES_API_KEY,
                  language: 'en',
                  radius: 5000,
                  location: '3.1905,101.7133',
                }}
                keyboardShouldPersistTaps="handled"
                styles={{
                  textInput: styles.searchInput,
                  listView: styles.searchResults,
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>

      </View>

      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.contentGptButton}
          onPress={() => navigation.navigate('ContentGPT')}
        >
          <View style={styles.iconContainer}>
            <FontAwesome5 name="magic" size={14} color="white" />
          </View>
          <Text style={styles.contentGptText}>Content GPT</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.postButton} onPress={() => setShowSimilarQuestions(true)}></TouchableOpacity> */}
        <TouchableOpacity style={styles.postButton} onPress={handleSubmit}>
          <Text style={styles.postButtonText}>{screenButton}</Text>
        </TouchableOpacity>
      </View>

      {/* Priority Modal */}
      <Modal visible={showPriorityModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { borderColor: getPriorityColor(priorityLevel) }]}>
            <View style={[styles.priorityHeader, { backgroundColor: getPriorityColor(priorityLevel) }]}>
              <Text style={styles.modalTitle}>{priorityLevel} Priority</Text>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalDescription}>Would you like to add a priority fee for faster response?</Text>
              <View style={styles.optionsContainer}>
                <TouchableOpacity 
                  style={[styles.priorityOption, { marginBottom: 15 }]} 
                  onPress={() => {
                    setShowPriorityModal(false);
                    navigation.navigate("Payment", { 
                      questionData: {
                        user_id: userId,
                        title,
                        description,
                        priority: true // Set priority to true when user chooses to pay
                      }
                    });
                  }}
                >
                  <View style={styles.optionContent}>
                    <Text style={styles.priorityText}>Priority Response</Text>
                    <Text style={styles.priorityFee}>RM 2.00</Text>
                  </View>
                  <Text style={styles.optionSubtext}>Get faster responses from locals</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.priorityOption}
                  onPress={async () => {
                    setShowPriorityModal(false);
                    const questionData = {
                      user_id: userId,
                      title,
                      description,
                      priority: false // Set priority to false for regular response
                    };

                    try {
                      const response = await fetch('http://10.0.2.2:3000/addQuestion', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(questionData),
                      });

                      const data = await response.json();
                      console.log('📩 Server Response:', data);

                      if (response.ok) {
                        setShowSuccessModal(true);
                      } else {
                        Alert.alert('Error', data.error || 'Unknown error occurred.');
                      }
                    } catch (err) {
                      console.error('❌ Network Error:', err);
                      Alert.alert('Error', 'Failed to connect to the server.');
                    }
                  }}
                >
                  <View style={styles.optionContent}>
                    <Text style={styles.priorityText}>Regular Response</Text>
                    <Text style={styles.priorityFee}>Free</Text>
                  </View>
                  <Text style={styles.optionSubtext}>Standard response time</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {/* Success Modal */}
      <Modal visible={showSuccessModal} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { borderColor: '#4CAF50' }]}>
            <View style={[styles.priorityHeader, { backgroundColor: '#4CAF50' }]}>
              <Text style={styles.modalTitle}>Success!</Text>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.successIconContainer}>
                <FontAwesome5 name="check-circle" size={60} color="#4CAF50" />
              </View>
              <Text style={styles.modalDescription}>Your question has been posted successfully!</Text>
              <TouchableOpacity 
                style={[styles.postButton, { marginTop: 20 }]} 
                onPress={() => {
                  setShowSuccessModal(false);
                  navigation.navigate('Explore');
                }}
              >
                <Text style={styles.postButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    paddingTop: 40,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    marginLeft: 10,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  imageWrapper: {
    position: "relative",
    marginRight: 10,
  },
  uploadedImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  removeButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadButton: {
    width: 80,
    height: 80,
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  imageUploadContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,     // Maintain clean spacing
    marginTop: 10,        // Adds minimal space from FlatList
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    paddingBottom: 5,
  },
  descriptionInput: {
    fontSize: 14,
    color: "#bbb",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    paddingBottom: 5,
  },
  uploadButton: {
    width: 80,
    height: 80,
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 5,      // Reduces spacing at top for cleaner look
  },

  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  optionButton: {
    backgroundColor: "#1a1a1a",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  optionText: {
    color: "#8A2BE2",
    fontSize: 14,
  },
  locationPrivacyContainer: {
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 10,
    marginTop: 10,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  locationText: {
    color: "#8A2BE2",
    fontSize: 14,
    marginLeft: 5,
  },
  bottomActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  contentGptButton: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  iconContainer: {
    width: 30,
    height: 30,
    backgroundColor: "#1a1a1a",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  contentGptText: {
    color: "white",
    fontSize: 10,
    textAlign: "center",
  },
  postButton: {
    backgroundColor: "#A64DFF",
    paddingVertical: 12,
    paddingHorizontal: 130,
    borderRadius: 30,
  },
  postButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  }, modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "#222",
    padding: 0,
    borderRadius: 10,
    width: "90%",
    borderWidth: 2,
  },
  priorityHeader: {
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalBody: {
    padding: 20,
  },
  modalTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalDescription: {
    color: "#bbb",
    fontSize: 16,
    marginBottom: 25,
    textAlign: "center",
    lineHeight: 22,
  },
  priorityOption: {
    backgroundColor: "#1a1a1a",
    padding: 15,
    borderRadius: 10,
    width: "100%",
  },
  optionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  priorityText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  priorityFee: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  optionSubtext: {
    color: "#888",
    fontSize: 14,
    marginTop: 5,
  },
  searchInput: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderRadius: 10,
    padding: 10,
  },
  doneButton: {
    backgroundColor: "#A855F7",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  successIconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalDescription: {
    color: "#bbb",
    fontSize: 16,
    marginBottom: 25,
    textAlign: "center",
    lineHeight: 22,
  },

});

export default AskLocalScreen;
