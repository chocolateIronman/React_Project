import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer'
import {HomeScreen} from './screens/HomeScreen';
import {RegisterScreen} from "./screens/RegisterScreen";
import {SearchScreen} from "./screens/SearchScreen";
import {UserScreen} from './screens/UserScreen';
import {PostScreen} from './screens/PostScreen';
import { EditScreen } from './screens/EditScreen';

//Initialising Tab and Drawer navigation
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

//Creating the Tab navigation and adding all the appropriate screens
const TabScreen = () =>{
  return(
  <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Home" component={HomeScreen}></Tab.Screen>
      <Tab.Screen name="Search" component={SearchScreen}></Tab.Screen>
      <Tab.Screen name="Post Chit" component={PostScreen}></Tab.Screen>
      
    </Tab.Navigator>
  )
}

//Main navigation - Drawer; adding all the appropriate screens and linking the Tab navigation
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