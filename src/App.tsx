import './App.css';
import { ScrollArea } from 'radix-ui';

type Transaction = {
  date: string;
  amount: number;
  merchant: string;
  status: 'processing' | 'settled' | 'failed';
}

function App() {
  return <ScrollArea.Root>
    <ScrollArea.Viewport>
    </ScrollArea.Viewport>
  </ScrollArea.Root>
}

export default App
