import React from 'react';
import { Container, Text } from 'native-base';
import { firebaseApp } from '../../repository/firebase';

export default class ProductScreen extends React.Component {
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
            <Container>
                <Text>{JSON.stringify(this.state)}</Text>
            </Container>
        );
    }
}