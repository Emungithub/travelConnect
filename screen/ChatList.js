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
    { id: 1, name: "Eemun", message: "I would like to schedule a time for you to take...", time: "14:47" },
    { id: 2, name: "Eemun", message: "I would like to schedule a time for you to take...", time: "14:47" },
    { id: 3, name: "Eemun", message: "I would like to schedule a time for you to take...", time: "14:47" },
    { id: 4, name: "Eemun", message: "I would like to schedule a time for you to take...", time: "14:47" },
    { id: 5, name: "Eemun", message: "I would like to schedule a time for you to take...", time: "14:47" },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Travel Connect</Text>
        <TouchableOpacity>
          <Text style={styles.addPeople}>Add people</Text>
        </TouchableOpacity>
      </View>
      
      {/* Top Services */}
      <View style={styles.serviceContainer}>
        <TouchableOpacity style={styles.serviceButton}>
          <FontAwesome5 name="concierge-bell" size={20} color="white" />
          <Text style={styles.serviceText}>All Services</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.serviceButton}>
          <FontAwesome5 name="language" size={20} color="white" />
          <Text style={styles.serviceText}>Translate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.serviceButton}>
          <FontAwesome5 name="question-circle" size={20} color="white" />
          <Text style={styles.serviceText}>Ask Travel</Text>
        </TouchableOpacity>
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
          <View key={chat.id} style={styles.chatItem}>
            <View style={styles.chatLeft}>
              <View style={styles.profileContainer}>
                <Image source={require("../assets/explore/1.png")} style={styles.profileImage} />
                <Image source={require("../assets/flag/china.png")} style={styles.flagIcon} />
              </View>
              <View>
                <Text style={styles.chatName}>{chat.name}</Text>
                <Text style={styles.chatMessage}>{chat.message}</Text>
              </View>
            </View>
            <Text style={styles.chatTime}>{chat.time}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
export default ChatList;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  addPeople: {
    color: "#8A2BE2",
    fontSize: 14,
  },
  serviceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  serviceButton: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#8A2BE2",
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  serviceText: {
    color: "white",
    fontSize: 12,
    marginTop: 5,
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
    borderRadius: 10,
    marginBottom: 10,
  },
  chatLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileContainer: {
    position: "relative",
    marginRight: 10,
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
    bottom: 0,
    left: 0,
    borderRadius: 7.5,
  },
  chatName: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  chatMessage: {
    color: "#bbb",
    fontSize: 14,
  },
  chatTime: {
    color: "#bbb",
    fontSize: 12,
  },
});


