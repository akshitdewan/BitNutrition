import React, {Component} from 'react';
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import { Container, Content, Button, Text } from 'native-base';

export default class Main extends Component {
  state = {
    products: [
      {
        title: 'Doritos',
        calories: 150
      }
    ]
  }

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
    .then((json) => console.warn(json))
    .catch((error) => console.warn(error));
  }

  render() {
    return (
      <Container>
        <Content padder>
          <View style={{flexDirection: 'row'}}>
            <Button onPress={() => this.props.navigation.navigate('Scan')} light>
              <Text>Scan</Text>
            </Button>
            <Button onPress={() => this.props.navigation.navigate('CameraScreen')} style={{marginLeft: 10}} light>
              <Text>Camera screen</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}