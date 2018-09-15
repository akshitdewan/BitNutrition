import React from 'react'
import { Text, ListItem, View } from 'native-base'

export default class Product extends React.Component {
  render() {
    return (
      <ListItem style={{marginLeft: 0, paddingLeft: 16}}>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>{this.props.product.title}</Text>
          <Text style={{color: 'gray'}}>{this.props.product.calories} kcal</Text>
        </View>
      </ListItem>
    );
  }
}