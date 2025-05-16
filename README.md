# Transactions Feed App

A React application that demonstrates real-time transaction list management using WebSocket integration. The app features an infinite-scroll list of transactions with keyboard navigation support.

## About

The application connects to a WebSocket echo server to simulate real-time updates. Since it's an echo server, the app includes a button that allows users to send test transactions, which are then echoed back by the server and prepended to the list. This demonstrates how real-time updates would work in a production environment with a real WebSocket server.

## Tech Stack

- React 19 with TypeScript
- Tailwind CSS for styling
- React Virtuoso for efficient list rendering
- WebSocket integration for real-time updates

## Prerequisites

- Node.js (v18 or higher)
- pnpm (v9.15.4 or higher)

## Getting Started

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd brass-assessment
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## Testing Real-time Updates

1. The WebSocket connection status is displayed in the top-left corner
2. Use the "Send Test Transaction" button to send a transaction
3. The echo server will return the transaction, and it will appear at the top of the list
4. The list supports keyboard navigation (↑/↓ arrows) and infinite scrolling
