import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { OPENAI_API_KEY } from '@env';  // Ensure your .env file is properly configured

const ContentGPT = ({ navigation }) => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [applyQueue, setApplyQueue] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const flatListRef = useRef(null);

    // Process the queue
    useEffect(() => {
        const processQueue = async () => {
            if (applyQueue.length > 0 && !isProcessing) {
                setIsProcessing(true);
                const { title: queuedTitle, description: queuedDescription } = applyQueue[0];
                
                // Update the state variables
                setTitle(queuedTitle);
                setDescription(queuedDescription);
                
                // Create a new message with the extracted content
                const newMessage = {
                    id: Date.now().toString(),
                    text: `Title: ${queuedTitle}\n\nDescription: ${queuedDescription}`,
                    sender: "user"
                };
                
                // Add the new message to the chat
                setMessages(prevMessages => [...prevMessages, newMessage]);
                flatListRef.current.scrollToEnd({ animated: true });
                
                // Remove the processed item from the queue
                setApplyQueue(prevQueue => prevQueue.slice(1));
                setIsProcessing(false);
            }
        };

        processQueue();
    }, [applyQueue, isProcessing]);

    const handleSend = async () => {
        if (inputText.trim().length === 0) return;

        const newMessage = { id: Date.now().toString(), text: inputText, sender: "user" };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setInputText("");

        flatListRef.current.scrollToEnd({ animated: true });

        try {
            // Check if this is a follow-up response
            const lastBotMessage = messages[messages.length - 1]?.sender === "bot" ? messages[messages.length - 1].text : null;
            const isFollowUp = lastBotMessage && lastBotMessage.includes("Please provide more details");

            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: `You are a specialized content creator for travel and local experiences. Your task is to create detailed, engaging content about specific places and experiences.

When a user asks about a general topic (e.g., "best nasi lemak in PJ"), first ask for the specific place they want to write about. For example:
"Please provide more details about the specific place you want to write about. For example, the restaurant name and location."

Once they provide a specific place (e.g., "Village Park Restaurant – Damansara Uptown"), create a detailed, engaging post with this structure:

Title: [Catchy, specific title about the place]

Description: [Detailed description with these sections]

🌟 HIGHLIGHTS
• [Main highlight 1] ✨
• [Main highlight 2] ✨
• [Main highlight 3] ✨

🍽️ FOOD & DRINKS
• [Signature dish 1] 🍜
• [Signature dish 2] 🍛
• [Must-try items] 🍢

💫 AMBIENCE & VIBE
• [Atmosphere description] 🎯
• [Interior details] 🎯
• [Special features] 🎯

📍 LOCATION & DETAILS
• Address: [Full address] 📍
• Operating Hours: [Hours] 🕒
• Price Range: [Price info] 💰
• Contact: [Phone/Website] 📞

💡 TIPS & RECOMMENDATIONS
• [Best time to visit] 💫
• [What to order] 💫
• [Special tips] 💫

📸 PHOTO OPPORTUNITIES
• [Photo spots] 📷
• [Instagrammable areas] 📷

🎉 SPECIAL FEATURES
• [Unique aspects] 🎪
• [Awards/Recognition] 🎪

Use appropriate emojis throughout the text to make it more engaging and visually appealing. Keep the title concise and engaging. The description should be informative, helpful, and visually structured with emojis.`
                        },
                        {
                            role: "user",
                            content: isFollowUp ? 
                                `Specific place: ${inputText}` : 
                                `Generate content about: ${inputText}`
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 800,
                }),
                keepalive: true,
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

    const handleApply = (message) => {
        console.log("Apply button clicked with message:", message);
        
        // Extract title and description from the message
        const titleMatch = message.match(/Title: (.*?)(?:\n|$)/);
        const descriptionMatch = message.match(/Description: ([\s\S]*?)(?:\n\n|$)/);
        
        console.log("Title match:", titleMatch);
        console.log("Description match:", descriptionMatch);
        
        if (titleMatch && descriptionMatch) {
            const extractedTitle = titleMatch[1].trim();
            const extractedDescription = descriptionMatch[1].trim();
            
            console.log("Extracted title:", extractedTitle);
            console.log("Extracted description:", extractedDescription);
            
            try {
                // Navigate to AskLocalScreen with the extracted data for New Post
                navigation.navigate('AskLocal', {
                    title: extractedTitle,
                    description: extractedDescription,
                    button: "Post",
                    bigTit: "New Post"  // Changed from bigTitle to bigTit
                });
                console.log("Navigation successful");
            } catch (error) {
                console.error("Navigation error:", error);
            }
        } else {
            console.log("Failed to extract title or description");
            // Fallback: Try to find title and description by splitting the message
            const lines = message.split('\n');
            let fallbackTitle = '';
            let fallbackDescription = '';
            let foundDescription = false;
            
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].startsWith('Title:')) {
                    fallbackTitle = lines[i].replace('Title:', '').trim();
                } else if (lines[i].startsWith('Description:')) {
                    fallbackDescription = lines[i].replace('Description:', '').trim();
                    foundDescription = true;
                } else if (foundDescription) {
                    // Add all remaining lines to description
                    fallbackDescription += '\n' + lines[i].trim();
                }
            }
            
            if (fallbackTitle && fallbackDescription) {
                console.log("Using fallback extraction:");
                console.log("Fallback title:", fallbackTitle);
                console.log("Fallback description:", fallbackDescription);
                
                try {
                    navigation.navigate('AskLocal', {
                        title: fallbackTitle,
                        description: fallbackDescription,
                        button: "Post",
                        bigTit: "New Post"  // Changed from bigTitle to bigTit
                    });
                    console.log("Navigation successful with fallback");
                } catch (error) {
                    console.error("Navigation error with fallback:", error);
                }
            } else {
                console.log("Fallback extraction also failed");
            }
        }
    };

    const renderMessage = ({ item }) => {
        if (item.sender === "user") {
            return (
                <View style={[styles.messageBubble, styles.userMessage]}>
                    <Text style={styles.messageText}>{item.text}</Text>
                </View>
            );
        } else {
            return (
                <View style={[styles.messageBubble, styles.botMessage]}>
                    <Text style={styles.messageText}>{item.text}</Text>
                    <TouchableOpacity 
                        style={styles.applyButton}
                        onPress={() => handleApply(item.text)}
                    >
                        <Text style={styles.applyButtonText}>Apply</Text>
                    </TouchableOpacity>
                </View>
            );
        }
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
                <Text style={styles.headerTitle}>ContentGPT</Text>
                <View style={{ width: 20 }} />
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderMessage}
                contentContainerStyle={styles.messagesContainer}
                keyboardShouldPersistTaps="handled"
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Message ContentGPT"
                    placeholderTextColor="#888"
                    value={inputText}
                    onChangeText={setInputText}
                    multiline={false}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Ionicons name="send" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
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
        paddingBottom: 20, // Add extra padding at bottom for keyboard
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
        backgroundColor: "#000", // Ensure background color matches
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
    applyButton: {
        backgroundColor: "#8A2BE2",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginTop: 10,
        alignSelf: "flex-start",
    },
    applyButtonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
    },
});

export default ContentGPT;
