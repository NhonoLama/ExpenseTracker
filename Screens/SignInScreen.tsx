import {useState, useContext} from 'react';
import {View, TextInput, Button} from 'react-native';
import {AuthContext} from '../App';

const handleSignIn = async()=>{
  const username = await AsyncStorage.getItem(`userRegistrationData-${token.username}-${token.email}`);
  if (!username || !password) {
    Alert.alert('ERROR', 'Enter both fields');
    return;
  }
  elseif (username === 'admin' && password === 'admin') {
    signIn('token');
}

function SignInScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const authContext = useContext(AuthContext);
  if (!authContext || !authContext.signIn) {
    throw new Error('No AuthContext provided');
  }
  const {signIn} = authContext;

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign In" onPress={handleSignIn})} />
    </View>
  );
}

export default SignInScreen;
