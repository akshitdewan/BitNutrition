import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import { Constants, Camera, Permissions } from 'expo';
import { firebaseApp } from '../../repository/firebase';
import axios from 'axios';

function delay(time) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), time);
  });
}
export default class CameraScreen extends Component {
  constructor(props) {
    super(props);
    this.itemsRef = firebaseApp.database().ref();
    //console.log("items ref from constructor " + this.itemsRef);
    this.state = {
      hasCameraPermission: null,
      retrieveMissingNutrition: () => {
        console.log("retrieve missing nutrition");
        // return fetch('https://trackapi.nutritionix.com/v2/search/instant?query=breakfast+with+good+protein&common=true&detailed=true', {
        //   method: 'GET',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'x-app-id': '78b99be4',
        //     'x-app-key': '3336dc25b9c9c59b073c97a6b1f80926'
        //   },
          body: {
            // "full_nutrients": {
            //   //   Protein max is unlimited
            //   "203": {
            //     "gte": 0.4
            //   },
            //   // Fat 75 g
            //   "204": {
            //     "lte": 10
            //   },
            //   // Carbohydrate  300 g
            //   "205": {
            //     "gte": 10,
            //     "lte": 40
            //   }
            // }
          }
        // }).then((response) => response.json())
        //   .then((json) => console.log("STANFORD " + json))
        //   .catch((error) => console.warn(error));
      //   return axios.get('https://trackapi.nutritionix.com/v2/search/instant', {
      //     headers: {
      //     'Content-Type': 'application/json',
      //     "x-app-id": "78b99be4",
      //     "x-app-key":"3336dc25b9c9c59b073c97a6b1f80926"
      //     },
      //     params: {
      //       query: "breakfast with good protein",
      //       "common": true,
      //       "detailed": true,
      //       "full_nutrients": {
      //         //   Protein max is unlimited
      //         "203": {
      //           "gte": 0.4
      //         },
      //         // Fat 75 g
      //         "204": {
      //           "lte": 10
      //         },
      //         // Carbohydrate  300 g
      //         "205": {
      //           "gte": 10,
      //           "lte": 40
      //         }
      //       }
      //     }
      // })
      // .then((data) => {
      //   console.log("STAN " + data)
      // })
      // .catch((error) => console.log("STANERROR " + error));
      return fetch("https://trackapi.nutritionix.com/v2/search/instant", {
        body: "{\n  \"query\": \"breakfeast with good protein\",\n  \"common\": true,\n  \"detailed\": true,\n  \"full_nutrients\": {\n    \"203\": {\n      \"gte\": 0.4\n    },\n    \"204\": {\n      \"lte\": 10\n    },\n    \"205\": {\n      \"gte\": 10,\n      \"lte\": 40\n    }\n  }\n}",
        headers: {
          "Content-Type": "application/json",
          "X-App-Id": "54dbb031",
          "X-App-Key": "168f109946c557af5e3f83856c106d03"
        },
        method: "POST"
      }).then((response) => response.json())
      .then((json) => console.log(json))
      .catch((error)=> console.log("STAN ERROR " + error));
    },
      _handleBarCodeRead: (data) => {
        this.state.retrieveMissingNutrition().then((data) => console.log(JSON.stringify(data)));
        this.setState({ _handleBarCodeRead: null });
        //console.log("items ref 2" + this.itemsRef);
        productsRef = this.itemsRef.child('products');
        //https://trackapi.nutritionix.com/v2/search/item?upc=060410020203
        //data.data is the barcode
        let one = fetch('https://trackapi.nutritionix.com/v2/search/item?upc=' + data.data, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-app-id': '78b99be4',
            'x-app-key': '3336dc25b9c9c59b073c97a6b1f80926'
          }
        }).then((response) => response.json())
          .then((json) => {
            //console.warn(json);
            productsRef.push(json.foods[0]);
            // console.log("pushing " + JSON.stringify(json.foods[0].food_name));
            this.props.navigation.navigate('App', {
              barcode: data.data,
            });
          }
          )
          .catch((error) => console.warn(error));
      }
    }
  }

  componentDidMount() {
    this._requestCameraPermission();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  _handleBarCodeRead = data => {
    this.setState({ _handleBarCodeRead: null });
    productsRef = this.itemsRef.child('htn-food').child('products');
    //https://trackapi.nutritionix.com/v2/search/item?upc=060410020203
    //data.data is the barcode
    let one = fetch('https://trackapi.nutritionix.com/v2/search/item?upc=' + data.data, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-app-id': '3b1feac3',
        'x-app-key': 'b0c5a4d828a89461d52c593e52c99c44'
      }
    }).then((response) => response.json())
      .then((json) => {
        //console.warn(json);
        productsRef.push(json.foods[0]);
        this.props.navigation.navigate('App');
      }
      )
      .catch((error) => console.warn("there is an error"));

  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.hasCameraPermission === null ?
          <Text>Requesting for camera permission</Text> :
          this.state.hasCameraPermission === false ?
            <Text>Camera permission is not granted</Text> :
            <Camera
              onBarCodeRead={this.state._handleBarCodeRead}
              style={StyleSheet.absoluteFill}
            />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  }
});
