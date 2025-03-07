import { enablePromise, openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';
import { User, Expense } from './models'

const userTable = 'Users';
const expenseTable = 'Expenses';

enablePromise(true);

export const getDBConnection = async ():Promise<SQLiteDatabase> => {
  return openDatabase({ name: 'ExpenseDB.db', location: 'default' });
};

export const createTables = async (db: SQLiteDatabase) => {
  const userQuery = `
    CREATE TABLE IF NOT EXISTS ${userTable} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      username TEXT NOT NULL,
      password TEXT NOT NULL 
    );`;

  const expenseQuery = `
    CREATE TABLE IF NOT EXISTS ${expenseTable} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      name TEXT NOT NULL,
      cost REAL NOT NULL,
      FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
    );`;

  await db.executeSql(userQuery);
  await db.executeSql(expenseQuery);
};

export const getUserDetails = async (db: SQLiteDatabase,email:string): Promise<User|undefined> => {
    try {
        
        const query = `SELECT * FROM ${userTable} WHERE email = ?`;
        const results = await db.executeSql(query, [email]);
    
        console.log(results);
    
        // Check if any rows were returned
        if (results[0].rows.length > 0) {
          // Return the user as an array (even if only one result)
          const user = results[0].rows.item(0);  
          return user; 
        }
    
        return undefined;
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
};

export const addUser = async (db: SQLiteDatabase, user: User) => { 
  const insertQuery = `INSERT INTO ${userTable} (email, username,password) VALUES (?, ?,?)`;
  await db.executeSql(insertQuery, [user.email, user.username, user.password]);
};

// CRUD for Expenses
export const getUserExpenses = async (db: SQLiteDatabase, userId: number): Promise<Expense[]> => {
  const expenses: Expense[] = [];
  const results = await db.executeSql(`SELECT * FROM ${expenseTable} WHERE userId = ?`, [userId]);
  results.forEach(result => {
    for (let i = 0; i < result.rows.length; i++) {
      expenses.push(result.rows.item(i));
    }
  });
  return expenses;
};

export const addExpense = async (db: SQLiteDatabase, expense: Expense) => {
  const insertQuery = `INSERT INTO ${expenseTable} (userId, name, cost) VALUES (?, ?, ?)`;
  await db.executeSql(insertQuery, [expense.userId, expense.name, expense.cost]);
};
