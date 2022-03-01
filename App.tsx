import React from 'react';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import {colors} from './src/constants';

import Keyboard from './src/components/Keyboard';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <Text style={styles.title}>WORDLE</Text>

      <View style={styles.map}>
        <View style={styles.row}>
          <View style={styles.cell} />
          <View style={styles.cell} />
          <View style={styles.cell} />
          <View style={styles.cell} />
          <View style={styles.cell} />
          <View style={styles.cell} />
        </View>
      </View>

      <Keyboard />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
  },
  title: {
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 7,
    marginTop: 30
  },
  map: {
    backgroundColor: 'red',
    alignSelf: 'stretch',
    height: 100
  },

  row: {
    alignSelf: 'stretch',
    flexDirection: 'row',
  },

  cell: {
    borderWidth: 2,
    borderColor: colors.darkgrey,
    flex: 1,
    aspectRatio: 1,
    margin: 3
  }

});
