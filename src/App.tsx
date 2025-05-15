import './App.css';
import { useState, useMemo, useEffect } from 'react';
import TransactionsList from './components/TransactionsList';
import TransactionControls from './components/TransactionControls';
import { getTransactions } from './services/get-transactions';
import { type Transaction } from './@types/transactions';
import useWebSocket, { ReadyState } from 'react-use-websocket';

export type SortField = 'date' | 'amount' | 'none';
export type SortDirection = 'asc' | 'desc';
export type Status = 'processing' | 'settled' | 'failed' | 'all';

let transactionCounter = 0;

function getTransaction() {
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

function App() {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [status, setStatus] = useState<Status>('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial transactions
  useEffect(() => {
    const loadTransactions = async () => {
      setIsLoading(true);
      try {
        const data = await getTransactions();
        setTransactions(data);
      } catch (error) {
        console.error('Failed to load transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const { sendMessage, lastJsonMessage, readyState } = useWebSocket('wss://echo.websocket.org/');
  useEffect(() => {
    if (typeof lastJsonMessage === 'object' &&
      lastJsonMessage !== null &&
      'date' in lastJsonMessage &&
      'amount' in lastJsonMessage &&
      'merchant' in lastJsonMessage &&
      'status' in lastJsonMessage) {
      setTransactions(prev => [lastJsonMessage as Transaction, ...prev])
    }
  }, [lastJsonMessage])


  const sortedTransactions = useMemo(() => {
    const filteredTransactions = status === 'all'
      ? [...transactions]
      : transactions.filter(t => t.status === status);

    if (sortField === 'none') {
      return filteredTransactions;
    }

    return filteredTransactions.sort((a, b) => {
      if (sortField === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
      } else {
        return sortDirection === 'desc'
          ? b.amount - a.amount
          : a.amount - b.amount;
      }
    });
  }, [transactions, sortField, sortDirection, status]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Connected',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  const renderWebSocketUI = () => {
    return <div className='absolute top-2 left-2'>
      <span className='block'>
        <span className='font-semibold'>Web Socket:</span>{connectionStatus}
      </span>

      {
        readyState === ReadyState.OPEN && <button className='block py-2 px-2 text-center border border-gray-200 mb-2 hover:bg-gray-100 mt-1' onClick={() => sendMessage(JSON.stringify(getTransaction()))}>
          Broadcast transaction
        </button>
      }

    </div>
  }

  return (
    <>
      <div className="max-w-md mx-auto pt-2 border-x border-gray-200 h-screen grid grid-rows-[auto_auto_1fr] grid-col-1">
        <TransactionControls
          sortField={sortField}
          sortDirection={sortDirection}
          status={status}
          onSortFieldChange={setSortField}
          onSortDirectionChange={setSortDirection}
          onStatusChange={setStatus}
        />
        <TransactionsList transactions={sortedTransactions} isLoading={isLoading} />
      </div>

      {renderWebSocketUI()}
    </>
  );
}

export default App;
