import React from "react";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";
import { colors } from "./src/constants";

import Keyboard from "./src/components/Keyboard";

const NUMBER_OF_TRIES = 6;

export default function App() {
  const word = "hello";
  const letters = word.split("");

  const rows = new Array(NUMBER_OF_TRIES).fill(
    new Array(letters.length).fill("")
  );

  const onKeyPressed = (key: string) => {
    console.warn(key)
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <Text style={styles.title}>WORDLE</Text>

      <ScrollView showsHorizontalScrollIndicator={false} style={styles.map}>
        {rows.map((row) => (
          <View style={styles.row}>
            {row.map((cell: string) => (
              <View style={styles.cell}>
                <Text style={styles.cellText}>{cell.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <Keyboard onKeyPressed={onKeyPressed}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: "center",
  },
  title: {
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 7,
    marginTop: 30,
  },
  map: {
    alignSelf: "stretch",
    marginVertical: 20,
    height: 100,
  },

  row: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "center",
  },

  cell: {
    borderWidth: 3,
    borderColor: colors.darkgrey,
    flex: 1,
    aspectRatio: 1,
    margin: 3,
    maxWidth: 70,
    justifyContent: "center",
    alignItems: 'center'
  },

  cellText: {
    color: colors.lightgrey,
    fontWeight: "bold",
    fontSize: 28
  }
});
