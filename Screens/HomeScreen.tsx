import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, StatusBar} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import CrudScreen from './CrudScreen';

type AppProps = {
  Home: undefined;
  Crud: undefined;
};

type HomeParams = NativeStackScreenProps<AppProps, 'Home'>;

const HomeScreen = ({navigation}: HomeParams) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.head}>Expense Tracker</Text>
      <CrudScreen />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F0F0',

    paddingTop: StatusBar.currentHeight || 0,
  },
  head: {
    fontSize: 25,
    textAlign: 'center',
    color: '#FFEDFA',
    backgroundColor: '#F9CB43',
    paddingVertical: 5,
  },
});

export default HomeScreen;
