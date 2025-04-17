import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { chatId, userName, profileImage, flag } = route.params;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [userId, setUserId] = useState(null);
    const flatListRef = useRef();

    useEffect(() => {
        // Load user ID from AsyncStorage
        const loadUserId = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('user_id');
                if (storedUserId) {
                    setUserId(storedUserId);
                }
            } catch (error) {
                console.error('Error loading user ID:', error);
            }
        };

        loadUserId();
        // Load chat history here
        // For now, we'll use dummy data
        setMessages([
            {
                id: '1',
                text: 'Hi, I am Ella. Can you speak English? What cultural customs should visitors be aware of when visiting Kuala Lumpur?',
                senderId: 'user123',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
            },
            {
                id: '2',
                text: 'Hi, I am Eemun. Yes, I can communicate in English.',
                senderId: chatId,
                timestamp: new Date(Date.now() - 3500000).toISOString(),
            },
            {
                id: '3',
                text: 'I live in Setapak for 21 years. I would like to say that our culture here is very diverse and we are very understanding people...',
                senderId: chatId,
                timestamp: new Date(Date.now() - 3400000).toISOString(),
            },
        ]);
    }, [chatId]);

    const handleSend = async () => {
        if (!newMessage.trim()) return;

        const message = {
            id: Date.now().toString(),
            text: newMessage.trim(),
            senderId: userId,
            timestamp: new Date().toISOString(),
        };

        setMessages(prevMessages => [...prevMessages, message]);
        setNewMessage('');

        // Here you would typically send the message to your backend
        try {
            // const response = await fetch('YOUR_API_ENDPOINT/messages', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
            //     },
            //     body: JSON.stringify({
            //         chatId,
            //         text: message.text,
            //         timestamp: message.timestamp,
            //     }),
            // });
            // const data = await response.json();
            // if (!response.ok) throw new Error(data.message);
        } catch (error) {
            console.error('Error sending message:', error);
            // Handle error (e.g., show error message to user)
        }
    };

    const renderMessage = ({ item }) => {
        const isOwnMessage = item.senderId === userId;

        return (
            <View style={[
                styles.messageContainer,
                isOwnMessage ? styles.ownMessage : styles.otherMessage
            ]}>
                {!isOwnMessage && (
                    <Image source={profileImage} style={styles.messageAvatar} />
                )}
                <View style={[
                    styles.messageContent,
                    isOwnMessage ? styles.ownMessageContent : styles.otherMessageContent
                ]}>
                    <Text style={styles.messageText}>{item.text}</Text>
                    <Text style={styles.timestamp}>
                        {new Date(item.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        })}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <FontAwesome5 name="arrow-left" size={20} color="white" />
                </TouchableOpacity>
                <View style={styles.headerProfile}>
                    <Image source={profileImage} style={styles.profileImage} />
                    {flag && <Image source={flag} style={styles.flagIcon} />}
                </View>
                <Text style={styles.headerTitle}>{userName}</Text>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
                onLayout={() => flatListRef.current?.scrollToEnd()}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message..."
                    placeholderTextColor="#666"
                    multiline
                />
                <TouchableOpacity 
                    style={styles.sendButton}
                    onPress={handleSend}
                    disabled={!newMessage.trim()}
                >
                    <FontAwesome5 
                        name="paper-plane" 
                        size={20} 
                        color={newMessage.trim() ? '#8A2BE2' : '#666'} 
                    />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingTop: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    backButton: {
        padding: 8,
    },
    headerProfile: {
        position: 'relative',
        marginHorizontal: 12,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    flagIcon: {
        width: 16,
        height: 16,
        position: 'absolute',
        bottom: -2,
        right: -2,
        borderRadius: 8,
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    messagesList: {
        padding: 16,
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        maxWidth: '80%',
    },
    ownMessage: {
        alignSelf: 'flex-end',
    },
    otherMessage: {
        alignSelf: 'flex-start',
    },
    messageAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
    messageContent: {
        backgroundColor: '#333',
        borderRadius: 16,
        padding: 12,
    },
    ownMessageContent: {
        backgroundColor: '#8A2BE2',
    },
    otherMessageContent: {
        backgroundColor: '#333',
    },
    messageText: {
        color: 'white',
        fontSize: 16,
    },
    timestamp: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    input: {
        flex: 1,
        backgroundColor: '#333',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        color: 'white',
        fontSize: 16,
        maxHeight: 100,
    },
    sendButton: {
        marginLeft: 12,
        padding: 8,
    },
});

export default ChatScreen; 