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
import {GOOGLE_PLACES_API_KEY} from "@env";
import { Alert } from 'react-native';


const AskLocalScreen = ({ navigation }) => {
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

  const similarQuestions = [
    {
      id: 1,
      title: "Vegetarian food options near Setapak after 10 PM",
      answer: [
        "Hi, my favourite to-go vegetarian food opens till 11pm. It’s called Mamakim...",
        "There is a vegetarian restaurant near Bukit Bintang and it closes at 10pm. It’s ...",
        "There is a vegetarian restaurant near Bukit Bintang and it closes at 10pm. It’s ...",
      ],
    },
    {
      id: 2,
      title: "Recommendation for pet-friendly vegetarian food in Kuala Lumpur area",
      answer: [
        "Hi, my favourite to-go vegetarian food opens till 11pm. It’s called Mamakim...",
        "There is a vegetarian restaurant near Bukit Bintang and it closes at 10pm. It’s ...",
      ],
    },
    {
      id: 3,
      title: "Late-night vegetarian-friendly restaurants in KL",
      answer: [
        "Hi, my favourite to-go vegetarian food opens till 11pm. It’s called Mamakim...",
        "There is a vegetarian restaurant near Bukit Bintang and it closes at 10pm. It’s ...",
      ],
    },
  ];

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

  const handleSubmit = async () => {
    const postData = {
        title,
        description
    };

    console.log('📤 Data Sent to Server:', postData); // ✅ Log data before sending

    try {
        const response = await fetch('http://10.0.2.2:3000/addPost', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
        });

        const data = await response.json();
        console.log('📩 Server Response:', data); // ✅ Log server response

        if (response.ok) {
            Alert.alert('Success', 'Post added successfully!');
            navigation.navigate('Explore');
        } else {
            Alert.alert('Error', data.error);
        }
    } catch (error) {
        console.error('❌ Network Error:', error); // ✅ Log network errors
        Alert.alert('Error', 'Failed to connect to the server.');
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

      {/* Similar Question Modal */}
      <Modal visible={showSimilarQuestions} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.questionContainer}>
              <View style={styles.centerIcon}>
                <Text style={styles.centerIconText}>Q</Text>
              </View>
              <Text style={styles.modalTitle}>Similar Questions found!</Text>
            </View>
            <ScrollView style={styles.listContainer}>
              {similarQuestions.map((item) => (
                <View key={item.id}>
                  <TouchableOpacity style={styles.questionItem} onPress={() => setSelectedQuestion(item)}>
                    <Text style={styles.questionText}>{item.title}</Text>
                  </TouchableOpacity>
                  {selectedQuestion?.id === item.id && selectedQuestion.answer && (
                    <View style={styles.answerContainer}>
                      <View style={styles.questionContainer}>
                        <View style={styles.centerIcon}>
                          <Text style={styles.centerIconText}>A</Text>
                        </View>
                        <Text style={styles.answerTitle}>{selectedQuestion.title}</Text>
                      </View>
                      {selectedQuestion.answer.map((ans, index) => (
                        <Text key={index} style={styles.answerText}>{ans}</Text>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.postButton} onPress={() => {
              setShowSimilarQuestions(false);
              setPriorityLevel(determinePriority());
              setShowPriorityModal(true);
            }}>
              <Text style={styles.postButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Priority Modal */}
      <Modal visible={showPriorityModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Priority detected: {priorityLevel}</Text>
            <Text style={styles.modalDescription}>Would you like to add a priority fee for faster response?</Text>
            <TouchableOpacity style={styles.priorityOption} onPress={() => navigation.navigate("Payment")}>
              <Text style={styles.priorityText}>Priority</Text>
              <Text style={styles.priorityFee}>RM 2.00</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.priorityOption} onPress={() => {
              setShowPriorityModal(false);
              setShowSuccessModal(true);
            }}>
              <Text style={styles.priorityText}>Regular</Text>
              <Text style={styles.priorityFee}>Free</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postButton} onPress={() => setShowPriorityModal(false)}>
              <Text style={styles.postButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Success Modal */}
      <Modal visible={showSuccessModal} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Posted Question Successfully!</Text>
            <TouchableOpacity style={styles.postButton} onPress={() => setShowSuccessModal(false)}>
              <Text style={styles.postButtonText}>OK</Text>
            </TouchableOpacity>
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
    padding: 20,
    borderRadius: 10,
    width: "90%",
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  questionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  centerIcon: {
    width: 45,
    height: 45,
    backgroundColor: "#A64DFF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  centerIconText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
  questionItem: {
    backgroundColor: "#1a1a1a",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#8A2BE2",
  },
  questionText: {
    color: "#fff",
    fontSize: 14,
  },
  answerContainer: {
    backgroundColor: "#4B0082",
    padding: 12,
    borderRadius: 10,
    marginTop: 5,
    borderWidth: 2,
    borderColor: "#8A2BE2",
    marginBottom: 10,
  },
  answerTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  answerText: {
    color: "white",
    fontSize: 14,
    marginBottom: 5,
    borderWidth: 2,
    borderColor: "#8A2BE2",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  modalDescription: {
    color: "#bbb",
    fontSize: 14,
    marginBottom: 10,
  },
  priorityOption: {
    padding: 12,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#A64DFF",
  },
  priorityText: {
    color: "white",
    fontSize: 16,
  },
  priorityFee: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  }, locationPrivacyContainer: {
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 10,
    width: "90%",
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderRadius: 10,
    padding: 10,
  },
  searchResults: {
    backgroundColor: "#2a2a2a",
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

});

export default AskLocalScreen;
