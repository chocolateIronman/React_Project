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

//used hook to refresh screen when focused
function Refresh(){
    useFocusEffect(useCallback(()=>{
      console.debug("got focus");
        console.debug("refreshing");
        window.UserScreenComponent.refreshUpdate();
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
    //update function
    refreshUpdate = function () {
        if(this.props.route.params!==undefined&& this.props.route.params!==null){//if the route parameters exist
            console.log("Props:"+this.props.route.params.userid);
            if(this.props.route.params.userid==0){ //check if the route param is 0 (the user is navigating from the Drawer navigation)
                
                if (global.key != null & global.key != undefined ) { //checking if a user is logged in
                    console.debug("got key: ",global.key);
                    //setting the appropriate headers for the http requests
                    this.setState({
                      requestHeaders: {
                        'Content-Type': 'application/json',
                        'X-Authorization': global.key
                      }
                    },() =>this.setState({ hasKey: true }),()=>this.setState({userID:global.key}));
                }else {
                    this.displayData().then(() => { //trying to extract the auth token from the local storage
                      if (global.key != null && global.key != undefined) {
                        console.debug("got key2 ",global.key);
                        //setting the appropriate headers for the http requests
                        this.setState({
                          requestHeaders: {
                            'Content-Type': 'application/json',
                            'X-Authorization': global.key
                          }
                        },() =>this.setState({ hasKey: true },()=>this.setState({userID:global.key})));
                      } else { //if user is not logged in redirect to the Login/Logout page
                       
                        console.debug("can't find key");
                        this.setState({hasKey:false},()=>this.setState({userID:0},()=>this.props.navigation.navigate('Login/Logout')));
                        
                      }
                    });
                  }
                  if (global.user_id != null & global.user_id != undefined) { //checking if the user id is available
                    console.debug("global id: ",global.user_id);
                    this.setState({userID:global.user_id},()=>this.myFunctions())
                    
                }else {//trying to extract the user id from the local storage
                    this.displayData().then(() => {
                      if (global.user_id != null && global.user_id != undefined) {
                        console.debug("global id2 ",global.user_id);
                        this.setState({userID:global.user_id},()=>this.myFunctions())
        
                      } else { //if user's id is not found redirect to the Login/Logout page
                        console.debug("can't find id");
                        this.setState({hasKey:false},()=>this.setState({userID:0},()=>this.props.navigation.navigate('Login/Logout')));
                        
                       
                      }
                    });
                  }
            }
            else{ //if user id exists do myFunctions
                
                this.setState({userID:this.props.route.params.userid},() =>this.myFunctions());
            }  
         } //if user is not logged in navigate to Login/Logout page
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

//function combining all functions needed for getting all the appropriate data
    myFunctions() {
        this.getUserInfo().then( this.getFollowers()).then(this.getFollowing()).then(this.props.route.params.userid=0)
  
    }
    //show user's chits
    toggleTweets() {
        this.setState({showTweets:true});
        this.setState({showFollowing:false})
        this.setState({showFollowers:false});
    }
    //show user's followers
    toggleFollowers() {
        this.setState({showTweets:false})
        this.setState({showFollowing:false})
        this.setState({showFollowers:true});
    }
    //show the people the user's following
    toggleFollowing() {
        this.setState({showTweets:false})
        this.setState({showFollowing:true})
        this.setState({showFollowers:false});
    }
    
    //Get request to get all the information about a user
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

    //Get request to get the followers of the user
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
    //Get request to get the people the user's following
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
    //estracting the user's id from the user's information
    getID(item){
        global.userid=item;
        this.setState({userID:item},()=> this.myFunctions())
            
    }
    
    //Post request to follow a user
    follow(){
        console.log(this.state.userID);
        console.log("following with request headers: ",this.state.requestHeaders)
        return fetch("http://10.0.2.2:3333/api/v0.0.5/user/"+this.state.userID+"/follow",{
        method: 'POST',
        headers:this.state.requestHeaders
    })
    .then((response)=>{
        console.debug(response);
        this.setState({buttonText:'Unfollow'}) //changing the text of the button
        alert("User followed!");
    })
    .catch((error)=>{
        console.error(error);
        alert("Ooops! Something went wrong!");
    });
    }

    //checking if a user is followed/not followed/checking their own profile to display the correct button and functionality
    checkIfFollowed(){
        if(global.user_id!==null&&global.user_id!==undefined){
            console.debug("followers",this.state.followers);
          
            if(this.state.followers.map(follower => follower.user_id).includes(global.user_id)){

                this.setState({buttonText:'Unfollow'})
            }
            else if(global.user_id==this.state.userID)
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
    //Post request to unfollow a user
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

  
    //extracting the user's id and token from the local storage
      async displayData() {
        try {
          let user = await AsyncStorage.getItem('user');
          let parsed = JSON.parse(user);
         
        } catch(e) {
          console.log("Error2: "+e);
        }
      }
    
    //changing the view depending on which button is pressed
    toggleFollow(){
        if(this.state.buttonText=='Follow'){
            if(this.state.hasKey==true){
               this.setState({buttonText:'Unfollow'},()=>this.follow())
            }
            else{ //if user is not logged in
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
            this.props.navigation.navigate('Edit Profile');
        }
        
    }
    
    render() {
        if(this.state.showTweets){
        return (
            <View style={{flex: 1,flexDirection: 'column',margin: 20}}>
             <Refresh></Refresh>
                <View style={{paddingBottom: 20}}>
                    <Text style={{textAlign: 'center',color: '#3892ff',fontSize: 45}}>Chittr</Text>
                </View>
                <View style={{flex: 2,flexDirection: 'column', alignItems:'center'}}>
                <Image style={{ width:100, height:100, borderRadius:50}} 
                                    source={{uri: 'http://10.0.2.2:3333/api/v0.0.5/user/'+this.state.userInfoData.user_id+'/photo?timestamp='+Date.now()}}></Image>
                <Text style={{fontWeight: 'bold',fontSize:25}}>{this.state.userInfoData.given_name} {this.state.userInfoData.family_name}</Text>
                <View>
                    <TouchableOpacity onPress={()=>this.toggleFollow()} style={{alignItems:'center', backgroundColor:'#3892ff', padding:10, borderWidth:1, borderRadius:50, borderColor:'#3892ff'}}><Text>{this.state.buttonText}</Text></TouchableOpacity>
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
                                    source={{uri: 'http://10.0.2.2:3333/api/v0.0.5/user/'+this.state.userInfoData.user_id+'/photo?timestamp='+Date.now()}}></Image>
                                <View  style={{marginTop: 15,marginLeft: 10}}>
                                    <Text style={{fontWeight: 'bold'}}>{this.state.userInfoData.given_name} {this.state.userInfoData.family_name} </Text>
                                    <Text style={{marginTop: 5, maxWidth: 270}}>{item.chit_content}</Text>
                                    <Image style={{width: 100, height: 60, borderColor:'black',borderWidth:1, alignSelf:'center'}}
              source={{uri: 'http://10.0.2.2:3333/api/v0.0.5/chits/' + item.chit_id + '/photo'}} alt="no photo"></Image>
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
                        <Text style={{textAlign: 'center',color: '#3892ff',fontSize: 45}}>Chittr</Text>
                    </View>
                    <View style={{flexDirection: 'column', alignItems:'center'}}>
                        <Image style={{ width:100, height:100, borderRadius:50}} 
                                source={{uri: 'http://10.0.2.2:3333/api/v0.0.5/user/'+this.state.userInfoData.user_id+'/photo?timestamp='+Date.now()}}></Image>
                        <Text style={{fontWeight: 'bold',fontSize:25}}>{this.state.userInfoData.given_name} {this.state.userInfoData.family_name}</Text>
                        <View>
                            <TouchableOpacity onPress={()=>this.toggleFollow()} style={{alignItems:'center', backgroundColor:'#3892ff', padding:10, borderWidth:1, borderRadius:50, borderColor:'#3892ff'}}><Text>{this.state.buttonText}</Text></TouchableOpacity>
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
                                    source={{uri: 'http://10.0.2.2:3333/api/v0.0.5/user/'+item.user_id+'/photo?timestamp='+Date.now()}}></Image>
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
                        <Text style={{textAlign: 'center',color: '#3892ff',fontSize: 45}}>Chittr</Text>
                    </View>
                    <View style={{flexDirection: 'column', alignItems:'center'}}>
                        <Image style={{ width:100, height:100, borderRadius:50}} 
                                source={{uri: 'http://10.0.2.2:3333/api/v0.0.5/user/'+this.state.userInfoData.user_id+'/photo?timestamp='+Date.now()}}></Image>
                        <Text style={{fontWeight: 'bold',fontSize:25}}>{this.state.userInfoData.given_name} {this.state.userInfoData.family_name}</Text>
                        <View>
                            <TouchableOpacity onPress={()=>this.toggleFollow()} style={{alignItems:'center', backgroundColor:'#3892ff', padding:10, borderWidth:1, borderColor:'#3892ff', borderRadius:50}}><Text>{this.state.buttonText}</Text></TouchableOpacity>
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
                                    source={{uri: 'http://10.0.2.2:3333/api/v0.0.5/user/'+item.user_id+'/photo?timestamp='+Date.now()}}></Image>
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