import React, {Component,useCallback} from 'react';
import {
    View,
    Text,
    Button,
    FlatList,
    Image,
    ActivityIndicator,
    TextInput,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Card} from 'react-native-shadow-cards';
import AsyncStorage from '@react-native-community/async-storage';
import {RNCamera} from 'react-native-camera';

function Refresh(){
    useFocusEffect(useCallback(()=>{
      console.debug("got focus");
      //if(window.HomeScreenComponent.state.mounted) {
        console.debug("refreshing");
        window.EditScreenComponent.refreshUpdate();
      //}
      return()=>{console.debug("lost focus");}
    },[]));
    return null;
  }

export class EditScreen extends Component {
    constructor(props) {
        super(props);
        window.EditScreenComponent=this;
        this.state = {
            userInfoData: [],
            userID:'',
            given_name:'',
            family_name:'',
            email:'',
            password:'',
            mounted:false,
            requestHeaders:{
                'Content-Type':'application/json'
            },
            hasKey:false,
            body: {},
            togglePhoto:false,
            myPhoto:''
        }
       
    }

    componentDidMount() {
        console.debug("mounting");
        this.setState({
          mounted:true
        });
      }


    getUserInfo(){
        return fetch('http://10.0.2.2:3333/api/v0.0.5/user/'+this.state.userID , {
           headers:{
                'Content-Type':'application/json'
           }
        }).then((response) => response.json()).then((responseJson) => {
            this.setState({userInfoData: responseJson},()=>this.setState({given_name:responseJson.given_name},()=>this.setState({family_name:responseJson.family_name},()=>this.setState({email:responseJson.email}))));
        }).catch((error) => {
            console.log(error);
        });
    }


    patchUserInfo(){
        console.log("updating with body: ",this.state.given_name,this.state.family_name,this.state.email,this.state.password);
        console.log("updating with headers: ",this.state.requestHeaders);
        return fetch('http://10.0.2.2:3333/api/v0.0.5/user/'+this.state.userID , {
            method:'PATCH',
            headers: this.state.requestHeaders,
            body: JSON.stringify({
                given_name:this.state.given_name,
                family_name:this.state.family_name,
                email:this.state.email,
                password:this.state.password
            })

        }).then((response)=>{
            console.debug(response);
            alert("Profile updated successfully!");
            
        })
        .catch((error)=>{
            console.error(error);
            alert("Ooops! Something went wrong!");
        });
    }

    togglePhoto(){
        this.setState({togglePhoto:!this.state.togglePhoto})
      }

    async takePicture(){
        if (this.camera) {
            const options = { quality: 0.5, base64: true };
          try{
              let data = await this.camera.takePictureAsync(options);
              console.log(data.uri);
              this.setState({myPhoto:data});
              console.log("My photo:",this.state.myPhoto.uri)
              this.postUserPhoto();
              this.setState({togglePhoto:false})
          }catch(error){
              console.log("Error1: "+error)
          }
      }
    }
       
    postUserPhoto(){
        console.log("Sending my photo: ",this.state.myPhoto.uri);
        console.log("updating with headers: ",global.key);
        return fetch("http://10.0.2.2:3333/api/v0.0.5/user/photo",{
            method: 'POST',
            headers: {
                'X-Authorization':global.key
            },
            body: this.state.myPhoto
        })
            .then((response)=>{
                console.debug("Response from posting photo: ",response)
            })
            .catch((error)=>{
                console.error("OOOPS! "+error);
            });
    }
      
    refreshUpdate(){
        if (global.key != null & global.key != undefined) {
            console.debug("setting key in header",global.key);
            this.setState({
              requestHeaders: {
                'Content-Type': 'application/json',
                'X-Authorization': global.key
              }
            },() =>this.setState({ hasKey: true }));
        }else {
            this.displayData().then(() => {
              if (global.key != null && global.key != undefined) {
                console.debug("setting key in header2 ",global.key);
                this.setState({
                  requestHeaders: {
                    'Content-Type': 'application/json',
                    'X-Authorization': global.key
                  }
                },() =>this.setState({ hasKey: true }));
              } else {
                console.debug("can't find key");
                this.setState({hasKey:false});
              }
            });
          }

          if (global.user_id != null & global.user_id != undefined) {
            console.debug("global id: ",global.user_id);
            this.setState({userID:global.user_id},()=>this.getUserInfo())
            
        }else {
            this.displayData().then(() => {
              if (global.user_id != null && global.user_id != undefined) {
                console.debug("global id2 ",global.user_id);
                this.setState({userID:global.user_id},()=>this.getUserInfo())

              } else {
                console.debug("can't find id");
                this.setState({hasKey:false},()=>this.setState({userID:0}));
                
               
              }
            });
          }
      }
    
      async displayData() {
        try {
          let user = await AsyncStorage.getItem('user');
          let parsed = JSON.parse(user);
          
        } catch(e) {
          console.log("Error2: "+e);
        }
      }




    render(){
        if (this.state.hasKey) {
            if(this.state.togglePhoto==false){
            return (
                <View style={{flex:1,flexDirection: 'column', margin:20}}>
                <Refresh></Refresh>
                    <View style={{paddingBottom:20}}>
                        <Text style={{textAlign: 'center', color: '#8ceded', fontSize:45}}>Chittr</Text>
                        <Text style={{textAlign: 'center',  fontSize:25}}>Edit your profile:</Text>
                    </View>
                    <View style={{paddingBottom:20}}>
                       
                        <TextInput placeholder={this.state.userInfoData.given_name} style={{borderWidth:1, borderRadius:50, borderColor: 'grey'}}  onChangeText={(text) => this.setState({given_name: text})}></TextInput>
                    </View>
                    <View style={{paddingBottom:20}}>
                       
                        <TextInput placeholder={this.state.userInfoData.family_name} style={{borderWidth:1, borderRadius:50, borderColor: 'grey'}}  onChangeText={(text) => this.setState({family_name: text})}></TextInput>
                    </View>
                    <View style={{paddingBottom:20}}>
                       
                        <TextInput placeholder={this.state.userInfoData.email} style={{borderWidth:1, borderRadius:50, borderColor: 'grey'}}  onChangeText={(text) => this.setState({email: text})}></TextInput>
                    </View>
                    <View style={{paddingBottom:20}}>
                        
                        <TextInput secureTextEntry={true} placeholder="Password" style={{borderWidth:1, borderRadius:50, borderColor: 'grey'}}  onChangeText={(text) => this.setState({password: text})}></TextInput>
                    </View>
                    <View style={{margin:10}}>
                        <Button title="Edit" onPress={()=>this.patchUserInfo()}></Button>
                    </View>
                    <View style={{margin:10}}>
                        <Text style={{textAlign:'center'}}>To edit your profile photo:</Text>
                        <Button title="Edit Photo" onPress={()=>this.togglePhoto()}></Button>
                    </View>
                </View>
            );
            }else{
                return(
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                      <RNCamera ref={ref => {this.camera = ref;}} style={ { flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}/>
                      <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                        <TouchableOpacity onPress={this.takePicture.bind(this)} style={{flex:0, backgroundColor:'#8ceded', padding:10, borderWidth:1, borderRadius:50, margin:10}}><Text style={{ fontSize: 16 }}>CAPTURE</Text></TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.togglePhoto()} style={{flex:0, backgroundColor:'orange', padding:10, borderWidth:1, borderRadius:50,margin:10}}><Text style={{ fontSize: 16 }}>CANCEL</Text></TouchableOpacity>
                      </View>
                    </View>
                  )
            }
        }
        else{
            return(
                <View style={{flex:1,flexDirection: 'column', margin:20}}>
                    <Refresh></Refresh>
                    <View style={{paddingBottom:20}}>
                        <Text style={{textAlign: 'center', color: '#8ceded', fontSize:45}}>Chittr</Text>
                        <Text style={{textAlign: 'center',  fontSize:15}}>You cannot edit your profile unless logged in!</Text>
                    </View>
                    <View style={{margin:10}}>
                        <Button title="Log In" onPress={()=>this.props.navigation.navigate('Login/Logout')}></Button>
                    </View>
                </View>
            );
        }
    }
}