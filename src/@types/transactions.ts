export type Transaction = {
    id: string;
    date: string;
    amount: number;
    merchant: string;
    status: 'processing' | 'settled' | 'failed';
}