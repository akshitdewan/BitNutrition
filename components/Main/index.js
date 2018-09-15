import React, { Component } from 'react';
import { View } from 'react-native';
import { Container, Content, Button, Text, List } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import Product from '../Product';
import ProductsRepository from '../../repository/ProductsRepository';

export default class Main extends Component {
  state = {
    products: [
      {
        title: 'Doritos',
        calories: 150
      }
    ],
    barcodeList: [],
    products: []
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

  async componentWillMount() {
    const repo = new ProductsRepository();
    this.setState({
      products: await repo.getAll()
  })
  }

  render() {
    const { navigation } = this.props;
    const barcode = navigation.getParam('barcode', '0');
    if(barcode!=='0' && this.state.barcodeList[this.state.barcodeList.length-1]!=barcode) {
      list = this.state.barcodeList.slice(0);
      list.push(barcode);
      this.setState({barcodeList: list});
    }
    console.warn(this.state.barcodeList);
    return (
      <Container>
        <ScrollView>
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
          <Text letterSpacing=".2em"
            style={{fontWeight: 'bold', marginTop: 16, marginLeft: 16, marginBottom: 8}}>PRODUCTS</Text>
          <List style={{margin: 0}}>
            {this.state.products.map(el =>
              <Product key={el.id} product={el}
                onPress={() => this.props.navigation.navigate('ProductScreen', {productId: this.props.id})}/>
            )}
          </List>
        </ScrollView>
      </Container>
    );
  }
}