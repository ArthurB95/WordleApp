import React from 'react';

import {View, Text} from 'react-native';

const EndScreen = ({won = false}) => {
  return (
    <View>
      <Text style={{fontSize: 30, color: 'white'}}>EndScreen</Text>
    </View>
  )
}

export default EndScreen;