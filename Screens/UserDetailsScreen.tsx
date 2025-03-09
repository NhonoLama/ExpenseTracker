import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {AuthContext} from '../App';
import {getDBConnection, getUserExpenses} from '../Database/dbservices';
import {Expense} from '../Database/models';

const UserDetailsScreen = () => {
  const authContext = useContext(AuthContext);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  if (!authContext) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const {user} = authContext;

  useEffect(() => {
    const callExpenses = async () => {
      if (!user) {
        console.log('User Data:', user);
        return;
      }
      const db = await getDBConnection();
      let fetchedExpenses = await getUserExpenses(db, user.id);
      if (fetchedExpenses) {
        console.log('Expenses:', fetchedExpenses);
        setExpenses(fetchedExpenses);
      } else {
        console.log('No expenses available');
        setExpenses([]);
      }
    };

    callExpenses();
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Details:</Text>
      {user ? (
        <>
          <Text style={styles.detail}>Username: {user.username}</Text>
          <Text style={styles.detail}>Email: {user.email}</Text>
        </>
      ) : (
        <Text style={styles.detail}>No user data available</Text>
      )}

      <Text style={styles.subHeader}>Expenses:</Text>
      {expenses.length > 0 ? (
        expenses.map((expense, index) => (
          <Text style={styles.expense} key={index}>
            {expense.name} - ${expense.cost}
          </Text>
        ))
      ) : (
        <Text style={styles.noExpenses}>No expenses available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  detail: {
    fontSize: 18,
    marginBottom: 8,
    color: '#555',
  },
  subHeader: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  expense: {
    fontSize: 18,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    color: '#444',
  },
  noExpenses: {
    fontSize: 18,
    color: '#888',
  },
});

export default UserDetailsScreen;
