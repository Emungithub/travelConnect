import React from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const users = [
    {
        id: "1",
        name: "Eemun",
        location: "Kuala Lumpur, Malaysia",
        bio: "I am Ee Mun from Malaysia, I would like to make friends and share the insights of Malaysia...",
        profileImage: require("./assets/explore/1.png"),
        flagIcon: require("./assets/explore/1.png"),
        tags: ["Cancer", "Blood O", "INFJ", "Japan", "Software Engineer", "Malaysia", "Secret"],
    },
    {
        id: "2",
        name: "John Doe",
        location: "Penang, Malaysia",
        bio: "Hey there! I'm John. I love meeting new people and exploring different cultures.",
        profileImage: require("./assets/explore/1.png"),
        flagIcon: require("./assets/explore/1.png"),
        tags: ["Leo", "A+", "ENTP", "Gaming", "Digital Nomad", "Adventure"],
    },
];

const ConnectPage = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate("DetailsPage", { user: item })} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Image source={item.profileImage} style={styles.profileImage} />
                            <Image source={item.flagIcon} style={styles.flagIcon} />
                            <View>
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
                        <TouchableOpacity style={styles.connectButton} onPress={() => navigation.navigate("DetailsPage", { user: item })}>
                            <Text style={styles.connectText}>Connect</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default ConnectPage;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#000", padding: 10 },
    card: { backgroundColor: "#1a1a1a", padding: 15, borderRadius: 10, marginBottom: 10 },
    cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
    profileImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
    flagIcon: { width: 20, height: 15, marginRight: 5 },
    name: { color: "white", fontSize: 18, fontWeight: "bold" },
    location: { color: "gray", fontSize: 14 },
    bio: { color: "white", marginTop: 10 },
    tagsContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
    tag: { backgroundColor: "#444", padding: 8, borderRadius: 10, color: "white", margin: 5 },
    connectButton: { backgroundColor: "#8A2BE2", paddingVertical: 10, borderRadius: 20, marginTop: 10, alignItems: "center" },
    connectText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
