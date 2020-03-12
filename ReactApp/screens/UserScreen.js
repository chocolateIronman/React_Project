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
import {NavigationContainer,} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Card} from 'react-native-shadow-cards';
import { black } from 'color-name';


export class UserScreen extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            userInfoData: [],
            userID:'',
            showTweets: true,
            showFollowers: false,
            showFollowing: false,
            followers:[],
            following:[]
        }
        
    }
    
     componentDidMount() {
         if(this.props.route.params!==undefined&& this.props.route.params!==null){
            console.log(this.props.route.params.userid);
            this.setState({userID:this.props.route.params.userid},() =>this.myFunctions());
         }
         else{
            this.props.navigation.navigate('Login/Logout');
         }
        
        
    } 

    componentDidUpdate(prevProps) {
        if(this.props.route.params!==undefined&&this.props.route.params!==null){
            if (this.props.route.params.userid !== prevProps.route.params.userid) {
                this.setState({userID:this.props.route.params.userid},() =>this.myFunctions());
            }
        }else{
            this.props.navigation.navigate('Login/Logout');
        }
        
      }

    myFunctions() {
        this.getUserInfo();
        this.getFollowers();
        this.getFollowing();
    }

    toggleTweets() {
        this.setState({showTweets:true});
        this.setState({showFollowing:false})
        this.setState({showFollowers:false});
    }
    toggleFollowers() {
        this.setState({showTweets:false})
        this.setState({showFollowing:false})
        this.setState({showFollowers:true});
    }
    toggleFollowing() {
        this.setState({showTweets:false})
        this.setState({showFollowing:true})
        this.setState({showFollowers:false});
    }
    
    getUserInfo(){
        return fetch('http://10.0.2.2:3333/api/v0.0.5/user/'+this.state.userID , {
            headers: {
                'Content-Type': 'application/json'
            }

        }).then((response) => response.json()).then((responseJson) => {
            this.setState({userInfoData: responseJson});
        }).catch((error) => {
            console.log(error);
        });
    }

    getFollowers(){
        return fetch('http://10.0.2.2:3333/api/v0.0.5/user/'+this.state.userID+'/followers',{
            headers: {
                'Content-Type':'application/json'
            }
        }).then((response) => response.json()).then((responseJson) => {
            this.setState({followers: responseJson});
        }).catch((error) => {
            console.log(error);
        });
    }
    getFollowing(){
        return fetch('http://10.0.2.2:3333/api/v0.0.5/user/'+this.state.userID+'/following',{
            headers: {
                'Content-Type':'application/json'
            }
        }).then((response) => response.json()).then((responseJson) => {
            this.setState({following: responseJson});
        }).catch((error) => {
            console.log(error);
        });
    }

    getID(item){
        global.userid=item;
        this.props.navigation.jumpTo('Profile', {
            userid: item});
            
    }
    
    render() {
        if(this.state.showTweets){
        return (
            <View style={{flex: 1,flexDirection: 'column',margin: 20}}>
                <View style={{paddingBottom: 20}}>
                    <Text style={{textAlign: 'center',color: '#8ceded',fontSize: 45}}>Chittr</Text>
                </View>
                <View style={{flexDirection: 'column', alignItems:'center'}}>
                <Image style={{ width:100, height:100, borderRadius:50}} 
                                    source={{uri: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80'}}></Image>
                <Text style={{fontWeight: 'bold',fontSize:25}}>{this.state.userInfoData.given_name} {this.state.userInfoData.family_name}</Text>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => this.toggleFollowers()}><Text style={{margin:20}}>Followers</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => this.toggleFollowing()}><Text style={{margin:20}} >Following</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => this.toggleTweets()}><Text style={{margin:20}} >Tweets</Text></TouchableOpacity>
                </View>
        
                <View style={{flexDirection: 'column'}}>
                    <FlatList data={this.state.userInfoData.recent_chits} 
                        renderItem={({item}) =><Card style={{padding: 10,margin: 10,alignSelf: 'center'}} >
                            <View style={{flex: 1,flexDirection: 'row'}} >
                                <Image style={{width: 50, height: 50, borderRadius: 50}} 
                                    source={{uri: 'http://10.0.2.2:3333/api/v0.0.5/user/'+this.state.userInfoData.user_id+'/photo'}}></Image>
                                <View  style={{marginTop: 15,marginLeft: 10}}>
                                    <Text style={{fontWeight: 'bold'}}>{this.state.userInfoData.given_name} {this.state.userInfoData.family_name} </Text>
                                    <Text style={{marginTop: 5, maxWidth: 270}}>{item.chit_content}</Text>
                                </View>
                               
                            </View>
                        </Card>
                       
                        }
                        keyExtractor={({id}, index) => id}/>
                </View>
                </View>
                
            </View>
        )
        }
        else if(this.state.showFollowers){
            return (
                <View style={{flex: 1,flexDirection: 'column',margin: 20}}>
                    <View style={{paddingBottom: 20}}>
                        <Text style={{textAlign: 'center',color: '#8ceded',fontSize: 45}}>Chittr</Text>
                    </View>
                    <View style={{flexDirection: 'column', alignItems:'center'}}>
                        <Image style={{ width:100, height:100, borderRadius:50}} 
                                source={{uri: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80'}}></Image>
                        <Text style={{fontWeight: 'bold',fontSize:25}}>{this.state.userInfoData.given_name} {this.state.userInfoData.family_name}</Text>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity onPress={() => this.toggleFollowers()}><Text style={{margin:20}}>Followers</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => this.toggleFollowing()}><Text style={{margin:20}} >Following</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => this.toggleTweets()}><Text style={{margin:20}} >Tweets</Text></TouchableOpacity>
                        </View>
                    </View>

                     <View style={{flexDirection: 'column'}}>
                    <FlatList data={this.state.followers} 
                        renderItem={({item}) => <TouchableOpacity onPress={() => this.getID(item.user_id)}><Card style={{padding: 10,margin: 10,alignSelf: 'center'}} >
                            <View style={{flex: 1,flexDirection: 'row'}} >
                                <Image style={{width: 50, height: 50, borderRadius: 50}} 
                                    source={{uri: 'http://10.0.2.2:3333/api/v0.0.5/user/'+item.user_id+'/photo'}}></Image>
                                <View  style={{marginTop: 15,marginLeft: 10}}>
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
        else if(this.state.showFollowing){
            return (
                <View style={{flex: 1,flexDirection: 'column',margin: 20}}>
                    <View style={{paddingBottom: 20}}>
                        <Text style={{textAlign: 'center',color: '#8ceded',fontSize: 45}}>Chittr</Text>
                    </View>
                    <View style={{flexDirection: 'column', alignItems:'center'}}>
                        <Image style={{ width:100, height:100, borderRadius:50}} 
                                source={{uri: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80'}}></Image>
                        <Text style={{fontWeight: 'bold',fontSize:25}}>{this.state.userInfoData.given_name} {this.state.userInfoData.family_name}</Text>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity onPress={() => this.toggleFollowers()}><Text style={{margin:20}}>Followers</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => this.toggleFollowing()}><Text style={{margin:20}} >Following</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => this.toggleTweets()}><Text style={{margin:20}} >Tweets</Text></TouchableOpacity>
                        </View>
                    </View>

                     <View style={{flexDirection: 'column'}}>
                    <FlatList data={this.state.following} 
                        renderItem={({item}) => <TouchableOpacity onPress={() => this.getID(item.user_id)}><Card style={{padding: 10,margin: 10,alignSelf: 'center'}} >
                            <View style={{flex: 1,flexDirection: 'row'}} >
                                <Image style={{width: 50, height: 50, borderRadius: 50}} 
                                    source={{uri: 'http://10.0.2.2:3333/api/v0.0.5/user/'+item.user_id+'/photo'}}></Image>
                                <View  style={{marginTop: 15,marginLeft: 10}}>
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
}