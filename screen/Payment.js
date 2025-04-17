import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, Alert } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const PaymentScreen = ({ route }) => {
  const navigation = useNavigation();
  const [showPaymentModal, setShowPaymentModal] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { questionData } = route.params || {};

  const handlePayment = async () => {
    try {     
      // Explicitly create the data object with string priority
      const postData = {
        user_id: questionData.user_id,
        title: questionData.title,
        description: questionData.description,
        priority: "High"  // Explicitly set as string
      };

      // Log the exact data being sent
      console.log('📤 Payment Data (before fetch):', {
        ...postData,
        priorityType: typeof postData.priority
      });

      const response = await fetch('http://192.168.35.214:3000/addPost', {  // Changed to addPost endpoint
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });

      const data = await response.json();
      console.log('📩 Server Response:', data);

      if (response.ok) {
        setShowPaymentModal(false);
        setShowSuccessModal(true);
      } else {
        Alert.alert(
          'Error',
          data.error || 'Failed to save question. Please try again.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      console.error('❌ Network Error:', error);
      Alert.alert(
        'Error',
        'Failed to connect to the server. Please check your internet connection and try again.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
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
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { borderColor: '#A64DFF' }]}>
            <View style={[styles.priorityHeader, { backgroundColor: '#A64DFF' }]}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => {
                  setShowPaymentModal(false);
                  navigation.goBack();
                }}
              >
                <FontAwesome5 name="times" size={20} color="white" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Payment</Text>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.paymentDetails}>
                <View style={styles.amountContainer}>
                  <Text style={styles.amountLabel}>Total Amount</Text>
                  <Text style={styles.amountValue}>RM 2.00</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentInfoText}>Priority Response Fee</Text>
                  <Text style={styles.paymentInfoText}>This will ensure faster responses from locals</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={[styles.payButton, { marginTop: 20 }]} 
                onPress={handlePayment}
              >
                <Text style={styles.payButtonText}>Pay Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { borderColor: '#4CAF50' }]}>
            <View style={[styles.priorityHeader, { backgroundColor: '#4CAF50' }]}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => {
                  setShowSuccessModal(false);
                  navigation.navigate('Explore');
                }}
              >
                <FontAwesome5 name="times" size={20} color="white" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Success!</Text>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.successIconContainer}>
                <FontAwesome5 name="check-circle" size={60} color="#4CAF50" />
              </View>
              <Text style={styles.modalDescription}>Payment successful! Your question will be prioritized.</Text>
              <TouchableOpacity 
                style={[styles.payButton, { marginTop: 20 }]} 
                onPress={() => {
                  setShowSuccessModal(false);
                  navigation.navigate('Explore');
                }}
              >
                <Text style={styles.payButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "#222",
    borderRadius: 10,
    width: "90%",
    borderWidth: 2,
    overflow: 'hidden',
  },
  priorityHeader: {
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: 'relative',
  },
  modalBody: {
    padding: 20,
  },
  modalTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  paymentDetails: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 15,
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  amountLabel: {
    color: "#bbb",
    fontSize: 16,
    marginBottom: 5,
  },
  amountValue: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: 15,
  },
  paymentInfo: {
    alignItems: 'center',
  },
  paymentInfoText: {
    color: "#bbb",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 5,
  },
  payButton: {
    backgroundColor: "#A64DFF",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  payButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  successIconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalDescription: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 1,
  },
});

export default PaymentScreen;
