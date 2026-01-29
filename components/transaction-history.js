// ==========================================
// TRANSACTION HISTORY COMPONENT
// ==========================================
import { getTransactions, deleteTransaction } from '../services/transaction-service.js';
import {
  formatTransactionAmount,
  formatDate,
  groupTransactionsByDate,
  getCategoryIcon,
  getCategoryColor
} from '../utils/helpers.js';
import { openTransactionModal } from './transaction-modal.js';
import { Timestamp } from '../services/firebase-service.js';

let currentFilters = {
  startDate: null,
  endDate: null
};

/**
 * Render transaction history section
 */
export async function renderTransactionHistory() {
  const container = document.getElementById('history-section');
  if (!container) return;

  try {
    // Show loading state
    container.innerHTML = '<div class="flex items-center justify-center h-64"><div class="text-white">Loading...</div></div>';

    // Fetch transactions
    const filters = {};
    if (currentFilters.startDate) {
      filters.startDate = Timestamp.fromDate(new Date(currentFilters.startDate));
    }
    if (currentFilters.endDate) {
      filters.endDate = Timestamp.fromDate(new Date(currentFilters.endDate));
    }

    const transactions = await getTransactions(filters);
    const groupedTransactions = groupTransactionsByDate(transactions);

    // Get today's date for default filter values
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    container.innerHTML = `
      <main class="flex-1 flex flex-col w-full max-w-7xl mx-auto px-5 pb-24 h-full overflow-hidden">
        <!--Desktop Layout Wrapper-->
      <div class="flex flex-col h-full">
        <!-- Filter Section -->
        <div class="bg-white dark:bg-[#1c2e36] rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-white/5 mb-6 flex-shrink-0">
          <div class="flex flex-col lg:flex-row lg:items-end gap-4">
            <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs text-slate-500 dark:text-slate-400 font-bold ml-1 uppercase tracking-wider">Start Date</label>
                <div class="relative">
                  <input
                    id="start-date"
                    class="form-input flex w-full rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-200 dark:border-[#326755] bg-gray-50 dark:bg-[#132329] h-12 px-4 text-sm font-medium leading-normal shadow-sm transition-all"
                    type="date"
                    value="${currentFilters.startDate || formatDate(firstDayOfMonth, 'input')}"
                  />
                </div>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs text-slate-500 dark:text-slate-400 font-bold ml-1 uppercase tracking-wider">End Date</label>
                <div class="relative">
                  <input
                    id="end-date"
                    class="form-input flex w-full rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-200 dark:border-[#326755] bg-gray-50 dark:bg-[#132329] h-12 px-4 text-sm font-medium leading-normal shadow-sm transition-all"
                    type="date"
                    value="${currentFilters.endDate || formatDate(today, 'input')}"
                  />
                </div>
              </div>
            </div>

            <div class="flex gap-3 lg:w-auto">
              <button id="reset-filter" class="flex-1 lg:flex-none h-12 px-6 rounded-xl border border-gray-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
                Reset
              </button>
              <button id="apply-filter" class="flex-1 lg:flex-none h-12 px-8 bg-primary hover:bg-[#0e9f6e] text-[#11221c] font-bold text-sm tracking-wide rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-[18px]">filter_list</span>
                Apply Filter
              </button>
            </div>
          </div>
        </div>

        <!-- Transactions List -->
        <div id="transactions-list" class="flex-1 overflow-y-auto scrollbar-hide pr-1 -mr-1 space-y-2">
          ${groupedTransactions.length === 0 ? renderEmptyState() : renderTransactionGroups(groupedTransactions)}
        </div>
      </div>
      </main>
    `;

    // Add event listeners
    document.getElementById('apply-filter')?.addEventListener('click', handleApplyFilter);
    document.getElementById('reset-filter')?.addEventListener('click', handleResetFilter);

    // Add event listeners for edit/delete buttons
    document.querySelectorAll('.edit-transaction').forEach(button => {
      button.addEventListener('click', () => handleEditTransaction(button.dataset.transactionId));
    });

    document.querySelectorAll('.delete-transaction').forEach(button => {
      button.addEventListener('click', () => handleDeleteTransaction(button.dataset.transactionId));
    });

  } catch (error) {
    console.error('Error rendering transaction history:', error);
    container.innerHTML = `
      <div class="flex items-center justify-center h-64">
        <div class="text-red-500">Error loading transactions: ${error.message}</div>
      </div>
    `;
  }
}

/**
 * Render transaction groups
 */
function renderTransactionGroups(groups) {
  return groups.map(group => `
    <div class="flex flex-col">
      <div class="px-4 pt-4 pb-2 flex items-baseline justify-between">
        <h3 class="text-base font-bold text-slate-900 dark:text-white">${group.label}</h3>
        <span class="text-xs font-medium text-slate-500 dark:text-slate-400">${formatDate(group.date, 'short')}</span>
      </div>
      <div class="px-4 space-y-3">
        ${group.transactions.map(transaction => renderTransactionItem(transaction)).join('')}
      </div>
    </div>
  `).join('');
}

/**
 * Render single transaction item
 */
function renderTransactionItem(transaction) {
  const icon = getCategoryIcon(transaction.category);
  const color = getCategoryColor(transaction.category);
  const amountColor = transaction.type === 'income' ? 'text-primary' : 'text-red-500';

  return `
    <div class="group relative flex items-center gap-4 p-3 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-accent-green/20 shadow-sm transition-all hover:border-primary/30">
      <!--Icon -->
      <div class="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-${color}-100 dark:bg-${color}-500/10 text-${color}-600 dark:text-${color}-400">
        <span class="material-symbols-outlined text-[20px]">${icon}</span>
      </div>
      
      <!--Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between mb-0.5">
          <h4 class="text-sm font-semibold truncate">${transaction.description || transaction.category}</h4>
          <span class="text-sm font-bold ${amountColor}">${formatTransactionAmount(transaction.amount, transaction.type)}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-xs text-slate-500 dark:text-slate-400 truncate">${transaction.category}</span>

          <!-- Actions -->
          <div class="flex items-center gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <button
              class="edit-transaction text-slate-400 hover:text-primary transition-colors"
              data-transaction-id="${transaction.id}"
              aria-label="Edit"
            >
              <span class="material-symbols-outlined text-[18px]">edit</span>
            </button>
            <button
              class="delete-transaction text-slate-400 hover:text-red-500 transition-colors"
              data-transaction-id="${transaction.id}"
              aria-label="Delete"
            >
              <span class="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
      `;
}

/**
 * Render empty state
 */
function renderEmptyState() {
  return `
    <div class="flex flex-col items-center justify-center py-16 px-4">
      <div class="size-20 rounded-full bg-slate-700/20 flex items-center justify-center mb-4">
        <span class="material-symbols-outlined text-[40px] text-slate-500">receipt_long</span>
      </div>
      <h3 class="text-lg font-bold text-white mb-2">No Transactions Found</h3>
      <p class="text-sm text-slate-400 text-center">Start by adding your first transaction</p>
    </div>
  `;
}

/**
 * Handle apply filter
 */
async function handleApplyFilter() {
  const startDate = document.getElementById('start-date')?.value;
  const endDate = document.getElementById('end-date')?.value;

  currentFilters.startDate = startDate;
  currentFilters.endDate = endDate;

  await renderTransactionHistory();
}

/**
 * Handle reset filter
 */
async function handleResetFilter() {
  currentFilters.startDate = null;
  currentFilters.endDate = null;

  await renderTransactionHistory();
}

/**
 * Handle edit transaction
 */
async function handleEditTransaction(transactionId) {
  // Fetch transaction data
  const filters = {};
  if (currentFilters.startDate) {
    filters.startDate = Timestamp.fromDate(new Date(currentFilters.startDate));
  }
  if (currentFilters.endDate) {
    filters.endDate = Timestamp.fromDate(new Date(currentFilters.endDate));
  }

  const transactions = await getTransactions(filters);
  const transaction = transactions.find(t => t.id === transactionId);

  if (transaction) {
    openTransactionModal(transaction);
  }
}

/**
 * Handle delete transaction
 */
async function handleDeleteTransaction(transactionId) {
  if (confirm('Are you sure you want to delete this transaction?')) {
    try {
      await deleteTransaction(transactionId);
      await renderTransactionHistory();

      // Refresh dashboard if it's visible
      const dashboardSection = document.getElementById('dashboard-section');
      if (dashboardSection && dashboardSection.classList.contains('active')) {
        const { refreshDashboard } = await import('./dashboard.js');
        await refreshDashboard();
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction: ' + error.message);
    }
  }
}

/**
 * Refresh transaction history
 */
export async function refreshTransactionHistory() {
  await renderTransactionHistory();
}
