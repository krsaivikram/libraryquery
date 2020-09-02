
import React from 'react';
import { StyleSheet, Text, View,ScrollView ,FlatList,TextInput, TouchableOpacity } from 'react-native';
import db from '../config';
import firebase from 'firebase' ;

export default class Searchscreen extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      alltransactions:[],
      lastvisibletransaction:null,
      search:"",
    }
  }
  componentDidMount=async()=>{
    const query = await db.collection("transaction").get();
    query.docs.map((doc)=>{
      this.setState({alltransactions:[],
      lastvisibletransaction:doc
      })
    })
  }
  fetchmoretransaction=async()=>{
   var text = this.state.search
   var entertext = text.split("")
   if(entertext[0]=="b"){
    const transaction = await db.collection("transaction").where("BookId","==",text).startAfter(this.state.lastvisibletransaction).get();
    transaction.docs.map((doc)=>{
      this.setState({alltransactions:[...this.state.alltransactions,doc.data()],
        lastvisibletransaction:doc
    })
  })
}
else if(entertext[0]=="s"){
  const transaction = await db.collection("transaction").where("StudentId","==",text).startAfter(this.state.lastvisibletransaction).get();
  transaction.docs.map((doc)=>{
    this.setState({alltransactions:[...this.state.alltransactions,doc.data()],
      lastvisibletransaction:doc
  })
})
}
  }
searchtransaction = async(text)=>{
  var entertext = text.split("")
  if(entertext[0]=="b"){
    const transaction = await db.collection("transaction").where("BookId","==",text).get();
    transaction.docs.map((doc)=>{
      this.setState({alltransactions:[...this.state.alltransactions,doc.data()],
        lastvisibletransaction:doc
    })
  })
}
else if(entertext[0]=="s"){
  const transaction = await db.collection("transaction").where("StudentId","==",text).get();
  transaction.docs.map((doc)=>{
    this.setState({alltransactions:[...this.state.alltransactions,doc.data()],
      lastvisibletransaction:doc
  })
})
}}
   render(){
  return (
    <View style={styles.container}>
      <View style={styles.inputbox}>
        <TextInput placeholder="Enter book id or student id" onChangeText={(text)=>{this.setState({search:text})}}></TextInput>
        <TouchableOpacity style={styles.submitbutton} onPress={()=>{
          this.searchtransaction(this.state.search);
        }}><Text>Search</Text></TouchableOpacity>
      </View>
   
      <FlatList
      data={this.state.alltransactions}
      renderItem={({item})=>(
        <View style={{borderBottomWidth:3}}>
        <Text style={{fontSize:14}}>{"BookId:"+item.BookId}</Text>
        <Text style={{fontSize:14}}>{"StudentId:"+item.StudentId}</Text>
        <Text style={{fontSize:14}}>{"TransactionType:"+item.TransactionType}</Text>
    
        </View>
     
      )}
      
         keyExtractor={(item,index)=>index.toString()}
         onEndReached={this.fetchmoretransaction}
         onEndReachedThreshold={0.7}
  
   />
       </View>
    
  )}
}
const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  inputbox:{width:105,height:50,fontSize:18},
  submitbutton:{backgroundColor:"green",width:70,height:40},
  submitbutton:{backgroundColor:"green",width:70,height:40},
});