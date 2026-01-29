// ==========================================
// HELPER UTILITIES
// ==========================================

/**
 * Format currency with symbol (Indonesian Rupiah)
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency symbol (default: Rp)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = 'Rp') {
    const absAmount = Math.abs(amount);
    const formatted = absAmount.toLocaleString('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    return `${amount < 0 ? '-' : ''}${currency} ${formatted}`;
}

/**
 * Format currency with sign for transactions (Rupiah)
 * @param {number} amount - Amount to format
 * @param {string} type - 'income' or 'expense'
 * @returns {string} Formatted currency with +/- sign
 */
export function formatTransactionAmount(amount, type) {
    const formatted = formatCurrency(amount);
    return type === 'income' ? `+${formatted}` : `-${formatted}`;
}

/**
 * Format date to readable string
 * @param {Date} date - Date object
 * @param {string} format - 'short', 'medium', or 'long'
 * @returns {string} Formatted date string
 */
export function formatDate(date, format = 'medium') {
    if (!date) return '';

    const d = date instanceof Date ? date : new Date(date);

    switch (format) {
        case 'short':
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        case 'long':
            return d.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        case 'input':
            // Format for input type="date" (YYYY-MM-DD)
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        default: // medium
            return d.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
    }
}

/**
 * Get relative date label (Today, Yesterday, or formatted date)
 * @param {Date} date - Date to check
 * @returns {string} Relative date label
 */
export function getRelativeDateLabel(date) {
    const d = date instanceof Date ? date : new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time to compare dates only
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    const compareDate = new Date(d);
    compareDate.setHours(0, 0, 0, 0);

    if (compareDate.getTime() === today.getTime()) {
        return 'Today';
    } else if (compareDate.getTime() === yesterday.getTime()) {
        return 'Yesterday';
    } else {
        return formatDate(d, 'medium');
    }
}

/**
 * Group transactions by date
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} Array of grouped transactions
 */
export function groupTransactionsByDate(transactions) {
    const groups = {};

    transactions.forEach(transaction => {
        const dateKey = formatDate(transaction.date, 'input');
        if (!groups[dateKey]) {
            groups[dateKey] = {
                date: transaction.date,
                label: getRelativeDateLabel(transaction.date),
                transactions: []
            };
        }
        groups[dateKey].transactions.push(transaction);
    });

    // Convert to array and sort by date descending
    return Object.values(groups).sort((a, b) => b.date - a.date);
}

/**
 * Get icon for category
 * @param {string} category - Category name
 * @returns {string} Material icon name
 */
export function getCategoryIcon(category) {
    const iconMap = {
        // Income
        'Salary': 'payments',
        'Freelance': 'work',
        'Investments': 'trending_up',
        'Business': 'business_center',
        'Gift': 'card_giftcard',

        // Expense
        'Groceries': 'shopping_bag',
        'Rent': 'home',
        'Transport': 'directions_car',
        'Utilities': 'power',
        'Entertainment': 'movie',
        'Healthcare': 'local_hospital',
        'Shopping': 'shopping_cart',
        'Food & Dining': 'restaurant',
        'Education': 'school'
    };

    return iconMap[category] || 'payments';
}

/**
 * Get color for category
 * @param {string} category - Category name
 * @returns {string} Tailwind color class
 */
export function getCategoryColor(category) {
    const colorMap = {
        'Salary': 'primary',
        'Freelance': 'blue',
        'Investments': 'emerald',
        'Business': 'indigo',
        'Gift': 'pink',
        'Groceries': 'orange',
        'Rent': 'red',
        'Transport': 'blue',
        'Utilities': 'yellow',
        'Entertainment': 'purple',
        'Healthcare': 'rose',
        'Shopping': 'cyan',
        'Food & Dining': 'red',
        'Education': 'indigo'
    };

    return colorMap[category] || 'slate';
}

/**
 * Calculate percentage change
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {number} Percentage change
 */
export function calculatePercentageChange(current, previous) {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Generate chart data for line chart with 3 lines: Income, Expense, Balance
 * @param {Array} transactions - Array of transactions
 * @param {string} period - Time period
 * @returns {object} Chart.js data object
 */
export function generateLineChartData(transactions, period) {
    // Sort transactions by date
    const sorted = [...transactions].sort((a, b) => a.date - b.date);

    // Group by date and calculate income, expense, and balance
    const dateGroups = {};
    sorted.forEach(transaction => {
        const dateKey = formatDate(transaction.date, 'input');
        if (!dateGroups[dateKey]) {
            dateGroups[dateKey] = {
                income: 0,
                expense: 0
            };
        }

        if (transaction.type === 'income') {
            dateGroups[dateKey].income += transaction.amount;
        } else {
            dateGroups[dateKey].expense += transaction.amount;
        }
    });

    // Create data points with cumulative values
    const dataPoints = [];
    let cumulativeIncome = 0;
    let cumulativeExpense = 0;
    let cumulativeBalance = 0;

    Object.keys(dateGroups).sort().forEach(dateKey => {
        cumulativeIncome += dateGroups[dateKey].income;
        cumulativeExpense += dateGroups[dateKey].expense;
        cumulativeBalance = cumulativeIncome - cumulativeExpense;

        dataPoints.push({
            date: dateKey,
            income: cumulativeIncome,
            expense: cumulativeExpense,
            balance: cumulativeBalance
        });
    });

    return {
        labels: dataPoints.map(d => formatDate(new Date(d.date), 'short')),
        datasets: [
            {
                label: 'Income',
                data: dataPoints.map(d => d.income),
                borderColor: '#10b77f',
                backgroundColor: 'rgba(16, 183, 127, 0.05)',
                tension: 0.4,
                fill: false,
                borderWidth: 2
            },
            {
                label: 'Expense',
                data: dataPoints.map(d => d.expense),
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.05)',
                tension: 0.4,
                fill: false,
                borderWidth: 2
            },
            {
                label: 'Balance',
                data: dataPoints.map(d => d.balance),
                borderColor: '#ffffff',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                tension: 0.4,
                fill: false,
                borderWidth: 3
            }
        ]
    };
}

/**
 * Generate chart data for pie chart
 * @param {Array} categoryBreakdown - Category breakdown from stats
 * @param {string} type - 'income' or 'expense'
 * @returns {object} Chart.js data object
 */
export function generatePieChartData(categoryBreakdown, type) {
    const filtered = categoryBreakdown.filter(item => item.type === type);

    // Sort by total descending
    filtered.sort((a, b) => b.total - a.total);

    // Take top 5 categories
    const top5 = filtered.slice(0, 5);
    const others = filtered.slice(5);

    const labels = top5.map(item => item.category);
    const data = top5.map(item => item.total);

    // Add "Others" if there are more categories
    if (others.length > 0) {
        const othersTotal = others.reduce((sum, item) => sum + item.total, 0);
        labels.push('Others');
        data.push(othersTotal);
    }

    // Generate colors
    const colors = [
        '#10b77f', // primary
        '#3b82f6', // blue
        '#f59e0b', // amber
        '#ef4444', // red
        '#8b5cf6', // violet
        '#64748b'  // slate for others
    ];

    return {
        labels,
        datasets: [{
            data,
            backgroundColor: colors.slice(0, labels.length),
            borderWidth: 0
        }]
    };
}

/**
 * Format number input with dots for thousands
 * @param {HTMLInputElement} inputElement - The input element to format
 */
export function formatInputCurrency(inputElement) {
    if (!inputElement) return;

    // Remove non-digit characters
    let value = inputElement.value.replace(/\D/g, '');

    // Format with dots
    if (value) {
        value = parseInt(value, 10).toLocaleString('id-ID').replace(/,/g, '.');
    }

    inputElement.value = value;
}

/**
 * Get raw number from formatted input
 * @param {string} value - Formatted value
 * @returns {number} Raw number
 */
export function getRawNumber(value) {
    if (!value) return 0;
    return parseInt(value.replace(/\./g, ''), 10);
}
