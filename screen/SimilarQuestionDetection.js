import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const SimilarQuestionDetection = ({ route }) => {
    const navigation = useNavigation();
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    // Simulated similar questions (replace this with an API call in production)
    const similarQuestions = [
        {
            id: 1,
            title: "Vegetarian food options near Setapak after 10 PM",
        },
        {
            id: 2,
            title: "Recommendation for pet-friendly vegetarian food in Kuala Lumpur area",
        },
        {
            id: 3,
            title: "Late-night vegetarian-friendly restaurants in KL",
            answer: [
                "Hi, my favourite to-go vegetarian food opens till 11pm. It’s called Mamakim...",
                "There is a vegetarian restaurant near Bukit Bintang and it closes at 10pm. It’s ...",
            ],
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <FontAwesome5 name="arrow-left" size={20} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Similar Questions found!</Text>
            </View>

            <View style={styles.questionContainer}>
                <View style={styles.centerIcon}>
                    <Text style={styles.centerIconText}>Q</Text>
                </View>
                <Text style={styles.questionTitle}>Where can I find vegetarian food near Setapak at midnight?</Text>
            </View>

            <Text style={styles.subtitle}>
                Do any of these match your question? If yes, click to view answers.
            </Text>

            <ScrollView style={styles.listContainer}>
                {similarQuestions.map((item) => (
                    <View key={item.id}>
                        <TouchableOpacity style={styles.questionItem} onPress={() => setSelectedQuestion(item)}>
                            <Text style={styles.questionText}>{item.title}</Text>
                        </TouchableOpacity>
                        {selectedQuestion?.id === item.id && selectedQuestion.answer && (
                            <View style={styles.answerContainer}>
                                <View style={styles.questionContainer}>
                                    <View style={styles.centerIcon}>
                                        <Text style={styles.centerIconText}>A</Text>
                                    </View>
                                    <Text style={styles.answerTitle}>{selectedQuestion.title}</Text>
                                </View>
                                {selectedQuestion.answer.map((ans, index) => (
                                    <Text key={index} style={styles.answerText}>{ans}</Text>
                                ))}
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>

            <TouchableOpacity
                style={styles.postButton}
                onPress={() => navigation.navigate("AskLocal")}
            >
                <Text style={styles.postButtonText}>Continue to post</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
        padding: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        paddingTop: 40,
    },
    headerTitle: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        flex: 1,
        textAlign: "center",
    },
    questionContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    centerIcon: {
        width: 45,
        height: 45,
        backgroundColor: "#A64DFF",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    centerIconText: {
        color: "white",
        fontSize: 30,
        fontWeight: "bold",
    },
    questionTitle: {
        color: "#8A2BE2",
        fontSize: 18,
        fontWeight: "bold",
        flex: 1,
    },
    subtitle: {
        color: "#bbb",
        fontSize: 14,
        textAlign: "center",
        marginBottom: 10,
    },
    listContainer: {
        flex: 1,
    },
    questionItem: {
        backgroundColor: "#1a1a1a",
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
    },
    questionText: {
        color: "#fff",
        fontSize: 14,
    },
    answerContainer: {
        backgroundColor: "#4B0082",
        padding: 12,
        borderRadius: 10,
        marginTop: 5,
    },
    answerTitle: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    answerText: {
        color: "white",
        fontSize: 14,
        marginBottom: 5,
    },
    postButton: {
        backgroundColor: "#A64DFF",
        paddingVertical: 12,
        borderRadius: 30,
        alignItems: "center",
        marginTop: 20,
    },
    postButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
      },
      modalContent: {
        backgroundColor: "#222",
        padding: 20,
        borderRadius: 10,
        width: "90%",
      },
      modalTitle: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
      },
});

export default SimilarQuestionDetection;
