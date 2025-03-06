import React from 'react';
import {Image, Text, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserDetailsScreen = async ({route}: any) => {
  // try {
  //   const {email} = route.params;
  //   const userData = await AsyncStorage.getItem(
  //     `userRegistrationData-${email}`,
  //   );

  //   if (!userData) {
  //     return;
  //   }

  //   const storedUser = JSON.parse(userData);
  //   console.log(storedUser);
  // } catch (error) {
  //   console.log(error);
  // }

  return (
    <View>
      <View>
        <Image source={require('../assets/user.png')} />
        <Text></Text>
      </View>
    </View>
  );
};

export default UserDetailsScreen;
