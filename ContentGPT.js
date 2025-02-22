import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

const ContentGPT = () => {
  const [messages, setMessages] = useState([
    { id: "1", text: "Hello! How can I help you today?", sender: "bot" },
  ]);
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (inputText.trim().length === 0) return;
    const newMessage = { id: Date.now().toString(), text: inputText, sender: "user" };
    setMessages([...messages, newMessage]);
    setInputText("");
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity>
          <FontAwesome5 name="bars" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ChatGPT</Text>
        <TouchableOpacity>
          <FontAwesome5 name="redo" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Chat Messages Section */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.sender === "user" ? styles.userMessage : styles.botMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
        inverted
      />

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.plusButton}>
          <Ionicons name="add-outline" size={24} color="white" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Message ChatGPT"
          placeholderTextColor="#888"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.micButton}>
          <Ionicons name="mic-outline" size={24} color="white" />
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  messagesContainer: {
    flexGrow: 1,
    padding: 15,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
    marginBottom: 8,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#2d2d2d",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#1a1a1a",
  },
  messageText: {
    color: "white",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  input: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    color: "white",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 10,
  },
  plusButton: {
    padding: 8,
  },
  micButton: {
    padding: 8,
  },
}); 

export default ContentGPT;
