import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

const Profile = () => {
  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <Text style={styles.time}>  </Text>
        <View style={styles.iconGroup}>
          <FontAwesome5 name="cog" size={20} color="white" style={styles.icon} />
        </View>
      </View>

      <ScrollView>
        {/* Profile Summary */}
        <View style={styles.profileSummary}>
          <Image source={require("./assets/explore/2.png")} style={styles.profilePic} />
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>Eemun Leong</Text>
            <Text style={styles.profileLocation}>Kuala Lumpur, Malaysia</Text>
            <View style={styles.completionBadge}>
              <Text style={styles.completionText}>65% Completed</Text>
            </View>
          </View>
          <FontAwesome5 name="chevron-right" size={16} color="white" />
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Moments</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>72</Text>
            <View style={styles.visitorBadge}>
              <Text style={styles.visitorBadgeText}>31</Text>
            </View>
            <Text style={styles.statLabel}>Visitors</Text>
          </View>
        </View>

        {/* VIP Features Card */}
        <View style={styles.vipCard}>
          <Text style={styles.vipTitle}>VIP Features</Text>
          <View style={styles.vipRow}>
            <Text style={styles.vipFeature}>Unlimited Translations</Text>
            <Text style={styles.vipFree}>5 times/day</Text>
            <Text style={styles.vipVIP}>Unlimited</Text>
          </View>
          <View style={styles.vipRow}>
            <Text style={styles.vipFeature}>Unlock Visitors page</Text>
            <Text style={styles.vipFree}>-</Text>
            <Text style={styles.vipVIP}>✓</Text>
          </View>
          <View style={styles.vipRow}>
            <Text style={styles.vipFeature}>Unlock Unlimited Chatgpt </Text>
            <Text style={styles.vipFree}>-</Text>
            <Text style={styles.vipVIP}>✓</Text>
          </View>
          <TouchableOpacity style={styles.vipButton}>
            <Text style={styles.vipButtonText}>See all VIP Features</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  headerBar: { flexDirection: "row", justifyContent: "space-between", padding: 10, paddingTop: 40 },
  time: { color: "white", fontSize: 16 },
  iconGroup: { flexDirection: "row" },
  icon: { marginRight: 10 },
  profileSummary: { flexDirection: "row", alignItems: "center", padding: 15, backgroundColor: "#222", borderRadius: 10, margin: 10 },
  profilePic: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  profileTextContainer: { flex: 1 },
  profileName: { color: "white", fontSize: 16, fontWeight: "bold" },
  profileLocation: { color: "gray", fontSize: 14 },
  completionBadge: { backgroundColor: "#A64DFF", paddingVertical: 2, paddingHorizontal: 10, borderRadius: 10, alignSelf: "flex-start", marginTop: 5 },
  completionText: { color: "white", fontSize: 12 },
  statsContainer: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 10, backgroundColor: "#111", borderRadius: 10, margin: 10 },
  statBox: { alignItems: "center", flex: 1, position: "relative" },
  statNumber: { color: "white", fontSize: 18, fontWeight: "bold" },
  statLabel: { color: "gray", fontSize: 14 },
  visitorBadge: { position: "absolute", top: -5, right: 20, backgroundColor: "#FF3B30", borderRadius: 12, paddingHorizontal: 6, paddingVertical: 2 },
  visitorBadgeText: { color: "white", fontSize: 12, fontWeight: "bold" },
  vipCard: { backgroundColor: "#A64DFF", padding: 15, borderRadius: 15, margin: 10, alignItems: "center" },
  vipTitle: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  vipRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 5 },
  vipFeature: { color: "#fff", fontSize: 14, flex: 2 },
  vipFree: { color: "fff", fontSize: 14, flex: 1, textAlign: "center" },
  vipVIP: { color: "#fff", fontSize: 14, flex: 1, textAlign: "right" },
  vipButton: { backgroundColor: "#222", padding: 10, borderRadius: 25, marginTop: 10,borderWidth:2, width: "80%", alignItems: "center" },
  vipButtonText: { color: "white", fontSize: 14, fontWeight: "bold" }
});

export default Profile;
