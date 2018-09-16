import React, { Component } from 'react';
import { View } from 'react-native';
import { Container, Content, Button, Text, List } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import Product from '../Product';
import { firebaseApp } from '../../repository/firebase';

export default class Main extends Component {
  state = {
    barcodeList: [],
    products: {}
  }

  componentDidMount() {
    this.listenForProducts();
  }

  listenForProducts() {
    const ref = firebaseApp.database().ref();
    ref.on('value', snap => {
      this.setState({
        products: snap.val().products
      });
    });
  }

  render() {
    const { navigation } = this.props;
    const barcode = navigation.getParam('barcode', '0');
    if (barcode !== '0' && this.state.barcodeList[this.state.barcodeList.length - 1] != barcode) {
      list = this.state.barcodeList.slice(0);
      list.push(barcode);
      this.setState({ barcodeList: list });
    }

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
            {Object.keys(this.state.products).map(key => {
              const el = this.state.products[key];
              return <Product key={key} product={el}
                onPress={() => this.props.navigation.navigate('ProductScreen', { productId: key, title: el.food_name })}/>
            }
            )}
          </List>
        </ScrollView>
      </Container>
    );
  }
}