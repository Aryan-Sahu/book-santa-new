import React, { Component} from 'react';
import {StyleSheet, View, Text,TouchableOpacity} from 'react-native';
import { DrawerItems} from 'react-navigation-drawer'
import {Avatar} from 'react-native-elements'
import firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker'
import db from '../config'

export default class CustomSideBarMenu extends Component{
  constructor(){
    super()
    this.state={
      userId:firebase.auth().currentUser.email,
      image:'#',
      name:'',
      docId:''    
    }
  }
  selectPicture=async()=>{
   const {cancelled,uri} =await ImagePicker.lunchImageLibreryAsync({
     mediaTypes:ImagePicker.mediaTypeOptions.All,
     allowsEditing:true,
     aspect:[4,3],
     quality:1
   })
   if(!cancelled){this.uploadImage(uri,this.state.userId)}
  }
  uploadImage=async(uri,imageName)=>{
    var responce=await fetch(uri)
    var blob=await responce.blob()
    var ref=firebase.storage()
    .ref().child("userProfile/"+ imageName)
return ref.put(blob).then((responce)=>{this.fetchImage(imageName)})
  }
  fetchImage=(imageName)=>{
    var storageRef=firebase.storage()
    .ref().child("userProfile/"+imageName)
    storageRef.getDownloadURL().then((url)=>{
      this.setState({image:url})
    }).catch((error)=>{this.setState({image:'#'})})
  }
  getUserProfile(){
    db.collection("users").where("email_id","==",this.state.userId)
    .onSnapshot((querySnapshot)=>{
      querySnapshot.forEach((doc)=>{
        this.setState({
          name:doc.data().first_name+"" +doc.data().last_name
        })
      })
    })
  }
  componentDidMount(){
    this.fetchImage(this.state.userId)
    this.getUserProfile()
    
  }
  render(){
    return(
      <View style={{flex:1}}>
        <View style={styles.drawerItemsContainer}>
          <View style={{flex:0.3,justifyContent:"center",alignItems:"center",backgroundColor:"#32867d"}}>
          <DrawerItems {...this.props}/>
        </View>
        <Avatar rounded
        source={{uri:this.state.image}}
        size='xlarge'
        onPress={()=>{
          this.selectPicture()
        }}
        containerStyle={styles.imageContainer}
        showEditButton/></View>
       <Text style={{fontWeight:'100',fontSize:20,paddingTop:10,}}>{this.state.name}</Text>
        <View style={styles.logOutContainer}>
          <TouchableOpacity style={styles.logOutButton}
          onPress = {() => {
              this.props.navigation.navigate('WelcomeScreen')
              firebase.auth().signOut()
          }}>
            <Icon name="logout" type="antdesgine" size={RFValue(20)}
            iconStyle={{paddingLeft:RFValue(10)}}></Icon>
            <Text style={{fontSize:RFValue(15),fontWeight:"bold",marginLeft:RFValue(30)}}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container : {
    flex:1
  },
  drawerItemsContainer:{
    flex:0.8
  },
  logOutContainer : {
    flex:0.2,
    justifyContent:'flex-end',
    paddingBottom:30
  },
  logOutButton : {
    height:30,
    width:'100%',
    justifyContent:'center',
    padding:10
  },
  logOutText:{
    fontSize: 30,
    fontWeight:'bold'
  }
})
