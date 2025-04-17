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
  Alert,
  ActivityIndicator,
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
import AsyncStorage from '@react-native-async-storage/async-storage';
// Categories for filtering
const categories = ["Recommend", "Stay", "Food", "Attractions"];
const priorityCategories = ["All", "Low", "Medium", "High"];

// Add getEmojiFlag function
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
    // Add more countries as needed
  };

  return map[country?.trim()] || "🌍"; // default: globe
};

const ExploreComponent = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState("Recommend");
  const [searchQuery, setSearchQuery] = useState("");
  const [exploreData, setExploreData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userVotes, setUserVotes] = useState({});
  const [postRatings, setPostRatings] = useState({});

  const handleVote = async (postId, voteType) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Please login to vote');
        return;
      }

      console.log('Sending vote request:', { postId, voteType });

      const response = await fetch('http://192.168.35.214:3000/votePost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          post_id: postId,
          vote_type: voteType
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Vote failed:', data);
        throw new Error(data.error || data.details || 'Failed to vote');
      }

      console.log('Vote successful:', data);
      
      // Update local state with the new rating
      setPostRatings(prev => ({
        ...prev,
        [postId]: data.newRating
      }));

      // Update user's vote state
      setUserVotes(prev => ({
        ...prev,
        [postId]: voteType
      }));

    } catch (error) {
      console.error('Error voting:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to vote. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  // Fetch explore data from the database
  useFocusEffect(
    useCallback(() => {
      const fetchExploreData = async () => {
        try {
          setLoading(true);
          const response = await fetch('http://192.168.35.214:3000/getExplorePosts');
          if (!response.ok) {
            throw new Error('Failed to fetch explore posts');
          }
          const data = await response.json();
          console.log('Raw data from server:', data);
          
          // Transform the data to match our existing structure
          const formattedData = data.map(post => {
            // Initialize ratings state for each post
            setPostRatings(prev => ({
              ...prev,
              [post.id]: post.rating || 0
            }));

            let mainImage;
            if (Array.isArray(post.images) && post.images.length > 0) {
              mainImage = { uri: post.images[0].replace(/^file:\/\//, '') };
            } else {
              mainImage = require("../assets/explore/1.png");
            }

            return {
              id: post.id.toString(),
              title: post.title,
              description: post.description,
              image: mainImage,
              user: post.user,
              profileImage: post.profile_image ? { uri: post.profile_image } : require("../assets/explore/solotravel.png"),
              country: post.country,
              language: post.language,
              rating: post.rating || 0,
              images: Array.isArray(post.images) ? post.images.map(img => ({ uri: img.replace(/^file:\/\//, '') })) : []
            };
          });

          setExploreData(formattedData);
        } catch (error) {
          console.error('Error fetching explore data:', error);
          Alert.alert('Error', 'Failed to load explore posts. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchExploreData();
    }, [])
  );

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
              styles.answerButton,
              selectedCategory === category && styles.answerButtonActive,
            ]}
          >
            <Text style={styles.answers}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8A2BE2" />
        </View>
      ) : filteredExploreData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No posts found</Text>
        </View>
      ) : (
      <FlatList
        key={selectedCategory}
        numColumns={2}
          data={filteredExploreData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => navigation.navigate("ExploreDetail", { item })}
            >
            <Image source={item.image} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.userContainer}>
                <View style={styles.profileContainer}>
              <Image source={item.profileImage} style={styles.profileImageSmall} />
                  <Text style={styles.flagIconSmall}>{getEmojiFlag(item.country)}</Text>
                </View>
              <Text style={styles.user}>{item.user}</Text>
              <View style={styles.ratingContainer}>
                  <TouchableOpacity 
                    onPress={() => handleVote(item.id, 'up')}
                    style={[styles.voteButton, userVotes[item.id] === 'up' && styles.voteButtonActive]}
                  >
                    <FontAwesome5 name="arrow-up" size={12} color={userVotes[item.id] === 'up' ? "#8A2BE2" : "#32CD32"} />
                  </TouchableOpacity>
                  <Text style={styles.rating}>{postRatings[item.id] || item.rating}%</Text>
                  <TouchableOpacity 
                    onPress={() => handleVote(item.id, 'down')}
                    style={[styles.voteButton, userVotes[item.id] === 'down' && styles.voteButtonActive]}
                  >
                    <FontAwesome5 name="arrow-down" size={12} color={userVotes[item.id] === 'down' ? "#8A2BE2" : "#FF4500"} />
                  </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
        columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={{ paddingBottom: 5 }}
      />
      )}
    </View>
  );
};

const QuestionsComponent = () => {
  const navigation = useNavigation();
  const [selectedPriority, setSelectedPriority] = useState("High");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [questionsData, setQuestionsData] = useState([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState({});

  // Filter questions data based on search query and priority
  const filteredQuestionsData = questionsData.filter(item => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(searchLower) ||
                         item.description.toLowerCase().includes(searchLower);
    const matchesPriority = selectedPriority === "All" || selectedPriority === item.priority;
    return matchesSearch && matchesPriority;
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
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      
      if (!token || !userId) {
        Alert.alert('Error', 'Please login to post comments');
        return;
      }

      // Send comment to backend
      const response = await fetch('http://192.168.35.214:3000/addComment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          post_id: questionId,
          text: commentText
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('userId');
          throw new Error('Your session has expired. Please login again.');
        }
        throw new Error(responseData.error || 'Failed to post comment');
      }

      // Update local state with the new comment including user details
      setComments(prev => ({
        ...prev,
        [questionId]: [...(prev[questionId] || []), {
          id: responseData.id,
          text: responseData.text,
          user: responseData.name,
          profile_image: responseData.profile_image,
          country: responseData.country,
          timestamp: responseData.created_at
        }]
      }));

      // Fetch updated comments count from the server
      const commentsResponse = await fetch(`http://192.168.35.214:3000/getComments/${questionId}`);
      const commentsData = await commentsResponse.json();

      // Update the answer count in questionsData with the actual count from the server
      setQuestionsData(prev => prev.map(item => {
        if (item.id === questionId) {
          return {
            ...item,
            answers: commentsData.length
          };
        }
        return item;
      }));

      setCommentText("");
    } catch (error) {
      console.error('Error submitting comment:', error);
      Alert.alert('Error', error.message || 'Failed to post comment. Please try again.');
    }
  };

  // Function to fetch comments for a question
  const fetchComments = async (questionId) => {
    try {
      const response = await fetch(`http://192.168.35.214:3000/getComments/${questionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const commentsData = await response.json();
      
      // Update the answer count in questionsData
      setQuestionsData(prev => prev.map(item => {
        if (item.id === questionId) {
          return {
            ...item,
            answers: commentsData.length
          };
        }
        return item;
      }));

      // Transform the comments data to include all necessary fields
      const formattedComments = commentsData.map(comment => ({
        id: comment.id,
        text: comment.text,
        user: comment.name,
        profile_image: comment.profile_image,
        country: comment.country,
        timestamp: comment.created_at
      }));

      setComments(prev => ({
        ...prev,
        [questionId]: formattedComments
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Update useEffect to fetch comments when a question is selected
  useEffect(() => {
    if (selectedAnswer) {
      fetchComments(selectedAnswer);
    }
  }, [selectedAnswer]);

  useFocusEffect(
    useCallback(() => {
      const fetchQuestions = async () => {
        try {
          const response = await fetch('http://192.168.35.214:3000/getQuestions');
          const data = await response.json();
          
          // Fetch comments count for each question
          const questionsWithAnswers = await Promise.all(
            data.map(async (question) => {
              const commentsResponse = await fetch(`http://192.168.35.214:3000/getComments/${question.id}`);
              const commentsData = await commentsResponse.json();
              return {
                ...question,
                answers: commentsData.length
              };
            })
          );
          
          console.log("Fetched questions with answers:", questionsWithAnswers);
          setQuestionsData(questionsWithAnswers);
        } catch (error) {
          console.error('Error fetching questions:', error);
        }
      };
  
      fetchQuestions();
    }, [])
  );

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

      {/* Priority Filters */}
      <View style={styles.categoryContainer}>
        {priorityCategories.map((priority) => (
          <TouchableOpacity
            key={priority}
            onPress={() => setSelectedPriority(priority)}
            style={[
              styles.answerButton,
              selectedPriority === priority && styles.answerButtonActive
            ]}
          >
            <Text style={styles.answers}>{priority}</Text>
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
                <FontAwesome5 name="comment" size={14} color={selectedAnswer === item.id ? "#FFFFFF" : "#8A2BE2"} />
                <Text style={[styles.answers, { color: selectedAnswer === item.id ? "#FFFFFF" : "#8A2BE2" }]}>
                  Answer {item.answers || 0}
                </Text>
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
                      <View style={styles.commentUserInfo}>
                        <View style={styles.commentProfileContainer}>
                          <Image 
                            source={{ uri: comment.profile_image }} 
                            style={styles.commentProfileImage} 
                          />
                          <Text style={styles.commentFlag}>{getEmojiFlag(comment.country)}</Text>
                        </View>
                        <View style={styles.commentUserDetails}>
                          <Text style={styles.commentUserName}>{comment.user}</Text>
                          <Text style={styles.commentTime}>
                            {new Date(comment.timestamp).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
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
    paddingHorizontal: 5,
    gap: 8,
  },
  answerButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#8A2BE2",
    minWidth: 80,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  answerButtonActive: {
    backgroundColor: "#8A2BE2",
  },
  answers: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
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
    position: 'relative',
    marginRight: 5,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  flagIconSmall: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    fontSize: 7,
    backgroundColor: '#222',
    borderRadius: 3,
    padding: 1,
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
    width: 20,
    height: 20,
    borderRadius: 10,
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
    gap: 4,
  },
  voteButton: {
    padding: 4,
    borderRadius: 4,
  },
  voteButtonActive: {
    backgroundColor: '#333',
  },
  rating: {
    color: "#32CD32",
    fontSize: 12,
    minWidth: 30,
    textAlign: 'center',
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
    marginBottom: 5,
  },
  commentUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentProfileContainer: {
    position: 'relative',
    marginRight: 10,
  },
  commentProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  commentFlag: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    fontSize: 10,
    backgroundColor: '#222',
    borderRadius: 4,
    padding: 1,
  },
  commentUserDetails: {
    flex: 1,
  },
  commentUserName: {
    color: '#8A2BE2',
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentTime: {
    color: '#bbb',
    fontSize: 12,
    marginTop: 2,
  },
  commentText: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
    marginLeft: 40, // Align with the username
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    color: '#bbb',
    fontSize: 16,
  },
});
