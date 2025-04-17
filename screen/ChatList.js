import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Image,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ChatList = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");

  const chatData = [
    { 
      id: 1, 
      name: "Eemun", 
      message: "I would like to schedule a time for you to take...", 
      time: "14:47",
      profileImage: require("../assets/explore/1.png"),
      flag: "china",
      location: "Kuala Lumpur, Malaysia",
      bio: "I am Ee Mun from Malaysia, I would like to make friends and share the insights of Malaysia...",
      tags: ["Cancer", "Blood O", "INFJ", "Japan", "Software Engineer", "Malaysia", "Secret"],
    },
    { 
      id: 2, 
      name: "John Doe", 
      message: "Hey there! Looking forward to meeting up...", 
      time: "13:20",
      profileImage: require("../assets/explore/1.png"),
      flag: "korea",
      location: "Penang, Malaysia",
      bio: "Hey there! I'm John. I love meeting new people and exploring different cultures.",
      tags: ["Leo", "A+", "ENTP", "Gaming", "Digital Nomad", "Adventure"],
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat</Text>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Local by Name"
          placeholderTextColor="#bbb"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {/* Chat List */}
      <ScrollView>
        {chatData.map((chat) => (
          <TouchableOpacity 
            key={chat.id} 
            style={styles.chatItem}
            onPress={() => navigation.navigate("DetailsPage", { 
              user: {
                name: chat.name,
                profileImage: chat.profileImage,
                location: chat.location,
                bio: chat.bio,
                tags: chat.tags
              }
            })}
          >
            <View style={styles.chatLeft}>
              <View style={styles.profileContainer}>
                <Image source={chat.profileImage} style={styles.profileImage} />
                <Image 
                  source={
                    chat.flag === "china" 
                      ? require("../assets/flag/china.png")
                      : require("../assets/flag/korea.png")
                  } 
                  style={styles.flagIcon} 
                />
              </View>
              <View>
                <Text style={styles.chatName}>{chat.name}</Text>
                <Text style={styles.chatMessage} numberOfLines={1} ellipsizeMode="tail">
                  {chat.message}
                </Text>
              </View>
            </View>
            <Text style={styles.chatTime}>{chat.time}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add New Chat Button */}
      <TouchableOpacity 
        style={styles.newChatButton}
        onPress={() => navigation.navigate("Connect")}
      >
        <FontAwesome5 name="plus" size={20} color="white" />
      </TouchableOpacity>
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
    marginBottom: 20,
    paddingTop: 40,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  searchContainer: {
    backgroundColor: "#333",
    padding: 8,
    borderRadius: 10,
    marginBottom: 10,
  },
  searchInput: {
    color: "white",
    fontSize: 14,
  },
  chatItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 12,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  chatLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileContainer: {
    position: "relative",
    marginRight: 12,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  flagIcon: {
    width: 15,
    height: 15,
    position: "absolute",
    bottom: -2,
    left: -2,
    borderRadius: 7.5,
  },
  chatName: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },
  chatMessage: {
    color: "#bbb",
    fontSize: 13,
    maxWidth: '85%',
  },
  chatTime: {
    color: "#bbb",
    fontSize: 12,
    marginLeft: 8,
  },
  newChatButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#8A2BE2",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default ChatList;


