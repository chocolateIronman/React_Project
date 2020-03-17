import React, {Component} from 'react';
import { View,Text,Button,FlatList,Image,TextInput} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-community/async-storage';;

const ACCESS_TOKEN ='access_token';

export class RegisterScreen extends Component {
   
    
    constructor(props) {
        super(props);
        this.state = {
            showLogin:true,
            showLogout:false,
            given_name:'',
            family_name:'',
            email:'',
            password:'',
            loginpass:'',
            username:''
        };
      }

    /* async storeToken(accessToken){
        try{
            await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
            this.getToken();
        }catch(error){
            console.log("Something went wrong!")
        }
    }
    async getToken(){
        try{
            let token = await AsyncStorage.getItem(ACCESS_TOKEN);
            console.log("Token is:" + token);
        }catch(error){
            console.log("Something went wrong!")
        }
    }
    async removeToken(){
        try{
            await AsyncStorage.removeItem(ACCESS_TOKEN);
            this.getToken();
        }catch(error){
            console.log("Something went wrong!")
        }
    } */
    /* async storeIDToken(idToken){
        try{
            await AsyncStorage.setItem('id_token', idToken);
            this.getIDToken();
        }catch(error){
            console.log("Something went wrong saving!")
        }
    }
    async getIDToken(){
        try{
            let myID = await AsyncStorage.getItem('id_token').then(global.user_id=null);
            console.log("ID is:" + myID);
        }catch(error){
            console.log("Something went wrong retrieving!")
        }
    }
    async removeIDToken(){
        try{
            await AsyncStorage.removeItem('id_token');
            this.getIDToken();
        }catch(error){
            console.log("Something went wrong removing!")
        }
    } */
    
    async saveData(obj){
        try{
            await AsyncStorage.setItem('user', JSON.stringify(obj));
            this.displayData();
        }catch(error){
            console.log("Error1: "+error)
        }
    }
    async displayData() {
        try {
          let user = await AsyncStorage.getItem('user');
          let parsed = JSON.parse(user);
          console.log("Parsed: "+parsed,"id: ",parsed.id,"token: ",parsed.token)
        } catch(e) {
          console.log("Error2: "+e);
        }
      }

    async removeData(){
        try{
            await AsyncStorage.removeItem('user');
            this.displayData();
        }catch(error){
            console.log("Error3: "+error);
        }
    }

    toggleLogin(){
        console.log("toggle",this.state.showLogin);
        this.setState({showLogin:!this.state.showLogin});
    }
    
    refreshUpdate = function() {
        if((global.key!=null && global.key!=undefined)){
            this.setState({showLogout:true});
        }
    }

    componentDidMount(){
        if((global.key==null || global.key==undefined) &&( global.user_id==null || global.user_id==undefined)) {
            this.displayData().then(()=>{
                if((global.key==null||global.key==undefined)&&(global.user_id==null||global.user_id==undefined)){
                    this.refreshUpdate();
                }
            })
        }
        if((global.key==null || global.key==undefined) &&( global.user_id==null || global.user_id==undefined)){
            this.refreshUpdate();
        }
        this.refreshUpdate();
    }

    async logOut(){
        return fetch("http://10.0.2.2:3333/api/v0.0.5/logout",{
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
                'X-Authorization':global.key
            }
        })
        .then((response)=>{
            alert('Logged out!');
            this.setState({showLogout:!this.state.showLogout},()=>this.removeData().then(this.props.navigation.navigate('Home')));
            global.key=null;
            global.user_id=null;
            
            
            
        })
        .catch((error)=>{
            console.error(error);
        })
    }

    checkIfEmpty(){
        if(this.state.given_name==null || this.state.given_name==undefined || this.state.given_name==''){
            alert("Invalid name"); 
        }
        else if(this.state.family_name==null || this.state.family_name==undefined || this.state.family_name==''){
            alert("Inavlid surname"); 
        }
        else if(this.state.email==null || this.state.email==undefined || this.state.email==''){
            alert("Invalid email"); 
        } 
        else if(this.state.password==null || this.state.password==undefined || this.state.password==''){
            alert("Invalid password"); 
        }   
        else{this.signUp()}
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
            alert("Invalid details! Please check in that everything is filled in correctly!");
        });
    }

    
    async logIn(){
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
                console.log(responseJson);
                let object = responseJson;
                this.saveData(object);
                global.key=object.token;
                global.user_id=object.id;
                console.log(global.key+"! "+global.user_id);

            }).then(()=>{this.setState({ showLogout: !this.state.showLogout }, () => this.props.navigation.navigate('Home'));})
        .catch((error) => {
            this.removeData();
            console.log(error);
            alert("Invalid email or password!");
         });
    }
     
      
    render() {
         if(this.state.showLogout)
        {
            return(
                <View>
                    <View style={{paddingBottom:20}}>
                        <Text style={{textAlign: 'center', color: '#8ceded', fontSize:45}}>Chittr</Text>
                        <Text style={{textAlign: 'center',  fontSize:25}}>Log out</Text>
                    </View>
                    <View style={{margin:10}}>
                        <Button title="Log out" onPress={()=>this.logOut()}></Button>
                    </View>
                </View>
            )
        }
        else{ 
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
                        <Button title="Sign Up" onPress={()=>this.checkIfEmpty()}></Button>
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

}