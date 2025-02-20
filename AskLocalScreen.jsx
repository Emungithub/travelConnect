import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const AskLocalScreen = () => {
  return (
    <View style={styles.askLocalContainer}>
      <Text style={styles.header}>Ask Local</Text>
      
      {/* Image Upload Section */}
      <View style={styles.imageUploadContainer}>
        <Image source={require("./assets/interest/stay.png")} style={styles.uploadedImage} />
        <TouchableOpacity style={styles.uploadButton}>
          <FontAwesome5 name="plus" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Question Input */}
      <Text style={styles.questionTitle}>Where can I find vegetarian food near Setapak at midnight?</Text>
      <Text style={styles.questionDetails}>
        Someone please help, I’m craving to eat some local food now. Any locals can recommend me some good food nearby that opens till 2am? Really appreciate your help.
      </Text>

      {/* Tags */}
      <View style={styles.tagsContainer}>
        <Text style={styles.tag}>#Food</Text>
        <Text style={styles.tag}>#Topic</Text>
      </View>

      {/* Popular Tags */}
      <View style={styles.popularTags}>
        <Text style={styles.tag}>#vegetarian - 600 search</Text>
        <Text style={styles.tag}>#vegetarian food - 200 search</Text>
        <Text style={styles.tag}>#unique restaurant - 100 search</Text>
        <Text style={styles.tag}>#local choice - 90 search</Text>
      </View>

      {/* Post Button */}
      <TouchableOpacity style={styles.postButton}>
        <Text style={styles.postButtonText}>Post</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  askLocalContainer: {
    flex: 1,
    backgroundColor: "#000",
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
  },
  imageUploadContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  uploadButton: {
    width: 40,
    height: 40,
    backgroundColor: "#8A2BE2",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  questionDetails: {
    fontSize: 14,
    color: "#bbb",
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  tag: {
    color: "#8A2BE2",
    backgroundColor: "#1a1a1a",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginRight: 8,
  },
  popularTags: {
    marginBottom: 16,
  },
  postButton: {
    backgroundColor: "#8A2BE2",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  postButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AskLocalScreen;
