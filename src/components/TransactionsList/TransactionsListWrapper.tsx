import React, { type CSSProperties, type ReactNode, forwardRef } from 'react';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import { type Transaction } from '@/@types/transactions';
import TransactionItem from './TransactionItem';

interface TransactionsListContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    style?: CSSProperties;
    children?: ReactNode;
}

const TransactionsListContainer = React.forwardRef<HTMLDivElement, TransactionsListContainerProps>(({ children, style, ...props }, ref) => {
    return (
        <div
            {...props}
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
    firstItemIndex: number;
    isLoading: boolean;
    loadMore: () => void;
}

const TransactionsListWrapper = forwardRef<VirtuosoHandle, TransactionsListWrapperProps>(({ transactions, firstItemIndex, isLoading, loadMore }, ref) => {
    const [currentItemIndex, setCurrentItemIndex] = React.useState(-1);
    const listRef = React.useRef<HTMLElement | Window>(null);
    const keyDownCallback = React.useCallback(
        (e: React.KeyboardEvent) => {
            let nextIndex = null

            if (e.code === 'ArrowUp') {
                nextIndex = Math.max(0, currentItemIndex - 1)
            } else if (e.code === 'ArrowDown') {
                nextIndex = Math.min(99, currentItemIndex + 1)
            }

            if (nextIndex !== null && ref && 'current' in ref) {
                ref.current?.scrollIntoView({
                    index: nextIndex,
                    behavior: 'auto',
                    done: () => {
                        setCurrentItemIndex(nextIndex)
                    },
                })
                e.preventDefault()
            }
        },
        [currentItemIndex, ref, setCurrentItemIndex]
    );

    const scrollerRef = React.useCallback(
        (element: HTMLElement | Window | null) => {
            if (element) {
                element.addEventListener('keydown', keyDownCallback as unknown as EventListenerOrEventListenerObject)
                listRef.current = element
            } else {
                listRef.current?.removeEventListener('keydown', keyDownCallback as unknown as EventListenerOrEventListenerObject)
            }
        },
        [keyDownCallback]
    )

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
                itemContent={(i, transaction, { currentItemIndex }) => (
                    <TransactionItem
                        key={transaction.id}
                        transaction={transaction}
                        focused={currentItemIndex === i}
                    />
                )}
                components={{
                    Footer,
                    List: TransactionsListContainer,
                }}
                scrollerRef={scrollerRef}
                context={{ currentItemIndex }}
                firstItemIndex={firstItemIndex}
            />
        </div>
    );
});

export default TransactionsListWrapper;
