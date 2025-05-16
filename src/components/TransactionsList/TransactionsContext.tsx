/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode } from 'react';
import { type SortField, type SortDirection, type Status } from '@/@types/filtering';

interface TransactionsConfig {
    defaultSortField: SortField;
    defaultSortDirection: SortDirection;
    defaultStatus: Status;
    pageSize: number;
    websocketUrl: string;
    virtuosoOptions?: {
        overscan?: number;
        increaseViewportBy?: number | { top?: number; bottom?: number };
        itemSize?: number;
    };
}

interface TransactionsContextValue {
    config: TransactionsConfig;
}

const defaultConfig: TransactionsConfig = {
    defaultSortField: 'date',
    defaultSortDirection: 'desc',
    defaultStatus: 'all',
    pageSize: 20,
    websocketUrl: 'wss://echo.websocket.org/',
    virtuosoOptions: {
        overscan: 200,
        increaseViewportBy: { top: 100, bottom: 100 },
    }
};

const TransactionsContext = createContext<TransactionsContextValue>({
    config: defaultConfig
});

export function TransactionsProvider({
    children,
    config
}: {
    children: ReactNode;
    config?: Partial<TransactionsConfig>;
}) {
    const mergedConfig = {
        ...defaultConfig,
        ...config,
        virtuosoOptions: {
            ...defaultConfig.virtuosoOptions,
            ...config?.virtuosoOptions
        }
    };

    return (
        <TransactionsContext.Provider value={{ config: mergedConfig }}>
            {children}
        </TransactionsContext.Provider>
    );
}

export function useTransactionsConfig() {
    const context = useContext(TransactionsContext);
    if (!context) {
        throw new Error('useTransactionsConfig must be used within a TransactionsProvider');
    }
    return context.config;
}
