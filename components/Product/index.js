import React from 'react'
import { Text, ListItem, View } from 'native-base'

export default class Product extends React.Component {
  render() {
    return (
      <ListItem style={{marginLeft: 0, paddingLeft: 16}} onPress={this.props.onPress}>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>{this.props.product.food_name}</Text>
          <Text style={{color: 'gray'}}>{this.props.product.nf_calories} kcal</Text>
        </View>
      </ListItem>
    );
  }
}