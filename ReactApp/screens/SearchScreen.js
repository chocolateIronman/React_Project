import React, {Component} from 'react';
import {
    View,
    Text,
    Button,
    FlatList,
    Image,
    ActivityIndicator,
    AsyncStorage,
    TextInput,
    TouchableOpacity
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Card} from 'react-native-shadow-cards';



export class SearchScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            userListData: []
        }

    }

    search() {
        return fetch('http://10.0.2.2:3333/api/v0.0.5/search_user?q=' + this.state.username, {
            headers: {
                'Content-Type': 'application/json'
            }

        }).then((response) => response.json()).then((responseJson) => {
            this.setState({userListData: responseJson},()=>this.setState({username:""}));
        })
        .catch((error) => {
            console.log(error);
        });
    }
    
    getID(item){
        global.userid=item;
        this.props.navigation.jumpTo('Profile', {
            userid: item});
            
    }
    


    render() {
        return (
            <View style={{flex: 1,flexDirection: 'column',margin: 20}}>
                <View style={{paddingBottom: 20}}>
                    <Text style={{textAlign: 'center',color: '#8ceded',fontSize: 45}}>Chittr</Text>
                    <Text style={{textAlign: 'center',fontSize: 15}}>Search for a user</Text>
                </View>

                <View>
                    <TextInput value={this.state.username} placeholder="Type here..." style={{borderWidth: 1,borderRadius: 50,borderColor: 'grey'}}onChangeText={(text) => this.setState({username: text})}></TextInput>
                </View>
            
                <View style={{margin: 10}}>
                    <Button title="Search" onPress={() => this.search()}></Button>
                </View>

                <View>
                    <FlatList data={this.state.userListData} 
                        renderItem={({item}) => <TouchableOpacity onPress={() => this.getID(item.user_id)}><Card style={{padding: 10,margin: 10,alignSelf: 'center'}} >
                            <View style={{flex: 1,flexDirection: 'row'}} >
                                <Image style={{width: 50, height: 50, borderRadius: 50}} 
                                    source={{uri: 'http://10.0.2.2:3333/api/v0.0.5/user/'+item.user_id+'/photo'}}></Image>
                                <View style={{marginTop: 15, marginLeft: 10}}>
                                    <Text style={{fontWeight: 'bold'}}>{item.given_name} {item.family_name} </Text>
                                </View>
                               
                            </View>
                        </Card>
                        </TouchableOpacity>
                        }
                        keyExtractor={({id}, index) => id}/>
                </View>

            </View>
            )
    }
}
