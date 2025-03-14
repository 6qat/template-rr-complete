import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import type { Context, ValidationTargets } from 'hono';
import type { ZodError } from 'zod';

type Expense = {
  id: number;
  title: string;
  amount: number;
};

const postExpenseSchema = z.object({
  title: z.string().min(3).max(100),
  amount: z.number().min(1),
});

const fakeExpenses: Expense[] = [
  {
    id: 1,
    title: 'Expense 1',
    amount: 100,
  },
  {
    id: 2,
    title: 'Expense 2',
    amount: 200,
  },
  {
    id: 3,
    title: 'Expense 3',
    amount: 300,
  },
  {
    id: 4,
    title: 'Grocery Shopping',
    amount: 150,
  },
  {
    id: 5,
    title: 'Monthly Subscription',
    amount: 15,
  },
];

export const expensesRoute = new Hono()
  .get('/', (c) => {
    return c.json({ expenses: fakeExpenses });
  })
  .post(
    '/',
    zValidator('json', postExpenseSchema, (result, c) => {
      // If validation fails, customize the error response
      if (!result.success) {
        const errors = result.error.errors.map((error) => ({
          path: error.path.join('.'),
          message: error.message,
        }));

        return c.json(
          {
            success: false,
            message: 'Validation failed',
            errors,
          },
          400
        );
      }
    }),
    async (c) => {
      try {
        // Get the validated data
        const { title, amount } = c.req.valid('json');

        // Generate a new ID
        const maxId =
          fakeExpenses.length > 0
            ? Math.max(...fakeExpenses.map((expense) => expense.id))
            : 0;
        const newId = maxId + 1;

        // Create the new expense
        const newExpense: Expense = {
          id: newId,
          title,
          amount,
        };

        // Add to our fake database
        const updatedExpenses = [...fakeExpenses, newExpense];
        fakeExpenses.length = 0; // remove all elements of the array
        fakeExpenses.push(...updatedExpenses);

        // Return the created expense with a 201 status
        return c.json({ expense: newExpense }, 201);
      } catch (error) {
        // Handle any errors
        console.error('Error creating expense:', error);
        return c.json({ error: 'Failed to create expense' }, 500);
      }
    }
  )
  .get('/:id', (c) => {
    const idParam = c.req.param('id');

    // Custom validation
    if (!/^[1-9]\d*$/.test(idParam)) {
      return c.json(
        {
          error:
            'Invalid ID format. ID must be a positive number without leading zeros.',
        },
        400
      );
    }

    const id = Number(idParam);
    const expense = fakeExpenses.find((expense) => expense.id === id);

    if (!expense) {
      return c.json({ error: 'Expense not found' }, 404);
    }

    return c.json({ expense });
  });
