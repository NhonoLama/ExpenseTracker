export type User = {
    id: number;  
    email: string;
    username: string;
    password: string;
  };
  
  export type Expense = {
    id: number;
    userId: string;
    name: string;
    cost: number;
  };
  