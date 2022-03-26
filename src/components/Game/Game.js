import React, { useEffect, useState } from "react";

import { Text, View, ScrollView, Alert, ActivityIndicator } from "react-native";
import { colors, CLEAR, ENTER, colorsToEmoji } from "../../constants";
import { copyArray, getDayOfTheYear, getDayKey } from '../../utils';

import * as Clipboard from 'expo-clipboard';
import Keyboard from "../Keyboard";
import words from '../../words';
import styles from './Game.styles';
import AsyncStorage from "@react-native-async-storage/async-storage";

const NUMBER_OF_TRIES = 6;

const dayOfTheYear = getDayOfTheYear();

const dayKey = getDayKey();

const game = {

}

const Game = () => {
  // AsyncStorage.removeItem("@game")
  const word = words[dayOfTheYear];
  const letters = word.split("");

  const [rows, setRows] = useState(
    new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(""))
  );

  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);
  const [gameState, setGameState] = useState('playing');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {

    if (curRow > 0) {
      checkGameState();
    }

  }, [curRow])

  useEffect(() => {
    if (loaded) {
      persistState();
    }
  }, [rows, curRow, curCol, gameState])

  useEffect(() => {
    readState()
  }, [])

  const persistState = async () => {
    //WRITE ALL THE STATE VARIABLES IN ASYNC STORAGE
    const dataForToday = {
      rows,
      curRow,
      curCol,
      gameState
    }

    try {
      const existingStateString = await AsyncStorage.getItem('@game');
      const existingState = existingStateString ? JSON.parse(existingStateString) : {};

      existingState[dayKey] = dataForToday;

      const dataString = JSON.stringify(existingState);
      console.log('Saving', dataString)
      await AsyncStorage.setItem('@game', dataString)
    } catch (e) {
      console.log('Failed to write data to async storage', e);
    }
  }

  const readState = async () => {
    const dataString = await AsyncStorage.getItem("@game");
    try {
      const data = JSON.parse(dataString);
      const day = data[dayKey];
      setRows(day.rows);
      setCurCol(day.curCol);
      setCurRow(day.curRow);
      setGameState(day.gameState);
    } catch (e) {
      console.log("Couldn't parse the state", e);
    }

    setLoaded(true)
  }

  const checkGameState = () => {
    if (checkIfWon() && gameState !== "won") {
      Alert.alert('WOOOWWWW', 'YOU WON 🏆', [{ text: 'Share', onPress: shareScore }]);
      setGameState('won')
    } else if (checkIfLost() && gameState !== 'lost') {
      Alert.alert('😪', 'Try again tomorrow!');
      setGameState('lost')
    }
  }

  const shareScore = () => {
    const textMap = rows.map((row, i) => row.map((cell, j) => colorsToEmoji[getCellBGColor(i, j)]).join("")).filter((row) => row).join('\n')

    const textToShare = `Wordle \n ${textMap}`

    Clipboard.setString(textToShare);
    Alert.alert('Copied successfully!', 'Share your score on you social media');
  }

  const checkIfWon = () => {
    const row = rows[curRow - 1];

    return row.every((letter, i) => letter === letters[i]);
  }

  const checkIfLost = () => {
    return !checkIfWon() && curRow === rows.length;
  }

  const onKeyPressed = (key) => {
    if (gameState !== 'playing') {
      return;
    }

    const updateRows = copyArray(rows);

    if (key === CLEAR) {
      const prevCol = curCol - 1;
      if (prevCol >= 0) {
        updateRows[curRow][prevCol] = "";
        setRows(updateRows);
        setCurCol(prevCol);
      }
      return;
    }

    if (key === ENTER) {
      if (curCol === rows[0].length) {
        setCurRow(curRow + 1);
        setCurCol(0);
      }
      return;
    }

    if (curCol < rows[0].length) {
      updateRows[curRow][curCol] = key;
      setRows(updateRows);
      setCurCol(curCol + 1);
    }
  };

  const isCellActive = (row, col) => {
    return row === curRow && col === curCol;
  };

  const getCellBGColor = (row, col) => {

    const letter = rows[row][col];
    if (row >= curRow) {
      return colors.black;
    }
    if (letter === letters[col]) {
      return colors.primary;
    }
    if (letters.includes(letter)) {
      return colors.secondary;
    }
    return colors.darkgrey;
  };

  const getAllLettersWithColor = (color) => {

    return rows.flatMap((row, i) => row.filter((cell, j) => getCellBGColor(i, j) === color))

  }

  const greenCaps = getAllLettersWithColor(colors.primary);
  const yellowCaps = getAllLettersWithColor(colors.secondary);
  const greyCaps = getAllLettersWithColor(colors.darkgrey);

  if (!loaded) {
    return (<ActivityIndicator />)
  }

  return (
    <>
      <ScrollView showsHorizontalScrollIndicator={false} style={styles.map}>
        {rows.map((row, i) => (
          <View key={`row-${i}`} style={styles.row}>
            {row.map((letter, j) => (
              <View
                key={`cell-${i}-${j}`}
                style={[
                  styles.cell,
                  {
                    borderColor: isCellActive(i, j)
                      ? colors.lightgrey
                      : colors.darkgrey,
                    backgroundColor: getCellBGColor(i, j),
                  },
                ]}
              >
                <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <Keyboard onKeyPressed={onKeyPressed} greenCaps={greenCaps} yellowCaps={yellowCaps} greyCaps={greyCaps} />
    </>
  );
}

export default Game;
