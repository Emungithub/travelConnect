import React, { useState, useEffect } from "react";
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
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { GOOGLE_PLACES_API_KEY } from "@env";
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const AskLocalScreen = ({ navigation, route }) => {
  // Add this at the top of the component, before any hooks
  console.log("AskLocalScreen rendered with route params:", route.params);

  // All state hooks at the top level
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState(route.params?.title || "");
  const [description, setDescription] = useState(route.params?.description || "");
  const [images, setImages] = useState([]);
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [priorityLevel, setPriorityLevel] = useState("Medium");
  const [buttonText, setButtonText] = useState(route.params?.button || "Ask");


  const openAiApiKey = process.env.OPENAI_API_KEY;

  // All effect hooks together
  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem("userId");
      if (id) {
        setUserId(Number(id));
        console.log("📦 Retrieved userId:", id);
      } else {
        console.warn("⚠️ No userId found in AsyncStorage!");
      }
    };
    getUserId();
  }, []);

  useEffect(() => {
    fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=starbucks&key=${process.env.GOOGLE_PLACES_API_KEY}`)
      .then(response => response.json())
      .then(data => console.log('API Response:', data))
      .catch(error => console.error('Error:', error));
  }, []);

  useEffect(() => {
    console.log("Route params changed:", route.params);
    if (route.params?.title) {
      console.log("Setting title:", route.params.title);
      setTitle(route.params.title);
    }
    if (route.params?.description) {
      console.log("Setting description:", route.params.description);
      setDescription(route.params.description);
    }
    if (route.params?.button) {
      console.log("Setting button text:", route.params.button);
      setButtonText(route.params.button);
    }
  }, [route.params]);

  // Priority keywords for different levels
  const highPriorityKeywords = [
    "urgent", "urgently", "immediately", "emergency", "critical", "now", "right now", 
    "quick", "fast", "important", "serious", "danger", "help", "assistance", "hospital",
    "accident", "injury", "life-threatening", "dangerous", "emergency", "911"
  ];
  
  const mediumPriorityKeywords = [
    "soon", "need help", "assistance", "guidance", "tomorrow", "this week", "moderate", 
     "concern", "worry", "issue", "problem", "trouble"
  ];
  
  const analyzePriorityLevel = async (title, description) => {
    // Combine title and description for analysis
    const combinedText = `${title} ${description}`.toLowerCase();
    
    try {
      console.log("Sending to OpenAI for analysis:", combinedText);
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
              content: `You are a priority analyzer for a travel and local recommendation app. Your task is to categorize questions into High, Medium, or Low priority based on their urgency and timing. Be very strict with these categories:

High Priority (Respond with "High"):
- Contains words indicating immediate need: "now", "asap", "right now", "real quick", "urgent", "immediately"
- Current location-based requests needing quick response
- Time-sensitive requests for the same day
- Emergency or urgent situations
Example questions that should be High:
- "I need some recommendation for chinese food in setapak area real quick"
- "Looking for a cafe that's open right now in KL"
- "Need urgent help finding halal food nearby"
- "Where can I find a restaurant that's open now?"

Medium Priority (Respond with "Medium"):
- Future plans with specific dates/timeframes
- Questions about upcoming trips
- Preparation-related queries with clear timing
- Contains timing words like: "next week", "tomorrow", "coming days", "planning to"
Example questions that should be Medium:
- "What to do in Malaysia, I'm going there next week"
- "Planning my trip to KL next month, need recommendations"
- "Looking for hotels in Penang for next weekend"
- "Need suggestions for my upcoming trip to Malaysia"

Low Priority (Respond with "Low"):
- General inquiries without time constraints
- No urgency indicated in the request
- Contains phrases like: "no rush", "when convenient", "sometime"
- General recommendations without timeframe
Example questions that should be Low:
- "Recommend me some nice places to travel around, no rush in replying"
- "What are some good restaurants in KL?"
- "Looking for interesting places to visit in Malaysia"
- "Share some travel tips for Malaysia"

Analyze the input and respond with ONLY ONE WORD: "High", "Medium", or "Low".
If there's any mention of immediate need or current location, prioritize that over other factors.`
            },
            {
              role: "user",
              content: `Analyze this question's priority level:\n\nTitle: ${title}\n\nDescription: ${description}`
            }
          ],
          temperature: 0.1, // Lower temperature for more consistent results
          max_tokens: 10,
        }),
      });

      const data = await response.json();
      console.log("OpenAI Raw Response:", data);

      if (response.ok) {
        const priority = data.choices[0].message.content.trim();
        console.log("Determined Priority Level:", priority);
        
        // Validate the response is one of the expected values
        if (!["High", "Medium", "Low"].includes(priority)) {
          console.log("Invalid priority returned, defaulting to Medium");
          return "Medium";
        }
        
        return priority;
      } else {
        console.error("OpenAI API Error:", data);
        return "Medium";
      }
    } catch (error) {
      console.error("Error in priority analysis:", error);
      return "Medium";
    }
  };
  
  
  const handleSubmit = async () => {
    if (!title || !description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
      
      if (!storedUserId || !token) {
        Alert.alert('Error', 'Please login to post');
        return;
      }

      if (route.params?.bigTit === "New Post") {
        // No need to filter images as they're already stored as URIs
        const postData = {
          title,
          description,
          images: images, // Direct array of URIs
          user_id: Number(storedUserId)
        };

        console.log("Sending explore post data:", postData);

        try {
          const response = await fetch('http://192.168.35.47:3000/addExplorePost', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(postData)
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();
          console.log("Explore Post Response:", data);

          setShowSuccessModal(true);
          setTitle('');
          setDescription('');
          setImages([]);
        } catch (fetchError) {
          console.error('Fetch error 1:', fetchError);
          console.log("Fetch error 2:", fetchError.message);
          console.log("Fetch error 3:", fetchError.status);
          Alert.alert('Error', 'Network error. Please check your connection.');
        }
      } else {
        // Handle Ask button - analyze priority and show modal
        const analyzedPriority = await analyzePriorityLevel(title, description);
        setPriorityLevel(analyzedPriority);
        setShowPriorityModal(true);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      Alert.alert('Error', 'Failed to connect to server');
    }
  };

  // Add this function to handle the priority option selection
  const handlePriorityOptionSelect = async (isPriorityResponse) => {
    try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (!storedUserId) {
            Alert.alert('Error', 'Please login to post');
            return;
        }

        if (isPriorityResponse) {
            // If user chooses priority response, navigate to payment
            navigation.navigate("Payment", { 
                questionData: {
                    user_id: Number(storedUserId),
                    title,
                    description,
                    priority: priorityLevel
                }
            });
            setShowPriorityModal(false);
        } else {
            // For regular response, save with analyzed priority level
            const questionData = {
                title,
                description,
                user_id: Number(storedUserId),
                priority: priorityLevel
            };

            console.log("Sending regular question data with priority:", questionData);

            const response = await fetch('http://192.168.35.47:3000/addPost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(questionData)
            });

            const data = await response.json();
            console.log("Server Response:", data);

            if (response.ok) {
                setShowPriorityModal(false);
                setShowSuccessModal(true);
                // Clear the form
                setTitle('');
                setDescription('');
                setImages([]);
                setPriorityLevel('Medium');
            } else {
                Alert.alert('Error', data.error || 'Failed to save question');
            }
        }
    } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'Failed to connect to server');
    }
  };

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

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please grant camera roll permissions to upload images');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (!result.canceled) {
        const newImageUri = result.assets[0].uri;
        console.log("Selected image URI:", newImageUri);
        setImages(prevImages => [...prevImages, newImageUri]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{route.params?.bigTit || "Ask Local"}</Text>
      </View>

      <ScrollView 
        style={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {route.params?.bigTit === "New Post" && (
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

        {/* Title Input */}
        <TextInput
          style={[styles.titleInput, { marginTop: 0 }]}
          placeholder="Add a title"
          placeholderTextColor="#bbb"
          value={title}
          onChangeText={setTitle}
          editable={true}
          autoCapitalize="sentences"
          textAlign="left"
        />

        {/* Description Input */}
        <TextInput
          style={[styles.descriptionInput, { marginTop: 0, height: 300 }]}
          placeholder="Add text"
          placeholderTextColor="#bbb"
          multiline
          value={description}
          onChangeText={setDescription}
          editable={true}
          textAlignVertical="top"
          textAlign="left"
          scrollEnabled={true}
          autoCapitalize="sentences"
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
      </ScrollView>

      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.contentGptButton}
          onPress={() => {
            if (route.params?.bigTit === "New Post") {
              navigation.navigate('ContentGPT', { 
                title: title,
                description: description,
                isNewPost: true
              });
            } else {
              navigation.navigate('ContentGPT');
            }
          }}
        >
          <View style={styles.iconContainer}>
            <FontAwesome5 name="magic" size={14} color="white" />
          </View>
          <Text style={styles.contentGptText}>Content GPT</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.postButton} onPress={handleSubmit}>
          <Text style={styles.postButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>

      {/* Priority Modal */}
      <Modal visible={showPriorityModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { borderColor: getPriorityColor(priorityLevel) }]}>
            <View style={[styles.priorityHeader, { backgroundColor: getPriorityColor(priorityLevel) }]}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowPriorityModal(false)}
              >
                <FontAwesome5 name="times" size={20} color="white" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{priorityLevel} Priority</Text>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalDescription}>
                This question has been analyzed as {priorityLevel} priority.{'\n'}
                Would you like to add a priority fee for faster response?
              </Text>
              <View style={styles.optionsContainer}>
                <TouchableOpacity 
                  style={[styles.priorityOption, { marginBottom: 15 }]} 
                  onPress={() => handlePriorityOptionSelect(true)}
                >
                  <View style={styles.optionContent}>
                    <Text style={styles.priorityText}>Priority Response</Text>
                    <Text style={styles.priorityFee}>RM 2.00</Text>
                  </View>
                  <Text style={styles.optionSubtext}>Get faster responses from locals</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.priorityOption}
                  onPress={() => handlePriorityOptionSelect(false)}
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContent}>
            <FontAwesome5 name="check-circle" size={50} color="#8A2BE2" />
            <Text style={styles.successModalTitle}>Success!</Text>
            <Text style={styles.successModalText}>Your question has been posted successfully.</Text>
            <TouchableOpacity 
              style={styles.successModalButton}
              onPress={() => {
                setShowSuccessModal(false);
                navigation.goBack();
              }}
            >
              <Text style={styles.successModalButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
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
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    paddingBottom: 5,
    paddingHorizontal: 10,
    minHeight: 40,
  },
  descriptionInput: {
    fontSize: 14,
    color: "white",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    paddingBottom: 5,
    paddingHorizontal: 10,
    minHeight: 200,
    textAlignVertical: "top",
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
    paddingHorizontal: 30,
    borderRadius: 30,
    flex: 1,
    marginLeft: 10,
  },
  postButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  }, 
  modalContainer: {
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
    position: 'relative',  // Added for absolute positioning of close button
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
  successModalButton: {
    backgroundColor: '#8A2BE2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    width: '100%'
  },
  successModalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  successModalContent: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  successModalTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  successModalText: {
    color: '#bbb',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default AskLocalScreen;
