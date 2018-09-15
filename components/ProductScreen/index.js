import React from 'react'
import { Container, Text } from 'native-base';
import ProductsRepository from '../../repository/ProductsRepository';

export default class ProductScreen extends React.Component {
    state = {
        product: null
    }

    async componentWillMount() {
        const productId = this.props.navigation.getParam('productId', null);
        const repo = new ProductsRepository();
        this.setState({
            product: await repo.getById(productId)
        });
    }

    render() {
        return (
            <Container>
                <Text>{JSON.stringify(this.state)}</Text>
            </Container>
        );
    }
}