import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import { Constants, Camera, Permissions } from 'expo';
import { firebaseApp } from '../../repository/firebase';

function delay(time) {
  return new Promise(function(resolve, reject) {
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
      _handleBarCodeRead: (data) => {
        this.setState({_handleBarCodeRead: null});
      //console.log("items ref 2" + this.itemsRef);
      productsRef = this.itemsRef.child('products');
      //https://trackapi.nutritionix.com/v2/search/item?upc=060410020203
      //data.data is the barcode
    let one =  fetch('https://trackapi.nutritionix.com/v2/search/item?upc='+data.data, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-app-id': '78b99be4',
          'x-app-key': '3336dc25b9c9c59b073c97a6b1f80926'
        }
      }).then((response) => response.json())
      .then((json) =>  {
        //console.warn(json);
        productsRef.push(json.foods[0]);
       // console.log("pushing " + JSON.stringify(json.foods[0].food_name));
        this.props.navigation.navigate('App', {
        barcode:data.data,
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
    this.setState({_handleBarCodeRead: null});
    productsRef = this.itemsRef.child('htn-food').child('products');
      //https://trackapi.nutritionix.com/v2/search/item?upc=060410020203
      //data.data is the barcode
    let one =  fetch('https://trackapi.nutritionix.com/v2/search/item?upc='+data.data, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-app-id': '3b1feac3',
          'x-app-key': 'b0c5a4d828a89461d52c593e52c99c44'
        }
      }).then((response) => response.json())
      .then((json) =>  {
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
