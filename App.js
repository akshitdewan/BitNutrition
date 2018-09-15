import  React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Camera, Permissions } from 'expo';
import { createStackNavigator } from 'react-navigation';
import TestComponent from './components/TestComponent';
import Main from './components/Main';
import CameraScreen from './components/CameraScreen'

export default class App extends Component {
  render() {
    return (
      <AppStackNavigator />
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

const AppStackNavigator =  createStackNavigator({
  App: {
    screen: Main
  },
  Scan: {
    screen: TestComponent
  },
  CameraScreen: {
    screen: CameraScreen
  }
});