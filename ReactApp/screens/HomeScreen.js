import React, {Component, useCallback} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  Image,
  ActivityIndicator,
  AsyncStorage
} from 'react-native';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Card} from 'react-native-shadow-cards';

function Refresh(){
  useFocusEffect(useCallback(()=>{
    console.debug("got focus");
    //if(window.HomeScreenComponent.state.mounted) {
      console.debug("refreshing");
      window.HomeScreenComponent.refreshUpdate();
    //}
    return()=>{console.debug("lost focus");}
  },[]));
  return null;
}
export class HomeScreen extends Component {
  constructor(props) {
    super(props);
    window.HomeScreenComponent=this;
    this.state = {
      isLoading: true,
      chitsListData: [],
      requestHeaders: {
        'Content-Type': 'application/json'
      },
      time: 0,
      mounted:false
    }

  }

  getData() {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/chits', { 
      headers: this.state.requestHeaders 
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({ 
        isLoading: false, 
        chitsListData: responseJson 
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  refreshUpdate = function () {
    if (global.key != null & global.key != undefined) {
      console.debug("setting key in header",global.key);
      this.setState({
        requestHeaders: {
          'Content-Type': 'application/json',
          'X-Authorization': global.key
        }
      },() =>this.getData().then(
        this.setState({ isLoading: false })
      ));
      /* this.getData().then(
        this.setState({ isLoading: false })
      ) */
    } else {
      this.getToken().then(() => {
        if (global.key != null && global.key != undefined) {
          console.debug("setting key in header2 ",global.key);
          this.setState({
            requestHeaders: {
              'Content-Type': 'application/json',
              'X-Authorization': global.key
            }
          });
        } else {
          console.debug("can't find key");
          this.setState({
            requestHeaders: {
              'Content-Type': 'application/json'
            }
          });
        }
        this.getData();
      });
    }
  }

  componentDidMount() {
    console.debug("mounting");
    this.setState({
      mounted:true
    });
  }

  async getToken() {
    try {
      let token = await AsyncStorage.getItem('access_token');
      //console.log("Token222 is:" + token);
      global.key = token;
      console.log("global token is:" + global.key);
      //console.log(global.key);
      //this.refreshUpdate()
    } catch (error) {
      console.log("Something went wrong!")
    }
  }

  render() {
    
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator/>
          <Refresh></Refresh>
        </View>
      )
    }

    return (
      <View style={{flex:1,flexDirection: 'column', margin:20}}>
        <Refresh></Refresh>
        <Text style={{textAlign: 'center', color: '#8ceded',  fontSize: 45}}>Chittr</Text>
        <FlatList data={this.state.chitsListData} renderItem={({item}) => <Card style={{padding: 10, margin: 10, alignSelf: 'center'}}>
          <View style={{flexDirection: 'row'}}>
            <Image style={{width: 50, height: 50, borderRadius: 50}}
              source={{uri: 'http://10.0.2.2:3333/api/v0.0.5/user/' + item.user.user_id + '/photo'}}></Image>
            <View style={{marginTop: 15,marginLeft: 10}}>
              <Text style={{fontWeight: 'bold'}}>{item.user.given_name} {item.user.family_name}</Text>
              <Text style={{marginTop: 5, maxWidth: 270}}>{item.chit_content}</Text>
            </View>
          </View>
        </Card>}
          keyExtractor={({
          id
        }, index) => id}/>
      </View>
    );
  }
}