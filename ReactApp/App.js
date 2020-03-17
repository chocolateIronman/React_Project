import React, {Component} from 'react';
import {View, Text, Button, FlatList, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer'
import {Card} from 'react-native-shadow-cards';
import {HomeScreen} from './screens/HomeScreen';
import {RegisterScreen} from "./screens/RegisterScreen";
import {SearchScreen} from "./screens/SearchScreen";
import {UserScreen} from './screens/UserScreen';
import {PostScreen} from './screens/PostScreen';
import { EditScreen } from './screens/EditScreen';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();







const TabScreen = () =>{
  return(
  <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Home" component={HomeScreen}></Tab.Screen>
      <Tab.Screen name="Search" component={SearchScreen}></Tab.Screen>
      <Tab.Screen name="Post Chit" component={PostScreen}></Tab.Screen>
    </Tab.Navigator>
  )
}


export default function Navigation(){
  return(
  <NavigationContainer initialRouteName="Home">
      <Drawer.Navigator>
       <Drawer.Screen name="Home" component={TabScreen} />
       <Drawer.Screen name="Login/Logout" component={RegisterScreen}/>
       <Drawer.Screen name='Profile' component={UserScreen} initialParams={{userid:0}}/>
       <Drawer.Screen name="Edit Profile" component={EditScreen}/>
      </Drawer.Navigator>
    </NavigationContainer>
  )
}