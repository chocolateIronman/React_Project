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
            showLogin:true,
            given_name:'',
            family_name:'',
            email:'',
            password:'',
            loginpass:'',
            username:''        
        };
      }
      
    toggleLogin(){
        console.log("toggle",this.state.showLogin);
        this.setState({showLogin:!this.state.showLogin});
    }

    signUp(){
        return fetch("http://10.0.2.2:3333/api/v0.0.5/user",{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                given_name: this.state.given_name,
                family_name: this.state.family_name,
                email: this.state.email,
                password: this.state.password
            })
        })
        .then((response)=>{
            alert("Account created successfully!");
            this.setState({showLogin:!this.state.showLogin});
        })
        .catch((error)=>{
            console.error(error);
        });
    }

    logIn(){
        return fetch("http://10.0.2.2:3333/api/v0.0.5/login",{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.username,
                password: this.state.loginpass
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(JSON.stringify({
                email: this.state.username,
               password: this.state.loginpass
            }))
            console.log(responseJson.token);
            alert("Logged in!"+responseJson.token);
        }).catch((error) => {
            console.log(error);
         });
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
                       
                        <TextInput label="Title" placeholder="Name" style={{borderWidth:1, borderRadius:50, borderColor: 'grey'}}  onChangeText={(text) => this.setState({given_name: text})}></TextInput>
                    </View>
                    <View style={{paddingBottom:20}}>
                       
                        <TextInput label="Title" placeholder="Surname" style={{borderWidth:1, borderRadius:50, borderColor: 'grey'}}  onChangeText={(text) => this.setState({family_name: text})}></TextInput>
                    </View>
                    <View style={{paddingBottom:20}}>
                       
                        <TextInput label="Title" placeholder="Email" style={{borderWidth:1, borderRadius:50, borderColor: 'grey'}}  onChangeText={(text) => this.setState({email: text})}></TextInput>
                    </View>
                    <View style={{paddingBottom:20}}>
                        
                        <TextInput secureTextEntry={true} placeholder="Password" style={{borderWidth:1, borderRadius:50, borderColor: 'grey'}}  onChangeText={(text) => this.setState({password: text})}></TextInput>
                    </View>
                    <View style={{margin:10}}>
                        <Button title="Sign Up" onPress={()=>this.signUp()}></Button>
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
                      
                        <TextInput label="Title" placeholder="Email" style={{borderWidth:1, borderRadius:50, borderColor: 'grey'}}  onChangeText={(text) => this.setState({username: text})}></TextInput>
                    </View>
                    <View style={{paddingBottom:20}}>
                       
                        <TextInput secureTextEntry={true} placeholder="Password" style={{borderWidth:1, borderRadius:50, borderColor: 'grey'}}  onChangeText={(text) => this.setState({loginpass: text})}></TextInput>
                    </View>
                    <View style={{margin:10}}>
                        <Button title="Log In" onPress={()=>this.logIn()}></Button>
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