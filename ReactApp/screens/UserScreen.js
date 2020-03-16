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


function Refresh(){
    useFocusEffect(useCallback(()=>{
      console.debug("got focus");
      //if(window.HomeScreenComponent.state.mounted) {
        console.debug("refreshing");
        window.UserScreenComponent.refreshUpdate();
      //}
      return()=>{console.debug("lost focus");}
    },[]));
    return null;
  }

export class UserScreen extends Component {
    constructor(props) {
        super(props);
        window.UserScreenComponent=this;
        this.state = {
            userInfoData: [],
            userID:'',
            showTweets: true,
            showFollowers: false,
            showFollowing: false,
            followers:[],
            following:[],
            mounted:false,
            buttonText: 'Follow',
            requestHeaders:{
                'Content-Type':'application/json'
            },
            hasKey:false
        }
       
    }
    
    refreshUpdate = function () {
        if(this.props.route.params!==undefined&& this.props.route.params!==null){
            console.log("Props:"+this.props.route.params.userid);
            if(this.props.route.params.userid==0){
                
                if (global.key != null & global.key != undefined ) {
                    console.debug("got key: ",global.key);
                    this.setState({
                      requestHeaders: {
                        'Content-Type': 'application/json',
                        'X-Authorization': global.key
                      }
                    },() =>this.setState({ hasKey: true }),()=>this.setState({userID:global.key}));
                }else {
                    this.displayData().then(() => {
                      if (global.key != null && global.key != undefined) {
                        console.debug("got key2 ",global.key);
                        this.setState({
                          requestHeaders: {
                            'Content-Type': 'application/json',
                            'X-Authorization': global.key
                          }
                        },() =>this.setState({ hasKey: true },()=>this.setState({userID:global.key})));
                      } else {
                       
                        console.debug("can't find key");
                        this.setState({hasKey:false},()=>this.setState({userID:0},()=>this.props.navigation.navigate('Login/Logout')));
                        
                      }
                    });
                  }
                  if (global.id != null & global.id != undefined) {
                    console.debug("global id: ",global.id);
                    this.setState({userID:global.id},()=>this.myFunctions())
                    
                }else {
                    this.displayData().then(() => {
                      if (global.id != null && global.id != undefined) {
                        console.debug("global id2 ",global.id);
                        this.setState({userID:global.id},()=>this.myFunctions())
        
                      } else {
                        console.debug("can't find id");
                        this.setState({hasKey:false},()=>this.setState({userID:0},()=>this.props.navigation.navigate('Login/Logout')));
                        
                       
                      }
                    });
                  }
            }
            else{
                
                this.setState({userID:this.props.route.params.userid},() =>this.myFunctions());
            }  
         }
          else{
            this.props.navigation.navigate('Login/Logout');
         } 
         
         
        
          
    }

     componentDidMount() {
        console.debug("mounting");
        this.setState({
          mounted:true
        });       
        
    } 


    myFunctions() {
        this.getUserInfo().then( this.getFollowers()).then(this.getFollowing()).then(this.props.route.params.userid=0)
        //this.getFollowers();
        //this.getFollowing();
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
            this.setState({followers: responseJson},()=>this.checkIfFollowed());
            
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
        this.setState({userID:item},()=> this.myFunctions())
            
    }
    
    follow(){
        console.log(this.state.userID);
        console.log("following with request headers: ",this.state.requestHeaders)
        return fetch("http://10.0.2.2:3333/api/v0.0.5/user/"+this.state.userID+"/follow",{
        method: 'POST',
        headers:this.state.requestHeaders
    })
    .then((response)=>{
        console.debug(response);
        this.setState({buttonText:'Unfollow'})
        alert("User followed!");
    })
    .catch((error)=>{
        console.error(error);
        alert("Ooops! Something went wrong!");
    });
    }

    checkIfFollowed(){
        if(global.id!==null&&global.id!==undefined){
            console.debug("followers",this.state.followers);
            //if(this.state.followers.forEach((item) => item.user_id == global.key)){
            if(this.state.followers.map(follower => follower.user_id).includes(global.id)){
                //.forEach((item) => item.user_id == global.key)){
                this.setState({buttonText:'Unfollow'})
            }
            else if(global.id==this.state.userID)
            {
                this.setState({buttonText:'Edit Profile'})
            }
            else{
                this.setState({buttonText:'Follow'})
            }
        }
        else{
            this.setState({buttonText:'Follow'},this.setState({hasKey:false}))
        }
        
    }

    unfollow(){
        console.log(this.state.userID);
        return fetch("http://10.0.2.2:3333/api/v0.0.5/user/"+this.state.userID+"/follow",{
        method: 'DELETE',
        headers:this.state.requestHeaders
    })
    .then((response)=>{
        console.debug(response);
        this.setState({buttonText:'Follow'})
        alert("User unfollowed!");
    })
    .catch((error)=>{
        console.error(error);
        alert("Ooops! Something went wrong!");
    });
    
    }

   /*  async getToken() {
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
      async getIDToken() {
        try {
          let myID = await AsyncStorage.getItem('id_token');
          //console.log("Token222 is:" + token);
          global.id = myID;
          console.log("global id is:" + global.id);
          //console.log(global.key);
          //this.refreshUpdate()
        } catch (error) {
          console.log("Something went wrong!")
        }
      } */

      async displayData() {
        try {
          let user = await AsyncStorage.getItem('user');
          let parsed = JSON.parse(user);
          console.log("Parsed: "+parsed,"id: ",parsed.id,"token: ",parsed.token)
        } catch(e) {
          console.log("Error2: "+e);
        }
      }

    toggleFollow(){
        if(this.state.buttonText=='Follow'){
            if(this.state.hasKey==true){
               this.setState({buttonText:'Unfollow'},()=>this.follow())
            }
            else{
                alert("Cannot follow users unless logged in!" )
            }
        }
        if(this.state.buttonText=='Unfollow'){
            if(this.state.hasKey==true){
                this.setState({buttonText:'Follow'},()=>this.unfollow())
            }
            else{}
        }
        if(this.state.buttonText=='Edit Profile'){
            alert('Edit to happen!')
        }
        
    }
    
    render() {
        if(this.state.showTweets){
        return (
            <View style={{flex: 1,flexDirection: 'column',margin: 20}}>
             <Refresh></Refresh>
                <View style={{paddingBottom: 20}}>
                    <Text style={{textAlign: 'center',color: '#8ceded',fontSize: 45}}>Chittr</Text>
                </View>
                <View style={{flex: 2,flexDirection: 'column', alignItems:'center'}}>
                <Image style={{ width:100, height:100, borderRadius:50}} 
                                    source={{uri: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80'}}></Image>
                <Text style={{fontWeight: 'bold',fontSize:25}}>{this.state.userInfoData.given_name} {this.state.userInfoData.family_name}</Text>
                <View>
                    <TouchableOpacity onPress={()=>this.toggleFollow()} style={{alignItems:'center', backgroundColor:'#8ceded', padding:10, borderWidth:1, borderRadius:50}}><Text>{this.state.buttonText}</Text></TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => this.toggleFollowers()}><Text style={{margin:20}}>Followers</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => this.toggleFollowing()}><Text style={{margin:20}} >Following</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => this.toggleTweets()}><Text style={{margin:20}} >Chits</Text></TouchableOpacity>
                </View>
        
                <View style={{flex: 2,flexDirection: 'column'}}>
               
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
                 <Refresh></Refresh>
                    <View style={{paddingBottom: 20}}>
                        <Text style={{textAlign: 'center',color: '#8ceded',fontSize: 45}}>Chittr</Text>
                    </View>
                    <View style={{flexDirection: 'column', alignItems:'center'}}>
                        <Image style={{ width:100, height:100, borderRadius:50}} 
                                source={{uri: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80'}}></Image>
                        <Text style={{fontWeight: 'bold',fontSize:25}}>{this.state.userInfoData.given_name} {this.state.userInfoData.family_name}</Text>
                        <View>
                            <TouchableOpacity onPress={()=>this.toggleFollow()} style={{alignItems:'center', backgroundColor:'#8ceded', padding:10, borderWidth:1, borderRadius:50}}><Text>{this.state.buttonText}</Text></TouchableOpacity>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity onPress={() => this.toggleFollowers()}><Text style={{margin:20}}>Followers</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => this.toggleFollowing()}><Text style={{margin:20}} >Following</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => this.toggleTweets()}><Text style={{margin:20}} >Chits</Text></TouchableOpacity>
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
                 <Refresh></Refresh>
                    <View style={{paddingBottom: 20}}>
                        <Text style={{textAlign: 'center',color: '#8ceded',fontSize: 45}}>Chittr</Text>
                    </View>
                    <View style={{flexDirection: 'column', alignItems:'center'}}>
                        <Image style={{ width:100, height:100, borderRadius:50}} 
                                source={{uri: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80'}}></Image>
                        <Text style={{fontWeight: 'bold',fontSize:25}}>{this.state.userInfoData.given_name} {this.state.userInfoData.family_name}</Text>
                        <View>
                            <TouchableOpacity onPress={()=>this.toggleFollow()} style={{alignItems:'center', backgroundColor:'#8ceded', padding:10, borderWidth:1, borderRadius:50}}><Text>{this.state.buttonText}</Text></TouchableOpacity>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity onPress={() => this.toggleFollowers()}><Text style={{margin:20}}>Followers</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => this.toggleFollowing()}><Text style={{margin:20}} >Following</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => this.toggleTweets()}><Text style={{margin:20}} >Chits</Text></TouchableOpacity>
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