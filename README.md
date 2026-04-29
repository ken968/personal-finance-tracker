# Personal Finance Tracker

## Overview

Personal Finance Tracker is a modern, responsive web application designed for comprehensive personal financial management. It provides a streamlined interface for tracking daily transactions, monitoring cash flow trends, and analyzing asset distribution across multiple portfolios.

## Project Structure

```
Personal Financial Tracker/
├── components/             # Reusable UI components (Dashboard, Modal, History, Categories)
├── services/               # Firebase integration and business logic services
├── utils/                  # Utility and helper functions
├── index.html              # Main application entry point
├── style.css               # Modern UI styling with Tailwind & Vanilla CSS
├── app.js                  # Application initialization & routing
├── firebase-config.js      # Firebase configuration
└── README.md               # Project documentation
```

## Features

- **Initial Balance Setup**: Configure base liquid assets.
- **Transaction Management**: Input income, expenses, and investments with categorized tracking.
- **Real-time Dashboard**: Automated calculations with interactive charts (Cashflow trend and distribution).
- **Time-period Filtering**: Flexible data views (All, 1D, 1W, 1M, 3M, 1Y).
- **Transaction History**: Comprehensive ledger with sorting, filtering, and modification capabilities.
- **Category Management**: Dynamic creation and deletion of transaction categories.
- **Responsive Design**: Optimized layouts for mobile, tablet, and desktop interfaces.

## Setup Instructions

### 1. Firebase Configuration

1. Create a project in the Firebase Console.
2. Enable Firestore Database (Production or Test mode).
3. Register a Web App in your project settings to obtain the Firebase configuration object.
4. Update `firebase-config.js` with your specific API keys and credentials.

### 2. Local Development

You can serve the application locally using any standard HTTP server:

**Using VS Code Live Server:**
Right-click `index.html` and select "Open with Live Server".

**Using Node.js:**
```bash
npm install -g http-server
http-server -p 8000
```

### 3. Deployment

The application is configured for Firebase Hosting.

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy --only hosting
```

## Technical Stack

- **Frontend**: HTML5, Vanilla JavaScript, Tailwind CSS.
- **Backend/Database**: Firebase Cloud Firestore.
- **Data Visualization**: Chart.js.
- **Architecture**: Modular Component-based architecture.

## Security Considerations

The current Firestore configuration utilizes open rules for demonstration purposes. Before deploying to a production environment, implement proper Firebase Authentication and restrict Firestore rules to authenticated users.

## License

This project is open-source and available for personal or commercial use.
