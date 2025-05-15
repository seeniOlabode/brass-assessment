import { type Transaction } from '../@types/transactions';
import transactionsData from '../data/transactions.json';

export async function getTransactions(): Promise<Transaction[]> {
    // Simulate network delay between 500ms and 1.5s
    const delay = Math.random() * 1000 + 500;
    await new Promise(resolve => setTimeout(resolve, delay));

    return [...transactionsData] as Transaction[];
}