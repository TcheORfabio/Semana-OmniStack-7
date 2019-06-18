import React from 'react';
import { Image } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

// Components
import { Feed, New } from './pages';

// Assets
import logo from '../assets/logo.png';


const stackNavigator = createStackNavigator({
  Feed,
  New,
}, {
  initialRouteName: 'New',
  defaultNavigationOptions: {
    headerTitle: <Image source={logo} style={{ marginHorizontal: 20 }} />,
    headerBackTitle: null,
    headerTintColor: '#000',
  },
  mode: 'modal',
});

export default createAppContainer(stackNavigator);
