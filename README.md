# Transactions Feed App

A modern, accessible React application for displaying and managing real-time transaction feeds. Built with React, TypeScript, and Tailwind CSS.

## Features

- 📊 Real-time transaction updates via WebSocket
- ♿ Fully accessible with keyboard navigation
- 🔄 Infinite scroll pagination
- 🔍 Transaction filtering by status
- ⚡ Virtualized list for optimal performance
- 🌓 Dark mode support
- 📱 Responsive design

## Tech Stack

- React 19
- TypeScript
- Tailwind CSS
- React Virtuoso (for virtualized lists)
- Radix UI (for accessible components)
- Vite (for development and building)

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

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## Keyboard Navigation

- `↑` / `↓` - Navigate through transactions
- `Home` / `End` - Jump to first/last transaction
- `Tab` - Navigate through interactive elements
- `Enter` / `Space` - Select/activate focused element

## API Integration

The app uses:

- JSONPlaceholder API for transaction data
- WebSocket Echo Server for real-time updates

## Accessibility

This application is built with accessibility in mind, following WCAG guidelines:

- Full keyboard navigation
- ARIA labels and roles
- Focus management
- High contrast ratios
- Screen reader friendly
