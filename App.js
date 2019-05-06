import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Constants } from 'expo';

import FeedScreen from './components/Feed';
import ProfileScreen from './components/Profile';
import EditScreen from './components/Edit';
import CreateScreen from './components/Create';
import PublishScreen from './components/Publish';
import LoginScreen from './components/Login';

import {
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer,
  createSwitchNavigator
} from 'react-navigation';

import * as firebase from 'firebase';

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBWJ-jeA_4f9xQ3nUhvv-fvibglcls6C1w",
  authDomain: "demoappteach.firebaseapp.com",
  databaseURL: "https://demoappteach.firebaseio.com",
  projectId: "demoappteach",
  storageBucket: "demoappteach.appspot.com",
  messagingSenderId: "954152720296"
};

if (firebase.apps.length < 1) {
  firebase.initializeApp(config);
}

const ProfileStack = createStackNavigator({
  Profile: ProfileScreen,
  Edit: EditScreen,
});

const CreateStack = createStackNavigator({
  Create: CreateScreen,
  Publish: PublishScreen
});

const Tabs = createBottomTabNavigator({
  Home: FeedScreen,
  Create: CreateStack,
  Profile: ProfileStack,
});

const AuthSwitch = createSwitchNavigator({
  App: Tabs,
  Login: LoginScreen,
});

const App = createAppContainer(AuthSwitch);

export default App;
