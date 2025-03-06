import React, {useContext} from 'react';
import {View} from 'react-native';
import {Image} from 'react-native';

import {StyleSheet, TouchableOpacity, Text, Pressable} from 'react-native';
import {AuthContext} from '../App';

const NavBar = ({navigation}: any) => {
  const authContext = useContext(AuthContext);
  if (!authContext || !authContext.signOut) {
    throw new Error('No AuthContext provided');
  }

  const handleUserDetails = () => {
    console.log('User Details');
    navigation.navigate('UserDetails');
  };

  const handleSignOut = () => {
    authContext.signOut();
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 30,
        marginHorizontal: 5,
      }}>
      <Image
        style={{width: 100, height: 30, borderRadius: 5}}
        source={require('../assets/logo.png')}
      />
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 15}}>
        <Pressable onPress={handleUserDetails}>
          <Image style={styles.avatar} source={require('../assets/user.png')} />
        </Pressable>
        <TouchableOpacity
          style={[styles.btn, {width: 70}]}
          onPress={handleSignOut}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: 32,
    height: 30,
    padding: 5,
    backgroundColor: '#E52020',
    borderRadius: 5,
  },
  avatar: {
    width: 32,
    height: 32,
  },
});

export default NavBar;
