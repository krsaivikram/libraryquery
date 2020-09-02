import * as firebase from 'firebase';
require('@firebase/firestore')
var firebaseConfig = {
    apiKey: "AIzaSyARupg86bbcBJuQ0AaAup9SAGGkPNlTMDY",
    authDomain: "wireleibrary-c2356.firebaseapp.com",
    databaseURL: "https://wireleibrary-c2356.firebaseio.com",
    projectId: "wireleibrary-c2356",
    storageBucket: "wireleibrary-c2356.appspot.com",
    messagingSenderId: "852313831096",
    appId: "1:852313831096:web:27af4d7d385a05db83664d"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase.firestore();