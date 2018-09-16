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
    summary: {},
    requirements: {
      calories: 2000,
      sodium: 2300,
      carbohydrates: 300,
      calcium: 780,
      iron: 10,
      fibre: 38,
      vitaminA: 3000,
      vitaminB: 1,
      vitaminC: 34,
    },
    recommendedProducts: []
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

    // FEATURE: Find most critical nutritition

    let tempCritical = {};
    Object.keys(this.state.requirements).forEach(key => {
      tempCritical[key] = sum[key] / this.state.requirements[key]
    });

    let mostCritical = 'calories';
    Object.keys(this.state.requirements).forEach(key => {
      if (tempCritical[key] < tempCritical[mostCritical]) {
        mostCritical = key;
      }
    });

    console.log(tempCritical);
    console.log(mostCritical);

    fetch("https://trackapi.nutritionix.com/v2/search/instant", {
      body: "{\n  \"query\": \"breakfeast with good " + mostCritical + "\",\n  \"common\": true,\n  \"detailed\": true,\n  \"full_nutrients\": {\n    \"203\": {\n      \"gte\": 0.4\n    },\n    \"204\": {\n      \"lte\": 10\n    },\n    \"205\": {\n      \"gte\": 10,\n      \"lte\": 40\n    }\n  }\n}",
      headers: {
        "Content-Type": "application/json",
        "X-App-Id": "54dbb031",
        "X-App-Key": "168f109946c557af5e3f83856c106d03"
      },
      method: "POST"
    })
    .then((response) => response.json())
    .then((data) => {
      this.setState({
        ...this.state,
        recommendedProducts: data.common.slice(0, 5)
      });

      firebaseApp.database().ref('suggested_food').set(
        data.common.slice(0, 5).map(el => el.food_name)
      );
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
              <Button onPress={() => this.props.navigation.navigate('DetectFood')} style={{marginLeft: 10}} light>
                <Text>Detect food</Text>
              </Button>
              <Button onPress={() => this.props.navigation.navigate('CameraScreen')} style={{marginLeft: 10}} light>
                <Text>Camera screen</Text>
              </Button>
            </View>
          </Content>
          <Text letterSpacing=".2em"
            style={{fontWeight: 'bold', marginTop: 16, marginLeft: 16, marginBottom: 8}}>YOU SHOULD EAT ONE OF THESE</Text>
          <List style={{margin: 0}}>
            {this.state.recommendedProducts.map((el, i) => {
              return <ListItem style={{marginLeft: 0, paddingLeft: 16}} key={i}>
                <Text>{el.food_name}</Text>
              </ListItem>;
            })}
          </List>
          <Text letterSpacing=".2em"
            style={{fontWeight: 'bold', marginTop: 16, marginLeft: 16, marginBottom: 8}}>SUMMARY</Text>
          <List style={{margin: 0}}>
              <ListItem style={{marginLeft: 0, paddingLeft: 16}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text>Calories</Text>
                  <Text style={{color: 'gray'}}>{this.state.summary.calories}/{this.state.requirements.calories} kcal</Text>
                </View>
              </ListItem>
              <ListItem style={{marginLeft: 0, paddingLeft: 16}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text>Sodium</Text>
                  <Text style={{color: 'gray'}}>{this.state.summary.sodium}/{this.state.requirements.sodium} mg</Text>
                </View>
              </ListItem>
              <ListItem style={{marginLeft: 0, paddingLeft: 16}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text>Carbohydrates</Text>
                  <Text style={{color: 'gray'}}>{this.state.summary.carbohydrates}/{this.state.requirements.carbohydrates} g</Text>
                </View>
              </ListItem>
              <ListItem style={{marginLeft: 0, paddingLeft: 16}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text>Calcium</Text>
                  <Text style={{color: 'gray'}}>{this.state.summary.calcium}//{this.state.requirements.calcium} mg</Text>
                </View>
              </ListItem>
              <ListItem style={{marginLeft: 0, paddingLeft: 16}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text>Iron</Text>
                  <Text style={{color: 'gray'}}>{this.state.summary.iron}/{this.state.requirements.iron} mg</Text>
                </View>
              </ListItem>
              <ListItem style={{marginLeft: 0, paddingLeft: 16}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text>Fibre</Text>
                  <Text style={{color: 'gray'}}>{this.state.summary.fibre}/{this.state.requirements.fibre} g</Text>
                </View>
              </ListItem>
              <ListItem style={{marginLeft: 0, paddingLeft: 16}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text>Vitamin A</Text>
                  <Text style={{color: 'gray'}}>{this.state.summary.vitaminA}/{this.state.requirements.vitaminA} IU</Text>
                </View>
              </ListItem>
              <ListItem style={{marginLeft: 0, paddingLeft: 16}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text>Vitamin B</Text>
                  <Text style={{color: 'gray'}}>{this.state.summary.vitaminB}/{this.state.requirements.vitaminB} mg</Text>
                </View>
              </ListItem>
              <ListItem style={{marginLeft: 0, paddingLeft: 16}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text>Vitamin C</Text>
                  <Text style={{color: 'gray'}}>{this.state.summary.vitaminC}/{this.state.requirements.vitaminC} mg</Text>
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