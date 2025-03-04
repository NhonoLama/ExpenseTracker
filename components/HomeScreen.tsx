import React from 'react';
import {useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import Home from './ChildScreen';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type AppProps = {
  Home: undefined;
  Crud: undefined;
};

type HomeParams = NativeStackScreenProps<AppProps, 'Home'>;

const HomeScreen = ({navigation}: HomeParams) => {
  return (
    <View>
      <View>
        <Button
          title="Go to Crud app"
          onPress={() => navigation.navigate('Crud')}
        />
      </View>
    </View>
  );
};

export default HomeScreen;
