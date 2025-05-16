import TransactionsList, { TransactionsProvider } from "./components/TransactionsList"
import { useTheme } from "./hooks/useTheme";

const config = {
    defaultSortField: 'date' as const,
    defaultSortDirection: 'desc' as const,
    defaultStatus: 'all' as const,
    pageSize: 25,
    virtuosoOptions: {
        overscan: 150,
        increaseViewportBy: { top: 200, bottom: 200 },
    }
};

const App = () => {
    const { toggleTheme, reverseTheme } = useTheme();


    return <div className="fixed inset-0 dark:bg-zinc-950 dark:text-white flex align-end">
        <button className="absolute top-2 right-2" onClick={toggleTheme}>
            Change theme to {reverseTheme}
        </button>
        <TransactionsProvider config={config}>
            <TransactionsList />
        </TransactionsProvider>
    </div>
}

export default App