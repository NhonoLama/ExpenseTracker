import React, {createContext, useEffect, useMemo} from 'react';
import {useReducer} from 'react';
import CrudScreen from './Screens/CrudScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignInScreen from './Screens/SignInScreen';
import SplashScreen from './Screens/SplashScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button} from 'react-native';

type prevStateType = {
  userToken: string | null;
  isLoading: boolean;
};

type actionType = {
  token?: any;
  type: 'RESTORE_TOKEN' | 'SIGN_IN' | 'SIGN_OUT' | 'REGISTER_IN';
};

type authContextType = {
  signIn: (token: any) => void;
  signOut: () => void;
  registerIn: (token: any) => void;
};

const Stack = createNativeStackNavigator();

export const AuthContext = createContext<authContextType | null>(null);

const initialState = {
  userToken: null,
  isLoading: true,
};

function reducer(prevState: prevStateType, action: actionType) {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...prevState,
        userToken: action.token,
        isLoading: false,
      };
    case 'SIGN_IN':
      return {
        ...prevState,
        userToken: action.token,
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        userToken: null,
      };
    case 'REGISTER_IN':
      return {
        ...prevState,
        userToken: null,
      };
  }
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = await AsyncStorage.getItem('userToken');
        dispatch({type: 'RESTORE_TOKEN', token: userToken});
      } catch (e: any) {
        console.log("Couldn't restore token");
        dispatch({type: 'RESTORE_TOKEN', token: null});
      }
    };
    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async (token: any) => {
        await AsyncStorage.setItem('userToken', JSON.stringify(token));
        dispatch({type: 'SIGN_IN', token});
      },
      signOut: async () => {
        await AsyncStorage.removeItem('userToken');
        dispatch({
          type: 'SIGN_OUT',
        });
      },
      registerIn: async (token: any) => {
        await AsyncStorage.setItem(
          `userRegistrationData-${token.username}-${token.email}`,
          JSON.stringify(token),
        );
        dispatch({type: 'REGISTER_IN', token});
      },
    }),
    [],
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {state.isLoading ? (
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : state.userToken === null ? (
            <>
              <Stack.Screen
                name="SignIn"
                component={SignInScreen}
                options={{
                  title: 'Sign in',
                  animationTypeForReplace: state.userToken ? 'pop' : 'push',
                }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Home"
                component={CrudScreen}
                options={{
                  headerRight: () => (
                    <Button
                      title="Sign Out"
                      onPress={() => authContext.signOut()}
                    />
                  ),
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
