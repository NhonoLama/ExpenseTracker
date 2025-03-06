import React, {useContext, useState} from 'react';
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

type expenseTypo = {
  id: number;
  name: string;
  cost: number | '';
};

const CrudScreen = ({navigation}: any) => {
  const [name, setName] = useState<string>('');
  const [cost, setCost] = useState<number | ''>('');
  const [visible, setVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<expenseTypo | null>(
    null,
  );
  const [expenses, setExpenses] = useState<expenseTypo[]>([
    {id: 1, name: 'clothes', cost: 2000},
    {id: 2, name: 'sports', cost: 100},
    {id: 3, name: 'food', cost: 5000},
  ]);

  const authContext = useContext(AuthContext);
  if (!authContext || !authContext.signOut) {
    throw new Error('No AuthContext provided');
  }

  const handleCreate = () => {
    if (!name || !cost) {
      Alert.alert('ERROR', 'Enter both fields');
      return;
    }
    const newid =
      expenses.length > 0 ? expenses[expenses.length - 1].id + 1 : 1;

    const addone: expenseTypo = {id: newid, name, cost};
    setExpenses([...expenses, addone]);
    setName('');
    setCost('');
  };

  const handleUpdatePress = (expense: expenseTypo) => {
    setName(expense.name);
    setCost(expense.cost);
    setSelectedExpense(expense);

    setVisible(true);
  };

  const handleUpdateBtn = () => {
    if (selectedExpense) {
      const updatedExpenses = expenses.map(exp =>
        exp.id === selectedExpense.id ? {...exp, name, cost} : exp,
      );
      setExpenses(updatedExpenses);
      setSelectedExpense(null);
      setName('');
      setCost('');
    }

    setVisible(false);
  };

  const handleDel = (expense: expenseTypo) => {
    const afterDeletedExpenses = expenses.filter(exp => exp.id != expense.id);
    setExpenses(afterDeletedExpenses);
  };

  return (
    <View style={{padding: 20}}>
      <NavBar navigation={navigation} />
      //create
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
    height: 30,
    padding: 5,
    backgroundColor: '#FFA725',
    borderRadius: 5,
  },
  delBTN: {
    width: 32,
    height: 30,
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
