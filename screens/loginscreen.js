import React from 'react';
import { StyleSheet, Text, View,ScrollView ,FlatList,TextInput, TouchableOpacity, KeyboardAvoidingView,Image, Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase' ;
 
export default class LoginScreen extends React.Component{
    constructor(){
        super()
        this.state={
            emailid:"",
            password:"",
        }
    }
    login=async(emailid,password)=>{
     if(emailid&password){
         try{
             const response=await firebase.auth().signInWithEmailAndPassword(emailid,password)
             if(response){
                 this.props.navigation.navigate("transaction")
             }
         }
         catch(error){
             switch(error.code){
                 case "auth/user-not-found":Alert.alert("User Doesn't Exist")
                 break;
                 case "auth/invalid-email":Alert.alert("Incorrect Email or Password")
             }
         }
     }
     else{
         Alert.alert("Enter email and password")
     }
    }
render(){
return(
    <KeyboardAvoidingView>
    <View>
     <Image source={require("../assets/booklogo.jpg")} style={{width:100,height:100}}/>
         <Text>Wireless Library</Text>
     
    </View>
    <View>
        <TextInput style={styles.inputbox} placeholder="abc@example.com"
        keyboardType="email-address"
        onChangeText={(text)=>{
        emailid:text
        }}
        />
          <TextInput style={styles.inputbox} placeholder="Enter Password"
        secureTextEntry={true}
        onChangeText={(text)=>{
        password:text
        }}
        />
        <TouchableOpacity style={styles.submitbutton} onPress={()=>{
            this.login(this.state.emailid,this.state.password)
            
        }}>
            <Text>LOGIN</Text>
        </TouchableOpacity>
    </View>
    </KeyboardAvoidingView>
)

}



}

const styles = StyleSheet.create({ 
   
    inputbox:{width:105,height:50,fontSize:18},
   
    submitbutton:{backgroundColor:"green",width:70,height:40},
  });