import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const AskLocalScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ask Local</Text>
      </View>

      <View style={{ flex: 1 }}>
        {/* Image Upload Section */}
        <View style={styles.imageUploadContainer}>
          <Image
            source={require("./assets/explore/1.png")} // Placeholder image
            style={styles.uploadedImage}
          />
          <TouchableOpacity style={styles.uploadButton}>
            <FontAwesome5 name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Title Input */}
        <TextInput
          style={styles.titleInput}
          placeholder="Add a title"
          placeholderTextColor="#bbb"
          value={title}
          onChangeText={setTitle}
        />

        {/* Description Input */}
        <TextInput
          style={styles.descriptionInput}
          placeholder="Add text"
          placeholderTextColor="#bbb"
          multiline
          value={description}
          onChangeText={setDescription}
        />

        {/* Interactive Options */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionText}># Topic</Text>
          </TouchableOpacity>
        </View>

        {/* Location & Privacy Settings */}
        <View style={styles.locationPrivacyContainer}>
          <TouchableOpacity style={styles.locationButton}>
            <FontAwesome5 name="map-marker-alt" size={16} color="#8A2BE2" />
            <Text style={styles.locationText}>Mark Locations</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.contentGptButton}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="magic" size={14} color="white" />
          </View>
          <Text style={styles.contentGptText}>Content GPT</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.postButton}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Center the content horizontally
    marginBottom: 10,
    paddingTop: 40,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    marginLeft: 10,
    fontWeight: "bold",
    flex: 1, // Allow the text to take up available space
    textAlign: "center", // Center the text within its container
  },
  uploadedImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  imageUploadContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  uploadButton: {
    width: 80,
    height: 80,
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
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
    borderRadius: 15, // Makes it a perfect circle
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6, // Spacing between icon and text
  },
  contentGptText: {
    color: "white",
    fontSize: 10,
    textAlign: "center", // Ensure text is centered
  },
  postButton: {
    backgroundColor: "#FF4444",
    paddingVertical: 12,
    paddingHorizontal: 130,
    borderRadius: 30,
  },
  postButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AskLocalScreen;