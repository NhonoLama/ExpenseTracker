import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

const Header = () => {
  return (
    <View style={{alignItems: 'center', marginVertical: 30}}>
      <Image style={styles.img} source={require('../assets/logo.png')} />
    </View>
  );
};

const styles = StyleSheet.create({
  img: {width: 300, height: 70, borderRadius: 15},
});

export default Header;
