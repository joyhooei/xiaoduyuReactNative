import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  NavigatorIOS,
  ScrollView,
  refreshControl,
  RefreshControl,
  Navigator,
  Button
} from 'react-native';

import NotificationList from '../../components/notification-list'

class Notifications extends React.Component {

  static navigationOptions = {
    title: '通知',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('./images/notification.png')}
        style={[stylesIcon.icon, {tintColor: tintColor}]}
      />
    )
  }

  render() {
    return (<NotificationList {...this.props} name="notification" />)
  }
}

const stylesIcon = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});

export default Notifications
