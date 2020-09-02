import React from 'react';
import { StyleSheet, Text, View,TouchableOpacity,TextInput,Image,Alert,KeyboardAvoidingView, ToastAndroid} from 'react-native';
import * as Permissions from 'expo-permissions';
import {BarCodeScanner} from 'expo-barcode-scanner';
import firebase from 'firebase';
import db from '../config';
export default class Transactionscreen extends React.Component{
  constructor(){
    super();
    this.state={
     hasCameraPermissions:null,
     Scanned:false,
     scanData:"",
     buttonstate:"normal",
     scanbookid:"",
     scanstudentid:"",
     transactionMessage:""

    }
  }
   GetCameraPermission=async(id)=>{
     const {status}=await Permissions.askAsync(Permissions.CAMERA)
     this.setState({hasCameraPermissions:status=="granted",
     buttonstate:id,Scanned:false})
   }
   HandleBarcodeScanner=async({type,data})=>{
     const {buttonstate}=this.state
     if(buttonstate=="bookid"){

     
     this.setState({Scanned:true,
      scanbookid:data,buttonstate:"normal"})
     }
     else if(buttonstate=="studentid"){
      this.setState({Scanned:true,
        scanstudentid:data,buttonstate:"normal"})
     }
   }
   HoldTransaction=async()=>{
    var transactionMessage= await this.checkbookavailability() ;
    if(!transactionMessage){
      Alert.alert("Book doesn't exist in the database");
      this.setState({scanbookid:"",scanstudentid:""});
    }
    else if(transactionMessage==="Issue"){
      var studenteligible = await this.checkstudenteligibilityforbookissue();
      if(studenteligible){
        this.initiateBookIssue();
        Alert.alert("Book issued to the student")
      }
    }
    else{
      var studenteligible = await this.checkstudenteligibilityforbookreturn();
      if(studenteligible){
        this.initiatebookreturn();
        Alert.alert("Book returned by the student");
      }
    }
    
    
   }
   checkbookavailability=async()=>{
     const bookref = await db.collection("books").where("BookId","==",this.state.scanbookid).get();
     var transactiontype = "";
    if(bookref.docs.length===0){
      transactiontype = false;
    }
    else{
      bookref.docs.map((doc)=>{
        var book = doc.data();
        if(book.bookavailability){
          transactiontype = "Issue";
        } 
        else{
          transactiontype = "Return"
        }
      })
    }
    return transactiontype;
   }
   checkstudenteligibilityforbookissue = async()=>{
    const studentref = await db.collection("students").where("StudentId","==",this.state.scanstudentid).get();
    var studenteligible="";
    if(studentref.docs.length==0){
      this.setState({scanbookid:"",scanstudentid:""})
    
    studenteligible=false;
    Alert.alert("This student id doesn't exist in the database")
    }
     else{
     studentref.docs.map((doc)=>{
       var student = doc.data();
       if(student.NoOfBooksIssued<2){
         studenteligible = true;
       }
       else{
         studenteligible = false;
         Alert.alert("Student has already issued 2 books");
         this.setState({scanstudentid:"",scanbookid:""});
       }
     })
     }
     return studenteligible;    
    }
    checkstudenteligibilityforbookreturn = async()=>{
      const transactionref = await db.collection("transaction").where("BookId","==",this.state.scanbookid).limit(1).get();
      var studenteligible = "";
      transactionref.docs.map((doc)=>{
        var lastbooktransaction = doc.data();
        if(lastbooktransaction.StudentId==this.state.scanstudentid){
          studenteligible = true;
        }
        else{
          studenteligible = false;
          Alert.alert("Book wasn't issued by the same student");
          this.setState({scanbookid:"",scanstudentid:""});
        }
      })
      return studenteligible;
    }
   initiateBookIssue=async()=>{
     db.collection("transaction").add({
       BookId:this.state.scanbookid,
       StudentId:this.state.scanstudentid,
       Date:firebase.firestore.Timestamp.now().toDate(),
       TransactionType:"Issue"
     })
     db.collection("books").doc(this.state.scanbookid).update({bookavailability:false})
     db.collection("students").doc(this.state.scanstudentid).update({
       NoOfBooksIssued:firebase.firestore.FieldValue.increment(1)
     })
     Alert.alert("Book Issued");
     this.setState({
       scanbookid:"",
       scanstudentid:""
     })
   }
   initiatebookreturn=async()=>{
    db.collection("transaction").add({
      BookId:this.state.scanbookid,
      StudentId:this.state.scanstudentid,
      Date:firebase.firestore.Timestamp.now().toDate(),
      TransactionType:"Return"
    })
    db.collection("books").doc(this.state.scanbookid).update({bookavailability:true})
    db.collection("students").doc(this.state.scanstudentid).update({
      NoOfBooksIssued:firebase.firestore.FieldValue.increment(-1)
    })
    Alert.alert("Book Returned");
    this.setState({
      scanbookid:"",
      scanstudentid:""
    })
   }
    render(){
      const hasCameraPermissions=this.state.hasCameraPermissions;
      const Scanned=this.state.Scanned;
      const buttonstate=this.state.buttonstate;
      if(buttonstate!=="normal"&&hasCameraPermissions){
      return(
      <BarCodeScanner onBarCodeScanned=
        {Scanned?undefined:this.HandleBarcodeScanner}
      style={StyleSheet.absoluteFillObject}
      />)
      }
      else if(buttonstate=="normal"){
  return (
      <KeyboardAvoidingView style={styles.container } behaviour="padding"enabled>
        <View><Image source={require("../assets/booklogo.jpg")} style = {{width:75,height:70}}/><Text style={{fontSize:24}}>E-Library</Text></View>
        <View style={styles.inputview}>
          <TextInput style={styles.inputbox} placeholder="Book id" onChangeText={text=>this.setState({
            scanbookid:text
          })}
          value={this.state.scanbookid}/>
          <TouchableOpacity style={styles.scanButton} onPress={()=>{
            this.GetCameraPermission("bookid")
          }}><Text style ={ styles.buttonText}>Scan</Text></TouchableOpacity>
        </View>
        <View style={styles.inputview}>
          <TextInput style={styles.inputbox} placeholder="Student id" onChangeText={text=>this.setState({
            scanstudentid:text
          })}
           value={this.state.scanstudentid}/>
          <TouchableOpacity style={styles.scanButton} onPress={()=>{
            this.GetCameraPermission("studentid")
          }}><Text style ={ styles.buttonText}>Scan</Text></TouchableOpacity>
        </View>
     <TouchableOpacity style={styles.submitbutton} onPress={async()=>
      {var transactionMessage = await this.HoldTransaction()}}><Text style={styles.submittext}>Submit</Text></TouchableOpacity>
    </KeyboardAvoidingView>
  );}
}
}
const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
 displayText:{ fontSize: 15, textDecorationLine: 'underline' }, 
 scanButton:{ backgroundColor: '#2196F3',
  padding: 10, margin: 10 }, 
  buttonText:{ fontSize: 20, },
inputview: { flexDirection:"row", margin:20,},
inputbox:{width:105,height:50,fontSize:18},
submitbutton:{backgroundColor:"green",width:70,height:40},
submittext:{textAlign:"center",fontWeight:"bold",fontSize:16,color:"white"}
});
