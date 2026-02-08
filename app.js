// ==========================================
// MAIN APPLICATION - Personal Finance Tracker
// ==========================================
import { initializeDefaultCategories } from './services/category-service.js';
import { renderDashboard } from './components/dashboard.js';
import { renderTransactionHistory } from './components/transaction-history.js';
import { renderManageCategories } from './components/manage-categories.js';
import { openTransactionModal } from './components/transaction-modal.js';
import { getSettings, updateInitialBalance } from './services/settings-service.js';
import { formatInputCurrency, getRawNumber } from './utils/helpers.js';

// Current active section
let currentSection = 'dashboard';

/**
 * Initialize the application
 */
async function initApp() {
    try {
        console.log('Initializing Personal Finance Tracker...');

        // Show loading state
        showLoading();

        // Initialize default categories if needed
        await initializeDefaultCategories();

        // Set up navigation
        setupNavigation();

        // Load initial section (dashboard)
        await navigateToSection('dashboard');

        // Hide loading state
        hideLoading();

        console.log('Application initialized successfully!');
    } catch (error) {
        console.error('Error initializing application:', error);
        hideLoading();
        showError('Failed to initialize application: ' + error.message);
    }
}

/**
 * Set up navigation event listeners
 */
function setupNavigation() {
    // Bottom navigation buttons
    document.querySelectorAll('[data-nav]').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const section = button.dataset.nav;
            navigateToSection(section);
        });
    });

    // Floating action button (add transaction)
    document.getElementById('fab-add-transaction')?.addEventListener('click', () => {
        openTransactionModal();
    });

    // Add transaction buttons in header
    document.querySelectorAll('.add-transaction-btn').forEach(button => {
        button.addEventListener('click', () => {
            openTransactionModal();
        });
    });
}

/**
 * Navigate to a specific section
 * @param {string} section - Section name ('dashboard', 'history', 'categories', 'settings')
 */
async function navigateToSection(section) {
    currentSection = section;

    // Update navigation states
    updateNavigationStates(section);

    // Hide all sections
    document.querySelectorAll('.app-section').forEach(el => {
        el.classList.remove('active');
        el.classList.add('hidden');
    });

    // Show selected section
    const sectionElement = document.getElementById(`${section}-section`);
    if (sectionElement) {
        sectionElement.classList.remove('hidden');
        sectionElement.classList.add('active');
    }

    // Render section content
    try {
        switch (section) {
            case 'dashboard':
                await renderDashboard();
                break;
            case 'history':
                await renderTransactionHistory();
                break;
            case 'categories':
                await renderManageCategories();
                break;
            case 'settings':
                await renderSettings();
                break;
            default:
                console.warn('Unknown section:', section);
        }
    } catch (error) {
        console.error('Error rendering section:', error);
        showError('Failed to load section: ' + error.message);
    }
}

/**
 * Update navigation button states
 */
function updateNavigationStates(activeSection) {
    document.querySelectorAll('[data-nav]').forEach(button => {
        const section = button.dataset.nav;

        if (section === activeSection) {
            button.classList.add('active', 'text-primary');
            button.classList.remove('text-slate-500', 'dark:text-slate-500');
        } else {
            button.classList.remove('active', 'text-primary');
            button.classList.add('text-slate-400', 'dark:text-slate-500', 'hover:text-primary', 'dark:hover:text-primary');
        }
    });
}

/**
 * Render settings section
 */
async function renderSettings() {
    const container = document.getElementById('settings-section');
    if (!container) return;

    try {
        const settings = await getSettings();

        container.innerHTML = `
    <div class="flex-1 flex flex-col w-full max-w-7xl mx-auto p-6 pb-24">
      <h1 class="text-[28px] font-bold leading-tight tracking-tight mb-8 text-white">Settings</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- App Info -->
        <div class="rounded-3xl bg-[#1c2e36] p-6 shadow-xl border border-white/5 h-full">
          <div class="size-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-4 text-primary">
             <span class="material-symbols-outlined text-[24px]">info</span>
          </div>
          <h2 class="text-xl font-bold mb-2 text-white">Personal Finance Tracker</h2>
          <p class="text-sm text-slate-400 mb-4">Version 1.2.0</p>
          <p class="text-sm text-slate-400 leading-relaxed">
            Manage your personal finances with ease. Track income, expenses, and visualize your cashflow in real-time.
          </p>
        </div>

        <!-- Financial Setup (New) -->
        <div class="rounded-3xl bg-[#1c2e36] p-6 shadow-xl border border-white/5 h-full">
          <div class="size-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
             <span class="material-symbols-outlined text-[24px]">account_balance_wallet</span>
          </div>
          <h2 class="text-xl font-bold mb-4 text-white">Financial Setup</h2>
          
          <div class="space-y-4">
            <div>
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Initial Balance</label>
                <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">Rp</span>
                    <input 
                        type="text"
                        inputmode="numeric" 
                        id="initial-balance-input" 
                        value="${settings.initialBalance || 0}" 
                        class="w-full bg-black/20 border border-white/10 rounded-xl px-4 pl-10 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-mono"
                        placeholder="0"
                    >
                </div>
                <p class="text-[10px] text-slate-500 mt-2">Saldo awal dompet manual (sebelum transaksi dicatat).</p>
            </div>
            
            <button 
                id="save-balance-btn"
                class="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
            >
                <span class="material-symbols-outlined text-[20px]">save</span>
                <span>Save Balance</span>
            </button>
          </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="rounded-3xl bg-[#1c2e36] p-6 shadow-xl border border-white/5 h-full">
          <div class="size-12 rounded-2xl bg-orange-500/20 flex items-center justify-center mb-4 text-orange-400">
             <span class="material-symbols-outlined text-[24px]">bolt</span>
          </div>
          <h2 class="text-xl font-bold mb-4 text-white">Quick Actions</h2>
          <div class="space-y-3">
            <button 
              class="w-full flex items-center justify-between p-4 rounded-xl bg-black/20 hover:bg-black/30 border border-white/5 hover:border-primary/30 transition-all text-left group"
              onclick="window.location.reload()"
            >
              <span class="text-sm font-medium text-white group-hover:text-primary transition-colors">Refresh App</span>
              <span class="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">refresh</span>
            </button>
            <button 
              data-nav="categories"
              class="w-full flex items-center justify-between p-4 rounded-xl bg-black/20 hover:bg-black/30 border border-white/5 hover:border-primary/30 transition-all text-left group"
            >
              <span class="text-sm font-medium text-white group-hover:text-primary transition-colors">Manage Categories</span>
              <span class="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">arrow_forward</span>
            </button>
          </div>
        </div>
        
        <!-- Data Migration (NEW) -->
        <div class="rounded-3xl bg-[#1c2e36] p-6 shadow-xl border border-white/5 h-full">
          <div class="size-12 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
             <span class="material-symbols-outlined text-[24px]">sync</span>
          </div>
          <h2 class="text-xl font-bold mb-4 text-white">Data Migration</h2>
          <p class="text-sm text-slate-400 mb-4 leading-relaxed">
            Convert "Investasi" expenses to the new Investment type to properly track your investment spending.
          </p>
          <button 
            id="migrate-data-btn"
            class="w-full py-3 px-4 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
          >
            <span class="material-symbols-outlined text-[20px]">sync</span>
            <span>Migrate Data</span>
          </button>
          <div id="migration-status" class="mt-3 text-xs text-slate-400 hidden"></div>
        </div>
        
        <!-- About -->
        <div class="rounded-3xl bg-[#1c2e36] p-6 shadow-xl border border-white/5 h-full">
          <div class="size-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
             <span class="material-symbols-outlined text-[24px]">code</span>
          </div>
          <h2 class="text-xl font-bold mb-4 text-white">Technology</h2>
          <p class="text-sm text-slate-400 leading-relaxed">
            Built with modern web technologies for maximum performance and reliability.
            <br><br>
            <span class="inline-block px-2 py-1 rounded bg-black/30 text-xs font-mono text-primary mr-1">Firebase</span>
            <span class="inline-block px-2 py-1 rounded bg-black/30 text-xs font-mono text-blue-400 mr-1">Tailwind</span>
            <span class="inline-block px-2 py-1 rounded bg-black/30 text-xs font-mono text-yellow-400">Chart.js</span>
          </p>
        </div>
      </div>
    </div>
  `;

        // Setup event listener for Save button
        document.getElementById('save-balance-btn')?.addEventListener('click', async () => {
            const btn = document.getElementById('save-balance-btn');
            const input = document.getElementById('initial-balance-input');
            const originalText = btn.innerHTML;

            try {
                // Show loading
                btn.innerHTML = '<span class="size-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Saving...';
                btn.disabled = true;

                await updateInitialBalance(getRawNumber(input.value));

                // Show success
                btn.innerHTML = '<span class="material-symbols-outlined">check</span> Saved!';
                btn.classList.add('bg-emerald-500', 'hover:bg-emerald-500');
                btn.classList.remove('bg-primary', 'hover:bg-primary/90');

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    btn.classList.remove('bg-emerald-500', 'hover:bg-emerald-500');
                    btn.classList.add('bg-primary', 'hover:bg-primary/90');
                }, 2000);

            } catch (error) {
                console.error(error);
                btn.innerHTML = 'Error!';
                btn.disabled = false;
            }
        });

        // Setup input formatting
        const balanceInput = document.getElementById('initial-balance-input');
        if (balanceInput) {
            formatInputCurrency(balanceInput);
            balanceInput.addEventListener('input', (e) => formatInputCurrency(e.target));
        }

        // Setup migration button
        const migrateBtn = document.getElementById('migrate-data-btn');
        const migrationStatus = document.getElementById('migration-status');

        if (migrateBtn && migrationStatus) {
            migrateBtn.addEventListener('click', async () => {
                const originalText = migrateBtn.innerHTML;

                try {
                    // Show loading
                    migrateBtn.disabled = true;
                    migrateBtn.innerHTML = '<span class="size-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Migrating...';
                    migrationStatus.classList.remove('hidden');
                    migrationStatus.textContent = 'Checking for transactions to migrate...';

                    // Import migration function
                    const { migrateInvestasiToInvestment } = await import('./services/migrate-investasi.js');

                    // Run migration
                    const results = await migrateInvestasiToInvestment();

                    // Show success
                    migrateBtn.innerHTML = '<span class="material-symbols-outlined">check</span> Migration Complete!';
                    migrateBtn.classList.remove('bg-purple-500', 'hover:bg-purple-600');
                    migrateBtn.classList.add('bg-emerald-500');

                    migrationStatus.textContent = `✓ Successfully migrated ${results.migratedCount} transactions from "Investasi" to "Investment" type.`;
                    migrationStatus.classList.remove('text-slate-400');
                    migrationStatus.classList.add('text-emerald-400');

                    // Refresh the app after 2 seconds
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);

                } catch (error) {
                    console.error('Migration error:', error);
                    migrateBtn.innerHTML = '<span class="material-symbols-outlined">error</span> Migration Failed';
                    migrateBtn.classList.remove('bg-purple-500', 'hover:bg-purple-600');
                    migrateBtn.classList.add('bg-rose-500');

                    migrationStatus.textContent = `× Error: ${error.message}`;
                    migrationStatus.classList.remove('text-slate-400');
                    migrationStatus.classList.add('text-rose-400');

                    setTimeout(() => {
                        migrateBtn.innerHTML = originalText;
                        migrateBtn.disabled = false;
                        migrateBtn.classList.remove('bg-rose-500');
                        migrateBtn.classList.add('bg-purple-500', 'hover:bg-purple-600');
                        migrationStatus.classList.add('hidden');
                    }, 5000);
                }
            });
        }

    } catch (error) {
        console.error('Error rendering settings:', error);
        container.innerHTML = '<div class="text-red-500 p-6">Error loading settings.</div>';
    }

    // Re-setup navigation for dynamically added buttons
    setupNavigation();
}

/**
 * Show loading state
 */
function showLoading() {
    const loader = document.getElementById('app-loader');
    if (loader) {
        loader.classList.remove('hidden');
    }
}

/**
 * Hide loading state
 */
function hideLoading() {
    const loader = document.getElementById('app-loader');
    if (loader) {
        loader.classList.add('hidden');
    }
}

/**
 * Show error message
 */
function showError(message) {
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
        errorContainer.innerHTML = `
      <div class="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
        ${message}
      </div>
    `;
        errorContainer.classList.remove('hidden');

        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorContainer.classList.add('hidden');
        }, 5000);
    }
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Export for global access
window.navigateToSection = navigateToSection;
window.openTransactionModal = openTransactionModal;
