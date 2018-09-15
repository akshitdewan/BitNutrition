import  React, {Component} from 'react';
import { createStackNavigator } from 'react-navigation';
import TestComponent from './components/TestComponent';
import Main from './components/Main';
import CameraScreen from './components/CameraScreen';
import Expo from 'expo';
import ProductScreen from './components/ProductScreen';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import reducers from './redux/reducers';

const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

export default class App extends Component {
  state = {
    loading: true,
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({loading: false});
  }

  render() {
    if (this.state.loading) {
      return <Expo.AppLoading/>
    }

    return (
      <Provider store={store}>
        <AppStackNavigator />
      </Provider>
    );
  }
}

const AppStackNavigator =  createStackNavigator({
  App: {
    screen: Main
  },
  Scan: {
    screen: TestComponent
  },
  CameraScreen: {
    screen: CameraScreen
  },
  ProductScreen: {
    screen: ProductScreen
  }
});