/* eslint-disable react-hooks/exhaustive-deps */
import { useReducer, useMemo, useEffect, useRef } from 'react';
import { type VirtuosoHandle } from 'react-virtuoso';
import TransactionsListWrapper from './TransactionsListWrapper';
import TransactionControls from './TransactionControls';
import { getTransactions, getTransaction } from '../../services/get-transactions';
import { type Transaction } from '../../@types/transactions';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useTransactionsConfig } from './TransactionsContext';

export type SortField = 'date' | 'amount' | 'none';
export type SortDirection = 'asc' | 'desc';
export type Status = 'processing' | 'settled' | 'failed' | 'all';

type State = {
  sortField: SortField;
  sortDirection: SortDirection;
  status: Status;
  transactions: Transaction[];
  isLoading: boolean;
  hasMore: boolean;
  nextPage: number;
}

type Action =
  | { type: 'SET_SORT'; field: SortField; direction: SortDirection }
  | { type: 'SET_STATUS'; status: Status }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'RESET_TRANSACTIONS' }
  | { type: 'APPEND_TRANSACTIONS'; transactions: Transaction[] }
  | { type: 'SET_TRANSACTIONS'; transactions: Transaction[] }
  | { type: 'ADD_TRANSACTION'; transaction: Transaction }
  | { type: 'UPDATE_PAGINATION'; hasMore: boolean; nextPage: number };

const initialState: State = {
  sortField: 'date',
  sortDirection: 'desc',
  status: 'all',
  transactions: [],
  isLoading: true,
  hasMore: true,
  nextPage: 1
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_SORT':
      return {
        ...state,
        sortField: action.field,
        sortDirection: action.direction
      };
    case 'SET_STATUS':
      return {
        ...state,
        status: action.status
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.isLoading
      };
    case 'RESET_TRANSACTIONS':
      return {
        ...state,
        transactions: [],
        nextPage: 1
      };
    case 'APPEND_TRANSACTIONS':
      return {
        ...state,
        transactions: [...state.transactions, ...action.transactions]
      };
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.transactions
      };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.transaction, ...state.transactions]
      };
    case 'UPDATE_PAGINATION':
      return {
        ...state,
        hasMore: action.hasMore,
        nextPage: action.nextPage
      };
    default:
      return state;
  }
}

const TransactionsList = () => {
  const config = useTransactionsConfig();
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    sortField: config.defaultSortField,
    sortDirection: config.defaultSortDirection,
    status: config.defaultStatus
  });
  const transactionsContainerRef = useRef<VirtuosoHandle>(null);

  const loadTransactions = async (page: number) => {
    dispatch({ type: 'SET_LOADING', isLoading: true });
    try {
      const response = await getTransactions({
        page,
        limit: config.pageSize,
        sortField: state.sortField,
        sortDirection: state.sortDirection,
        status: state.status
      });

      if (page === 1) {
        dispatch({ type: 'SET_TRANSACTIONS', transactions: response.transactions });
      } else {
        dispatch({ type: 'APPEND_TRANSACTIONS', transactions: response.transactions });
      }

      dispatch({
        type: 'UPDATE_PAGINATION',
        hasMore: response.hasMore,
        nextPage: response.nextPage
      });
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', isLoading: false });
    }
  };

  const loadMore = () => {
    if (!state.isLoading && state.hasMore) {
      loadTransactions(state.nextPage);
    }
  };

  useEffect(() => {
    loadTransactions(1);
  }, []);

  const { sendMessage, lastJsonMessage, readyState } = useWebSocket(config.websocketUrl, {
    shouldReconnect: () => true
  });
  useEffect(() => {
    if (typeof lastJsonMessage === 'object' &&
      lastJsonMessage !== null &&
      'date' in lastJsonMessage &&
      'amount' in lastJsonMessage &&
      'merchant' in lastJsonMessage &&
      'status' in lastJsonMessage) {
      dispatch({ type: 'ADD_TRANSACTION', transaction: lastJsonMessage as Transaction });
      scrollTransactionsToTop();
    }
  }, [lastJsonMessage])
  const scrollTransactionsToTop = () => {
    if (transactionsContainerRef.current) {
      transactionsContainerRef.current.scrollToIndex({ index: 0, behavior: 'smooth' });
    }
  }

  // Reset and reload when sort or filter changes
  useEffect(() => {
    dispatch({ type: 'RESET_TRANSACTIONS' });
    loadTransactions(1);
  }, [state.sortField, state.sortDirection, state.status]);

  const sortedTransactions = useMemo(() => {
    return state.transactions;
  }, [state.transactions]);

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
        <span className='font-semibold'>Web Socket: </span>{connectionStatus}
      </span>

      {
        readyState === ReadyState.OPEN && <button className='block py-2 px-2 text-center border border-gray-200 dark:border-zinc-700 mb-2 hover:bg-gray-100 dark:hover:bg-zinc-900 mt-1' onClick={() => sendMessage(JSON.stringify(getTransaction()))}>
          Add transaction
        </button>
      }

    </div>
  }

  return (
    <>
      <div className="max-w-md mx-auto pt-2 border-x max-md:border-y border-gray-200 dark:border-zinc-700 h-screen max-md:h-[calc(100vh_-_100px)] max-md:mt-auto grid grid-rows-[auto_1fr] grid-col-1 grow">
        <TransactionControls
          sortField={state.sortField}
          sortDirection={state.sortDirection}
          status={state.status}
          onSortFieldChange={(field) => dispatch({ type: 'SET_SORT', field, direction: state.sortDirection })}
          onSortDirectionChange={(direction) => dispatch({ type: 'SET_SORT', field: state.sortField, direction })}
          onStatusChange={(status) => dispatch({ type: 'SET_STATUS', status })}
        />
        <TransactionsListWrapper
          ref={transactionsContainerRef}
          transactions={sortedTransactions}
          isLoading={state.isLoading}
          loadMore={loadMore}
        />
      </div>

      {renderWebSocketUI()}
    </>
  );
}

export default TransactionsList;
