import React, { useState, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
} from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { OPENAI_API_KEY } from '@env';  // Ensure your .env file is properly configured

const ContentGPT = ({ navigation }) => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const flatListRef = useRef(null);

    const handleSend = async () => {
        if (inputText.trim().length === 0) return;

        const newMessage = { id: Date.now().toString(), text: inputText, sender: "user" };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setInputText("");

        flatListRef.current.scrollToEnd({ animated: true });

        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "gpt-4-0125-preview",
                    messages: [{ role: "user", content: inputText }],
                    max_tokens: 100,
                }),
                keepalive: true, // Prevents Expo from closing the connection early
            });

            const data = await response.json();

            if (response.ok) {
                const botMessage = {
                    id: Date.now().toString(),
                    text: data.choices[0].message.content,
                    sender: "bot"
                };
                setMessages((prevMessages) => [...prevMessages, botMessage]);
                flatListRef.current.scrollToEnd({ animated: true });
            } else {
                console.error("API Error:", data);
                alert(`Error: ${data.error.message}`);
            }

        } catch (error) {
            console.error("Network Error:", error);
            alert("Network error. Please check your connection.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <FontAwesome5 name="arrow-left" size={20} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>ContentGPT</Text>
                <View style={{ width: 20 }} />
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.messageBubble, item.sender === "user" ? styles.userMessage : styles.botMessage]}>
                        <Text style={styles.messageText}>{item.text}</Text>
                    </View>
                )}
                contentContainerStyle={styles.messagesContainer}
            />

            <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.plusButton}>
                    <Ionicons name="add-outline" size={24} color="white" />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder="Message ContentGPT"
                    placeholderTextColor="#888"
                    value={inputText}
                    onChangeText={setInputText}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Ionicons name="send" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

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
        paddingTop: 40,
    },
    headerTitle: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        flex: 1,
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
    sendButton: {
        padding: 8,
    },
});

export default ContentGPT;
