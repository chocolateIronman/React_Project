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
  StyleSheet
} from 'react-native';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Card} from 'react-native-shadow-cards';
import {AsyncStorage} from '@react-native-community/async-storage';
import {RNCamera} from 'react-native-camera';


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
        myPhoto:''
      }
      
  }
   
    async takePicture(){
    if (this.camera) {
        const options = { quality: 0.5, base64: true };
      try{
          let data = await this.camera.takePictureAsync(options);
          console.log(data.uri);
          this.setState({myPhoto:data});
          console.log("My photo:",this.state.myPhoto.uri)
          this.setState({togglePhoto:false})
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

  postChit(){
    if (this.state.myPhoto == null || this.state.myPhoto == undefined) {
      if(this.state.chit_content!=null && this.state.chit_content!==undefined){
      return fetch("http://10.0.2.2:3333/api/v0.0.5/chits", {
        method: 'POST',
        headers: this.state.requestHeaders,
        body: JSON.stringify({
          chit_content: this.state.chit_content,
          timestamp: Date.now()
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
    else {
      return fetch("http://10.0.2.2:3333/api/v0.0.5/chits", {
        method: 'POST',
        headers: this.state.requestHeaders,
        body: JSON.stringify({
          chit_content: this.state.chit_content,
          timestamp: Date.now()
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
})
.catch((error)=>{
    console.error("OOOPS! "+error);
});
}

  checkIfEmpty(){
      if(this.state.chit_content==null || this.state.chit_content==undefined){
        alert("Cannot post empty chit!")
      }else{
        this.postChit();
      }
  }

  togglePhoto(){
    this.setState({togglePhoto:!this.state.togglePhoto})
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
      if(this.state.togglePhoto==false){
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
                    <Button title="Add photo" onPress={()=>this.togglePhoto()}></Button>
                </View>
                <View style={{margin:10}}>
                    <Button title="Chit" onPress={()=>this.checkIfEmpty()}></Button>
                </View>
                
                



            </View>
        );
      }
      else{
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