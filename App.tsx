import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './components/HomeScreen';
import CrudScreen from './components/CrudScreen';

type AppProps = {
  Home: undefined;
  Crud: undefined;
};

const App = () => {
  const Stack = createNativeStackNavigator<AppProps>();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Crud" component={CrudScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
