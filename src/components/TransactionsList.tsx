import { ScrollArea } from 'radix-ui';
import { type Transaction } from '@/@types/transactions';
import TransactionItem from './TransactionItem';

interface TransactionsListProps {
    transactions: Transaction[];
    isLoading: boolean;
}

const TransactionsList = ({ transactions, isLoading }: TransactionsListProps) => {
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
        <div className='h-full overflow-hidden border-t border-gray-200'>
            <ScrollArea.Root className="h-full w-full ">
                <ScrollArea.Viewport className="h-full w-full">
                    {isLoading ? (
                        <div className="p-4 text-center text-gray-500">
                            Loading transactions...
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            No transactions found
                        </div>
                    ) : (
                        <ul
                            onKeyDown={handleKeyDown}
                            aria-label='Transactions List'
                            className="divide-y divide-gray-200"
                            role="list"
                        >
                            {transactions.map((transaction) => (
                                <TransactionItem key={transaction.id} transaction={transaction} />
                            ))}
                        </ul>
                    )}
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar
                    className="flex select-none touch-none p-0.5 bg-gray-100 transition-colors duration-[160ms] ease-out hover:bg-gray-200 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
                    orientation="vertical"
                >
                    <ScrollArea.Thumb className="flex-1 bg-gray-300 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
                </ScrollArea.Scrollbar>
            </ScrollArea.Root>
        </div>
    );
};

export default TransactionsList;

