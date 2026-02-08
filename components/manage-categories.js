// ==========================================
// MANAGE CATEGORIES COMPONENT
// ==========================================
import { getCategories, addCategory, deleteCategory } from '../services/category-service.js';

/**
 * Render manage categories section
 */
export async function renderManageCategories() {
  const container = document.getElementById('categories-section');
  if (!container) return;

  try {
    // Show loading state
    container.innerHTML = '<div class="flex items-center justify-center h-64"><div class="text-white">Loading...</div></div>';

    // Fetch categories
    const incomeCategories = await getCategories('income');
    const expenseCategories = await getCategories('expense');
    const investmentCategories = await getCategories('investment');

    container.innerHTML = `
      <div class="flex-1 flex flex-col w-full max-w-7xl mx-auto px-5 pb-24">
        
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
            <!-- Left Column: Add New Category Form -->
            <div class="lg:col-span-4 xl:col-span-3">
                <div class="bg-white dark:bg-[#1c2e36] rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-white/5 sticky top-24">
                  <h1 class="text-2xl font-bold leading-tight tracking-tight mb-6 text-slate-900 dark:text-white">Add Category</h1>
                  
                  <!-- Category Name Input -->
                  <div class="mb-5">
                    <label class="block text-sm font-medium text-neutral-600 dark:text-gray-300 mb-2">Name</label>
                    <div class="relative">
                      <input 
                        id="category-name" 
                        class="w-full h-12 px-4 bg-gray-50 dark:bg-[#132329] border border-gray-200 dark:border-[#326755] rounded-xl text-neutral-900 dark:text-white placeholder-gray-400 dark:placeholder-[#92c9b7] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm" 
                        placeholder="e.g., Gym" 
                        type="text"
                      />
                    </div>
                  </div>
                  
                  <!-- Category Type Toggle -->
                  <div class="mb-6">
                    <label class="block text-sm font-medium text-neutral-600 dark:text-gray-300 mb-2">Type</label>
                    <div class="grid grid-cols-3 gap-1 p-1 bg-gray-200 dark:bg-[#132329] rounded-xl">
                      <label class="cursor-pointer">
                        <input class="peer sr-only" name="cat_type" type="radio" value="income" />
                        <div class="flex items-center justify-center h-10 rounded-lg text-xs font-medium text-gray-500 dark:text-[#92c9b7] peer-checked:bg-white dark:peer-checked:bg-[#1c2e36] peer-checked:text-emerald-600 dark:peer-checked:text-emerald-400 peer-checked:shadow-sm transition-all select-none border border-transparent peer-checked:border-gray-200 dark:peer-checked:border-white/5">
                          Income
                        </div>
                      </label>
                      <label class="cursor-pointer">
                        <input checked class="peer sr-only" name="cat_type" type="radio" value="expense" />
                        <div class="flex items-center justify-center h-10 rounded-lg text-xs font-medium text-gray-500 dark:text-[#92c9b7] peer-checked:bg-white dark:peer-checked:bg-[#1c2e36] peer-checked:text-rose-600 dark:peer-checked:text-rose-400 peer-checked:shadow-sm transition-all select-none border border-transparent peer-checked:border-gray-200 dark:peer-checked:border-white/5">
                          Expense
                        </div>
                      </label>
                      <label class="cursor-pointer">
                        <input class="peer sr-only" name="cat_type" type="radio" value="investment" />
                        <div class="flex items-center justify-center h-10 rounded-lg text-xs font-medium text-gray-500 dark:text-[#92c9b7] peer-checked:bg-white dark:peer-checked:bg-[#1c2e36] peer-checked:text-blue-600 dark:peer-checked:text-blue-400 peer-checked:shadow-sm transition-all select-none border border-transparent peer-checked:border-gray-200 dark:peer-checked:border-white/5">
                          Investment
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <!-- Add Button -->
                  <button id="add-category-btn" class="w-full h-12 bg-primary hover:bg-[#0e9f6e] text-[#11221c] font-bold text-sm tracking-wide rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined text-[20px]">add</span>
                    Add Category
                  </button>
                </div>
            </div>
            
            <!-- Right Column: Lists -->
            <div class="lg:col-span-8 xl:col-span-9 space-y-8">
              <!-- Income Section -->
              <div class="bg-white dark:bg-[#1c2e36] rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-white/5">
                <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
                  <div class="size-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <span class="material-symbols-outlined text-[24px]">arrow_downward</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-slate-900 dark:text-white">Income Categories</h3>
                    <p class="text-sm text-slate-500 dark:text-slate-400">Sources of your income</p>
                  </div>
                </div>
                <div class="flex flex-wrap gap-3">
                  ${incomeCategories.length === 0 ? '<p class="text-sm text-slate-400 italic">No income categories created yet.</p>' : incomeCategories.map(cat => renderCategoryChip(cat)).join('')}
                </div>
              </div>
              
              <!-- Expense Section -->
              <div class="bg-white dark:bg-[#1c2e36] rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-white/5">
                <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
                  <div class="size-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                    <span class="material-symbols-outlined text-[24px]">arrow_upward</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-slate-900 dark:text-white">Expense Categories</h3>
                    <p class="text-sm text-slate-500 dark:text-slate-400">Where you spend your money</p>
                  </div>
                </div>
                <div class="flex flex-wrap gap-3">
                  ${expenseCategories.length === 0 ? '<p class="text-sm text-slate-400 italic">No expense categories created yet.</p>' : expenseCategories.map(cat => renderCategoryChip(cat)).join('')}
                </div>
              </div>
              
              <!-- Investment Section -->
              <div class="bg-white dark:bg-[#1c2e36] rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-white/5">
                <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
                  <div class="size-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <span class="material-symbols-outlined text-[24px]">trending_up</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-slate-900 dark:text-white">Investment Categories</h3>
                    <p class="text-sm text-slate-500 dark:text-slate-400">Where you invest your money</p>
                  </div>
                </div>
                <div class="flex flex-wrap gap-3">
                  ${investmentCategories.length === 0 ? '<p class="text-sm text-slate-400 italic">No investment categories created yet.</p>' : investmentCategories.map(cat => renderCategoryChip(cat)).join('')}
                </div>
              </div>
            </div>
        </div>
      </div>
    `;

    // Add event listeners
    document.getElementById('add-category-btn')?.addEventListener('click', handleAddCategory);

    document.querySelectorAll('.delete-category').forEach(button => {
      button.addEventListener('click', () => handleDeleteCategory(button.dataset.categoryId));
    });

  } catch (error) {
    console.error('Error rendering manage categories:', error);
    container.innerHTML = `
      <div class="flex items-center justify-center h-64">
        <div class="text-red-500">Error loading categories: ${error.message}</div>
      </div>
    `;
  }
}

/**
 * Render category chip
 */
function renderCategoryChip(category) {
  return `
    <div class="group flex items-center pl-4 pr-2 py-2 bg-white dark:bg-[#19332b] border border-gray-200 dark:border-[#326755] rounded-full text-sm font-medium shadow-sm hover:border-primary/50 transition-colors cursor-default">
      <span>${category.name}</span>
      <button 
        class="delete-category ml-2 size-6 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors" 
        data-category-id="${category.id}"
        aria-label="Delete category"
      >
        <span class="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  `;
}

/**
 * Handle add category
 */
async function handleAddCategory() {
  const nameInput = document.getElementById('category-name');
  const typeInput = document.querySelector('input[name="cat_type"]:checked');

  if (!nameInput || !typeInput) return;

  const name = nameInput.value.trim();
  const type = typeInput.value;

  if (!name) {
    alert('Please enter a category name');
    return;
  }

  try {
    await addCategory(name, type);

    // Clear input
    nameInput.value = '';

    // Refresh categories
    await renderManageCategories();

  } catch (error) {
    console.error('Error adding category:', error);
    alert('Failed to add category: ' + error.message);
  }
}

/**
 * Handle delete category
 */
async function handleDeleteCategory(categoryId) {
  if (confirm('Are you sure you want to delete this category?')) {
    try {
      await deleteCategory(categoryId);
      await renderManageCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category: ' + error.message);
    }
  }
}

/**
 * Refresh manage categories
 */
export async function refreshManageCategories() {
  await renderManageCategories();
}
