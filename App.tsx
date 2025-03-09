import React, {createContext, useEffect, useMemo, useReducer} from 'react';
import {Alert, Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

// Screens and database methods import (keep your imports as they are)
import CrudScreen from './Screens/CrudScreen';
import SignInScreen from './Screens/SignInScreen';
import SplashScreen from './Screens/SplashScreen';
import RegisterInScreen from './Screens/RegisterInScreen';
import UserDetailsScreen from './Screens/UserDetailsScreen';
import {
  createTables,
  getDBConnection,
  getUserExpenses,
  addUser,
  getUserData,
  getAllUsers,
} from './Database/dbservices';
import {User} from './Database/models';

type prevStateType = {
  userToken: string | null;
  isLoading: boolean;
  user: User | null;
  expenses: any[];
};

type actionType = {
  token?: any;
  user?: User;
  expenses?: any[];
  type:
    | 'RESTORE_TOKEN'
    | 'SIGN_IN'
    | 'SIGN_OUT'
    | 'REGISTER_IN'
    | 'SET_EXPENSES'
    | 'SET_USER';
};

type authContextType = {
  user: User | null;
  expenses: any[];
  signIn: (token: any) => void;
  signOut: () => void;
  registerIn: (token: any) => void;
  getUserDetails: (id: number) => Promise<User | null>;
};

const Stack = createNativeStackNavigator();

export const AuthContext = createContext<authContextType | null>(null);

const initialState = {
  userToken: null,
  isLoading: true,
  user: null,
  expenses: [],
};

const uniqueId = () => {
  return parseInt(uuid.v4().replace(/-/g, '').slice(0, 12), 16);
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
    case 'SET_EXPENSES':
      return {
        ...prevState,
        expenses: action.expenses || [],
      };
    case 'SET_USER':
      return {
        ...prevState,
        user: action.user || null,
      };
    default:
      return prevState;
  }
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = await AsyncStorage.getItem('userToken');

        if (userToken) {
          const parsedToken = JSON.parse(userToken);
          const userEmail = parsedToken.email;

          dispatch({type: 'RESTORE_TOKEN', token: userToken});
          console.log('Restored Token:', userToken);

          const db = await getDBConnection();
          await createTables(db);

          const user = await getUserData(db, userEmail);
          if (user) {
            console.log('User Found:', user);

            const expenses = await getUserExpenses(db, user.id);
            console.log('User Expenses:', expenses);
            dispatch({type: 'SET_USER', user});
            dispatch({type: 'SET_EXPENSES', expenses});
          } else {
            console.log('No user found for the provided email.');
          }
        } else {
          console.log('No userToken found in AsyncStorage.');
          dispatch({type: 'RESTORE_TOKEN', token: null});
        }
      } catch (e) {
        console.error("Couldn't restore token or fetch data", e);
        dispatch({type: 'RESTORE_TOKEN', token: null});
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      user: state.user,
      expenses: state.expenses,
      signIn: async (user: any) => {
        try {
          const db = await getDBConnection();

          const storedUser = await getUserData(db, user.email);
          console.log(storedUser);

          if (!storedUser) {
            Alert.alert('ERROR', 'User not found.');
            return;
          }

          if (storedUser.password !== user.password) {
            Alert.alert('ERROR', 'Invalid password.');
            return;
          }

          const expenses = await getUserExpenses(db, user.id);
          console.log('Expense:', expenses);

          await AsyncStorage.setItem('userToken', JSON.stringify(user));

          dispatch({type: 'SIGN_IN', token: user});
          dispatch({type: 'SET_USER', user: storedUser});
          dispatch({type: 'SET_EXPENSES', expenses});
        } catch (error) {
          console.error('Sign-in error:', error);
        }
      },
      signOut: async () => {
        await AsyncStorage.removeItem('userToken');
        dispatch({
          type: 'SIGN_OUT',
        });
      },
      registerIn: async (token: any) => {
        try {
          const db = await getDBConnection();
          const user = {
            id: uniqueId(),
            username: token.username,
            email: token.email,
            password: token.password,
          };
          await createTables(db);

          await addUser(db, user);
          const users = await getAllUsers(db);
          console.log(users);

          dispatch({type: 'REGISTER_IN', token: user});
        } catch (error) {
          console.error('Error saving user to DB:', error);
        }
      },
      getUserDetails: async (id: number) => {
        try {
          const db = await getDBConnection();
          const userData = await getUserData(db, id.toString());

          if (!userData) {
            return null;
          }
          console.log(userData);

          return userData;
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
    [state.user, state.expenses],
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {state.isLoading ? (
            <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{headerShown: false}}
            />
          ) : state.userToken === null ? (
            <>
              <Stack.Screen
                name="SignIn"
                component={SignInScreen}
                options={{
                  headerShown: false,
                  animationTypeForReplace: state.userToken ? 'pop' : 'push',
                }}
              />
              <Stack.Screen
                name="RegisterIn"
                component={RegisterInScreen}
                options={{headerShown: false}}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Home"
                component={CrudScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="UserDetails"
                component={UserDetailsScreen}
                options={{
                  headerShown: false,
                  animationTypeForReplace: state.userToken ? 'pop' : 'push',
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
