import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, TextInput, Modal, KeyboardAvoidingView, Platform } from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";

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
                <FontAwesome5 name="smile" size={20} color="white" style={styles.icon} />
                <MaterialIcons name="mic" size={24} color="white" style={styles.icon} />
            </View>

            {/* "Make a Deal" Modal (Small Popup) */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.smallModal}>
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

            {/* "Make a Deal" Fullscreen Form Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={dealModalVisible}
                onRequestClose={() => setDealModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.formContainer}>
                        <Text style={styles.formTitle}>Create Tour</Text>
                        <Text style={styles.formSubtitle}>Create a one-day or multi-day tour plan with your travelers.</Text>

                        <TextInput
                            style={styles.inputField}
                            placeholder="Add a tour name"
                            placeholderTextColor="#999"
                            value={tourName}
                            onChangeText={setTourName}
                        />

                        {/* Start and End Date */}
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

                        <View style={styles.row}>
                            <Text style={styles.label}>Number of pax</Text>
                            <View style={styles.counter}>
                                <TouchableOpacity onPress={() => setPeopleCount(peopleCount > 1 ? peopleCount - 1 : 1)}>
                                    <Text style={styles.counterText}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.counterValue}>{peopleCount}</Text>
                                <TouchableOpacity onPress={() => setPeopleCount(peopleCount + 1)}>
                                    <Text style={styles.counterText}>+</Text>
                                </TouchableOpacity>
                            </View>
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
    replyMessage: { backgroundColor: "#333", padding: 10, borderRadius: 10, alignSelf: "flex-start", maxWidth: "70%", marginBottom: 5 },

    inputContainer: { flexDirection: "row", alignItems: "center", padding: 10, backgroundColor: "#222", borderTopWidth: 1, borderColor: "#444" },
    plusButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#8A2BE2", justifyContent: "center", alignItems: "center", marginRight: 10 },

    modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
    smallModal: { backgroundColor: "#222", padding: 20, borderRadius: 10 },
    dealButton: { backgroundColor: "#C19A30", padding: 15, borderRadius: 10, alignItems: "center" },
    dealButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
