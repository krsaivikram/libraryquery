
import React from 'react';
import { StyleSheet, Text, View,Image } from 'react-native';
import Transactionscreen from './screens/transactionscreen'
import Searchscreen from './screens/searchscreen'
import {createAppContainer,createSwitchNavigator} from 'react-navigation'
import {createBottomTabNavigator} from 'react-navigation-tabs'
import LoginScreen from './screens/loginscreen'
export default class App extends React.Component{
  render(){
  return (
  <Appcontainer/>
  );
}
}
const Tabnavigator= createBottomTabNavigator({
transaction:{screen:Transactionscreen},
search:{screen:Searchscreen}
},
{
  defaultNavigationOptions:({navigation})=>({
    tabBarIcon:({})=>{
      const routeName=navigation.state.routeName
      if(routeName=="transaction"){
        return(
          <Image source={require('./assets/book.png')} style={{width:60,height:70}}/>
        )
      }
      else if(routeName=="search"){
        return(
          <Image source={require('./assets/searchingbook.png')} style={{width:60,height:70}}/>
        )
      }
    }
  })
}
)
const switchnavigator= createSwitchNavigator({
  LoginScreen:{screen:LoginScreen},
  Tabnavigator:{screen:Tabnavigator}
})
const Appcontainer=createAppContainer(switchnavigator)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
