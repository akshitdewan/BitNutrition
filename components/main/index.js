import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Camera, Permissions } from 'expo';
import {
  createStackNavigator,
} from 'react-navigation';

class MainScreen extends React.Component {
  _onPressButton = () => {
    //https://trackapi.nutritionix.com/v2/search/item?upc=060410020203
    return fetch('https://mywebsite.com/endpoint/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-app-id': '3b1feac3',
        'x-app-key': 'b0c5a4d828a89461d52c593e52c99c44'
      }
    }).then((response) => response.json())
    .then((json) => console.log(json))
    .catch((error) => console.warn(error));
    // return fetch('https://mywebsite.com/endpoint/', {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     firstParam: 'yourValue',
    //     secondParam: 'yourOtherValue',
    //   }),
    // })
    // .then((response) => response.json())
    // .then((responseJson) => {
    //   return responseJson.movies;
    // })
    // .catch((error) => {
    //   console.error(error);
    // });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
        <TouchableHighlight onPress={this._onPressButton}>
          <View
            style={{ height: 50, width: 50, backgroundColor: 'red' }}
          />
        </TouchableHighlight>

        <TouchableHighlight onPress={this._onPressButton}>
          <View style={{ height: 50, width: 50, backgroundColor: 'red' }}>
            <Text> Scan </Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MainScreen;