import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: 'AIzaSyBhygHgYkxvu8QgWjEfmu2iDCZV734_EZo',
    authDomain: "htn-food.firebaseio.com/",
    databaseURL: "https://htn-food.firebaseio.com/",
    storageBucket: "htn-food"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);