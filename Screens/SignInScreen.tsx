import {useState, useContext} from 'react';
import {View, TextInput, Button, StyleSheet, Text} from 'react-native';
import {AuthContext} from '../App';
import Header from '../Components/Header';
import React from 'react';

function SignInScreen({navigation}: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const authContext = useContext(AuthContext);
  if (!authContext || !authContext.signIn) {
    throw new Error('No AuthContext provided');
  }
  const {signIn} = authContext;

  const handleSignIn = () => {
    signIn({email, password});
    console.log('Sign In complete');
  };

  return (
    <View style={{margin: 30}}>
      <Header />
      <View style={{marginBottom: 40}}>
        <TextInput
          style={styles.textBorder}
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          style={[styles.textBorder, {marginBottom: 30}]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Sign In" onPress={handleSignIn} />
      </View>
      <View style={{alignItems: 'center', gap: 10}}>
        <Text style={{fontStyle: 'italic'}}>Not Signed in??</Text>
        <Button
          title="Register"
          onPress={() => navigation.navigate('RegisterIn')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textBorder: {
    borderWidth: 1,
    borderBottomColor: '#BDB395',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
});

export default SignInScreen;
