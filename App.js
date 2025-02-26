import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './LoginScreen';
import RecommendationScreen from './RecommendationScreen';
import ExploreScreen from './ExploreScreen';
import AskLocalScreen from './AskLocalScreen';
import ContentGPT from './ContentGPT';
import ConnectPage from "./ConnectPage";
import DetailsPage from "./DetailsPage";
import SimilarQuestionDetection from './SimilarQuestionDetection';
import ChatList from './ChatList';
import Payment from './Payment';
import Profile from './Profile';
import ExploreDetail from './ExploreDetail';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Recommendation" component={RecommendationScreen} />
          <Stack.Screen name="Explore" component={ExploreScreen} />
          <Stack.Screen name="AskLocal" component={AskLocalScreen} />
          <Stack.Screen name="ContentGPT" component={ContentGPT} />
          <Stack.Screen name="ConnectPage" component={ConnectPage} />
          <Stack.Screen name="DetailsPage" component={DetailsPage} />
          <Stack.Screen name="SimilarQuestionDetection" component={SimilarQuestionDetection} />
          <Stack.Screen name="ChatList" component={ChatList} />
          <Stack.Screen name="Payment" component={Payment} />
          <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="ExploreDetail" component={ExploreDetail} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
