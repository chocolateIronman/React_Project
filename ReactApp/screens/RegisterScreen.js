import React, {Component} from 'react';
import {
    View,
    Text,
    Button,
    FlatList,
    Image,
    TextInput
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
//import console = require('console');


export class RegisterScreen extends Component {
   
    constructor(props) {
        super(props);
        this.state = {
            showLogin:true        
        }
        


      }
      
    toggleLogin(){
        console.log("toggle",this.state.showLogin);
        this.setState({showLogin:!this.state.showLogin});
    }
     
      
    render() {
        if(this.state.showLogin){
            return (
           
           
                <View style={{flex:1,flexDirection: 'column', margin:20}}>
                    <View style={{paddingBottom:20}}>
                        <Text style={{textAlign: 'center', color: '#8ceded', fontSize:45}}>Chittr</Text>
                        <Text style={{textAlign: 'center',  fontSize:25}}>Register</Text>
                    </View>
                    <View style={{paddingBottom:20}}>
                       
                        <TextInput label="Title" placeholder="Name" style={{borderWidth:1, borderRadius:50, borderColor: 'grey'}}></TextInput>
                    </View>
                    <View style={{paddingBottom:20}}>
                       
                        <TextInput label="Title" placeholder="Surname" style={{borderWidth:1, borderRadius:50, borderColor: 'grey'}}></TextInput>
                    </View>
                    <View style={{paddingBottom:20}}>
                       
                        <TextInput label="Title" placeholder="Email" style={{borderWidth:1, borderRadius:50, borderColor: 'grey'}}></TextInput>
                    </View>
                    <View style={{paddingBottom:20}}>
                        
                        <TextInput secureTextEntry={true} placeholder="Password" style={{borderWidth:1, borderRadius:50, borderColor: 'grey'}}></TextInput>
                    </View>
                    <View style={{margin:10}}>
                        <Button title="Sign Up" ></Button>
                    </View>
                    <View style={{margin:10}}>
                        <Text style={{textAlign:'center'}}>Already have an account?</Text>
                        <Button title="Log In" onPress={()=>{this.toggleLogin()}}></Button>
                        
                    </View>
                    
                </View>
            )
        }
        else{
            return(
                <View style={{flex:1,flexDirection: 'column', margin:20}}>
                    <View style={{paddingBottom:20}}>
                        <Text style={{textAlign: 'center', color: '#8ceded', fontSize:45}}>Chittr</Text>
                        <Text style={{textAlign: 'center',  fontSize:25}}>Log In</Text>
                    </View>
                    <View style={{paddingBottom:20}}>
                      
                        <TextInput label="Title" placeholder="Email" style={{borderWidth:1, borderRadius:50, borderColor: 'grey'}}></TextInput>
                    </View>
                    <View style={{paddingBottom:20}}>
                       
                        <TextInput secureTextEntry={true} placeholder="Password" style={{borderWidth:1, borderRadius:50, borderColor: 'grey'}}></TextInput>
                    </View>
                    <View style={{margin:10}}>
                        <Button title="Log In" ></Button>
                    </View>
                   <View style={{margin:10}}>
                        <Text style={{textAlign:'center'}}>Don't have an account?</Text>
                        <Button title="Sign Up" onPress={()=>{this.toggleLogin()}}></Button>
                        
                    </View>
                </View>
            )

            
        }

        
        
    }
}