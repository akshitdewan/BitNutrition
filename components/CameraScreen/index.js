// import React from 'react';
// import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
// import { Camera, Permissions, BarCodeScanner } from 'expo';

// class CameraScreen extends React.Component {
//   state = {
//     hasCameraPermission: null,
//     type: Camera.Constants.Type.back,
//   };

//   async componentWillMount() {
//     const { status } = await Permissions.askAsync(Permissions.CAMERA);
//     this.setState({ hasCameraPermission: status === 'granted' });
//   }

//   render() {
//     const { hasCameraPermission } = this.state;

//     if (hasCameraPermission === null) {
//       return <Text>Requesting for camera permission</Text>;
//     }
//     if (hasCameraPermission === false) {
//       return <Text>No access to camera</Text>;
//     }
//     return (
//       <View style={{ flex: 1 }}>
//         <Camera
//           onBarCodeRead={this._handleBarCodeRead}
//           style={StyleSheet.absoluteFill}
//         />
//       </View>
//     );
//   }

//   _handleBarCodeRead = data => {
//     Alert.alert(
//       'Scan successful!',
//       JSON.stringify(data)
//     );
//   };
// }

// export default CameraScreen;
import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import { Constants, Camera, Permissions } from 'expo';

export default class CameraScreen extends Component {
  state = {
    hasCameraPermission: null
  };

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
    Alert.alert(
      'Scan successful!',
      JSON.stringify(data)
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.hasCameraPermission === null ?
          <Text>Requesting for camera permission</Text> :
          this.state.hasCameraPermission === false ?
            <Text>Camera permission is not granted</Text> :
            <Camera
              onBarCodeRead={this._handleBarCodeRead}
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
