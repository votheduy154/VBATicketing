import React from 'react';
import { View, Text, Button } from 'react-native';

class DemoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onClick() {
    this.props.navigator.push({
      screen: 'RNBoot.HomeScreen',
      title: 'Home'
    });
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#999' }}>
        <Text style={{ fontSize: 30 }}>
          A basic button component that sh ould render nicely on any platform. Supports a minimal level of
          customization.
        </Text>
        <Button title="Learn More" color="#841584" onPress={() => this.onClick()} />
      </View>
    );
  }
}
export default DemoPage;
