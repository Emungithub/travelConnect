import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const PaymentScreen = () => {
  const navigation = useNavigation();
  const [showPaymentModal, setShowPaymentModal] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handlePayment = () => {
    setShowPaymentModal(false);
    setShowSuccessModal(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Travel Wallet</Text>
      </View>
      
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Balance</Text>
        <Text style={styles.balanceAmount}>RM 0.00</Text>
        <TouchableOpacity style={styles.withdrawButton}>
          <Text style={styles.withdrawText}>Reload</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.walletItem}>
        <FontAwesome5 name="coins" size={20} color="white" />
        <Text style={styles.walletText}>0 Travel Coin</Text>
        <Text style={styles.detailsText}> {">"} </Text>
      </View>
      <View style={styles.walletItem}>
        <FontAwesome5 name="gift" size={20} color="white" />
        <Text style={styles.walletText}>Other Payment Option</Text>
        <Text style={styles.detailsText}> {">"} </Text>
      </View>

      {/* Payment Modal */}
      <Modal visible={showPaymentModal} animationType="slide" transparent={true}>
        <View style={styles.paymentModalContainer}>
          <View style={styles.paymentModalContent}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>RM 2.00</Text>
            </View>
            <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
              <Text style={styles.payButtonText}>Pay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Payment Success Modal */}
      <Modal visible={showSuccessModal} animationType="slide" transparent={true}>
        <View style={styles.successModalContainer}>
          <View style={styles.successModalContent}>
            <Image source={require("./assets/travelConnectLogo.png")} style={styles.successIcon} />
            <Text style={styles.successTitle}>Payment successful!</Text>
            <Text style={styles.successMessage}>Your request will be responded to within 15 minutes.</Text>
            <TouchableOpacity style={styles.confirmButton} onPress={() => setShowSuccessModal(false)}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#191919",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingTop: 40,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  balanceContainer: {
    backgroundColor: "#A64DFF",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  balanceLabel: {
    color: "white",
    fontSize: 14,
  },
  balanceAmount: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 10,
  },
  withdrawButton: {
    backgroundColor: "white",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  withdrawText: {
    color: "#A64DFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  walletItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    justifyContent: "space-between",
  },
  walletText: {
    color: "white",
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  detailsText: {
    color: "#BBB",
    fontSize: 14,
  },
  successModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  successModalContent: {
    backgroundColor: "#A64DFF",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  successIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  successTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  successMessage: {
    color: "white",
    fontSize: 14,
    marginVertical: 10,
    textAlign: "center",
  },
  confirmButton: {
    backgroundColor: "#222",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginTop: 10,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default PaymentScreen;
