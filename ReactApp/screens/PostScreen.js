import React, {Component, useCallback} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  Image,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
  CheckBox,
  AsyncStorage
} from 'react-native';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Card} from 'react-native-shadow-cards';
//import {AsyncStorage} from '@react-native-community/async-storage';
import {RNCamera} from 'react-native-camera';
import Geolocation from 'react-native-geolocation-service';
//import { CheckBox } from 'react-native-elements';

//used hook to refresh screen when focused
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
        chit_id:'',
        requestHeaders: {
            'Content-Type': 'application/json'
        },
        hasKey:false,
        mounted:false,
        togglePhoto: false,
        myPhoto:'',
        location:null,
        locationPermission:false,
        checked:false,
        longitude:0,
        latitude:0,
        chitData:[]
      }
      
  }
   
  //function to take a photo
    async takePicture(){
    if (this.camera) {
        const options = { quality: 0.5, base64: true };
      try{
          let data = await this.camera.takePictureAsync(options);
          console.log(data.uri);
          this.setState({myPhoto:data});
          this.setState({togglePhoto:!this.state.togglePhoto});
          console.log("My photo:",this.state.myPhoto.uri)
          
      }catch(error){
          console.log("Error1: "+error)
      }
  }
}
     

  componentDidMount() {
    console.debug("mounting");
    this.setState({
      mounted:true
    });
  }

  //Post request to publish a chit
  postChit(){
    if (this.state.myPhoto == null || this.state.myPhoto == undefined) { //checking if there is no photo available
      if(this.state.chit_content!=null && this.state.chit_content!==undefined){//checking that there is content to publish
        //post request to publish chit without photo
      return fetch("http://10.0.2.2:3333/api/v0.0.5/chits", {
        method: 'POST',
        headers: this.state.requestHeaders,
        body: JSON.stringify({
          chit_content: this.state.chit_content,
          timestamp: Date.now(),
          location: {
            "longitude": this.state.longitude,
            "latitude": this.state.latitude
          }
          
        })
      })
        .then((response) => response.json()).then((responseJson) => {
          this.setState({ chit_id: responseJson.chit_id }, () => this.setState({ chit_content: "" }, () => this.props.navigation.navigate('Home')))
          console.log("Chit id?", responseJson.chit_id);
        })
        .catch((error) => {
          console.error(error);
          alert("Ooops! Something went wrong!");
        });
      }else{
        alert("Cannot post empty chit!")
      }
    }
    else { //if photo is available > post request to post chit with photo
      return fetch("http://10.0.2.2:3333/api/v0.0.5/chits", {
        method: 'POST',
        headers: this.state.requestHeaders,
        body: JSON.stringify({
          chit_content: this.state.chit_content,
          timestamp: Date.now(),
          location: {
            "longitude": this.state.longitude,
            "latitude": this.state.latitude
          }
        })
      })
        .then((response) => response.json()).then((responseJson) => {
          this.setState({ chit_id: responseJson.chit_id }, ()=>this.postChitPhoto().then(this.setState({chit_content:""},()=>this.props.navigation.navigate('Home'))))
          console.log("Chit id?", responseJson.chit_id);
        })
        .catch((error) => {
          console.error(error);
          alert("Ooops! Something went wrong!");
        });
    }
}
//Post request to actually post hte photo after obtaining chit id
postChitPhoto(){
  console.log("Sending my photo: ",this.state.myPhoto.uri)
  return fetch("http://10.0.2.2:3333/api/v0.0.5/chits/"+this.state.chit_id+"/photo",{
    method: 'POST',
    headers: {
      'X-Authorization':global.key
    },
    body: this.state.myPhoto
  })
  .then((response)=>{
    console.debug("Response from posting photo: "+response)
    this.setState({togglePhoto:!this.state.togglePhoto})
})
.catch((error)=>{
    console.error("OOOPS! "+error);
});
}

//checking if the chit content is empty
  checkIfEmpty(){
      if(this.state.chit_content==null || this.state.chit_content==undefined){
        alert("Cannot post empty chit!")
      }else{
        this.postChit();
      }
  }
//checking if camera view should be displayed or not
  togglePhoto(){
    this.setState({togglePhoto:!this.state.togglePhoto})
  }
//update function
  refreshUpdate(){
    if (global.key !== null & global.key !== undefined) {//checking if a user is logged in
        console.debug("setting key in header",global.key);
        //setting the appropriate request headers for the post chit request
        this.setState({
          requestHeaders: {
            'Content-Type': 'application/json',
            'X-Authorization': global.key
          }
        },() =>this.setState({ hasKey: true }));
    }else {
        this.displayData().then(() => {//trying to extract the user's auth token from the local storage
          if (global.key !== null && global.key !== undefined) {
            console.debug("setting key in header2 ",global.key);
            //setting the appropriate request headers for the post chit requests
            this.setState({
              requestHeaders: {
                'Content-Type': 'application/json',
                'X-Authorization': global.key
              }
            },() =>this.setState({ hasKey: true }));
          } else {//user is not logged in; showing the appropriate view
            console.debug("can't find key");
            this.setState({hasKey:false});
          }
        });
      }
  }
//function to extract user's id and auth token from the local storage 
  async displayData() {
    try {
      let user = await AsyncStorage.getItem('user');
      let parsed = JSON.parse(user);
    } catch(e) {
      console.log("Error2: "+e);
    }
  }

  //finding the location coordinates if permission is granted
  findCoordinates=()=>{
    if(!this.state.locationPermission){
      this.state.locationPermission = this.requestLocationPermission();
      }
    Geolocation.getCurrentPosition(
      (position)=>{
        const location=JSON.stringify(position);
        console.log(position);
        this.setState({location},()=>this.setState({longitude:position.coords.longitude},()=>this.setState({latitude:position.coords.latitude})));
        
      },
      (error)=>{
        alert(error.message)
      },
      {
        enableHighAccuracy:true,
        timeout:20000,
        maximumAge:1000
      }
    );
  }

  //asking user to give permission and enable location
  async requestLocationPermission() {
    try{
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title:'ReactApp Loaction Permission',
          message: 'This app requires access to your location',
          buttonNeutral:'Ask Me Later',
          buttonNegative:'Cancel',
          buttonPositive:'OK',
        },
      );
      if(granted===PermissionsAndroid.RESULTS.GRANTED){
        console.log('You can access location');
        return true;
      }else{
        console.log('Location permission denied');
        return false;
      }
    } catch(err){
      console.warn(err);
    }
  }
//checking if user has chosen to share location
  checked(){
    if(this.state.checked==true){
      this.setState({checked:false})
    }
    else{
      this.setState({checked:true},()=>this.findCoordinates())
    }
  }

  //saving user's chit to local storage instead of publishig it
async saveChit(){
  const chit=this.state.chit_content;
  AsyncStorage.getItem('savedChits', (err, result) => {
    var chits = [{'id':global.user_id,'chit_content':chit}];
  if (result !== null) {
    console.log('Data Found', result);
    var newChit = JSON.parse(result).concat(chits);
    AsyncStorage.setItem('savedChits', JSON.stringify(newChit));
    this.displayChits()
  } else {
    console.log('Data Not Found');
    AsyncStorage.setItem('savedChits', JSON.stringify(chits));
    this.displayChits()
  }
});
}

//retrieving user's saved chits
async displayChits(){
  AsyncStorage.getItem('savedChits', (err, result) => {
    console.log(result);
    this.setState({chitData:result})
    console.log(this.state.chitData)
    global.chits=result;
    console.log(global.chits);
  });
}

//removing a chit from the local storage
async removeChits(){
  try{
      await AsyncStorage.removeItem('savedChits');
      this.displayData();
  }catch(error){
      console.log("Error3: "+error);
  }
}


 
  render() {
    if (this.state.hasKey) {
      if(this.state.togglePhoto==false){
        return (
            <View style={{flex:1,flexDirection: 'column', margin:20}}>
            <Refresh></Refresh>
                <View style={{paddingBottom:20}}>
                    <Text style={{textAlign: 'center', color: '#3892ff', fontSize:45}}>Chittr</Text>
                    <Text style={{textAlign: 'center',  fontSize:20, color:'orange'}}>Post your thoughts in a chit!</Text>
                    <Text style={{textAlign: 'center',  fontSize:15, color:'grey'}}>What is happening?</Text>
                </View>
                <View style={{paddingBottom:20}}>
                    <TextInput value={this.state.chit_content} multiline maxLength={141} placeholder="Type something..." style={{borderWidth:1, borderRadius:30, borderColor: 'grey',height:80}} onChangeText={(text) => this.setState({chit_content: text})} ></TextInput>
                    <Text style={{textAlign:'right', fontSize:10,color:'grey'}}>Max characters: 141</Text>
                    <View style={{flexDirection:'row'}}>
                      <CheckBox value={this.state.checked} onChange={()=>this.checked()}/>
                      <Text style={{marginTop:5, color:'grey'}}>Share Location</Text>
                    </View>
                    
                </View>
                <View style={{margin:10}}>
                    <Button title="Add photo" onPress={()=>this.togglePhoto()}></Button>
                </View>
                <View style={{margin:10}}>
                    <Button title="Chit" onPress={()=>this.checkIfEmpty()}></Button>
                </View>
                <View style={{margin:10}}>
                    <Button title="Save Chit" onPress = { () => this.saveChit() }></Button>
                </View>
                
           

            </View>
        );
      }
      if(this.state.togglePhoto==true){
        return(
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <RNCamera ref={ref => {this.camera = ref;}} style={ { flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}/>
            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity onPress={this.takePicture.bind(this)} style={{flex:0, backgroundColor:'#3892ff', padding:10, borderWidth:1, borderRadius:50, borderColor:'#3892ff', margin:5}}><Text style={{ fontSize: 16 }}>CAPTURE</Text></TouchableOpacity>
            
              <TouchableOpacity onPress={()=>this.togglePhoto()} style={{flex:0, backgroundColor:'orange', padding:10, borderWidth:1, borderRadius:50, borderColor:'orange', margin:5}}><Text style={{ fontSize: 16 }}>CANCEL</Text></TouchableOpacity>
            
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
                    <Text style={{textAlign: 'center', color: '#3892ff', fontSize:45}}>Chittr</Text>
                    <Text style={{textAlign: 'center',  fontSize:15, color:'orange'}}>You cannot post chits unless logged in!</Text>
                </View>
                <View style={{margin:10}}>
                    <Button title="Log In" onPress={()=>this.props.navigation.navigate('Login/Logout')}></Button>
                </View>
                
            </View>
        );
    }

  }
}