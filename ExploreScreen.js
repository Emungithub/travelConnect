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
import Profile from './Profile';
import ExploreDetail from './ExploreDetail';
import { useNavigation } from "@react-navigation/native";
// Categories for filtering
const categories = ["Recommend", "Stay", "Food", "Attractions"];

const exploreData = [
  {
    id: "1",
    title: "Experience Taman ABC Night Market",
    description: "Looking for a place to **stretch, relax, and rejuvenate**? 🌸✨ Experience the **tranquility and expert guidance** at **Sense Studio Wangsa Maju**, where wellness meets serenity! 🏡💆‍♂️\n\n🔥 Whether you're a **beginner or an experienced yogi**, there's something for everyone:\n\n✅ **Hatha Yoga** – Perfect for **balance & flexibility** 🧘\n✅ **Vinyasa Flow** – A **dynamic & energizing** workout 🔥\n✅ **Yin Yoga** – Deep **stretching & relaxation** 🌙\n✅ **Aerial Yoga** – Fly high & build **core strength** 🕊️\n\n🌿 **Why Sense Studio Wangsa Maju?**\n🎀 **Cozy ambiance** & skilled trainers! 🎀\n🌸 **Great for beginners & advanced yogis!** 🌸\n\n💬 **Tag your yoga buddies & start your wellness journey today!** 🏞️💖\n\n#SenseStudio #YogaWangsaMaju #MindBodySoul #RelaxAndFlow #BestYogaKL",
    image: require("./assets/explore/2.png"),
    user: "test_24",
    profileImage: require("./assets/explore/solotravel.png"),
    rating: "90%",
  },  
  {
    id: "2",
    title: "Experience Taman ABC Night Market",
    description: "Looking for a place to **stretch, relax, and rejuvenate**? 🌸✨ Experience the **tranquility and expert guidance** at **Sense Studio Wangsa Maju**, where wellness meets serenity! 🏡💆‍♂️\n\n🔥 Whether you're a **beginner or an experienced yogi**, there's something for everyone:\n\n✅ **Hatha Yoga** – Perfect for **balance & flexibility** 🧘\n✅ **Vinyasa Flow** – A **dynamic & energizing** workout 🔥\n✅ **Yin Yoga** – Deep **stretching & relaxation** 🌙\n✅ **Aerial Yoga** – Fly high & build **core strength** 🕊️\n\n🌿 **Why Sense Studio Wangsa Maju?**\n🎀 **Cozy ambiance** & skilled trainers! 🎀\n🌸 **Great for beginners & advanced yogis!** 🌸\n\n💬 **Tag your yoga buddies & start your wellness journey today!** 🏞️💖\n\n#SenseStudio #YogaWangsaMaju #MindBodySoul #RelaxAndFlow #BestYogaKL",
    image: require("./assets/explore/2.png"),
    user: "test_24",
    profileImage: require("./assets/explore/solotravel.png"),
    rating: "90%",
  },
  {
    id: "3",
    title: "First experience in Sense Studio Wangsa Maju",
    description: "Looking for a place to **stretch, relax, and rejuvenate**? 🌸✨ Experience the **tranquility and expert guidance** at **Sense Studio Wangsa Maju**, where wellness meets serenity! 🏡💆‍♂️\n\n🔥 Whether you're a **beginner or an experienced yogi**, there's something for everyone:\n\n✅ **Hatha Yoga** – Perfect for **balance & flexibility** 🧘\n✅ **Vinyasa Flow** – A **dynamic & energizing** workout 🔥\n✅ **Yin Yoga** – Deep **stretching & relaxation** 🌙\n✅ **Aerial Yoga** – Fly high & build **core strength** 🕊️\n\n🌿 **Why Sense Studio Wangsa Maju?**\n🎀 **Cozy ambiance** & skilled trainers! 🎀\n🌸 **Great for beginners & advanced yogis!** 🌸\n\n💬 **Tag your yoga buddies & start your wellness journey today!** 🏞️💖\n\n#SenseStudio #YogaWangsaMaju #MindBodySoul #RelaxAndFlow #BestYogaKL",
    image: require("./assets/explore/1.png"),
    user: "ella_03",
    profileImage: require("./assets/explore/solotravel.png"),
    rating: "100%",
  },
  {
    id: "4",
    title: "Experience Taman ",
    description: "Looking for a place to **stretch, relax, and rejuvenate**? 🌸✨ Experience the **tranquility and expert guidance** at **Sense Studio Wangsa Maju**, where wellness meets serenity! 🏡💆‍♂️\n\n🔥 Whether you're a **beginner or an experienced yogi**, there's something for everyone:\n\n✅ **Hatha Yoga** – Perfect for **balance & flexibility** 🧘\n✅ **Vinyasa Flow** – A **dynamic & energizing** workout 🔥\n✅ **Yin Yoga** – Deep **stretching & relaxation** 🌙\n✅ **Aerial Yoga** – Fly high & build **core strength** 🕊️\n\n🌿 **Why Sense Studio Wangsa Maju?**\n🎀 **Cozy ambiance** & skilled trainers! 🎀\n🌸 **Great for beginners & advanced yogis!** 🌸\n\n💬 **Tag your yoga buddies & start your wellness journey today!** 🏞️💖\n\n#SenseStudio #YogaWangsaMaju #MindBodySoul #RelaxAndFlow #BestYogaKL",
    image: require("./assets/explore/2.png"),
    user: "john_24",
    profileImage: require("./assets/explore/solotravel.png"),
    rating: "90%",
  },
  {
    id: "5",
    title: "Sense Studio Wangsa Maju",
    description: "Looking for a place to **stretch, relax, and rejuvenate**? 🌸✨ Experience the **tranquility and expert guidance** at **Sense Studio Wangsa Maju**, where wellness meets serenity! 🏡💆‍♂️\n\n🔥 Whether you're a **beginner or an experienced yogi**, there's something for everyone:\n\n✅ **Hatha Yoga** – Perfect for **balance & flexibility** 🧘\n✅ **Vinyasa Flow** – A **dynamic & energizing** workout 🔥\n✅ **Yin Yoga** – Deep **stretching & relaxation** 🌙\n✅ **Aerial Yoga** – Fly high & build **core strength** 🕊️\n\n🌿 **Why Sense Studio Wangsa Maju?**\n🎀 **Cozy ambiance** & skilled trainers! 🎀\n🌸 **Great for beginners & advanced yogis!** 🌸\n\n💬 **Tag your yoga buddies & start your wellness journey today!** 🏞️💖\n\n#SenseStudio #YogaWangsaMaju #MindBodySoul #RelaxAndFlow #BestYogaKL",
    image: require("./assets/explore/1.png"),
    user: "ella_03",
    profileImage: require("./assets/explore/solotravel.png"),
    rating: "100%",
  },
  {
    id: "6",
    title: "Experience Taman ABC Night Market",
    description: "Looking for a place to **stretch, relax, and rejuvenate**? 🌸✨ Experience the **tranquility and expert guidance** at **Sense Studio Wangsa Maju**, where wellness meets serenity! 🏡💆‍♂️\n\n🔥 Whether you're a **beginner or an experienced yogi**, there's something for everyone:\n\n✅ **Hatha Yoga** – Perfect for **balance & flexibility** 🧘\n✅ **Vinyasa Flow** – A **dynamic & energizing** workout 🔥\n✅ **Yin Yoga** – Deep **stretching & relaxation** 🌙\n✅ **Aerial Yoga** – Fly high & build **core strength** 🕊️\n\n🌿 **Why Sense Studio Wangsa Maju?**\n🎀 **Cozy ambiance** & skilled trainers! 🎀\n🌸 **Great for beginners & advanced yogis!** 🌸\n\n💬 **Tag your yoga buddies & start your wellness journey today!** 🏞️💖\n\n#SenseStudio #YogaWangsaMaju #MindBodySoul #RelaxAndFlow #BestYogaKL",
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
    answers: 1,
    responses: [{
      id: "1",
      user: "john_24",
      level: "Lv3",
      nationality: "Local Guide",
      profileImage: require("./assets/explore/solotravel.png"),
      text: "I've tried Cafe ABC near Bukit Bintang. They serve great vegetarian options and the ambiance is cozy!",
      images: [require("./assets/explore/2.png")],
      likes: 10,
      suggests: "95%",
    },]
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
    responses: [
      {
        id: "1",
        user: "ella_03",
        level: "Lv1",
        nationality: "Malaysian aboard student",
        profileImage: require("./assets/explore/solotravel.png"),
        text: "Hi, I frequently go to DancePot, OM Factory, air sense studio for my yoga lesson. They have different kinds of yoga to choose from such as Ariel Yoga, Ariel Hoop.",
        images: [require("./assets/explore/1.png"), require("./assets/explore/2.png")],
        likes: 4,
        suggests: "100%",
      },
      {
        id: "2",
        user: "john_24",
        level: "Lv3",
        nationality: "Local Guide",
        profileImage: require("./assets/explore/solotravel.png"),
        text: "I've tried Cafe ABC near Bukit Bintang. They serve great vegetarian options and the ambiance is cozy!",
        images: [require("./assets/explore/2.png")],
        likes: 10,
        suggests: "95%",
      },
      {
        id: "3",
        user: "test_24",
        level: "Lv2",
        nationality: "Korean traveler",
        profileImage: require("./assets/explore/solotravel.png"),
        text: "I found a hidden cafe called Secret Garden Café. It's in a small alley near Petaling Street!",
        images: [],
        likes: 7,
        suggests: "80%",
      },
      {
        id: "4",
        user: "meiki",
        level: "Lv5",
        nationality: "Food Blogger",
        profileImage: require("./assets/explore/solotravel.png"),
        text: "I love Artisan Roastery. Their cold brew is amazing, and the staff is very friendly.",
        images: [require("./assets/explore/1.png")],
        likes: 12,
        suggests: "98%",
      },
      {
        id: "5",
        user: "kyle_92",
        level: "Lv4",
        nationality: "Traveler",
        profileImage: require("./assets/explore/solotravel.png"),
        text: "If you're looking for a quiet place to study, I highly recommend VCR Café in Pudu.",
        images: [require("./assets/explore/2.png")],
        likes: 9,
        suggests: "92%",
      },
      {
        id: "6",
        user: "samantha_lee",
        level: "Lv2",
        nationality: "Coffee Lover",
        profileImage: require("./assets/explore/solotravel.png"),
        text: "Don't miss out on Bean Brothers! It's an industrial-style cafe with great pastries.",
        images: [],
        likes: 5,
        suggests: "88%",
      },
      {
        id: "7",
        user: "hassan_k",
        level: "Lv1",
        nationality: "Backpacker",
        profileImage: require("./assets/explore/solotravel.png"),
        text: "I enjoyed the matcha lattes at Little Japan Café in Mont Kiara.",
        images: [require("./assets/explore/1.png"), require("./assets/explore/2.png")],
        likes: 6,
        suggests: "85%",
      },
      {
        id: "8",
        user: "ryan_goh",
        level: "Lv3",
        nationality: "Kuala Lumpur Local",
        profileImage: require("./assets/explore/solotravel.png"),
        text: "You should try Strangers at 47! They serve delicious crepes and specialty coffee.",
        images: [require("./assets/explore/2.png")],
        likes: 14,
        suggests: "97%",
      },
      {
        id: "9",
        user: "jacob_chia",
        level: "Lv4",
        nationality: "Photographer",
        profileImage: require("./assets/explore/solotravel.png"),
        text: "If you love artsy cafes, check out Pokok KL. It's filled with greenery and has a great brunch menu.",
        images: [],
        likes: 11,
        suggests: "94%",
      },
      {
        id: "10",
        user: "natasha_w",
        level: "Lv5",
        nationality: "KL Explorer",
        profileImage: require("./assets/explore/solotravel.png"),
        text: "Kopenhagen Coffee in Mont Kiara is super chill, great for remote work or casual meetups.",
        images: [require("./assets/explore/1.png")],
        likes: 9,
        suggests: "90%",
      },
      {
        id: "11",
        user: "kelly_jones",
        level: "Lv3",
        nationality: "Coffee Enthusiast",
        profileImage: require("./assets/explore/solotravel.png"),
        text: "Try The Red Beanbag for their amazing Australian-style breakfast and great coffee!",
        images: [],
        likes: 15,
        suggests: "99%",
      },
      {
        id: "12",
        user: "bryan_oh",
        level: "Lv2",
        nationality: "Local Foodie",
        profileImage: require("./assets/explore/solotravel.png"),
        text: "If you're near Chinatown, go to Luckin Kopi. They serve local-style coffee with a twist.",
        images: [require("./assets/explore/2.png")],
        likes: 8,
        suggests: "91%",
      },
      {
        id: "13",
        user: "stephanie_m",
        level: "Lv4",
        nationality: "Cafe Hopper",
        profileImage: require("./assets/explore/solotravel.png"),
        text: "Merchant’s Lane is my go-to spot. Vintage vibes with amazing food.",
        images: [],
        likes: 13,
        suggests: "96%",
      },
      {
        id: "14",
        user: "tina_lau",
        level: "Lv1",
        nationality: "Traveler",
        profileImage: require("./assets/explore/solotravel.png"),
        text: "Feeka Coffee Roasters has a great selection of desserts and cozy ambiance.",
        images: [require("./assets/explore/1.png")],
        likes: 7,
        suggests: "93%",
      },
      {
        id: "15",
        user: "eric_ong",
        level: "Lv3",
        nationality: "Barista",
        profileImage: require("./assets/explore/solotravel.png"),
        text: "Pulp by Papa Palheta is a specialty coffee house. Highly recommended!",
        images: [],
        likes: 16,
        suggests: "99%",
      },
      {
        id: "16",
        user: "jamie_c",
        level: "Lv2",
        nationality: "Frequent Traveler",
        profileImage: require("./assets/explore/solotravel.png"),
        text: "Toby’s Estate serves one of the best flat whites in KL!",
        images: [],
        likes: 5,
        suggests: "85%",
      },
      {
        id: "17",
        user: "daniel_l",
        level: "Lv1",
        nationality: "Solo Traveler",
        profileImage: require("./assets/explore/solotravel.png"),
        text: "Try Lucky Peaches Eatery for a modern twist on Asian fusion and coffee.",
        images: [require("./assets/explore/2.png")],
        likes: 8,
        suggests: "92%",
      },
      {
        id: "18",
        user: "michelle_lee",
        level: "Lv4",
        nationality: "KL Resident",
        profileImage: require("./assets/explore/solotravel.png"),
        text: "Birch KL is fantastic for brunch lovers! Stylish and cozy.",
        images: [require("./assets/explore/1.png")],
        likes: 12,
        suggests: "97%",
      },
      {
        id: "19",
        user: "jason_h",
        level: "Lv5",
        nationality: "Barista Trainer",
        profileImage: require("./assets/explore/solotravel.png"),
        text: "Don’t miss out on One Half x ilaika, great for handcrafted drinks and chill vibes.",
        images: [],
        likes: 14,
        suggests: "95%",
      },
      {
        id: "20",
        user: "rebecca_tan",
        level: "Lv3",
        nationality: "Lifestyle Blogger",
        profileImage: require("./assets/explore/solotravel.png"),
        text: "I highly recommend Breakfast Thieves, excellent for food and coffee lovers alike!",
        images: [require("./assets/explore/2.png")],
        likes: 11,
        suggests: "96%",
      },
    ],
  }
  
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
              style={[styles.answerButton, selectedAnswer === item.id && styles.answerButtonActive]}
              onPress={() => setSelectedAnswer(selectedAnswer === item.id ? null : item.id)}
            >
              <FontAwesome5 name="comment" size={14} color="#bbb" />
              <Text style={styles.answers}>Answer {item.answers}</Text>
            </TouchableOpacity>
          </View>
          {/* Display answers when the button is clicked */}
          {selectedAnswer === item.id && item.responses.length > 0 && (
            <View style={styles.responseContainer}>
              <Text style={styles.commentsHeader}>Comments ({item.responses.length})</Text>
              {item.responses.map((response) => (
                <View key={response.id} style={styles.responseCard}>
                  <View style={styles.responseHeader}>
                    <Image source={response.profileImage} style={styles.profileImageResponse} />
                    <View style={styles.textContainer}>
                      <Text style={styles.responseUser}>{response.user}   <Text style={styles.levelTag}>{response.level}</Text></Text>
                      <Text style={styles.responseTag}>{response.nationality}</Text>
                    </View>
                    
                    <Text style={styles.timestamp}>{response.timestamp}</Text>
                  </View>
                  <Text style={styles.responseText}>{response.text}</Text>
                  <ScrollView horizontal>
                    {response.images.map((img, idx) => (
                      <Image key={idx} source={img} style={styles.responseImage} />
                    ))}
                  </ScrollView>
                  <View style={styles.responseFooter}>                    
                    <TouchableOpacity style={styles.translateButton}>
                      <Image source={require("./assets/translate.png")} style={styles.translateButton} />  
                    </TouchableOpacity>
                    <FontAwesome5 name="thumbs-up" size={14} color="white" />
                    <Text style={styles.likesText}>{response.likes}</Text>
                    <Text style={styles.suggestText}>{response.suggests}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
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
  translateButton:{
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

});
