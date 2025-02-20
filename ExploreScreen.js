import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { FontAwesome5 } from "@expo/vector-icons";

// Categories for filtering
const categories = ["Recommend", "Stay", "Food", "Attractions"];

const exploreData = [
  {
    id: "1",
    title: "First experience in Sense Studio Wangsa Maju",
    image: require("./assets/explore/1.png"),
    user: "ella_03",
    profileImage: require("./assets/explore/solotravel.png"),
    rating: "100%",
  },
  {
    id: "2",
    title: "Experience Taman ABC Night Market",
    image: require("./assets/explore/2.png"),
    user: "john_24",
    profileImage: require("./assets/explore/solotravel.png"),
    rating: "90%",
  },
  {
    id: "3",
    title: "First experience in Sense Studio Wangsa Maju",
    image: require("./assets/explore/1.png"),
    user: "ella_03",
    profileImage: require("./assets/explore/solotravel.png"),
    rating: "100%",
  },
  {
    id: "4",
    title: "Experience Taman ",
    image: require("./assets/explore/2.png"),
    user: "john_24",
    profileImage: require("./assets/explore/solotravel.png"),
    rating: "90%",
  },
  {
    id: "5",
    title: "Sense Studio Wangsa Maju",
    image: require("./assets/explore/1.png"),
    user: "ella_03",
    profileImage: require("./assets/explore/solotravel.png"),
    rating: "100%",
  },
  {
    id: "6",
    title: "Experience Taman ABC Night Market",
    image: require("./assets/explore/2.png"),
    user: "john_24",
    profileImage: require("./assets/explore/solotravel.png"),
    rating: "90%",
  },
];

const questionsData = [
  {
    id: "1",
    tag: "Chinese",
    priority: "Priority",
    question: "Please recommend Penang nearby cheap accommodation?",
    details: "I'm staying nearby Wangsa Maju area and would love a suggestion.",
    answers: 0,
  },
  {
    id: "2",
    tag: "Korean",
    priority: null,
    question: "Any hidden cafe in Kuala Lumpur?",
    details: "Please recommend the best food in Setapak area.",
    answers: 20,
  },
];

const ExploreComponent = () => {
  const [selectedCategory, setSelectedCategory] = useState("Recommend");

  return (
    <ScrollView style={styles.container}>
      {/* Category Filters */}
      <View style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive,
            ]}
          >
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Explore Listings */}
      <FlatList 
        key={selectedCategory}  
        numColumns={2}
        data={exploreData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.userContainer}>
              <Image source={item.profileImage} style={styles.profileImageSmall} /><Text style={styles.user}>{item.user}</Text>
              <View style={styles.ratingContainer}>
                <FontAwesome5 name="arrow-up" size={12} color="#32CD32" />
                <Text style={styles.rating}>{item.rating}</Text>
              </View>            
            </View>
          </View>
        )}
        columnWrapperStyle={styles.columnWrapper}
      />
    </ScrollView>
  );
};

const QuestionsComponent = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Category Filters */}
      <View style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity key={category} style={styles.categoryButton}>
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List of Questions */}
      {questionsData.map((item) => (
        <View key={item.id} style={styles.questionCard}>
          <Text style={styles.questionTag}>{item.tag}</Text>
          {item.priority && <Text style={styles.priority}>{item.priority}</Text>}
          <Text style={styles.questionTitle}>{item.question}</Text>
          <Text style={styles.questionDetails}>{item.details}</Text>
          <Text style={styles.answers}>Answer {item.answers}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

// Top Tab Navigation (Explore / Questions)
const TopTab = createMaterialTopTabNavigator();

const TopTabNavigator = () => {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: "#000" },
        tabBarIndicatorStyle: { backgroundColor: "#8A2BE2" },
        tabBarLabelStyle: { color: "white", fontSize: 16, fontWeight: "bold" },
      }}
    >
      <TopTab.Screen name="Explore" component={ExploreComponent} />
      <TopTab.Screen name="Questions" component={QuestionsComponent} />
    </TopTab.Navigator>
  );
};

// Bottom Tab Navigation (TravelConnect, Service, Questions, Chat, Me)
const BottomTab = createBottomTabNavigator();

export default function ExploreScreen() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "purple",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      }}
    >
      <BottomTab.Screen
        name="TravelConnect"
        component={TopTabNavigator}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome5 name="globe" size={20} color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Service"
        component={TopTabNavigator}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome5 name="cogs" size={20} color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Questions"
        component={TopTabNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.centerIcon}>
              <FontAwesome5 name="question-circle" size={24} color="white" />
            </View>
          ),
        }}
      />
      <BottomTab.Screen
        name="Chat"
        component={TopTabNavigator}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome5 name="comments" size={20} color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Me"
        component={TopTabNavigator}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome5 name="user" size={20} color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// ✅ STYLES INSIDE THE SAME FILE
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 16,
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#333",
    borderWidth: 1,
    borderColor: "#8A2BE2",
  },
  categoryButtonActive: {
    backgroundColor: "#8A2BE2",
  },
  categoryText: {
    color: "#fff",
    fontSize: 16,    
  },
  card: {
    width: "49%",
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 0,
    margin: 2,
  },
  image: {
    width: "100%",
    height: 244,
    borderRadius: 10,

  },
  title: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 10,
  },
  profileImageSmall: {
    width: 14,
    height: 14,
    borderRadius: 14,
    marginRight: 5,
  },
  user: {
    color: "#bbb",
    fontSize: 12,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    color: "#32CD32",
    fontSize: 12,
    marginLeft: 5,
  },
  questionCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  questionTag: {
    color: "#8A2BE2",
    fontSize: 14,
    fontWeight: "bold",
  },
  priority: {
    color: "#FF4500",
    fontSize: 14,
    fontWeight: "bold",
  },
  questionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  questionDetails: {
    color: "#bbb",
    fontSize: 14,
    marginTop: 5,
  },
  answers: {
    color: "#32CD32",
    fontSize: 14,
    marginTop: 5,
  },
  tabBar: {
    backgroundColor: "#000",
  },
  centerIcon: {
    backgroundColor: "#8A2BE2",
    padding: 10,
    borderRadius: 30,
  },
});
