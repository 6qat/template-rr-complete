import { Hono } from 'hono';

type Expense = {
  id: number;
  description: string;
  amount: number;
  category: string;
};

const fakeExpenses: Expense[] = [
  {
    id: 1,
    description: 'Expense 1',
    amount: 100,
    category: 'Category 1',
  },
  {
    id: 2,
    description: 'Expense 2',
    amount: 200,
    category: 'Category 2',
  },
  {
    id: 3,
    description: 'Expense 3',
    amount: 300,
    category: 'Category 3',
  },
];

export const expensesRoute = new Hono()
  .get('/', (c) => {
    return c.json({ expenses: fakeExpenses });
  })
  .post('/', (c) => {
    return c.json({});
  });
