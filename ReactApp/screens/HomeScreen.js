import React, {Component} from 'react';
import {View, Text, Button, FlatList, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Card} from 'react-native-shadow-cards';

export class HomeScreen extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isLoading: true,
        chitsListData: []
      }
    }
  
    getData() {
      return fetch('http://10.0.2.2:3333/api/v0.0.5/chits', {
        headers: {
          'Content-type': 'application/json',
          //'X-Authorization' : KEY
        }
      }).then((response) => response.json()).then((responseJson) => {
        this.setState({isLoading: false, chitsListData: responseJson});
      }).catch((error) => {
        console.log(error);
      });
    }
    componentDidMount() {
      this.getData();
    }
  
    render() {
      return (
        <View>
          <Text style={{textAlign: 'center', color: '#8ceded', fontSize:35}}>Chittr</Text>
          <FlatList
            data={this.state.chitsListData}
            renderItem={({item}) => 
            <Card style={{padding: 10, margin: 10, alignSelf:'center'}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Image style={{width: 50, height: 50, borderRadius: 50}}
            source={{uri: 'http://10.0.2.2:3333/api/v0.0.5/user/'+item.user.user_id+'/photo'}}></Image>
             
              <View style={{marginTop:15, marginLeft:10}}>
                <Text style={{fontWeight: 'bold'}}>{item.user.given_name} {item.user.family_name}</Text>
                <Text style={{marginTop:5,maxWidth:270}}>{item.chit_content}</Text>
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