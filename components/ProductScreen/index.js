import React from 'react';
import { Container, Text, View, List, ListItem } from 'native-base';
import { firebaseApp } from '../../repository/firebase';

export default class ProductScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('title', '')
        };
    }

    static nutrients = {
        307: ['Sodium', 'mg'],
        205: ['Calcium', 'mg'],
        303: ['Iron', 'mg'],
        291: ['Fibre', 'g'],
        318: ['Vitamin A', 'IU'],
        415: ['Vitamin B', 'mg'],
        401: ['Vitamin C', 'mg']
    }

    state = {
        product: {}
    }

    async componentWillMount() {
        const productId = this.props.navigation.getParam('productId', null);
        const ref = firebaseApp.database().ref();
        ref.on('value', snap => {
            this.setState({
                ...this.state,
                product: snap.val().products[productId]
            })
        })
    }

    render() {
        return (
            <List style={{margin: 0}}>
                {Object.keys(this.state.product.full_nutrients).map((key, i) => {
                    const el = this.state.product.full_nutrients[key];
                    if (ProductScreen.nutrients[el.attr_id] == undefined) return;
                    return <ListItem style={{marginLeft: 0, paddingLeft: 16}} key={i}>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text>{ProductScreen.nutrients[el.attr_id][0]}</Text>
                            <Text>{el.value} {ProductScreen.nutrients[el.attr_id][1]}</Text>
                        </View>
                    </ListItem>;
                })}
            </List>
        );
    }
}