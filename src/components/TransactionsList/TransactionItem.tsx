import { type Transaction } from "@/@types/transactions";
import { useEffect, useState } from "react";

interface TransactionItemProps {
    transaction: Transaction;
    focused: boolean;
}

const statusStyles = {
    processing: 'bg-blue-100 text-blue-800',
    settled: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800'
};

const TransactionItem = ({ transaction, focused }: TransactionItemProps) => {
    const [isRecent, setIsRecent] = useState(false);

    const formattedDate = new Date(transaction.date).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    useEffect(() => {
        const transactionDate = new Date(transaction.date);
        const now = new Date();
        const isNew = (now.getTime() - transactionDate.getTime()) < 5000; // 10 seconds

        setIsRecent(isNew);

        if (isNew) {
            const timer = setTimeout(() => setIsRecent(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [transaction.date]);

    useEffect(() => {
        if (focused) {
            document.getElementById(transaction.id)?.focus();
        }
    }, [focused, transaction.id]);

    return (
        <li
            id={transaction.id}
            tabIndex={0}
            aria-label={`Transaction from ${transaction.merchant}: ${transaction.amount} pounds, Status: ${transaction.status}`}
            className="transaction-item list-none relative p-4 hover:bg-gray-50 dark:hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset focus:bg-gray-50 dark:focus:bg-zinc-900"
        >
            <div className="flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 dark:text-white">{transaction.merchant}</p>
                        {isRecent && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-900 rounded-full dark:bg-blue-900 dark:text-blue-200">
                                Now
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500" aria-label={`Transaction date: ${formattedDate}`}>
                        {formattedDate}
                    </p>
                </div>
                <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                        £{transaction.amount.toFixed(2)}
                    </p>
                    <span
                        role="status"
                        className={`inline-block px-2 py-1 text-xs rounded-full ${statusStyles[transaction.status]}`}
                    >
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                </div>
            </div>
        </li>
    );
};

export default TransactionItem;