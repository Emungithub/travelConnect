import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const ExploreDetail = ({ route, navigation }) => {
  const { item } = route.params;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome5 name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Explore Details</Text>
      </View>
      {/* User Info */}
      <View style={styles.userContainer}>
        <Image source={item.profileImage} style={styles.profileImage} />
        <Text style={styles.user}>{item.user}</Text>
        <View style={styles.ratingContainer}>
          <FontAwesome5 name="arrow-up" size={14} color="#32CD32" />
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
      </View>


      {/* Image */}
      <Image source={item.image} style={styles.image} />

      {/* Title */}
      <Text style={styles.title}>{item.title}</Text>

      
      {/* Description */}
      <Text style={styles.description}>{item.description}</Text>

      {/* Button to go back */}
      <TouchableOpacity style={styles.backButtonFull} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingTop: 40,
    display: "center",
    justifyContent: "center",
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  image: {
    width: "full",
    height: "488",
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  user: {
    color: "#bbb",
    fontSize: 16,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    color: "#32CD32",
    fontSize: 14,
    marginLeft: 5,
  },
  description: {
    color: "#ccc",
    fontSize: 16,
    marginTop: 10,
  },
  backButtonFull: {
    backgroundColor: "#8A2BE2",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ExploreDetail;
