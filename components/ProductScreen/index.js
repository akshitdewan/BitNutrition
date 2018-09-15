import React from 'react';
import { Container, Text } from 'native-base';
import { connect } from 'react-redux';
import actions from '../../redux/actions';

const mapStateToProps = (state) => {
    return {
        products: state.products
    };
};
const mapDispatchToProps = (dispatch) => {};

class ProductScreen extends React.Component {
    state = {
        product: null
    }

    async componentWillMount() {
        const productId = this.props.navigation.getParam('productId', null);
        this.setState({
            product: this.store.products.find(el => el.id == productId)
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

const dupa = ({ data }) => {
    return { data };
};

export default connect(dupa, actions)(ProductScreen);