import React, { useState, useRef, useCallback, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, TextInput, Modal, KeyboardAvoidingView, Platform, Keyboard, FlatList, Alert, ActivityIndicator } from "react-native";
import { FontAwesome5, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { OPENAI_API_KEY } from "@env";

const DetailsPage = () => {
    // Navigation and route hooks first
    const navigation = useNavigation();
    const route = useRoute();
    const { user, isConnected } = route.params;
    
    // All useState hooks together
    const [modalVisible, setModalVisible] = useState(false);
    const [dealModalVisible, setDealModalVisible] = useState(false);
    const [peopleCount, setPeopleCount] = useState(3);
    const [price, setPrice] = useState('');
    const [tourName, setTourName] = useState("");
    const [tourLocation, setTourLocation] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [description, setDescription] = useState('');
    const [serviceType, setServiceType] = useState('guide'); // 'guide' or 'transport'
    const [suggestions, setSuggestions] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);

    // Refs after useState
    const scrollViewRef = useRef(null);

    // Helper functions
    const formatDateTime = useCallback((date) => {
        return date.toLocaleString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }, []);

    // Event handlers with useCallback
    const handleStartChat = useCallback(() => {
        navigation.navigate("ChatScreen", { 
            chatId: user.id,
            userName: user.name,
            profileImage: user.profileImage,
            flag: user.tag === "China" ? require("../assets/flag/china.png") : 
                 user.tag === "Korean" ? require("../assets/flag/korea.png") : null
        });
    }, [navigation, user]);

    const onStartDateChange = useCallback((event, selectedDate) => {
        setShowStartPicker(false);
        if (selectedDate) {
            setStartDate(selectedDate);
        }
    }, []);

    const onEndDateChange = useCallback((event, selectedDate) => {
        setShowEndPicker(false);
        if (selectedDate) {
            setEndDate(selectedDate);
        }
    }, []);

    // Function to get message suggestions from OpenAI
    const getSuggestions = async (messageHistory) => {
        try {
            setLoadingSuggestions(true);
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: `You are a helpful travel conversation assistant. The user is chatting with ${user.name} from ${user.location}. 
                            Suggest 3 short, friendly messages that would be appropriate for the conversation. 
                            Focus on travel-related topics, cultural exchange, and building connections.`
                        },
                        ...messageHistory.map(msg => ({
                            role: msg.isSender ? "user" : "assistant",
                            content: msg.text
                        }))
                    ],
                    temperature: 0.7,
                    max_tokens: 150
                })
            });

            const data = await response.json();
            if (data.choices && data.choices[0]) {
                // Parse the suggestions from the AI response
                const suggestionsText = data.choices[0].message.content;
                const parsedSuggestions = suggestionsText
                    .split('\n')
                    .filter(s => s.trim())
                    .map(s => s.replace(/^\d+\.\s*/, '').trim())
                    .filter(s => s.length > 0)
                    .slice(0, 3);
                setSuggestions(parsedSuggestions);
            }
        } catch (error) {
            console.error('Error getting suggestions:', error);
        } finally {
            setLoadingSuggestions(false);
        }
    };

    // Get initial suggestions when chat opens
    useEffect(() => {
        getSuggestions([]);
    }, []);

    // Modified handleSendMessage to update suggestions after sending
    const handleSendMessage = useCallback(async (suggestedMessage = null) => {
        const messageToSend = suggestedMessage || message;
        if (messageToSend.trim()) {
            const newMessage = {
                id: Date.now().toString(),
                text: messageToSend,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isSender: true
            };
            setMessages(prev => [...prev, newMessage]);
            setMessage("");
            Keyboard.dismiss();
            
            // Get new suggestions based on updated conversation
            await getSuggestions([...messages, newMessage]);

            // Scroll to the bottom after sending message
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }
    }, [message, messages]);

    const handleMakeDeal = useCallback(() => {
        if (!tourName.trim() || !tourLocation.trim() || !price.trim()) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const tourDetails = {
            name: tourName,
            location: tourLocation,
            startDate: formatDateTime(startDate),
            endDate: formatDateTime(endDate),
            price: price,
            description: description,
            serviceType: serviceType
        };

        const newMessage = {
            id: Date.now().toString(),
            text: `🎯 New Tour Proposal\n\n` +
                 `🏷️ ${tourDetails.name}\n` +
                 `📍 ${tourDetails.location}\n` +
                 `🕒 Start: ${tourDetails.startDate}\n` +
                 `🕕 End: ${tourDetails.endDate}\n` +
                 `💰 Price: $${tourDetails.price}\n` +
                 `🎫 Service: ${serviceType === 'guide' ? 'Tour Guide' : 'Transportation'}\n\n` +
                 `📝 ${tourDetails.description}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSender: true
        };

        setMessages(prev => [...prev, newMessage]);
        setTourName('');
        setTourLocation('');
        setStartDate(new Date());
        setEndDate(new Date());
        setPrice('');
        setDescription('');
        setDealModalVisible(false);
    }, [tourName, tourLocation, startDate, endDate, price, description, serviceType, formatDateTime]);

    const renderMessage = useCallback(({ item }) => {
        if (item.text.includes('🎯 New Tour Proposal')) {
            // Parse the message content safely
            const messageLines = item.text.split('\n');
            const tourName = messageLines.find(line => line.includes('🏷️'))?.replace('🏷️ ', '') || 'Tour Name';
            const priceMatch = messageLines.find(line => line.includes('💰'))?.match(/RM\s*(\d+(\.\d{2})?)/);
            const price = priceMatch ? priceMatch[0] : 'RM 0.00';

            return (
                <View style={[
                    styles.messageContainer,
                    item.isSender ? styles.senderMessage : styles.receiverMessage
                ]}>
                    <View style={styles.offerCard}>
                        <View style={styles.offerHeader}>
                            <FontAwesome5 name="calendar" size={16} color="#8A2BE2" />
                            <Text style={styles.offerTitle}>{tourName}</Text>
                        </View>
                        <View style={styles.offerPrice}>
                            <Text style={styles.priceText}>{price}</Text>
                        </View>
                        <TouchableOpacity 
                            style={styles.makeOfferButton}
                            onPress={() => {
                                Alert.alert(
                                    "Make Counter Offer",
                                    "This feature will be available soon!"
                                );
                            }}
                        >
                            <Text style={styles.makeOfferButtonText}>Make Offer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.viewDetailsButton}
                            onPress={() => {
                                Alert.alert(
                                    "Tour Details",
                                    item.text
                                );
                            }}
                        >
                            <Text style={styles.viewDetailsText}>View Details</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.messageTime}>{item.timestamp}</Text>
                </View>
            );
        }
        
        // Regular message
        return (
            <View style={[
                styles.messageContainer,
                item.isSender ? styles.senderMessage : styles.receiverMessage
            ]}>
                <Text style={[
                    styles.messageText,
                    item.isSender ? styles.senderMessageText : styles.receiverMessageText
                ]}>{item.text}</Text>
                <Text style={styles.messageTime}>{item.timestamp}</Text>
            </View>
        );
    }, []);

    const renderSuggestions = () => (
        <View style={styles.suggestionsContainer}>
            {loadingSuggestions ? (
                <ActivityIndicator color="#8A2BE2" size="small" />
            ) : (
                <View style={styles.suggestionsGrid}>
                    <View style={styles.suggestionsRow}>
                        {suggestions.slice(0, 2).map((suggestion, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.suggestionButton, { flex: 1, marginRight: index === 0 ? 8 : 0 }]}
                                onPress={() => handleSendMessage(suggestion)}
                            >
                                <Text style={styles.suggestionText} numberOfLines={2}>{suggestion}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={[styles.suggestionsRow, { marginTop: 8 }]}>
                        {suggestions.slice(2).map((suggestion, index) => (
                            <TouchableOpacity
                                key={index + 2}
                                style={[styles.suggestionButton, { flex: 1, marginRight: index === 0 ? 8 : 0 }]}
                                onPress={() => handleSendMessage(suggestion)}
                            >
                                <Text style={styles.suggestionText} numberOfLines={2}>{suggestion}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );

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
                <Text style={styles.headerTitle}>Profile Details</Text>
            </View>

            <View style={styles.content}>
                <FlatList
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={item => item.id}
                    style={styles.messagesContainer}
                    contentContainerStyle={styles.messagesList}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                    ref={scrollViewRef}
                    ListHeaderComponent={() => (
                        <View>
                            <View style={styles.profileSection}>
                                <View style={styles.profileImageContainer}>
                                    <Image source={user.profileImage} style={styles.profileImage} />
                                    <Image
                                        source={
                                            user.tag === "China"
                                                ? require("../assets/flag/china.png")
                                                : user.tag === "Korean"
                                                    ? require("../assets/flag/korea.png")
                                                    : null
                                        }
                                        style={styles.flagIcon}
                                    />
                                </View>
                                <Text style={styles.name}>{user.name}</Text>
                                <Text style={styles.location}>{user.location}</Text>
                            </View>

                            <View style={styles.bioSection}>
                                <Text style={styles.sectionTitle}>About</Text>
                                <Text style={styles.bioText}>{user.bio}</Text>
                            </View>
                        </View>
                    )}
                />

                {renderSuggestions()}

                <View style={styles.inputContainer}>
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.plusButton}>
                        <FontAwesome5 name="plus" size={20} color="white" />
                    </TouchableOpacity>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Type a message..." 
                        placeholderTextColor="#999"
                        value={message}
                        onChangeText={setMessage}
                        multiline
                    />
                    <TouchableOpacity onPress={() => handleSendMessage()}>
                        <Ionicons name="send" size={24} color="#8A2BE2" />
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.bottomModalOverlay}>
                    <View style={styles.bottomModal}>
                        <TouchableOpacity
                            style={styles.dealButton}
                            onPress={() => {
                                setModalVisible(false);
                                setDealModalVisible(true);
                            }}
                        >
                            <Text style={styles.dealButtonText}>Make a deal</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={dealModalVisible}
                onRequestClose={() => setDealModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView 
                        behavior={Platform.OS === "ios" ? "padding" : "height"} 
                        style={styles.formContainer}
                    >
                        <View style={styles.modalHeader}>
                            <View style={styles.headerRow}>
                                <Text style={styles.formTitle}>Create Tour Offer</Text>
                                <TouchableOpacity 
                                    onPress={() => setDealModalVisible(false)}
                                    style={styles.closeButton}
                                >
                                    <FontAwesome5 name="times" size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.formSubtitle}>Create a personalized tour offer for your traveler</Text>
                        </View>

                        <ScrollView style={styles.formScroll}>
                            <View style={styles.serviceTypeContainer}>
                                <TouchableOpacity 
                                    style={[
                                        styles.serviceTypeButton,
                                        serviceType === 'guide' && styles.serviceTypeButtonActive
                                    ]}
                                    onPress={() => setServiceType('guide')}
                                >
                                    <FontAwesome5 
                                        name="user-tie" 
                                        size={20} 
                                        color={serviceType === 'guide' ? '#8A2BE2' : 'white'} 
                                    />
                                    <Text style={[
                                        styles.serviceTypeText,
                                        serviceType === 'guide' && styles.serviceTypeTextActive
                                    ]}>Tour Guide</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[
                                        styles.serviceTypeButton,
                                        serviceType === 'transport' && styles.serviceTypeButtonActive
                                    ]}
                                    onPress={() => setServiceType('transport')}
                                >
                                    <FontAwesome5 
                                        name="car" 
                                        size={20} 
                                        color={serviceType === 'transport' ? '#8A2BE2' : 'white'} 
                                    />
                                    <Text style={[
                                        styles.serviceTypeText,
                                        serviceType === 'transport' && styles.serviceTypeTextActive
                                    ]}>Transportation</Text>
                                </TouchableOpacity>
                            </View>

                            <TextInput
                                style={styles.inputField}
                                placeholder="Tour name"
                                placeholderTextColor="#999"
                                value={tourName}
                                onChangeText={setTourName}
                            />

                            <View style={styles.dateRow}>
                                <TouchableOpacity 
                                    style={styles.dateButton}
                                    onPress={() => setShowStartPicker(true)}
                                >
                                    <FontAwesome5 name="calendar" size={16} color="white" />
                                    <Text style={styles.dateText}>Starts: {formatDateTime(startDate)}</Text>
                                </TouchableOpacity>
                            </View>

                            {showStartPicker && (
                                <DateTimePicker
                                    value={startDate}
                                    mode="datetime"
                                    is24Hour={false}
                                    display="default"
                                    onChange={onStartDateChange}
                                    minimumDate={new Date()}
                                />
                            )}

                            <View style={styles.dateRow}>
                                <TouchableOpacity 
                                    style={styles.dateButton}
                                    onPress={() => setShowEndPicker(true)}
                                >
                                    <FontAwesome5 name="calendar" size={16} color="white" />
                                    <Text style={styles.dateText}>Ends: {formatDateTime(endDate)}</Text>
                                </TouchableOpacity>
                            </View>

                            {showEndPicker && (
                                <DateTimePicker
                                    value={endDate}
                                    mode="datetime"
                                    is24Hour={false}
                                    display="default"
                                    onChange={onEndDateChange}
                                    minimumDate={startDate}
                                />
                            )}

                            <TextInput
                                style={styles.inputField}
                                placeholder="Location"
                                placeholderTextColor="#999"
                                value={tourLocation}
                                onChangeText={setTourLocation}
                            />

                            <TextInput
                                style={styles.inputField}
                                placeholder="Price (MYR)"
                                placeholderTextColor="#999"
                                value={price}
                                onChangeText={setPrice}
                                keyboardType="numeric"
                            />

                            <TextInput
                                style={[styles.inputField, styles.textArea]}
                                placeholder="Description (Optional)"
                                placeholderTextColor="#999"
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />

                            <TouchableOpacity 
                                style={styles.makeDealButton} 
                                onPress={handleMakeDeal}
                            >
                                <FontAwesome5 name="handshake" size={20} color="white" style={styles.dealIcon} />
                                <Text style={styles.makeDealText}>Send Offer</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
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
        padding: 16,
        paddingTop: 40,
        marginBottom: 10,
    },
    headerTitle: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        flex: 1,
        textAlign: "center",
    },
    content: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    messagesContainer: {
        flex: 1,
        backgroundColor: '#111',
    },
    messagesList: {
        padding: 16,
    },
    profileSection: {
        alignItems: "center",
        marginBottom: 24,
        backgroundColor: '#1A1A1A',
        padding: 20,
        borderRadius: 15,
    },
    profileImageContainer: {
        position: "relative",
        marginBottom: 12,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    flagIcon: {
        width: 24,
        height: 24,
        position: "absolute",
        bottom: 0,
        right: 0,
        borderRadius: 12,
    },
    name: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 4,
    },
    location: {
        color: "gray",
        fontSize: 16,
    },
    bioSection: {
        marginBottom: 24,
        backgroundColor: '#1A1A1A',
        padding: 20,
        borderRadius: 15,
    },
    sectionTitle: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
    },
    bioText: {
        color: "white",
        fontSize: 16,
        lineHeight: 24,
    },
    messageContainer: {
        maxWidth: '80%',
        marginVertical: 5,
        padding: 2,
    },
    senderMessage: {
        alignSelf: 'flex-end',
    },
    receiverMessage: {
        alignSelf: 'flex-start',
    },
    messageText: {
        padding: 12,
        borderRadius: 20,
        fontSize: 16,
    },
    senderMessageText: {
        backgroundColor: '#8A2BE2',
        color: 'white',
        borderTopRightRadius: 4,
    },
    receiverMessageText: {
        backgroundColor: '#333',
        color: 'white',
        borderTopLeftRadius: 4,
    },
    messageTime: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: "#222",
        borderTopWidth: 1,
        borderColor: "#444",
        justifyContent: "space-between",
    },
    plusButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#8A2BE2", justifyContent: "center", alignItems: "center", marginRight: 10 },
    input: {
        flex: 1,
        color: "#fff",
        fontSize: 16,
        paddingVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: "#333",
        borderRadius: 20,
        marginRight: 10,
        maxHeight: 100,
    },
    bottomModalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    bottomModal: {
        backgroundColor: "#222",
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: "center",
    },
    dealButton: { backgroundColor: "#C19A30", padding: 15, borderRadius: 10, alignItems: "center", width: "90%" },
    dealButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    formContainer: {
        backgroundColor: "#222",
        borderRadius: 15,
        width: "90%",
        maxHeight: "80%",
        padding: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    closeButton: {
        padding: 5,
    },
    formScroll: {
        marginTop: 15,
    },
    serviceTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    serviceTypeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        backgroundColor: '#333',
        borderRadius: 10,
        marginHorizontal: 5,
    },
    serviceTypeButtonActive: {
        backgroundColor: 'rgba(138, 43, 226, 0.2)',
        borderWidth: 1,
        borderColor: '#8A2BE2',
    },
    serviceTypeText: {
        color: 'white',
        marginLeft: 8,
        fontSize: 14,
    },
    serviceTypeTextActive: {
        color: '#8A2BE2',
        fontWeight: 'bold',
    },
    inputField: {
        backgroundColor: '#333',
        color: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        paddingTop: 15,
    },
    makeDealButton: {
        backgroundColor: '#8A2BE2',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    dealIcon: {
        marginRight: 10,
    },
    makeDealText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    formTitle: { color: "white", fontSize: 18, fontWeight: "bold", marginBottom: 10 },
    formSubtitle: { color: "gray", fontSize: 14, textAlign: "center", marginBottom: 20 },
    dateRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    dateButton: {
        backgroundColor: '#333',
        padding: 15,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
    },
    dateText: {
        color: 'white',
        marginLeft: 10,
        fontSize: 14,
    },
    offerCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 15,
        padding: 16,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#333',
        width: '100%',
        shadowColor: '#8A2BE2',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    offerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    offerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 10,
        flex: 1,
    },
    offerPrice: {
        backgroundColor: '#2A2A2A',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#8A2BE2',
    },
    priceText: {
        color: '#8A2BE2',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    makeOfferButton: {
        backgroundColor: '#8A2BE2',
        borderRadius: 25,
        padding: 15,
        alignItems: 'center',
        marginBottom: 10,
    },
    makeOfferButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    viewDetailsButton: {
        backgroundColor: 'rgba(138, 43, 226, 0.1)',
        borderRadius: 25,
        padding: 12,
        alignItems: 'center',
    },
    viewDetailsText: {
        color: '#8A2BE2',
        fontSize: 14,
        fontWeight: '500',
    },
    suggestionsContainer: {
        padding: 10,
        backgroundColor: '#1A1A1A',
        borderTopWidth: 1,
        borderColor: '#333',
    },
    suggestionsGrid: {
        width: '100%',
    },
    suggestionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    suggestionButton: {
        backgroundColor: 'rgba(138, 43, 226, 0.1)',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#8A2BE2',
        minHeight: 60,
        justifyContent: 'center',
    },
    suggestionText: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
    },
});

export default DetailsPage;
