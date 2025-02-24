# TravelConnect

## 📌 Introduction
**TravelConnect** is a travel platform designed to bridge the gap between travelers and locals. The platform provides real-time, location-specific insights, fostering community-driven engagement and personalized travel experiences. 

## 🚀 Features
- **Q&A Section** – Travelers can ask and receive answers from locals or other travelers.
- **Blog & Travel Stories** – Share and read travel experiences, tips, and recommendations.
- **Booking Options** – Users can book flights, accommodations, and entry tickets.
- **Route Guidance** – Provides optimized routes and navigation for travelers.
- **Blockchain Integration** – Secure transactions and verification of experiences.
- **Admin Panel** – Manages user reports, bookings, and system content.

## 🏗️ Tech Stack
- **Frontend**: React Native (for mobile app)
- **Backend**: Node.js with Express
- **Database**: MongoDB / Firebase
- **Blockchain**: (Optional) Smart Contracts for secure transactions

## 🎯 Setup Guide

### 1️⃣ Prerequisites
Make sure you have the following installed:
- **Node.js** (v16+)
- **Expo CLI** (`npm install -g expo-cli`)
- **Android Studio** (if using andriod studio emulator)
- **MongoDB** (if using a self-hosted database)
- **Firebase CLI** (if using Firebase)

### 2️⃣ Installation
Clone the repository:
```bash
git clone https://github.com/your-repo/travelconnect.git
cd travelconnect
```
#### 1.Extra react installation
```bash
npm install
npm install @react-navigation/native-stack
npm install @react-navigation/stack
npx expo install react-native-gesture-handler
npm install @react-navigation/native-stack
npm install @react-navigation/bottom-tabs
npm install @react-navigation/material-top-tabs
npx expo install react-native-pager-view
npm install react-native-dotenv
```

### 3️⃣ Running the Project
Start the Expo development server:
```bash
npm start
```

#### If found error when running react native expo app
error: Android Bundling failed 6279ms index.js (1020 modules) ERROR node_modules\react-native\Libraries\Debugging\DebuggingOverlayRegistry.js: C:\Eemun\travelConnect\node_modules\react-native\Libraries\Debugging\DebuggingOverlayRegistry.js: Class private methods are not enabled. Please add @babel/plugin-transform-private-methods to your configuration. 117 | }; 118 |

To resolve the error, you need to add the @babel/plugin-transform-private-methods plugin to your Babel configuration. Additionally, ensure that the loose mode is consistent across all necessary plugins.
```bash
module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
    }],
    ['@babel/plugin-transform-class-properties', { loose: true }],
    ['@babel/plugin-transform-private-methods', { loose: true }],
    ['@babel/plugin-transform-private-property-in-object', { loose: true }]
  ],
};
```
After updating the configuration, restart your server and clear the bundler cache if necessary. You can do this by running:
```bash
npx cross-env BABEL_SHOW_CONFIG_FOR=C:/Eemun/travelConnect/index.js npm start --clear
```

### 4️⃣ Backend Setup
Navigate to the backend folder:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Start the backend server:
```bash
npm run dev
```

### 5️⃣ Environment Variables
Create a .env file in the root directory and configure:

```bash
MONGO_URI=your_mongodb_connection_string
FIREBASE_API_KEY=your_firebase_api_key
JWT_SECRET=your_secret_key
```
