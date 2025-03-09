import {useState, useContext} from 'react';
import {View, TextInput, Button, Alert, StyleSheet} from 'react-native';
import {AuthContext} from '../App';
import Header from '../Components/Header';
import React from 'react';

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

function RegisterInScreen({navigation}: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const authContext = useContext(AuthContext);
  if (!authContext || !authContext.registerIn) {
    throw new Error('No AuthContext provided');
  }
  const {registerIn} = authContext;

  const handleRegisterIn = () => {
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Invalid Email');
      return;
    }
    registerIn({
      username,
      email,
      password,
    });
    navigation.navigate('SignIn');
    Alert.alert('Success', 'Registered Successfully');
  };

  return (
    <View style={{margin: 30, gap: 30}}>
      <View>
        <Header />
        <TextInput
          style={styles.textBorder}
          placeholder="Username"
          value={username}
          onChangeText={text => setUsername(text)}
        />
        <TextInput
          style={styles.textBorder}
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          style={styles.textBorder}
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry
        />
      </View>
      <Button title="Register" onPress={() => handleRegisterIn()} />
    </View>
  );
}

const styles = StyleSheet.create({
  textBorder: {
    borderWidth: 1,
    borderBottomColor: '#BDB395',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
});

export default RegisterInScreen;
