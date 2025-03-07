import React from 'react';
import {View, Text, FlatList} from 'react-native';

const UserDetailsScreen = ({route}: any) => {
  const {user, expenses} = route.params;

  return (
    <View style={{flex: 1, padding: 20}}>
      {user ? (
        <>
          <Text style={{fontSize: 24}}>Username: {user.username}</Text>
          <Text style={{fontSize: 18}}>Email: {user.email}</Text>
        </>
      ) : (
        <Text style={{fontSize: 18}}>No user found</Text>
      )}

      <Text style={{fontSize: 20, marginVertical: 10}}>Expenses:</Text>
      {expenses && expenses.length > 0 ? (
        <FlatList
          data={expenses}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View style={{padding: 10}}>
              <Text>Expense: {item.description}</Text>
              <Text>Amount: {item.amount}</Text>
            </View>
          )}
        />
      ) : (
        <Text>No expenses found</Text>
      )}
    </View>
  );
};

export default UserDetailsScreen;
