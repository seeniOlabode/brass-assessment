import allTransactions from '../data/transactions.json';
import { type Transaction } from '../@types/transactions';

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

export const getTransactions = async ({
    page = 1,
    limit = 20,
    sortField = 'none',
    sortDirection = 'desc',
    status = 'all'
}: GetTransactionsParams = {}): Promise<GetTransactionsResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Filter transactions
    let filteredTransactions = [...allTransactions];
    if (status !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.status === status);
    }

    // Sort transactions
    if (sortField !== 'none') {
        filteredTransactions.sort((a, b) => {
            if (sortField === 'date') {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
            } else {
                return sortDirection === 'desc' ? b.amount - a.amount : a.amount - b.amount;
            }
        });
    }

    // Paginate
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedTransactions = filteredTransactions.slice(start, end);

    return {
        transactions: paginatedTransactions as Transaction[],
        hasMore: end < filteredTransactions.length,
        nextPage: page + 1
    };
};

let transactionCounter = 0;

export function getTransaction() {
    const merchants = ['Apple Store', 'Amazon', 'Starbucks', 'Netflix', 'Uber'];
    const statuses: Array<Transaction['status']> = ['processing', 'settled', 'failed'];

    const transaction: Transaction = {
        id: `tx_${Date.now()}_${++transactionCounter}`,
        date: new Date().toISOString(),
        amount: Math.round(Math.random() * 10000) / 100,
        merchant: merchants[Math.floor(Math.random() * merchants.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)]
    };

    return transaction;
}