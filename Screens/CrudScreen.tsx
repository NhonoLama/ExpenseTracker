import React, {useContext, useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  Button,
  Modal,
  Alert,
} from 'react-native';
import {AuthContext} from '../App';
import NavBar from '../Components/NavBar';
import {
  addExpense,
  deleteExpense,
  getDBConnection,
  getUserExpenses,
  updateExpense,
} from '../Database/dbservices';

type expenseTypo = {
  id: number;
  userId: string;
  name: string;
  cost: number;
};

const CrudScreen = ({navigation}: any) => {
  const [name, setName] = useState<string>('');
  const [cost, setCost] = useState<number | ''>('');
  const [visible, setVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<expenseTypo | null>(
    null,
  );
  const [expenses, setExpenses] = useState<expenseTypo[]>([]);

  const authContext = useContext(AuthContext);
  if (!authContext || !authContext.registerIn) {
    throw new Error('No AuthContext provided');
  }
  const {user} = authContext;

  useEffect(() => {
    if (!user) {
      console.log('User is not logged in.');
      return; // Early return if no user is available
    }
    const getExpenses = async () => {
      const db = await getDBConnection();
      const userExpenses = await getUserExpenses(db, user.id);
      setExpenses(userExpenses);
    };
    getExpenses();
  }, [user]);

  const addExpenseForUser = async (newExpense: expenseTypo) => {
    try {
      const db = await getDBConnection();
      await addExpense(db, newExpense);
      return newExpense;
    } catch (error) {
      console.error('Failed to add expense:', error);
      return null;
    }
  };

  const handleCreate = async () => {
    if (!name || Number.isNaN(cost) || cost === '') {
      Alert.alert('ERROR', 'Enter both fields correctly');
      return;
    }
    if (!user) {
      console.log('User is not logged in.');
      return; // Early return if no user is available
    }

    const newid =
      expenses.length > 0 ? expenses[expenses.length - 1].id + 1 : 1;

    const addone: expenseTypo = {
      id: newid,
      userId: user.id.toString(),
      name,
      cost: cost as number,
    };

    const addedExpense = await addExpenseForUser(addone);

    if (addedExpense) {
      // Re-fetch the expenses after adding
      const db = await getDBConnection();
      const updatedExpenses = await getUserExpenses(db, user.id);
      setExpenses(updatedExpenses);
      setName('');
      setCost('');
    } else {
      Alert.alert('ERROR', 'Failed to add expense.');
    }
  };

  const handleUpdatePress = (expense: expenseTypo) => {
    setName(expense.name);
    setCost(expense.cost);
    setSelectedExpense(expense);
    setVisible(true);
  };

  const handleUpdateBtn = async () => {
    if (selectedExpense) {
      const updatedExpense = {
        ...selectedExpense,
        name,
        cost: cost === '' ? 0 : cost,
      };
      if (!user) {
        console.log('User is not logged in.');
        return;
      }

      const db = await getDBConnection();
      await updateExpense(db, updatedExpense);
      const updatedExpenses = await getUserExpenses(db, user.id);
      setExpenses(updatedExpenses);
      setSelectedExpense(null);
      setName('');
      setCost('');
    }

    setVisible(false);
  };

  const handleDel = async (expense: expenseTypo) => {
    if (!user) {
      console.log('User is not logged in.');
      return; // Early return if no user is available
    }
    const db = await getDBConnection();
    await deleteExpense(db, expense.id, user.id);

    // Re-fetch the expenses after deleting
    const updatedExpenses = await getUserExpenses(db, user.id);
    setExpenses(updatedExpenses);
  };

  return (
    <View style={{padding: 20}}>
      <NavBar navigation={navigation} />

      <View
        style={{
          paddingBottom: 20,
          borderBottomWidth: 1,
          borderColor: '#D5E5D5',
        }}>
        <Text>Expense Name:</Text>
        <TextInput
          id="exName"
          value={name}
          placeholder="Enter the expense name to add...."
          style={{borderWidth: 1, margin: 10, paddingHorizontal: 10}}
          onChangeText={text => setName(text)}
        />
        <Text>Expense Cost:</Text>
        <TextInput
          value={cost.toString()}
          id="exCost"
          placeholder="Enter the cost to add...."
          style={{borderWidth: 1, margin: 10, paddingHorizontal: 10}}
          onChangeText={cost => setCost(parseInt(cost))}
        />
        <View style={styles.btn}>
          <Button title="Create" onPress={handleCreate} />
        </View>
      </View>

      <View>
        <FlatList
          data={expenses}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View style={styles.flex}>
              <View style={styles.gap}>
                <Text>{item.name}</Text>
                <Text>Rs. {item.cost}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleUpdatePress(item)}
                style={styles.btn2}>
                <Text
                  style={{fontSize: 12, color: '#F5F5F5', fontWeight: 'bold'}}>
                  UPDATE
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.delBTN}
                onPress={() => handleDel(item)}>
                <Text
                  style={{fontSize: 12, fontWeight: 'bold', color: 'white'}}>
                  DEL
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <Modal
        transparent={true}
        animationType="fade"
        visible={visible}
        onRequestClose={() => setVisible(false)}>
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setVisible(false)}>
          <View style={styles.menu}>
            <View style={styles.gap}>
              <Text style={styles.menuItem}>ID:</Text>
              <TextInput />
            </View>
            <View style={styles.gap}>
              <Text style={styles.menuItem}>Name:</Text>
              <TextInput
                onChangeText={text => setName(text)}
                value={name}
                style={{borderWidth: 1, paddingHorizontal: 9}}
              />
            </View>
            <View style={[styles.gap, {alignItems: 'center'}]}>
              <Text style={styles.menuItem}>Cost:</Text>
              <TextInput
                onChangeText={text => setCost(parseInt(text))}
                style={{borderWidth: 1, paddingHorizontal: 9}}
                value={cost.toString()}
              />
            </View>
            <Button title="Update" onPress={handleUpdateBtn} />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: 100,
    margin: 'auto',
  },
  btn2: {
    width: 60,
    height: 25,
    padding: 5,
    backgroundColor: '#FFA725',
    borderRadius: 5,
  },
  delBTN: {
    width: 32,
    height: 25,
    padding: 5,
    backgroundColor: '#E52020',
    borderRadius: 5,
  },
  flex: {
    marginVertical: 15,
    flex: 1,
    flexDirection: 'row',
    gap: 15,
    paddingHorizontal: 5,
  },
  gap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 300,
    height: 300,
    alignItems: 'center',
  },
  menuItem: {
    fontSize: 18,
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
});

export default CrudScreen;
