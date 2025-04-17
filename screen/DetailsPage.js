import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, TextInput, Modal, KeyboardAvoidingView, Platform } from "react-native";
import { FontAwesome5, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const DetailsPage = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { user } = route.params;
    const [modalVisible, setModalVisible] = useState(false);
    const [dealModalVisible, setDealModalVisible] = useState(false);
    const [peopleCount, setPeopleCount] = useState(3);
    const [price, setPrice] = useState(4900);
    const [tourName, setTourName] = useState("");
    const [tourLocation, setTourLocation] = useState("");
    const [isConnected, setIsConnected] = useState(false);

    const handleConnect = () => {
        setIsConnected(true);
        // Here you would typically make an API call to establish the connection
        // For now, we'll just simulate it with the state change
    };

    const handleStartChat = () => {
        // Navigate to chat screen with the user data
        navigation.navigate("ChatScreen", { 
            chatId: user.id,
            userName: user.name,
            profileImage: user.profileImage,
            flag: user.tag === "China" ? require("../assets/flag/china.png") : 
                 user.tag === "Korean" ? require("../assets/flag/korea.png") : null
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <FontAwesome5 name="arrow-left" size={20} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile Details</Text>
            </View>

            <ScrollView style={styles.content}>
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

                <View style={styles.tagsSection}>
                    <Text style={styles.sectionTitle}>Tags</Text>
                    <View style={styles.tagsContainer}>
                        {user.tags.map((tag, index) => (
                            <Text key={index} style={styles.tag}>{tag}</Text>
                        ))}
                    </View>
                </View>

                {!isConnected ? (
                    <TouchableOpacity style={styles.connectButton} onPress={handleConnect}>
                        <Text style={styles.buttonText}>Connect</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.chatButton} onPress={handleStartChat}>
                        <Text style={styles.buttonText}>Start Chat</Text>
                    </TouchableOpacity>
                )}
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
        padding: 16,
    },
    profileSection: {
        alignItems: "center",
        marginBottom: 24,
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
    tagsSection: {
        marginBottom: 24,
    },
    tagsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    tag: {
        backgroundColor: "#444",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        color: "white",
        margin: 4,
    },
    connectButton: {
        backgroundColor: "#8A2BE2",
        paddingVertical: 16,
        borderRadius: 25,
        alignItems: "center",
        marginBottom: 16,
    },
    chatButton: {
        backgroundColor: "#4CAF50",
        paddingVertical: 16,
        borderRadius: 25,
        alignItems: "center",
        marginBottom: 16,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
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
    dateRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    dateButton: {
        backgroundColor: "#8A2BE2",
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    dateText: { color: "white", fontSize: 16 },
});

export default DetailsPage;
