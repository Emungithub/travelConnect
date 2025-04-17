import React from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";

const users = [
    {
        id: "1",
        name: "Eemun",
        location: "Kuala Lumpur, Malaysia",
        tag: "China",
        bio: "I am Ee Mun from Malaysia, I would like to make friends and share the insights of Malaysia...",
        profileImage: require("../assets/explore/1.png"),
        tags: ["Cancer", "Blood O", "INFJ", "Japan", "Software Engineer", "Malaysia", "Secret"],
    },
    {
        id: "2",
        name: "John Doe",
        tag: "Korean",
        location: "Penang, Malaysia",
        bio: "Hey there! I'm John. I love meeting new people and exploring different cultures.",
        profileImage: require("../assets/explore/1.png"),
        tags: ["Leo", "A+", "ENTP", "Gaming", "Digital Nomad", "Adventure"],
    },
];

const ConnectPage = () => {
    const navigation = useNavigation();

    const handleConnect = (user) => {
        // Navigate to DetailsPage with the selected user
        navigation.navigate("DetailsPage", { user });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <FontAwesome5 name="arrow-left" size={20} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Connect</Text>
            </View>
            <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.profileContainer}>
                                <Image source={item.profileImage} style={styles.profileImageQuestion} />
                                <Image
                                    source={
                                        item.tag === "China"
                                            ? require("../assets/flag/china.png")
                                            : item.tag === "Korean"
                                                ? require("../assets/flag/korea.png")
                                                : null
                                    }
                                    style={styles.flagIcon}
                                />
                            </View>
                            <View style={{ flex: 1, marginLeft: 10 }}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.location}>{item.location}</Text>
                            </View>
                        </View>
                        <Text style={styles.bio}>{item.bio}</Text>
                        <View style={styles.tagsContainer}>
                            {item.tags.map((tag, index) => (
                                <Text key={index} style={styles.tag}>{tag}</Text>
                            ))}
                        </View>
                        <TouchableOpacity 
                            style={styles.connectButton} 
                            onPress={() => handleConnect(item)}
                        >
                            <Text style={styles.connectText}>Connect</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: "#000", 
        padding: 16 
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
    card: { 
        backgroundColor: "#1a1a1a", 
        padding: 15, 
        borderRadius: 10, 
        marginBottom: 10 
    },
    cardHeader: { 
        flexDirection: "row", 
        alignItems: "center", 
        marginBottom: 10 
    },
    profileContainer: {
        position: "relative",
    },
    profileImageQuestion: {
        width: 53,
        height: 53,
        borderRadius: 30,
    },
    flagIcon: {
        width: 15,
        height: 15,
        position: "absolute",
        bottom: -2,
        left: -2,
        borderRadius: 7.5,
    },
    name: { 
        color: "white", 
        fontSize: 18, 
        fontWeight: "bold" 
    },
    location: { 
        color: "gray", 
        fontSize: 14 
    },
    bio: { 
        color: "white", 
        marginTop: 10 
    },
    tagsContainer: { 
        flexDirection: "row", 
        flexWrap: "wrap", 
        marginTop: 10 
    },
    tag: { 
        backgroundColor: "#444", 
        padding: 8, 
        borderRadius: 10, 
        color: "white", 
        margin: 5 
    },
    connectButton: { 
        backgroundColor: "#8A2BE2", 
        paddingVertical: 10, 
        borderRadius: 20, 
        marginTop: 10, 
        alignItems: "center" 
    },
    connectText: { 
        color: "white", 
        fontSize: 16, 
        fontWeight: "bold" 
    },
});

export default ConnectPage;
