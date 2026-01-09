# Financial Statement Maker

A comprehensive React TypeScript application for creating and managing financial statements including Balance Sheets, Profit & Loss statements, Cash Flow statements, and detailed notes with breakdown tables.

## Features

- **Company Management**: Add and manage multiple companies
- **Financial Statements**:
  - Balance Sheet with automatic calculations
  - Profit & Loss statement
  - Cash Flow statement
- **Editable Notes System**: Create detailed notes with breakdown tables for financial statement items
- **Real-time Synchronization**: Changes in breakdown tables automatically update financial statement totals
- **Responsive Design**: Built with Tailwind CSS for modern, responsive UI
- **Rich Text Editor**: Edit note content with formatting capabilities

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Create React App with CRACO
- **State Management**: React Context API
- **UI Components**: Custom components with Tailwind styling

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sreenu1232/finacialstatement.git
cd finacialstatement
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Build for Production

```bash
npm run build
```

## Usage

1. **Dashboard**: View all companies and their financial summaries
2. **Add Company**: Create new companies with initial financial data
3. **Company Details**: Edit financial statements and notes
4. **Notes**: Add detailed breakdowns for financial statement items
5. **Export**: Generate comprehensive financial reports

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BalanceSheet.tsx
│   ├── ProfitLoss.tsx
│   ├── CashFlow.tsx
│   ├── Notes.tsx
│   └── BreakdownTable.tsx
├── pages/              # Page components
├── context/            # React Context for state management
├── data/               # Sample data and types
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
