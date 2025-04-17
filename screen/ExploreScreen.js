import React, { useState, useEffect, useCallback} from "react";
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
import Profile from './Profile';
import ExploreDetail from './ExploreDetail';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
// Categories for filtering
const categories = ["Recommend", "Stay", "Food", "Attractions"];

const exploreData = [
  {
    id: "1",
    title: "Experience Taman ABC Night Market",
    description: "Looking for a place to **stretch, relax, and rejuvenate**? 🌸✨ Experience the **tranquility and expert guidance** at **Sense Studio Wangsa Maju**, where wellness meets serenity! 🏡💆‍♂️\n\n🔥 Whether you're a **beginner or an experienced yogi**, there's something for everyone:\n\n✅ **Hatha Yoga** – Perfect for **balance & flexibility** 🧘\n✅ **Vinyasa Flow** – A **dynamic & energizing** workout 🔥\n✅ **Yin Yoga** – Deep **stretching & relaxation** 🌙\n✅ **Aerial Yoga** – Fly high & build **core strength** 🕊️\n\n🌿 **Why Sense Studio Wangsa Maju?**\n🎀 **Cozy ambiance** & skilled trainers! 🎀\n🌸 **Great for beginners & advanced yogis!** 🌸\n\n💬 **Tag your yoga buddies & start your wellness journey today!** 🏞️💖\n\n#SenseStudio #YogaWangsaMaju #MindBodySoul #RelaxAndFlow #BestYogaKL",
    image: require("../assets/explore/2.png"),
    user: "test_24",
    profileImage: require("../assets/explore/solotravel.png"),
    rating: "90%",
  },
  {
    id: "2",
    title: "Experience Taman ABC Night Market",
    description: "Looking for a place to **stretch, relax, and rejuvenate**? 🌸✨ Experience the **tranquility and expert guidance** at **Sense Studio Wangsa Maju**, where wellness meets serenity! 🏡💆‍♂️\n\n🔥 Whether you're a **beginner or an experienced yogi**, there's something for everyone:\n\n✅ **Hatha Yoga** – Perfect for **balance & flexibility** 🧘\n✅ **Vinyasa Flow** – A **dynamic & energizing** workout 🔥\n✅ **Yin Yoga** – Deep **stretching & relaxation** 🌙\n✅ **Aerial Yoga** – Fly high & build **core strength** 🕊️\n\n🌿 **Why Sense Studio Wangsa Maju?**\n🎀 **Cozy ambiance** & skilled trainers! 🎀\n🌸 **Great for beginners & advanced yogis!** 🌸\n\n💬 **Tag your yoga buddies & start your wellness journey today!** 🏞️💖\n\n#SenseStudio #YogaWangsaMaju #MindBodySoul #RelaxAndFlow #BestYogaKL",
    image: require("../assets/explore/2.png"),
    user: "test_24",
    profileImage: require("../assets/explore/solotravel.png"),
    rating: "90%",
  },
  {
    id: "3",
    title: "First experience in Sense Studio Wangsa Maju",
    description: "Looking for a place to **stretch, relax, and rejuvenate**? 🌸✨ Experience the **tranquility and expert guidance** at **Sense Studio Wangsa Maju**, where wellness meets serenity! 🏡💆‍♂️\n\n🔥 Whether you're a **beginner or an experienced yogi**, there's something for everyone:\n\n✅ **Hatha Yoga** – Perfect for **balance & flexibility** 🧘\n✅ **Vinyasa Flow** – A **dynamic & energizing** workout 🔥\n✅ **Yin Yoga** – Deep **stretching & relaxation** 🌙\n✅ **Aerial Yoga** – Fly high & build **core strength** 🕊️\n\n🌿 **Why Sense Studio Wangsa Maju?**\n🎀 **Cozy ambiance** & skilled trainers! 🎀\n🌸 **Great for beginners & advanced yogis!** 🌸\n\n💬 **Tag your yoga buddies & start your wellness journey today!** 🏞️💖\n\n#SenseStudio #YogaWangsaMaju #MindBodySoul #RelaxAndFlow #BestYogaKL",
    image: require("../assets/explore/1.png"),
    user: "ella_03",
    profileImage: require("../assets/explore/solotravel.png"),
    rating: "100%",
  },
  {
    id: "4",
    title: "Experience Taman ",
    description: "Looking for a place to **stretch, relax, and rejuvenate**? 🌸✨ Experience the **tranquility and expert guidance** at **Sense Studio Wangsa Maju**, where wellness meets serenity! 🏡💆‍♂️\n\n🔥 Whether you're a **beginner or an experienced yogi**, there's something for everyone:\n\n✅ **Hatha Yoga** – Perfect for **balance & flexibility** 🧘\n✅ **Vinyasa Flow** – A **dynamic & energizing** workout 🔥\n✅ **Yin Yoga** – Deep **stretching & relaxation** 🌙\n✅ **Aerial Yoga** – Fly high & build **core strength** 🕊️\n\n🌿 **Why Sense Studio Wangsa Maju?**\n🎀 **Cozy ambiance** & skilled trainers! 🎀\n🌸 **Great for beginners & advanced yogis!** 🌸\n\n💬 **Tag your yoga buddies & start your wellness journey today!** 🏞️💖\n\n#SenseStudio #YogaWangsaMaju #MindBodySoul #RelaxAndFlow #BestYogaKL",
    image: require("../assets/explore/2.png"),
    user: "john_24",
    profileImage: require("../assets/explore/solotravel.png"),
    rating: "90%",
  },
  {
    id: "5",
    title: "Sense Studio Wangsa Maju",
    description: "Looking for a place to **stretch, relax, and rejuvenate**? 🌸✨ Experience the **tranquility and expert guidance** at **Sense Studio Wangsa Maju**, where wellness meets serenity! 🏡💆‍♂️\n\n🔥 Whether you're a **beginner or an experienced yogi**, there's something for everyone:\n\n✅ **Hatha Yoga** – Perfect for **balance & flexibility** 🧘\n✅ **Vinyasa Flow** – A **dynamic & energizing** workout 🔥\n✅ **Yin Yoga** – Deep **stretching & relaxation** 🌙\n✅ **Aerial Yoga** – Fly high & build **core strength** 🕊️\n\n🌿 **Why Sense Studio Wangsa Maju?**\n🎀 **Cozy ambiance** & skilled trainers! 🎀\n🌸 **Great for beginners & advanced yogis!** 🌸\n\n💬 **Tag your yoga buddies & start your wellness journey today!** 🏞️💖\n\n#SenseStudio #YogaWangsaMaju #MindBodySoul #RelaxAndFlow #BestYogaKL",
    image: require("../assets/explore/1.png"),
    user: "ella_03",
    profileImage: require("../assets/explore/solotravel.png"),
    rating: "100%",
  },
  {
    id: "6",
    title: "Experience Taman ABC Night Market",
    description: "Looking for a place to **stretch, relax, and rejuvenate**? 🌸✨ Experience the **tranquility and expert guidance** at **Sense Studio Wangsa Maju**, where wellness meets serenity! 🏡💆‍♂️\n\n🔥 Whether you're a **beginner or an experienced yogi**, there's something for everyone:\n\n✅ **Hatha Yoga** – Perfect for **balance & flexibility** 🧘\n✅ **Vinyasa Flow** – A **dynamic & energizing** workout 🔥\n✅ **Yin Yoga** – Deep **stretching & relaxation** 🌙\n✅ **Aerial Yoga** – Fly high & build **core strength** 🕊️\n\n🌿 **Why Sense Studio Wangsa Maju?**\n🎀 **Cozy ambiance** & skilled trainers! 🎀\n🌸 **Great for beginners & advanced yogis!** 🌸\n\n💬 **Tag your yoga buddies & start your wellness journey today!** 🏞️💖\n\n#SenseStudio #YogaWangsaMaju #MindBodySoul #RelaxAndFlow #BestYogaKL",
    image: require("../assets/explore/2.png"),
    user: "john_24",
    profileImage: require("../assets/explore/solotravel.png"),
    rating: "90%",
  },
];

const ExploreComponent = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState("Recommend");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter explore data based on search query
  const filteredExploreData = exploreData.filter(item => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower)
    );
  });

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainerBig}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by title or description"
            placeholderTextColor="#bbb"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.searchIcon} onPress={() => navigation.navigate("AskLocal", { bigTit: "New Post", button: "Post" })}>
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
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("ExploreDetail", { item })}>
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
          </TouchableOpacity>
        )}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={{ paddingBottom: 5 }}
      />
    </View>
  );
};

const QuestionsComponent = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState("Recommend");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [questionsData, setQuestionsData] = useState([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState({});

  // Filter questions data based on search query
  const filteredQuestionsData = questionsData.filter(item => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower)
    );
  });

  const toggleDescription = (id) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCommentSubmit = async (questionId) => {
    if (!commentText.trim()) return;

    try {
      // Here you would typically send the comment to your backend
      // For now, we'll simulate it with local state
      const newComment = {
        id: Date.now().toString(),
        text: commentText,
        user: "Current User", // You would get this from your auth system
        timestamp: new Date().toISOString(),
      };

      setComments(prev => ({
        ...prev,
        [questionId]: [...(prev[questionId] || []), newComment]
      }));

      // Update the answer count in questionsData
      setQuestionsData(prev => prev.map(item => {
        if (item.id === questionId) {
          return {
            ...item,
            answers: (item.answers || 0) + 1
          };
        }
        return item;
      }));

      setCommentText("");
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchQuestions = async () => {
        try {
          const response = await fetch('http://192.168.35.214:3000/getQuestions');
          const data = await response.json();
          console.log("Fetched questions data:", JSON.stringify(data, null, 2));
          setQuestionsData(data);
        } catch (error) {
          console.error('Error fetching questions:', error);
        }
      };
  
      fetchQuestions();
    }, [])
  );

  const getEmojiFlag = (country) => {
    const map = {
      "USA": "🇺🇸",
      "UK": "🇬🇧",
      "China": "🇨🇳",
      "Japan": "🇯🇵",
      "Korea": "🇰🇷",
      "South Korea": "🇰🇷",
      "France": "🇫🇷",
      "Germany": "🇩🇪",
      "Italy": "🇮🇹",
      "Spain": "🇪🇸",
      "Malaysia": "🇲🇾",
      "Indonesia": "🇮🇩",
      // Add more as needed
    };

    return map[country?.trim()] || "🌍"; // default: globe
  };

  return (
    <ScrollView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainerBig}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by title or description"
            placeholderTextColor="#bbb"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.searchIcon} onPress={() => navigation.navigate("AskLocal", { bigTit: "New Post", button: "Post" })}>
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
      {filteredQuestionsData.map((item) => {
        console.log("Rendering question with priority:", item.priority);
        return (
          <View key={item.id} style={styles.questionCard}>
            <View style={styles.cardHeader}>
              <View style={styles.profileContainer}>
                <Image source={{ uri: item.profile_image }} style={styles.profileImageQuestion} />
                <Text style={styles.flagIcon}>{getEmojiFlag(item.country)}</Text>          
              </View>
              <View style={styles.textContainer}>
                <View style={styles.tagRow}>
                  <Text style={styles.user}>{item.name}</Text>
                  {item.priority && (
                    <View style={[
                      styles.priorityBadge, 
                      { backgroundColor: item.priority === "High" ? "#FF4500" : 
                                      item.priority === "Medium" ? "#FFA500" : "#32CD32" }
                    ]}>
                      <Text style={styles.priorityText}>{item.priority}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.questionTitle}>{item.title}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => toggleDescription(item.id)}>
              <Text 
                style={styles.questionDetails} 
                numberOfLines={expandedDescriptions[item.id] ? undefined : 2}
                ellipsizeMode="tail"
              >
                {item.description}
              </Text>
              {!expandedDescriptions[item.id] && (
                <Text style={styles.readMore}>... Read more</Text>
              )}
            </TouchableOpacity>
            <View style={styles.answerContainer}>
              <TouchableOpacity
                style={[styles.answerButton, selectedAnswer === item.id && styles.answerButtonActive]}
                onPress={() => setSelectedAnswer(selectedAnswer === item.id ? null : item.id)}
              >
                <FontAwesome5 name="comment" size={14} color="#bbb" />
                <Text style={styles.answers}>Answer {item.answers || 0}</Text>
              </TouchableOpacity>
            </View>

            {/* Comment Section */}
            {selectedAnswer === item.id && (
              <View style={styles.commentSection}>
                {/* Comment Input */}
                <View style={styles.commentInputContainer}>
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Write your answer..."
                    placeholderTextColor="#bbb"
                    value={commentText}
                    onChangeText={setCommentText}
                    multiline
                  />
                  <TouchableOpacity 
                    style={styles.submitButton}
                    onPress={() => handleCommentSubmit(item.id)}
                  >
                    <Text style={styles.submitButtonText}>Post</Text>
                  </TouchableOpacity>
                </View>

                {/* Comments List */}
                {(comments[item.id] || []).map(comment => (
                  <View key={comment.id} style={styles.commentItem}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentUser}>{comment.user}</Text>
                      <Text style={styles.commentTime}>
                        {new Date(comment.timestamp).toLocaleDateString()}
                      </Text>
                    </View>
                    <Text style={styles.commentText}>{comment.text}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}
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
        component={Profile}
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
    marginBottom: 4,
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
  translateButton: {
    paddingTop: 5,
    paddingRight: 10,
    justifyContent: "flex-end",
    alignItems: "end",
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

  responseContainer: {
    backgroundColor: "#1a1a1a",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  commentsHeader: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  responseCard: {
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  responseHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  profileImageResponse: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginRight: 10,
  },
  responseUser: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  levelTag: {
    color: "#8A2BE2",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 5,
  },
  responseTag: {
    color: "#bbb",
    fontSize: 12,
  },
  timestamp: {
    color: "#bbb",
    fontSize: 12,
  },
  responseText: {
    color: "white",
    fontSize: 14,
    marginTop: 5,
  },
  responseImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginTop: 5,
    marginRight: 5,
  },
  responseFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",  // Push all elements to the right
    marginTop: 5,
    gap: 5, // Add space between elements
    padding: 5,
  },

  likesText: {
    color: "white",
    fontSize: 12,
    marginLeft: 5,
  },
  suggestText: {
    color: "#A64DFF",
    fontSize: 12,
    marginLeft: 10,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
    minWidth: 60,
    alignItems: "center",
  },
  priorityText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  readMore: {
    color: "#8A2BE2",
    fontSize: 14,
    marginTop: 4,
  },
  commentSection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#333',
    color: 'white',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    minHeight: 40,
    maxHeight: 100,
  },
  submitButton: {
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  commentItem: {
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  commentUser: {
    color: '#8A2BE2',
    fontWeight: 'bold',
  },
  commentTime: {
    color: '#bbb',
    fontSize: 12,
  },
  commentText: {
    color: 'white',
    fontSize: 14,
  },
});
