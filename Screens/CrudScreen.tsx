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
import PieChart from 'react-native-pie-chart';

type expenseTypo = {
  id: number;
  userId: string;
  name: string;
  cost: number;
};

const CrudScreen = ({navigation}: any) => {
  const [name, setName] = useState<string>('');
  const [cost, setCost] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
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

      return;
    }
    const getExpenses = async () => {
      const db = await getDBConnection();
      const userExpenses = await getUserExpenses(db, user.id);
      setExpenses(userExpenses);
      console.log(expenses);
    };
    getExpenses();
  }, [user]);

  useEffect(() => {
    const calcTotalCost = () => {
      const total = expenses.reduce(
        (acc, expense) => acc + (isNaN(expense.cost) ? 0 : expense.cost),
        0,
      );
      setTotalCost(total);
    };
    calcTotalCost();
  }, [expenses]);

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
    if (!name || Number.isNaN(cost)) {
      Alert.alert('ERROR', 'Enter both fields correctly');
      return;
    }
    if (!user) {
      console.log('User is not logged in.');
      return;
    }

    const newid =
      expenses.length > 0 ? expenses[expenses.length - 1].id + 1 : 1;

    const addone: expenseTypo = {
      id: newid,
      userId: user.id.toString(),
      name,
      cost: isNaN(cost) ? 0 : cost,
    };

    const addedExpense = await addExpenseForUser(addone);

    if (addedExpense) {
      const db = await getDBConnection();
      const updatedExpenses = await getUserExpenses(db, user.id);
      setExpenses(updatedExpenses);
      setName('');
      setCost(0);
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
        cost,
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
      setCost(0);
    }

    setVisible(false);
  };

  const handleDel = async (expense: expenseTypo) => {
    if (!user) {
      console.log('User is not logged in.');
      return;
    }
    const db = await getDBConnection();
    await deleteExpense(db, expense.id, user.id);

    const updatedExpenses = await getUserExpenses(db, user.id);
    setExpenses(updatedExpenses);
  };

  const colors = [
    '#fbd203',
    '#ffb300',
    '#ff9100',
    '#ff6c00',
    '#ff6347',
    '#ff4500',
    '#ffd700',
    '#32cd32',
    '#8a2be2',
    '#ff1493',
    '#00bfff',
    '#228b22',
    '#ff69b4',
    '#9932cc',
    '#ff4500',
    '#7b68ee',
  ];
  const validExpenses = expenses.filter(
    expense => !isNaN(expense.cost) && expense.cost > 0,
  );
  const series = validExpenses.map((expense, index) => ({
    value: expense.cost,
    color: colors[index % colors.length],
    label: {text: expense.name, fontWeight: 'bold'},
  }));

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
          onChangeText={cost => {
            !isNaN(parseInt(cost)) ? setCost(parseInt(cost)) : setCost(0);
          }}
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
        <View style={styles.total}>
          <Text>Total Cost: </Text>
          <Text>Rs.{totalCost}</Text>
        </View>
        {validExpenses.length === 0 ? (
          <Text>No item to display.</Text>
        ) : (
          <PieChart style={styles.pie} widthAndHeight={250} series={series} />
        )}
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
                onChangeText={text =>
                  !isNaN(parseInt(text)) ? setCost(parseInt(text)) : setCost(0)
                }
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
  total: {
    borderTopColor: 'grey',
    borderTopWidth: 1,
    padding: 10,
    paddingHorizontal: 30,
    marginVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pie: {
    marginTop: 15,
    margin: 'auto',
  },
});

export default CrudScreen;
