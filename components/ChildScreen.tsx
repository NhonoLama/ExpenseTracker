import React from 'react';
import {View, Text} from 'react-native';

type UserProps = {
  name: string;
  age: number;
};

const ChildScreen = ({name, age}: UserProps) => {
  return (
    <View>
      <Text>Name: {name}</Text>
      <Text>Age: {age}</Text>
    </View>
  );
};

export default ChildScreen;
