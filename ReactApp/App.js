import React, {Component} from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


const Stack=createStackNavigator();

const HomeScreen=(props)=>(
  <View>
    <Text>Home Screen</Text>
  </View>
)
export default function App(){
  return <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen}></Stack.Screen>
    </Stack.Navigator>
  </NavigationContainer>
}