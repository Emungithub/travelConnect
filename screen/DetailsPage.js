import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, TextInput, Modal, KeyboardAvoidingView, Platform } from "react-native";
import { FontAwesome5, MaterialIcons, Ionicons } from "@expo/vector-icons";

const DetailsPage = ({ route }) => {
    const { user } = route.params;
    const [modalVisible, setModalVisible] = useState(false);
    const [dealModalVisible, setDealModalVisible] = useState(false);
    const [peopleCount, setPeopleCount] = useState(3);
    const [price, setPrice] = useState(4900);
    const [tourName, setTourName] = useState("");
    const [tourLocation, setTourLocation] = useState("");

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.profileSection}>
                    <Image source={user.profileImage} style={styles.largeProfileImage} />
                    <Text style={styles.name}>{user.name}</Text>
                    <Text style={styles.location}>{user.location}</Text>
                    <Text style={styles.bio}>{user.bio}</Text>
                </View>

                <View style={styles.tagsContainer}>
                    {user.tags.map((tag, index) => (
                        <Text key={index} style={styles.tag}>{tag}</Text>
                    ))}
                </View>

                {/* Chat Messages */}
                <View style={styles.chatContainer}>
                    <View style={styles.userMessage}>
                        <Text style={styles.userText}>Hi, I am Ella. Can you speak English? What cultural customs should visitors be aware of when visiting Kuala Lumpur?</Text>
                    </View>
                    <View style={styles.replyMessage}>
                        <Text style={styles.replyText}>Hi, I am Eemun. Yes, I can communicate in English.</Text>
                    </View>
                    <View style={styles.replyMessage}>
                        <Text style={styles.replyText}>
                            I live in Setapak for 21 years. I would like to say that our culture here is very diverse and we are very understanding people...
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Message Input Section */}
            <View style={styles.inputContainer}>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.plusButton}>
                    <FontAwesome5 name="plus" size={20} color="white" />
                </TouchableOpacity>
                <TextInput style={styles.input} placeholder="Type a message..." placeholderTextColor="#999" />
                <Ionicons name="send" size={24} color="#8A2BE2" />
            </View>

            {/* "Make a Deal" Modal (Bottom Sheet) */}
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
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.formContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.formTitle}>Create Tour</Text>
                            <Text style={styles.formSubtitle}>Create a one-day or multi-day tour plan with your travelers.</Text>
                        </View>

                        <TextInput
                            style={styles.inputField}
                            placeholder="Add a tour name"
                            placeholderTextColor="#999"
                            value={tourName}
                            onChangeText={setTourName}
                        />

                        <View style={styles.dateRow}>
                            <TouchableOpacity style={styles.dateButton}>
                                <FontAwesome5 name="calendar" size={16} color="white" />
                                <Text style={styles.dateText}>Starts  23 Dec 2024  10:00 AM</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.dateRow}>
                            <TouchableOpacity style={styles.dateButton}>
                                <FontAwesome5 name="calendar" size={16} color="white" />
                                <Text style={styles.dateText}>Ends  27 Dec 2024  20:00 PM</Text>
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.inputField}
                            placeholder="Add a tour location"
                            placeholderTextColor="#999"
                            value={tourLocation}
                            onChangeText={setTourLocation}
                        />

                        <TouchableOpacity style={styles.makeDealButton} onPress={() => setDealModalVisible(false)}>
                            <Text style={styles.makeDealText}>Make a deal</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </View>
            </Modal>

            
        </View>
    );
};

export default DetailsPage;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#000" },
    scrollContent: { flexGrow: 1, padding: 20 },
    profileSection: { alignItems: "center", marginBottom: 20 },
    largeProfileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
    name: { color: "white", fontSize: 18, fontWeight: "bold" },
    location: { color: "gray", fontSize: 14 },
    bio: { color: "white", marginTop: 10, textAlign: "center" },

    chatContainer: { paddingHorizontal: 15, marginTop: 10 },
    userMessage: { backgroundColor: "#8A2BE2", padding: 10, borderRadius: 10, alignSelf: "flex-end", maxWidth: "70%", marginBottom: 5 },
    replyMessage: { backgroundColor: "#555", padding: 10, borderRadius: 10, alignSelf: "flex-start", maxWidth: "70%", marginBottom: 5 },

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
    },
    icon: {
        padding: 8,
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
        padding: 20,
        borderRadius: 10,
        width: "90%",
        alignItems: "center",
    },
    formTitle: { color: "white", fontSize: 18, fontWeight: "bold", marginBottom: 10 },
    formSubtitle: { color: "gray", fontSize: 14, textAlign: "center", marginBottom: 20 },
    inputField: { backgroundColor: "#333", color: "white", padding: 10, borderRadius: 5, width: "100%", marginBottom: 10 },
    makeDealButton: { backgroundColor: "#8A2BE2", padding: 12, borderRadius: 10, alignItems: "center", width: "100%" },
    makeDealText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
