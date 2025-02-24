import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { FontAwesome5 } from "@expo/vector-icons";
import AskLocalScreen from "./AskLocalScreen";
import ConnectPage from "./ConnectPage";
import ChatList from "./ChatList";
import { useNavigation } from "@react-navigation/native";
// Categories for filtering
const categories = ["Recommend", "Stay", "Food", "Attractions"];

const exploreData = [
  {
    id: "1",
    title: "First experience in Sense Studio Wangsa Maju",
    image: require("./assets/explore/1.png"),
    user: "emun_03",
    profileImage: require("./assets/explore/solotravel.png"),
    rating: "100%",
  },
  {
    id: "2",
    title: "Experience Taman ABC Night Market",
    image: require("./assets/explore/2.png"),
    user: "test_24",
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
    tag: "China",
    user: "test_24",
    priority: "Priority",
    vvip: "VVIP",
    profileImage: require("./assets/explore/solotravel.png"),
    question: "Please recommend Penang nearby cheap accommodation?",
    details: "I'm staying nearby Wangsa Maju area and would love a suggestion.",
    answers: 0,
  },
  {
    id: "2",
    tag: "Korean",
    user: "emun_03",
    priority: null,
    vvip: null,
    profileImage: require("./assets/explore/solotravel.png"),
    question: "Any hidden cafe in Kuala Lumpur?",
    details: "Please recommend the best food in Setapak area.",
    answers: 20,
  },
];

const ExploreComponent = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState("Recommend");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View style={styles.container}>

      {/* Search Bar */}
      <View style={styles.searchContainerBig}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#bbb"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.searchIcon} onPress={() => navigation.navigate("AskLocal", { title: "New Post", button: "Post" })}>
          <FontAwesome5 name="edit" size={20} color="#8A2BE2" />
        </TouchableOpacity>
      </View>

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

      {/* 🔥 Use `FlatList` Without `ScrollView` */}
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
              <Image source={item.profileImage} style={styles.profileImageSmall} />
              <Text style={styles.user}>{item.user}</Text>
              <View style={styles.ratingContainer}>
                <FontAwesome5 name="arrow-up" size={12} color="#32CD32" />
                <Text style={styles.rating}>{item.rating}</Text>
              </View>
            </View>
          </View>
        )}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={{ paddingBottom: 5 }} // Add spacing to prevent UI cutting off
      />
    </View>
  );
};


const QuestionsComponent = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState("Recommend");
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  return (
    <ScrollView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainerBig}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#bbb"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.searchIcon} onPress={() => navigation.navigate("AskLocal", { title: "New Post", button: "Post" })}>
          <FontAwesome5 name="edit" size={20} color="#8A2BE2" />
        </TouchableOpacity>
      </View>
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

      {/* List of Questions */}
      {questionsData.map((item) => (
        <View key={item.id} style={styles.questionCard}>
          <View style={styles.cardHeader}>
            <View style={styles.profileContainer}>
              <Image source={item.profileImage} style={styles.profileImageQuestion} />
              <Image
                source={
                  item.tag === "China"
                    ? require("./assets/flag/china.png")
                    : item.tag === "Korean"
                      ? require("./assets/flag/korea.png")
                      : null
                }
                style={styles.flagIcon}
              />
            </View>
            <View style={styles.textContainer}>
              <View style={styles.tagRow}>
                <Text style={styles.user}>{item.user}   {item.priority && <Text style={styles.questionTag}>{item.vvip}</Text>}
                </Text>
                {item.priority && <Text style={styles.priority}>{item.priority}</Text>}
              </View>
              <Text style={styles.questionTitle}>{item.question}</Text>
            </View>
          </View>
          <Text style={styles.questionDetails}>{item.details}</Text>
          <View style={styles.answerContainer}>
            <TouchableOpacity
              style={[
                styles.answerButton,
                selectedAnswer === item.id && styles.answerButtonActive,
              ]}
              onPress={() => {
                setSelectedAnswer(item.id);
                navigation.navigate("AskLocal");
              }}
            >
              <FontAwesome5 name="comment" size={14} color="#bbb" />
              <Text style={styles.answers}>Answer {item.answers}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const SideBar = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState("Recommend");

  const [searchQuery, setSearchQuery] = useState("");
  return (
    <ScrollView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainerBig}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#bbb"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.searchIcon} onPress={() => navigation.navigate("AskLocal", { title: "New Post", button: "Post" })}>
          <FontAwesome5 name="edit" size={20} color="#8A2BE2" />
        </TouchableOpacity>
      </View>
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
        tabBarStyle: { backgroundColor: "#000", paddingTop: 40 },
        tabBarIndicatorStyle: { backgroundColor: "#8A2BE2" },
        tabBarLabelStyle: { color: "white", fontSize: 16, fontWeight: "bold" },
      }}
    >
      {/* <TopTab.Screen name="SideBar" component={SideBar} /> */}
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
        tabBarStyle: {
          ...styles.tabBar,
        },
        tabBarActiveTintColor: "#8A2BE2",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      }}
    >

      <BottomTab.Screen
        name="Home"
        component={TopTabNavigator}
        options={{
          tabBarIcon: ({ color }) =>

            <FontAwesome5 name="home" size={20} color={color} />,

        }}
      />

      <BottomTab.Screen
        name="Connect"
        component={ConnectPage}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome5 name="globe" size={20} color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Questions"
        component={AskLocalScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.centerIcon}>
              <Text style={styles.centerIconText}>Q</Text>
            </View>
          ),
          tabBarLabel: "",
        }}
      />



      <BottomTab.Screen
        name="Chat"
        component={ChatList}
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
    padding: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    paddingHorizontal: 10,
    width: "90%",
  },
  searchContainerBig: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 10,
  },
  searchIcon: {
    padding: 10,
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  categoryButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: "#333",
    borderWidth: 1,
    borderColor: "#8A2BE2",
  },
  categoryButtonActive: {
    backgroundColor: "#8A2BE2",
  },
  categoryText: {
    color: "#fff",
    fontSize: 14,
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
  profileContainer: {
    position: "relative",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  flagIcon: {
    width: 15,
    height: 15,
    position: "absolute",
    bottom: 0,
    left: 0,
    borderRadius: 8,
  },
  profileImageSmall: {
    width: 14,
    height: 14,
    borderRadius: 14,
    marginRight: 5,
  },
  profileImageQuestion: {
    width: 53,
    height: 53,
    borderRadius: 30,
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  questionTag: {
    color: "#8A2BE2",
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 5,
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
    marginTop: 5,
  },
  questionDetails: {
    color: "#bbb",
    fontSize: 14,
    marginTop: 5,
  },
  answerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  answerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 8,
    backgroundColor: "#435345",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: "#333",
    borderWidth: 1,
    borderColor: "#8A2BE2",
  },
  answerButtonActive: {
    backgroundColor: "#8A2BE2",
  },
  answers: {
    color: "#FFFFFF",
    fontSize: 14,
    marginLeft: 5,
  },
  tabBar: {
    backgroundColor: "#000",
  },
  centerIcon: {
    width: 45,  // Adjust size as needed
    height: 45,
    backgroundColor: "#A64DFF", // Purple background
    borderRadius: 10, // Rounded square
    justifyContent: "center",
    alignItems: "center",
    marginBottom: -15,
  },
  centerIconText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
});
