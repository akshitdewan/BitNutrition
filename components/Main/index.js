import React, { Component } from 'react';
import { View } from 'react-native';
import { Container, Content, Button, Text, List, ListItem } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import Product from '../Product';
import { firebaseApp } from '../../repository/firebase';

export default class Main extends Component {
  state = {
    barcodeList: [],
    products: {},
    summary: {}
  }

  componentDidMount() {
    this.listenForProducts();
  }

  listenForProducts() {
    const ref = firebaseApp.database().ref();
    ref.on('value', snap => {
      this.setState({
        products: snap.val().products,
        summary: this.calcSummary(snap.val().products)
      });
    });
  }

  calcSummary(products) {
    let sum = { calories: 0, sodium: 0, carbohydrates: 0, calcium: 0, iron: 0,
      fibre: 0, vitaminA: 0, vitaminB: 0, vitaminC: 0 }
    Object.keys(products).map(key => {
      const nutrients = products[key].full_nutrients;
      //console.log(nutrients);
      sum.calories += products[key].nf_calories || 0;
      sum.sodium += this.getNutrientValue(nutrients, 307);
      sum.carbohydrates += this.getNutrientValue(nutrients, 205);
      sum.calcium += this.getNutrientValue(nutrients, 301);
      sum.iron += this.getNutrientValue(nutrients, 303);
      sum.fibre += this.getNutrientValue(nutrients, 291);
      sum.vitaminA += this.getNutrientValue(nutrients, 318);
      sum.vitaminB += this.getNutrientValue(nutrients, 415);
      sum.vitaminC += this.getNutrientValue(nutrients, 401);
    });

    return sum;
  }

  getNutrientValue(nutrients, id) {
    const nutrient = nutrients.find(el => el.attr_id == id);
    if (nutrient == undefined)
      return 0;

    return nutrient.value;
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
            style={{fontWeight: 'bold', marginTop: 16, marginLeft: 16, marginBottom: 8}}>SUMMARY</Text>
          <List style={{margin: 0}}>
              <ListItem style={{marginLeft: 0, paddingLeft: 16}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text>Calories</Text>
                  <Text style={{color: 'gray'}}>{this.state.summary.calories} kcal</Text>
                </View>
              </ListItem>
              <ListItem style={{marginLeft: 0, paddingLeft: 16}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text>Sodium</Text>
                  <Text style={{color: 'gray'}}>{this.state.summary.sodium} mg</Text>
                </View>
              </ListItem>
              <ListItem style={{marginLeft: 0, paddingLeft: 16}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text>Carbohydrates</Text>
                  <Text style={{color: 'gray'}}>{this.state.summary.carbohydrates} g</Text>
                </View>
              </ListItem>
              <ListItem style={{marginLeft: 0, paddingLeft: 16}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text>Calcium</Text>
                  <Text style={{color: 'gray'}}>{this.state.summary.calcium} mg</Text>
                </View>
              </ListItem>
              <ListItem style={{marginLeft: 0, paddingLeft: 16}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text>Iron</Text>
                  <Text style={{color: 'gray'}}>{this.state.summary.iron} mg</Text>
                </View>
              </ListItem>
              <ListItem style={{marginLeft: 0, paddingLeft: 16}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text>Fibre</Text>
                  <Text style={{color: 'gray'}}>{this.state.summary.fibre} g</Text>
                </View>
              </ListItem>
              <ListItem style={{marginLeft: 0, paddingLeft: 16}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text>Vitamin A</Text>
                  <Text style={{color: 'gray'}}>{this.state.summary.vitaminA} IU</Text>
                </View>
              </ListItem>
              <ListItem style={{marginLeft: 0, paddingLeft: 16}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text>Vitamin B</Text>
                  <Text style={{color: 'gray'}}>{this.state.summary.vitaminB} mg</Text>
                </View>
              </ListItem>
              <ListItem style={{marginLeft: 0, paddingLeft: 16}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text>Vitamin C</Text>
                  <Text style={{color: 'gray'}}>{this.state.summary.vitaminC} mg</Text>
                </View>
              </ListItem>
          </List>
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