// ==========================================
// TRANSACTION MODAL COMPONENT
// ==========================================
import { getCategories } from '../services/category-service.js';
import { addTransaction, updateTransaction } from '../services/transaction-service.js';
import { formatDate, formatInputCurrency, getRawNumber } from '../utils/helpers.js';

let currentTransaction = null;
let isEditMode = false;

/**
 * Open transaction modal
 * @param {object} transaction - Transaction data for editing (null for new)
 */
export async function openTransactionModal(transaction = null) {
  currentTransaction = transaction;
  isEditMode = !!transaction;

  // Fetch categories
  const incomeCategories = await getCategories('income');
  const expenseCategories = await getCategories('expense');
  const investmentCategories = await getCategories('investment');

  // Get modal element
  let modal = document.getElementById('transaction-modal');
  if (!modal) {
    // Create modal if it doesn't exist
    modal = document.createElement('div');
    modal.id = 'transaction-modal';
    modal.className = 'fixed inset-0 z-[100] hidden';
    document.body.appendChild(modal);
  }

  // Default values
  const defaultType = transaction?.type || 'expense';
  const defaultAmount = transaction?.amount || '';
  const defaultCategory = transaction?.category || '';
  const defaultDescription = transaction?.description || '';
  const defaultDate = transaction?.date ? formatDate(transaction.date, 'input') : formatDate(new Date(), 'input');

  modal.innerHTML = `
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" id="modal-backdrop"></div>
    
    <!-- Modal Content -->
    <div class="absolute inset-0 flex items-end md:items-center justify-center p-0 md:p-4">
      <div class="relative w-full max-w-md bg-white dark:bg-background-dark rounded-t-3xl md:rounded-3xl shadow-2xl transform transition-all">
        <!-- Header -->
        <div class="flex items-center justify-between p-5 border-b border-gray-200 dark:border-white/10">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">
            ${isEditMode ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button id="close-modal" class="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <span class="material-symbols-outlined text-slate-600 dark:text-slate-400">close</span>
          </button>
        </div>
        
        <!-- Form -->
        <form id="transaction-form" class="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          <!-- Transaction Type Toggle -->
          <div>
            <label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Transaction Type</label>
            <div class="grid grid-cols-3 gap-1 p-1 bg-gray-200 dark:bg-[#23483c] rounded-xl">
              <label class="cursor-pointer">
                <input 
                  class="peer sr-only transaction-type-input" 
                  name="transaction_type" 
                  type="radio" 
                  value="income"
                  ${defaultType === 'income' ? 'checked' : ''}
                />
                <div class="flex items-center justify-center h-10 rounded-lg text-sm font-medium text-gray-500 dark:text-[#92c9b7] peer-checked:bg-white dark:peer-checked:bg-background-dark peer-checked:text-emerald-600 dark:peer-checked:text-emerald-400 peer-checked:shadow-sm transition-all select-none">
                  <span class="material-symbols-outlined text-[18px] mr-1">arrow_downward</span>
                  Income
                </div>
              </label>
              <label class="cursor-pointer">
                <input 
                  class="peer sr-only transaction-type-input" 
                  name="transaction_type" 
                  type="radio" 
                  value="expense"
                  ${defaultType === 'expense' ? 'checked' : ''}
                />
                <div class="flex items-center justify-center h-10 rounded-lg text-sm font-medium text-gray-500 dark:text-[#92c9b7] peer-checked:bg-white dark:peer-checked:bg-background-dark peer-checked:text-rose-600 dark:peer-checked:text-rose-400 peer-checked:shadow-sm transition-all select-none">
                  <span class="material-symbols-outlined text-[18px] mr-1">arrow_upward</span>
                  Expense
                </div>
              </label>
              <label class="cursor-pointer">
                <input 
                  class="peer sr-only transaction-type-input" 
                  name="transaction_type" 
                  type="radio" 
                  value="investment"
                  ${defaultType === 'investment' ? 'checked' : ''}
                />
                <div class="flex items-center justify-center h-10 rounded-lg text-sm font-medium text-gray-500 dark:text-[#92c9b7] peer-checked:bg-white dark:peer-checked:bg-background-dark peer-checked:text-blue-600 dark:peer-checked:text-blue-400 peer-checked:shadow-sm transition-all select-none">
                  <span class="material-symbols-outlined text-[18px] mr-1">trending_up</span>
                  Investment
                </div>
              </label>
            </div>
          </div>
          
          <!-- Amount -->
          <div>
            <label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Amount</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-lg font-semibold">Rp</span>
              <input 
                id="transaction-amount" 
                type="text" 
                inputmode="numeric" 
                min="0"
                value="${defaultAmount}"
                class="w-full h-14 pl-12 pr-4 bg-white dark:bg-[#19332b] border border-gray-200 dark:border-[#326755] rounded-xl text-neutral-900 dark:text-white placeholder-gray-400 dark:placeholder-[#92c9b7] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm text-lg font-semibold" 
                placeholder="0"
                required
              />
            </div>
          </div>
          
          <!-- Category -->
          <div>
            <label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Category</label>
            <select 
              id="transaction-category" 
              class="w-full h-14 px-4 bg-white dark:bg-[#19332b] border border-gray-200 dark:border-[#326755] rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
              required
            >
              <option value="">Select a category</option>
              <optgroup label="Income" id="income-categories">
                ${incomeCategories.map(cat => `<option value="${cat.name}" ${defaultCategory === cat.name ? 'selected' : ''}>${cat.name}</option>`).join('')}
                <option value="__ADD_NEW__" style="color: #10b77f; font-weight: 600;">+ Add New Category</option>
              </optgroup>
              <optgroup label="Expense" id="expense-categories">
                ${expenseCategories.map(cat => `<option value="${cat.name}" ${defaultCategory === cat.name ? 'selected' : ''}>${cat.name}</option>`).join('')}
                <option value="__ADD_NEW__" style="color: #10b77f; font-weight: 600;">+ Add New Category</option>
              </optgroup>
              <optgroup label="Investment" id="investment-categories">
                ${investmentCategories.map(cat => `<option value="${cat.name}" ${defaultCategory === cat.name ? 'selected' : ''}>${cat.name}</option>`).join('')}
                <option value="__ADD_NEW__" style="color: #10b77f; font-weight: 600;">+ Add New Category</option>
              </optgroup>
            </select>
            
            <!-- New Category Input (Hidden by default) -->
            <div id="new-category-input" class="hidden mt-3 space-y-2">
              <input 
                id="new-category-name" 
                type="text" 
                class="w-full h-12 px-4 bg-white dark:bg-[#19332b] border border-primary rounded-xl text-neutral-900 dark:text-white placeholder-gray-400 dark:placeholder-[#92c9b7] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm" 
                placeholder="Enter new category name"
              />
              <div class="flex gap-2">
                <button 
                  id="save-new-category" 
                  type="button"
                  class="flex-1 h-10 bg-primary hover:bg-[#0e9f6e] text-[#11221c] font-semibold text-sm rounded-lg transition-all"
                >
                  Save Category
                </button>
                <button 
                  id="cancel-new-category" 
                  type="button"
                  class="flex-1 h-10 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-slate-900 dark:text-white font-semibold text-sm rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          
          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Description (Optional)</label>
            <input 
              id="transaction-description" 
              type="text" 
              value="${defaultDescription}"
              class="w-full h-14 px-4 bg-white dark:bg-[#19332b] border border-gray-200 dark:border-[#326755] rounded-xl text-neutral-900 dark:text-white placeholder-gray-400 dark:placeholder-[#92c9b7] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm" 
              placeholder="e.g., Whole Foods Market"
            />
          </div>
          
          <!-- Date -->
          <div>
            <label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Date</label>
            <input 
              id="transaction-date" 
              type="date" 
              value="${defaultDate}"
              class="w-full h-14 px-4 bg-white dark:bg-[#19332b] border border-gray-200 dark:border-[#326755] rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
              required
            />
          </div>
        </form>
        
        <!-- Footer -->
        <div class="flex gap-3 p-5 border-t border-gray-200 dark:border-white/10">
          <button 
            id="cancel-transaction" 
            type="button"
            class="flex-1 h-12 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-slate-900 dark:text-white font-semibold rounded-xl transition-all active:scale-[0.98]"
          >
            Cancel
          </button>
          <button 
            id="save-transaction" 
            type="submit"
            form="transaction-form"
            class="flex-1 h-12 bg-primary hover:bg-[#0e9f6e] text-[#11221c] font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
          >
            ${isEditMode ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  `;

  // Show modal
  modal.classList.remove('hidden');

  // Amount formatting
  const amountInput = document.getElementById('transaction-amount');
  if (amountInput) {
    // Format initial value if exists
    formatInputCurrency(amountInput);

    // Format on input
    amountInput.addEventListener('input', (e) => formatInputCurrency(e.target));
  }

  // Add event listeners
  document.getElementById('close-modal')?.addEventListener('click', closeTransactionModal);
  document.getElementById('modal-backdrop')?.addEventListener('click', closeTransactionModal);
  document.getElementById('cancel-transaction')?.addEventListener('click', closeTransactionModal);

  // Handle form submission
  const form = document.getElementById('transaction-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const amountElement = document.getElementById('transaction-amount');
    const categoryElement = document.getElementById('transaction-category');
    const dateElement = document.getElementById('transaction-date');
    const descriptionElement = document.getElementById('transaction-description');
    const typeElements = document.getElementsByName('transaction_type');

    if (!amountElement || !categoryElement || !dateElement || !descriptionElement) return;

    // Get raw amount
    const rawAmount = getRawNumber(amountElement.value);

    if (!rawAmount || rawAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const selectedType = Array.from(typeElements).find(input => input.checked)?.value;

    if (!selectedType) {
      alert('Please select a transaction type');
      return;
    }

    if (!categoryElement.value) {
      alert('Please select a category');
      return;
    }

    if (!dateElement.value) {
      alert('Please select a date');
      return;
    }

    try {
      const transactionData = {
        type: selectedType,
        amount: rawAmount,
        category: categoryElement.value,
        description: descriptionElement.value || '',
        date: dateElement.value
      };

      if (isEditMode && currentTransaction) {
        // Update existing transaction
        await updateTransaction(currentTransaction.id, transactionData);
      } else {
        // Add new transaction
        await addTransaction(transactionData);
      }

      // Close modal
      closeTransactionModal();

      // Refresh UI components
      const { refreshDashboard } = await import('./dashboard.js');
      const { refreshTransactionHistory } = await import('./transaction-history.js');

      await Promise.all([
        refreshDashboard(),
        refreshTransactionHistory()
      ]);

    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Failed to save transaction: ' + error.message);
    }
  });

  // Add event listener for transaction type change to update category options
  document.querySelectorAll('.transaction-type-input').forEach(input => {
    input.addEventListener('change', updateCategoryOptions);
  });

  // Add event listener for category change (to show/hide new category input)
  document.getElementById('transaction-category')?.addEventListener('change', handleCategoryChange);

  // Add event listeners for new category buttons
  document.getElementById('save-new-category')?.addEventListener('click', handleSaveNewCategory);
  document.getElementById('cancel-new-category')?.addEventListener('click', handleCancelNewCategory);

  // Initial category options update
  updateCategoryOptions();
}

/**
 * Close transaction modal
 */
export function closeTransactionModal() {
  const modal = document.getElementById('transaction-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
  currentTransaction = null;
  isEditMode = false;
}

/**
 * Update category options based on selected transaction type
 */
function updateCategoryOptions() {
  const typeInput = document.querySelector('input[name="transaction_type"]:checked');
  const categorySelect = document.getElementById('transaction-category');

  if (!typeInput || !categorySelect) return;

  const type = typeInput.value;
  const incomeGroup = document.getElementById('income-categories');
  const expenseGroup = document.getElementById('expense-categories');
  const investmentGroup = document.getElementById('investment-categories');

  // Show/hide optgroups based on type
  if (type === 'income') {
    incomeGroup?.classList.remove('hidden');
    expenseGroup?.classList.add('hidden');
    investmentGroup?.classList.add('hidden');
    // Select first income category if no selection
    if (!categorySelect.value || categorySelect.querySelector(`option[value="${categorySelect.value}"]`)?.parentElement?.id !== 'income-categories') {
      const firstIncome = incomeGroup?.querySelector('option');
      if (firstIncome) {
        categorySelect.value = firstIncome.value;
      }
    }
  } else if (type === 'expense') {
    incomeGroup?.classList.add('hidden');
    expenseGroup?.classList.remove('hidden');
    investmentGroup?.classList.add('hidden');
    // Select first expense category if no selection
    if (!categorySelect.value || categorySelect.querySelector(`option[value="${categorySelect.value}"]`)?.parentElement?.id !== 'expense-categories') {
      const firstExpense = expenseGroup?.querySelector('option');
      if (firstExpense) {
        categorySelect.value = firstExpense.value;
      }
    }
  } else if (type === 'investment') {
    incomeGroup?.classList.add('hidden');
    expenseGroup?.classList.add('hidden');
    investmentGroup?.classList.remove('hidden');
    // Select first investment category if no selection
    if (!categorySelect.value || categorySelect.querySelector(`option[value="${categorySelect.value}"]`)?.parentElement?.id !== 'investment-categories') {
      const firstInvestment = investmentGroup?.querySelector('option');
      if (firstInvestment) {
        categorySelect.value = firstInvestment.value;
      }
    }
  }
}

/**
 * Handle category dropdown change
 */
function handleCategoryChange() {
  const categorySelect = document.getElementById('transaction-category');
  const newCategoryInput = document.getElementById('new-category-input');

  if (!categorySelect || !newCategoryInput) return;

  if (categorySelect.value === '__ADD_NEW__') {
    // Show new category input
    newCategoryInput.classList.remove('hidden');
    document.getElementById('new-category-name')?.focus();
  } else {
    // Hide new category input
    newCategoryInput.classList.add('hidden');
    document.getElementById('new-category-name').value = '';
  }
}

/**
 * Handle save new category
 */
async function handleSaveNewCategory(e) {
  e.preventDefault();
  e.stopPropagation();

  const newCategoryName = document.getElementById('new-category-name')?.value.trim();
  const typeInput = document.querySelector('input[name="transaction_type"]:checked');

  if (!newCategoryName) {
    alert('Please enter a category name');
    return;
  }

  if (!typeInput) {
    alert('Please select a transaction type');
    return;
  }

  try {
    // Import category service
    const { addCategory, getCategories } = await import('../services/category-service.js');

    const type = typeInput.value;

    // Add the new category to Firestore
    await addCategory({
      name: newCategoryName,
      type: type
    });

    // Refresh categories and update dropdown
    const incomeCategories = await getCategories('income');
    const expenseCategories = await getCategories('expense');
    const investmentCategories = await getCategories('investment');

    const categorySelect = document.getElementById('transaction-category');
    const incomeGroup = document.getElementById('income-categories');
    const expenseGroup = document.getElementById('expense-categories');
    const investmentGroup = document.getElementById('investment-categories');

    if (incomeGroup && expenseGroup && investmentGroup && categorySelect) {
      // Update income categories
      incomeGroup.innerHTML = incomeCategories.map(cat =>
        `<option value="${cat.name}">${cat.name}</option>`
      ).join('') + '<option value="__ADD_NEW__" style="color: #10b77f; font-weight: 600;">+ Add New Category</option>';

      // Update expense categories
      expenseGroup.innerHTML = expenseCategories.map(cat =>
        `<option value="${cat.name}">${cat.name}</option>`
      ).join('') + '<option value="__ADD_NEW__" style="color: #10b77f; font-weight: 600;">+ Add New Category</option>';

      // Update investment categories
      investmentGroup.innerHTML = investmentCategories.map(cat =>
        `<option value="${cat.name}">${cat.name}</option>`
      ).join('') + '<option value="__ADD_NEW__" style="color: #10b77f; font-weight: 600;">+ Add New Category</option>';

      // Select the newly added category
      categorySelect.value = newCategoryName;
    }

    // Hide new category input
    document.getElementById('new-category-input')?.classList.add('hidden');
    document.getElementById('new-category-name').value = '';

  } catch (error) {
    console.error('Error adding category:', error);
    alert('Failed to add new category: ' + error.message);
  }
}

/**
 * Handle cancel new category
 */
function handleCancelNewCategory(e) {
  e.preventDefault();
  e.stopPropagation();

  const categorySelect = document.getElementById('transaction-category');
  const newCategoryInput = document.getElementById('new-category-input');

  // Reset to first available option
  if (categorySelect) {
    const typeInput = document.querySelector('input[name="transaction_type"]:checked');
    if (typeInput) {
      const type = typeInput.value;
      const firstOption = type === 'income'
        ? document.querySelector('#income-categories option:first-child')
        : document.querySelector('#expense-categories option:first-child');

      if (firstOption) {
        categorySelect.value = firstOption.value;
      }
    }
  }

  // Hide new category input
  newCategoryInput?.classList.add('hidden');
  document.getElementById('new-category-name').value = '';
  return;
}
