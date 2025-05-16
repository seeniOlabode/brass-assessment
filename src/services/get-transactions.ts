import { type Transaction } from '../@types/transactions';
import { faker } from '@faker-js/faker';

interface GetTransactionsParams {
    page?: number;
    limit?: number;
    sortField?: 'date' | 'amount' | 'none';
    sortDirection?: 'asc' | 'desc';
    status?: string;
}

interface GetTransactionsResponse {
    transactions: Transaction[];
    hasMore: boolean;
    nextPage: number;
}

// Generate a pool of transactions that we'll reuse
const generateTransactionPool = (size: number = 100): Transaction[] => {
    return Array.from({ length: size }, () => ({
        id: `tx_${faker.string.nanoid()}`,
        date: faker.date.recent({ days: 30 }).toISOString(),
        amount: parseFloat(faker.finance.amount({ min: 1, max: 1000, dec: 2 })),
        merchant: faker.company.name(),
        status: faker.helpers.arrayElement(['processing', 'settled', 'failed'])
    }));
};

// Initialize our transaction pool
let transactionPool = generateTransactionPool();

export const getTransactions = async ({
    page = 1,
    limit = 20,
    sortField = 'none',
    sortDirection = 'desc',
    status = 'all'
}: GetTransactionsParams = {}): Promise<GetTransactionsResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // If we're running low on transactions, generate more
    if (page * limit > transactionPool.length - limit) {
        transactionPool = [...transactionPool, ...generateTransactionPool()];
    }

    // Filter transactions
    let filteredTransactions = [...transactionPool];
    if (status !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.status === status);
    }

    // Sort transactions
    if (sortField !== 'none') {
        filteredTransactions.sort((a, b) => {
            if (sortField === 'date') {
                return sortDirection === 'asc'
                    ? new Date(a.date).getTime() - new Date(b.date).getTime()
                    : new Date(b.date).getTime() - new Date(a.date).getTime();
            }
            if (sortField === 'amount') {
                return sortDirection === 'asc'
                    ? a.amount - b.amount
                    : b.amount - a.amount;
            }
            return 0;
        });
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedTransactions = filteredTransactions.slice(start, end);

    // Always ensure we have more data for the next page
    const hasMore = true; // We can always generate more

    return {
        transactions: paginatedTransactions,
        hasMore,
        nextPage: page + 1
    };
};


export function getTransaction() {
    const statuses: Array<Transaction['status']> = ['processing', 'settled', 'failed'];

    const transaction: Transaction = {
        id: `tx_${faker.string.nanoid()}`,
        date: faker.date.recent({ days: 7 }).toISOString(),
        amount: parseFloat(faker.finance.amount({ min: 1, max: 1000, dec: 2 })),
        merchant: faker.company.name(),
        status: faker.helpers.arrayElement(statuses)
    };

    return transaction;
}