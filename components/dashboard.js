// ==========================================
// DASHBOARD COMPONENT
// ==========================================
import { getStats, getBalance } from '../services/transaction-service.js';
import {
  formatCurrency,
  generateLineChartData,
  generatePieChartData,
  calculatePercentageChange
} from '../utils/helpers.js';

let currentPeriod = 'ALL';
let lineChart = null;
let incomeChart = null;
let expenseChart = null;

/**
 * Render dashboard section
 */
export async function renderDashboard() {
  const container = document.getElementById('dashboard-section');
  if (!container) return;

  try {
    // Show loading state
    container.innerHTML = '<div class="flex items-center justify-center h-64"><div class="text-white">Loading...</div></div>';

    console.log("DEBUG: renderDashboard executing. Current Period:", currentPeriod);
    console.log("DEBUG: Fetching Global Balance...");

    // 1. GLOBAL STATE (All Time)
    const allStats = await getStats('ALL');
    const totalBalance = await getBalance(); // All Time + Initial Balance

    // 2. PERIODIC STATS (Filtered for Charts)
    const stats = await getStats(currentPeriod);

    container.innerHTML = `
      <main class="flex-1 px-5 pb-24 overflow-y-auto scrollbar-hide">
        <!-- Dashboard Grid Layout -->
        <div class="max-w-[95%] mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
            
            <!-- Column 1: Stats & Overview (Takes 2 columns on desktop) -->
            <div class="flex flex-col gap-6 lg:col-span-2">
                <!-- Total Balance Card (Hero) -->
                <div class="relative overflow-hidden rounded-3xl bg-[#1c2e36] p-6 shadow-xl border border-white/5 group hover:border-primary/20 transition-all">
                  <div class="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/20 blur-3xl pointer-events-none group-hover:bg-primary/30 transition-all"></div>
                  <div class="relative z-10 flex flex-col gap-3">
                    <p class="text-slate-400 text-sm font-medium tracking-wide">Total Balance</p>
                    <div class="flex items-baseline gap-2">
                      <h2 class="text-4xl font-bold tracking-tight text-white drop-shadow-sm">${formatCurrency(totalBalance)}</h2>
                    </div>
                    <div class="flex items-center gap-3 mt-1">
                      <div class="flex items-center gap-1.5 rounded-full ${stats.balance >= 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'} px-3 py-1 text-xs font-semibold border">
                        <span class="material-symbols-outlined text-[16px]">${stats.balance >= 0 ? 'trending_up' : 'trending_down'}</span>
                        <span>${stats.balance >= 0 ? '+' : ''}${formatCurrency(stats.balance)}</span>
                      </div>
                      <span class="text-xs text-slate-500 font-medium">This period</span>
                    </div>
                  </div>
                </div>
                
                <!-- Income & Expense & Investment Cards (Full Width) -->
                <div class="grid grid-cols-1 gap-4">
                  <!-- Income Stats -->
                  <div class="flex items-center gap-4 rounded-3xl bg-[#1c2e36] p-5 shadow-xl border border-white/5 hover:border-emerald-500/20 transition-all">
                    <div class="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                      <span class="material-symbols-outlined text-[24px]">arrow_downward</span>
                    </div>
                    <div class="flex-1">
                      <p class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Income</p>
                      <p class="text-2xl font-bold text-white leading-tight">${formatCurrency(allStats.totalIncome)}</p>
                    </div>
                  </div>
                  
                  <!-- Expense Stats -->
                  <div class="flex items-center gap-4 rounded-3xl bg-[#1c2e36] p-5 shadow-xl border border-white/5 hover:border-rose-500/20 transition-all">
                    <div class="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400">
                      <span class="material-symbols-outlined text-[24px]">arrow_upward</span>
                    </div>
                    <div class="flex-1">
                      <p class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Expense</p>
                      <p class="text-2xl font-bold text-white leading-tight">${formatCurrency(allStats.totalExpense)}</p>
                    </div>
                  </div>
                  
                  <!-- Investment Stats (NEW) -->
                  <div class="flex items-center gap-4 rounded-3xl bg-[#1c2e36] p-5 shadow-xl border border-white/5 hover:border-blue-500/20 transition-all">
                    <div class="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                      <span class="material-symbols-outlined text-[24px]">trending_up</span>
                    </div>
                    <div class="flex-1">
                      <p class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Investment</p>
                      <p class="text-2xl font-bold text-white leading-tight">${formatCurrency(allStats.totalInvestment || 0)}</p>
                    </div>
                  </div>
                </div>
                
                <!-- Pie Charts (Desktop: Moved here) -->
                <section class="flex flex-col gap-4 lg:hidden">
                    <h2 class="text-white text-lg font-bold">Distribution</h2>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex flex-col items-center justify-center rounded-3xl bg-[#1c2e36] p-4 shadow-xl border border-white/5">
                           <h4 class="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-widest">Income</h4>
                           <div class="relative size-20">
                             <canvas id="incomeChartMobile"></canvas>
                           </div>
                        </div>
                        <div class="flex flex-col items-center justify-center rounded-3xl bg-[#1c2e36] p-4 shadow-xl border border-white/5">
                           <h4 class="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-widest">Expense</h4>
                           <div class="relative size-20">
                             <canvas id="expenseChartMobile"></canvas>
                           </div>
                        </div>
                        <div class="flex flex-col items-center justify-center rounded-3xl bg-[#1c2e36] p-4 shadow-xl border border-white/5">
                           <h4 class="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-widest">Investment</h4>
                           <div class="relative size-20">
                             <canvas id="investmentChartMobile"></canvas>
                           </div>
                        </div>
                    </div>
                </section>
            </div>
            
            <!-- Column 2 & 3: Main Chart -->
            <div class="flex flex-col gap-6 lg:col-span-3">
                <!-- Cashflow Trend Chart -->
                <div class="flex-1 rounded-3xl bg-[#1c2e36] p-6 shadow-xl border border-white/5 flex flex-col min-h-[400px]">
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <h2 class="text-white text-xl font-bold">Cashflow Trend</h2>
                            <p class="text-slate-400 text-sm mt-1">Net Cashflow: <span class="text-white font-bold">${stats.balance >= 0 ? '+' : ''}${formatCurrency(stats.balance)}</span></p>
                        </div>
                        <!-- Use the new compact time filters -->
                        <div class="flex items-center gap-1 bg-black/20 p-1 rounded-lg">
                           ${['1D', '1W', '1M', '3M', '1Y', 'ALL'].map(period => {
      const isActive = period === currentPeriod;
      const activeClass = 'w-8 h-8 flex items-center justify-center text-[10px] font-bold text-white bg-primary shadow-sm rounded-md';
      const inactiveClass = 'w-8 h-8 flex items-center justify-center text-[10px] font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all rounded-md cursor-pointer';
      return `<button class="period-filter ${isActive ? activeClass : inactiveClass}" data-period="${period}">${period}</button>`;
    }).join('')}
                        </div>
                    </div>
                    
                    <div class="relative flex-1 w-full min-h-[300px]">
                      <canvas id="lineChart"></canvas>
                    </div>
                </div>

                <!-- Desktop Distribution (Hidden on Mobile) -->
                <div class="hidden lg:grid grid-cols-3 gap-6">
                    <div class="rounded-3xl bg-[#1c2e36] p-5 shadow-xl border border-white/5 flex items-center gap-6">
                        <div class="relative size-32 shrink-0">
                            <canvas id="incomeChartDesktop"></canvas>
                        </div>
                        <div>
                            <h4 class="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2">Income</h4>
                            <div class="text-2xl font-bold text-white">${formatCurrency(stats.totalIncome)}</div>
                            <p class="text-xs text-slate-400 mt-1">Top Sources</p>
                        </div>
                    </div>
                    <div class="rounded-3xl bg-[#1c2e36] p-5 shadow-xl border border-white/5 flex items-center gap-6">
                        <div class="relative size-32 shrink-0">
                            <canvas id="expenseChartDesktop"></canvas>
                        </div>
                        <div>
                            <h4 class="text-sm font-bold text-rose-400 uppercase tracking-wider mb-2">Expense</h4>
                            <div class="text-2xl font-bold text-white">${formatCurrency(stats.totalExpense)}</div>
                            <p class="text-xs text-slate-400 mt-1">Top Spending</p>
                        </div>
                    </div>
                    <div class="rounded-3xl bg-[#1c2e36] p-5 shadow-xl border border-white/5 flex items-center gap-6">
                        <div class="relative size-32 shrink-0">
                            <canvas id="investmentChartDesktop"></canvas>
                        </div>
                        <div>
                            <h4 class="text-sm font-bold text-blue-400 uppercase tracking-wider mb-2">Investment</h4>
                            <div class="text-2xl font-bold text-white">${formatCurrency(stats.totalInvestment || 0)}</div>
                            <p class="text-xs text-slate-400 mt-1">Portfolio</p>
                        </div>
                    </div>
                </div>
                
                <!-- Recent Transactions (New Section to fill space) -->
                <div class="hidden lg:block rounded-3xl bg-[#1c2e36] p-6 shadow-xl border border-white/5">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-white text-lg font-bold">Recent Transactions</h3>
                        <button onclick="navigateToSection('history')" class="text-sm text-primary hover:text-white transition-colors font-medium">View All</button>
                    </div>
                    <div class="space-y-3">
                        ${stats.transactions.slice(0, 5).map(t => {
      const isIncome = t.type === 'income';
      return `
                            <div class="flex items-center justify-between p-3 rounded-xl bg-black/20 hover:bg-black/30 transition-colors border border-white/5">
                                <div class="flex items-center gap-3">
                                    <div class="size-10 rounded-full flex items-center justify-center ${isIncome ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}">
                                        <span class="material-symbols-outlined text-[20px]">${t.category === 'Salary' ? 'payments' : t.category === 'Food' ? 'restaurant' : 'category'}</span>
                                    </div>
                                    <div>
                                        <p class="text-white text-sm font-semibold">${t.category}</p>
                                        <p class="text-slate-400 text-xs">${new Date(t.date?.toDate ? t.date.toDate() : t.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span class="font-bold ${isIncome ? 'text-emerald-400' : 'text-rose-400'}">
                                    ${isIncome ? '+' : '-'}${formatCurrency(t.amount)}
                                </span>
                            </div>
                            `;
    }).join('')}
                        ${stats.transactions.length === 0 ? '<div class="text-slate-500 text-center py-4">No recent transactions</div>' : ''}
                    </div>
                </div>
            </div>
            
        </div>
      </main>
    `;

    // Initialize charts
    initializeCharts(stats);

    // Add event listeners for period filters
    document.querySelectorAll('.period-filter').forEach(button => {
      button.addEventListener('click', () => handlePeriodChange(button.dataset.period));
    });

  } catch (error) {
    console.error('Error rendering dashboard:', error);
    container.innerHTML = `
      <div class="flex items-center justify-center h-64">
        <div class="text-red-500">Error loading dashboard: ${error.message}</div>
      </div>
    `;
  }
}

/**
 * Initialize Chart.js charts
 */
function initializeCharts(stats) {
  // Destroy existing charts safely
  if (lineChart && typeof lineChart.destroy === 'function') lineChart.destroy();
  if (incomeChart && typeof incomeChart.destroy === 'function') incomeChart.destroy();
  if (expenseChart && typeof expenseChart.destroy === 'function') expenseChart.destroy();
  if (window.incomeChartDesktop && typeof window.incomeChartDesktop.destroy === 'function') window.incomeChartDesktop.destroy();
  if (window.expenseChartDesktop && typeof window.expenseChartDesktop.destroy === 'function') window.expenseChartDesktop.destroy();

  // Reset chart references
  lineChart = null;
  incomeChart = null;
  expenseChart = null;
  window.incomeChartDesktop = null;
  window.expenseChartDesktop = null;

  // Line Chart
  const lineCtx = document.getElementById('lineChart');
  if (lineCtx) {
    const lineData = generateLineChartData(stats.transactions, currentPeriod);
    lineChart = new Chart(lineCtx, {
      type: 'line',
      data: lineData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              color: '#ffffff',
              usePointStyle: true,
              padding: 15,
              boxWidth: 8,
              font: {
                size: 10,
                weight: '500'
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(28, 46, 54, 0.95)',
            padding: 12,
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#10b77f',
            borderWidth: 1,
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                label += 'Rp ' + context.parsed.y.toLocaleString('id-ID');
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            display: true,
            grid: { display: false, color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#94a3b8', font: { size: 9 } }
          },
          y: {
            display: true,
            grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
            ticks: {
              color: '#94a3b8',
              font: { size: 9 },
              callback: (value) => 'Rp ' + value.toLocaleString('id-ID')
            }
          }
        }
      }
    });
  }

  // Helper to create doughnut config
  const createDoughnutConfig = (data, colorStr) => ({
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: colorStr,
          padding: 8,
          bodyColor: '#fff'
        }
      },
      cutout: '75%',
      borderWidth: 0
    }
  });

  // INCOME CHARTS (Mobile & Desktop)
  const incomeData = generatePieChartData(stats.categoryBreakdown, 'income');

  // Mobile Income
  const incomeCtxMobile = document.getElementById('incomeChartMobile');
  if (incomeCtxMobile) {
    incomeChart = new Chart(incomeCtxMobile, createDoughnutConfig(incomeData, 'rgba(16, 183, 127, 0.9)'));
  }

  // Desktop Income
  const incomeCtxDesktop = document.getElementById('incomeChartDesktop');
  if (incomeCtxDesktop) {
    window.incomeChartDesktop = new Chart(incomeCtxDesktop, createDoughnutConfig(incomeData, 'rgba(16, 183, 127, 0.9)'));
  }

  // EXPENSE CHARTS (Mobile & Desktop)
  const expenseData = generatePieChartData(stats.categoryBreakdown, 'expense');

  // Mobile Expense
  const expenseCtxMobile = document.getElementById('expenseChartMobile');
  if (expenseCtxMobile) {
    expenseChart = new Chart(expenseCtxMobile, createDoughnutConfig(expenseData, 'rgba(239, 68, 68, 0.9)'));
  }

  // Desktop Expense
  const expenseCtxDesktop = document.getElementById('expenseChartDesktop');
  if (expenseCtxDesktop) {
    window.expenseChartDesktop = new Chart(expenseCtxDesktop, createDoughnutConfig(expenseData, 'rgba(239, 68, 68, 0.9)'));
  }

  // INVESTMENT CHARTS (Mobile & Desktop)
  const investmentData = generatePieChartData(stats.categoryBreakdown, 'investment');

  // Mobile Investment
  const investmentCtxMobile = document.getElementById('investmentChartMobile');
  if (investmentCtxMobile) {
    let investmentChart = new Chart(investmentCtxMobile, createDoughnutConfig(investmentData, 'rgba(59, 130, 246, 0.9)'));
  }

  // Desktop Investment
  const investmentCtxDesktop = document.getElementById('investmentChartDesktop');
  if (investmentCtxDesktop) {
    window.investmentChartDesktop = new Chart(investmentCtxDesktop, createDoughnutConfig(investmentData, 'rgba(59, 130, 246, 0.9)'));
  }
}

/**
 * Handle period change
 */
async function handlePeriodChange(period) {
  currentPeriod = period;

  // Update button states
  document.querySelectorAll('.period-filter').forEach(button => {
    if (button.dataset.period === period) {
      button.className = 'period-filter w-10 h-10 flex items-center justify-center text-xs font-bold text-white bg-primary shadow-lg shadow-primary/20 rounded-lg transform scale-110 transition-all';
    } else {
      button.className = 'period-filter w-10 h-10 flex items-center justify-center text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all rounded-lg';
    }
  });

  // Reload dashboard with new period
  await renderDashboard();
}

/**
 * Refresh dashboard data
 */
export async function refreshDashboard() {
  await renderDashboard();
}
