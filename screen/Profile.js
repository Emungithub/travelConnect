import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const Profile = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const email = await AsyncStorage.getItem('email');
      const userId = await AsyncStorage.getItem('userId');
      
      console.log('Stored credentials:', { 
        hasToken: !!token, 
        email,
        userId,
        tokenFirstChars: token ? token.substring(0, 10) + '...' : null 
      });

      if (!token || !email) {
        console.log('Missing credentials - token:', !!token, 'email:', !!email);
        await AsyncStorage.multiRemove(['token', 'email', 'userId']);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
        return;
      }

      console.log('Fetching user profile for email:', email);
      const response = await fetch(`http://192.168.35.47:3000/getUserProfile?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Profile response status:', response.status);
      const responseData = await response.json();
      console.log('Profile response data:', responseData);

      if (!response.ok) {
        console.log('Profile fetch failed:', response.status, responseData);
        if (response.status === 401) {
          console.log('Token expired or invalid, logging out');
          await AsyncStorage.multiRemove(['token', 'email', 'userId']);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
          return;
        }
        throw new Error(responseData.error || 'Failed to fetch user data');
      }

      setUserData(responseData);

    } catch (error) {
      console.error('Profile fetch error:', error);
      setUserData({
        name: 'Guest User',
        country: 'Not Set',
        language: 'Not Set',
        gender: 'Not Set',
        profile_image: null
      });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'email']);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8A2BE2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.iconGroup}>
            <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
              <FontAwesome5 name="sign-out-alt" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.iconButton}>
              <FontAwesome5 name="cog" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Image 
              source={userData?.profile_image ? { uri: userData.profile_image } : require("../assets/explore/2.png")} 
              style={styles.profilePic} 
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userData?.name || 'User'}</Text>
              <View style={styles.locationRow}>
                <FontAwesome5 name="map-marker-alt" size={14} color="#8A2BE2" />
                <Text style={styles.profileLocation}>
                  {userData?.country || 'Location not set'}
                </Text>
              </View>
              <View style={styles.languageRow}>
                <FontAwesome5 name="language" size={14} color="#8A2BE2" />
                <Text style={styles.profileLocation}>
                  {userData?.language || 'Language not set'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Moments</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
          </View>
        </View>

        <View style={styles.bioSection}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.bioText}>
            {userData?.bio || "Hey there! I'm excited to connect with travelers and share experiences."}
          </Text>
        </View>

        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            {[
              { type: 'tour', text: 'Created a new tour', time: '2h ago' },
              { type: 'connect', text: 'Connected with Sarah', time: '5h ago' },
              { type: 'review', text: 'Received a 5-star review', time: '1d ago' }
            ].map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <FontAwesome5 
                    name={
                      activity.type === 'tour' ? 'map-marked-alt' : 
                      activity.type === 'connect' ? 'user-friends' : 'star'
                    } 
                    size={16} 
                    color="#8A2BE2" 
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityText}>{activity.text}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center"
  },
  headerBar: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#1A1A1A',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  iconGroup: {
    flexDirection: 'row',
    gap: 15,
  },
  iconButton: {
    padding: 8,
    backgroundColor: '#333',
    borderRadius: 20,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#8A2BE2',
  },
  profileInfo: {
    marginLeft: 15,
    flex: 1,
  },
  profileName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileLocation: {
    color: '#B0B0B0',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#333',
  },
  statNumber: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#B0B0B0',
    fontSize: 12,
  },
  bioSection: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  bioText: {
    color: '#E0E0E0',
    fontSize: 14,
    lineHeight: 22,
  },
  activitySection: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  activityList: {
    gap: 15,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 12,
  },
  activityIcon: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 4,
  },
  activityTime: {
    color: '#B0B0B0',
    fontSize: 12,
  },
});

export default Profile;
