import React, {Component} from 'react';
import {View, Text, Button, FlatList, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Card} from 'react-native-shadow-cards';
import {HomeScreen} from './screens/HomeScreen'

const Tab = createBottomTabNavigator();

function SearchScreen() {
  return (
    <View>
      <Text>Search</Text>
    </View>
  );
};

function LoginScreen() {
  return (
    <View>
      <Text>Login:</Text>
    </View>
  );
};



export default function Navigation() {
  return <NavigationContainer>
    <Tab.Navigator>
      
      <Tab.Screen name="Home" component={HomeScreen}></Tab.Screen>
      <Tab.Screen name="Search" component={SearchScreen}></Tab.Screen>
      <Tab.Screen name="Login" component={LoginScreen}></Tab.Screen>
    </Tab.Navigator>
  </NavigationContainer>
}