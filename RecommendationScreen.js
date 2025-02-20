import React, { useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";

const interests = [
  { id: "1", name: "Attractions", image: require("./assets/interest/attractions.png") },
  { id: "2", name: "Stay", image: require("./assets/interest/stay.png") },
  { id: "3", name: "Transport", image: require("./assets/interest/transport.png") },
  { id: "4", name: "Shopping", image: require("./assets/interest/shopping.png") },
  { id: "5", name: "Culture", image: require("./assets/interest/culture.png") },
  { id: "6", name: "Food", image: require("./assets/interest/food.png") },
  { id: "7", name: "History", image: require("./assets/interest/history.png") },
  { id: "8", name: "Nightlife", image: require("./assets/interest/nightlife.png") },
  { id: "9", name: "Nature", image: require("./assets/interest/nature.png") },
  { id: "10", name: "Adventure", image: require("./assets/interest/adventure.png") },
  { id: "11", name: "Cafe", image: require("./assets/interest/cafe.png") },
  { id: "12", name: "Coworking", image: require("./assets/interest/coworking.png") },
  { id: "13", name: "Internet", image: require("./assets/interest/internet.png") },
  { id: "14", name: "Local", image: require("./assets/interest/local.png") },
  { id: "15", name: "Sea", image: require("./assets/interest/sea.png") },
  { id: "16", name: "Solo Travel", image: require("./assets/interest/solotravel.png") },
  { id: "17", name: "Sport", image: require("./assets/interest/sport.png") },
  { id: "18", name: "Events", image: require("./assets/interest/events.png") },
];


export default function RecommendationScreen() {
  const [selectedInterests, setSelectedInterests] = useState([]);

  const toggleSelection = (id) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select your interests</Text>
      <FlatList
        data={interests}
        numColumns={3}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleSelection(item.id)} style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <View style={selectedInterests.includes(item.id) ? styles.overlaySelected : styles.overlay} />
            <Text style={styles.text}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.button} onPress={() => console.log("Selected Interests:", selectedInterests)}>
                <Text style={styles.buttonText}>Confirm Selection</Text>
              </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingHorizontal: 20, paddingTop: 50 },
  header: { fontSize: 22, fontWeight: "bold", color: "#fff", textAlign: "center", marginBottom: 20 },
  card: { flex: 1, margin: 5, position: "relative", alignItems: "center" },
  image: { width: 100, height: 100, borderRadius: 10 },
  overlay: { position: "absolute", width: 100, height: 100, backgroundColor: "rgba(0,0,0,0.3)", borderRadius: 10 },
  overlaySelected: { position: "absolute", width: 100, height: 100, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 10 },
  text: { position: "absolute", bottom: 10, color: "#fff", fontWeight: "bold" },
  button: { 
    backgroundColor: "#A855F7", 
    paddingVertical: 15, 
    borderRadius: 10, 
    width: "100%", 
    alignItems: "center", 
    marginVertical: 20 
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});