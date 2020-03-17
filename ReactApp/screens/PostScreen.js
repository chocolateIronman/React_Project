import React, {Component, useCallback} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  Image,
  ActivityIndicator,
  TextInput
} from 'react-native';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Card} from 'react-native-shadow-cards';
import {AsyncStorage} from '@react-native-community/async-storage';

function Refresh(){
    useFocusEffect(useCallback(()=>{
      console.debug("got focus");
     
        console.debug("refreshing");
        window.PostScreenComponent.refreshUpdate();
     
      return()=>{console.debug("lost focus");}
    },[]));
    return null;
  }

export class PostScreen extends Component {
  constructor(props) {
    super(props);
    window.PostScreenComponent=this;
    this.state = {
        chit_content:'',
        requestHeaders: {
            'Content-Type': 'application/json'
        },
        hasKey:false,
        mounted:false
      }

  }

  componentDidMount() {
    console.debug("mounting");
    this.setState({
      mounted:true
    });
  }

  postChit(){
    return fetch("http://10.0.2.2:3333/api/v0.0.5/chits",{
        method: 'POST',
        headers:this.state.requestHeaders,
        body: JSON.stringify({
            chit_content:this.state.chit_content,
            timestamp:Date.now()
        })
    })
    .then((response)=>{
        console.debug(response);
        alert("Chit posted successfully!");
        this.setState({chit_content:""},()=>this.props.navigation.navigate('Home'));
    })
    .catch((error)=>{
        console.error(error);
        alert("Ooops! Something went wrong!");
    });
}

  checkIfEmpty(){
      if(this.state.chit_content==null || this.state.chit_content==undefined){
        alert("Cannot post empty chit!")
      }else{
        this.postChit();
      }
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

  render() {
    if (this.state.hasKey) {
        return (
            <View style={{flex:1,flexDirection: 'column', margin:20}}>
            <Refresh></Refresh>
                <View style={{paddingBottom:20}}>
                    <Text style={{textAlign: 'center', color: '#8ceded', fontSize:45}}>Chittr</Text>
                    <Text style={{textAlign: 'center',  fontSize:25}}>Post your thoughts in a chit!</Text>
                    <Text style={{textAlign: 'center',  fontSize:15, color:'grey'}}>What is happening?</Text>
                </View>
                <View style={{paddingBottom:20}}>
                    <TextInput value={this.state.chit_content} multiline maxLength={140} placeholder="Type something..." style={{borderWidth:1, borderRadius:30, borderColor: 'grey',height:80}} onChangeText={(text) => this.setState({chit_content: text})} ></TextInput>
                    <Text style={{textAlign:'right', fontSize:10,color:'grey'}}>Max characters: 140</Text>
                </View>
                <View style={{margin:10}}>
                    <Button title="Chit" onPress={()=>this.checkIfEmpty()}></Button>
                </View>
            </View>
        );
    }
    else{
        return(
            <View style={{flex:1,flexDirection: 'column', margin:20}}>
                <Refresh></Refresh>
                <View style={{paddingBottom:20}}>
                    <Text style={{textAlign: 'center', color: '#8ceded', fontSize:45}}>Chittr</Text>
                    <Text style={{textAlign: 'center',  fontSize:15}}>You cannot post chits unless logged in!</Text>
                </View>
                <View style={{margin:10}}>
                    <Button title="Log In" onPress={()=>this.props.navigation.navigate('Login/Logout')}></Button>
                </View>
            </View>
        );
    }
  }
}