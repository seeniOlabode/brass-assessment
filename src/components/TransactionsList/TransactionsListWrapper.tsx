import React, { type CSSProperties, type ReactNode, forwardRef } from 'react';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import { type Transaction } from '@/@types/transactions';
import TransactionItem from './TransactionItem';

interface TransactionsListContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    style?: CSSProperties;
    children?: ReactNode;
}

const TransactionsListContainer = React.forwardRef<HTMLDivElement, TransactionsListContainerProps>(({ children, style, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        const items = Array.from(e.currentTarget.getElementsByTagName('li'));
        const currentIndex = items.findIndex(item => item === document.activeElement);

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (currentIndex < items.length - 1) {
                    items[currentIndex + 1].focus();
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (currentIndex > 0) {
                    items[currentIndex - 1].focus();
                }
                break;
            case 'Home':
                e.preventDefault();
                items[0].focus();
                break;
            case 'End':
                e.preventDefault();
                items[items.length - 1].focus();
                break;
        }
    };

    return (
        <div
            {...props}
            onKeyDown={handleKeyDown}
            style={style}
            ref={ref}
            className="divide-y divide-gray-200 dark:divide-zinc-700"
            role="list"
            aria-label="Transactions List"
        >
            {children}
        </div>
    )

})

interface TransactionsListWrapperProps {
    transactions: Transaction[];
    isLoading: boolean;
    loadMore: () => void;
}

const TransactionsListWrapper = forwardRef<VirtuosoHandle, TransactionsListWrapperProps>(({ transactions, isLoading, loadMore }, ref) => {
    const Footer = () => {
        return isLoading ? (
            <div className="p-4 text-center text-gray-500">
                Loading more transactions...
            </div>
        ) : null;
    };

    if (transactions.length === 0 && !isLoading) {
        return (
            <div className="p-4 text-center text-gray-500 border-t border-gray-200 dark:border-zinc-700">
                No transactions found
            </div>
        );
    }

    return (
        <div className='h-full border-t border-gray-200 dark:border-zinc-700'>
            <Virtuoso
                ref={ref}
                data={transactions}
                endReached={loadMore}
                itemContent={(_, transaction) => (
                    <TransactionItem
                        key={transaction.id}
                        transaction={transaction}
                    />
                )}
                components={{
                    Footer,
                    List: TransactionsListContainer,
                }}

            />
        </div>
    );
});

export default TransactionsListWrapper;
