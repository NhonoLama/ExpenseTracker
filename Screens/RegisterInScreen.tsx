import {useState, useContext} from 'react';
import {View, TextInput, Button} from 'react-native';
import {AuthContext} from '../App';

function RegisterInScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const authContext = useContext(AuthContext);
  if (!authContext || !authContext.signIn) {
    throw new Error('No AuthContext provided');
  }
  const {registerIn} = authContext;

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title="Sign In"
        onPress={() => registerIn({username, email, password})}
      />
    </View>
  );
}

export default RegisterInScreen;
