import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert, Button } from 'react-native';
import { Constants, Camera, Permissions } from 'expo';

export default class DetectFood extends Component {
  state = {
    hasCameraPermission: null,
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

  snap = async () => {
    console.log('done')
    if (this.camera) {
      let photo = await this.camera.takePictureAsync({base64: true, skipProcessing: true, quality: 0});
      photo = String(photo['base64'])
      
      return fetch('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyA0AhaLszD3frbmYj695IefSuU6t_GIWOo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'requests': [
            {
              'image': {
                'content': photo
              },
              'features': [
                {
                  'type': 'LABEL_DETECTION',
                  'maxResults': 5
                }
              ]
            }
          ]
        })
      }).then((response) => response.json())
        .then((json) => console.warn(json))
        .catch((error) => console.warn(error));
      }

  };

  render() {
    return [
      <View style={styles.container} key={1}>
        {this.state.hasCameraPermission === null ?
          <Text>Requesting for camera permission</Text> :
          this.state.hasCameraPermission === false ?
            <Text>Camera permission is not granted</Text> :
            <Camera
              ref={ref => { this.camera = ref; }}
              style={StyleSheet.absoluteFill}
            />
        }
      </View>,
      <View style={styles.takePicture} key={2}>
        <Button title="Take" onPress={this.snap.bind(this)} />
      </View>
    ];
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  takePicture: {
    position: 'absolute',
    width: 100,
    height: 50,
    alignSelf: 'center',
    bottom: 0
  }
});
