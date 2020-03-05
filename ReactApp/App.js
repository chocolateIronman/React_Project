import React, {Component} from 'react';
import {View, Text, Button, FlatList} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

const HomeScreen = ({navigation}) => {
  navigation.setOptions({
    headerRight: () => (
      <Button title="Login" onPress={() => navigation.navigate('Login')}></Button>
    )
  })
 
   
  return (
    <View>
      <FlatList
       
      />

    </View>
  );


  
};



const LoginScreen = (props) => (
  <View>
    <Text>Login:</Text>
  </View>
)

export default function App() {
  return <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Chittr" component={HomeScreen}></Stack.Screen>
      <Stack.Screen name="Login" component={LoginScreen}></Stack.Screen>
    </Stack.Navigator>
  </NavigationContainer>
}