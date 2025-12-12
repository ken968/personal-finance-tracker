// ==========================================
// IMPORT FIREBASE FIRESTORE
// ==========================================
import { db } from './firebase-config.js';
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    addDoc,
    deleteDoc,
    onSnapshot,
    query,
    orderBy,
    Timestamp
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

// ==========================================
// GLOBAL VARIABLES
// ==========================================
let initialBalance = 0;
let transactions = [];
let currentFilter = 'all';

// ==========================================
// DOM ELEMENTS
// ==========================================
// Forms
const initialBalanceForm = document.getElementById('initialBalanceForm');
const transactionForm = document.getElementById('transactionForm');

// Inputs
const initialBalanceInput = document.getElementById('initialBalanceInput');
const transactionType = document.getElementById('transactionType');
const transactionCategory = document.getElementById('transactionCategory');
const transactionAmount = document.getElementById('transactionAmount');
const transactionDate = document.getElementById('transactionDate');
const transactionDescription = document.getElementById('transactionDescription');
const timeFilter = document.getElementById('timeFilter');

// Display Elements
const currentBalanceDisplay = document.getElementById('currentBalanceDisplay');
const savedBalanceAmount = document.getElementById('savedBalanceAmount');
const finalBalance = document.getElementById('finalBalance');
const totalIncome = document.getElementById('totalIncome');
const totalExpense = document.getElementById('totalExpense');
const transactionList = document.getElementById('transactionList');
const emptyState = document.getElementById('emptyState');
const loadingOverlay = document.getElementById('loadingOverlay');
const alertToast = document.getElementById('alertToast');
const alertMessage = document.getElementById('alertMessage');

// ==========================================
// CATEGORY DEFINITIONS
// ==========================================
const categories = {
    income: ['Gaji', 'Bonus', 'Investasi', 'Uang Ortu', 'Lainnya'],
    expense: ['Makanan', 'Transport', 'Hiburan', 'Tagihan', 'Belanja', 'Kesehatan', 'Lainnya']
};

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    setDefaultDate();
});

function initializeApp() {
    showLoading(true);
    loadInitialBalance();
    listenToTransactions();
}

function setupEventListeners() {
    initialBalanceForm.addEventListener('submit', handleInitialBalanceSubmit);

    transactionForm.addEventListener('submit', handleTransactionSubmit);
    transactionType.addEventListener('change', handleTypeChange);

    timeFilter.addEventListener('change', handleFilterChange);
}

function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    transactionDate.value = today;
}

// ==========================================
// INITIAL BALANCE FUNCTIONS
// ==========================================
async function loadInitialBalance() {
    try {
        const docRef = doc(db, 'settings', 'initialBalance');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            initialBalance = docSnap.data().amount || 0;
            initialBalanceInput.value = initialBalance;
            savedBalanceAmount.textContent = formatCurrency(initialBalance);
            currentBalanceDisplay.classList.remove('hidden');
        }

        updateDashboard();
    } catch (error) {
        console.error('Error loading initial balance:', error);
        showAlert('Gagal memuat saldo awal', 'error');
    }
}

async function handleInitialBalanceSubmit(e) {
    e.preventDefault();

    const amount = parseFloat(initialBalanceInput.value);

    if (isNaN(amount) || amount < 0) {
        showAlert('Masukkan jumlah yang valid', 'error');
        return;
    }

    try {
        showLoading(true);

        const docRef = doc(db, 'settings', 'initialBalance');
        await setDoc(docRef, {
            amount: amount,
            updatedAt: Timestamp.now()
        });

        initialBalance = amount;
        savedBalanceAmount.textContent = formatCurrency(amount);
        currentBalanceDisplay.classList.remove('hidden');

        updateDashboard();
        showAlert('Saldo awal berhasil disimpan!', 'success');
    } catch (error) {
        console.error('Error saving initial balance:', error);
        showAlert('Gagal menyimpan saldo awal', 'error');
    } finally {
        showLoading(false);
    }
}

// ==========================================
// TRANSACTION FUNCTIONS
// ==========================================
function handleTypeChange() {
    const type = transactionType.value;

    transactionCategory.innerHTML = '<option value="">Pilih Kategori</option>';

    if (type && categories[type]) {
        categories[type].forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            transactionCategory.appendChild(option);
        });
        transactionCategory.disabled = false;
    } else {
        transactionCategory.disabled = true;
    }
}

    async function handleTransactionSubmit(e) {
        e.preventDefault();

        const type = transactionType.value;
        const category = transactionCategory.value;
        const amount = parseFloat(transactionAmount.value);
        const date = transactionDate.value;
        const description = transactionDescription.value.trim();

        // Validation
        if (!type || !category || isNaN(amount) || amount <= 0 || !date || !description) {
            showAlert('Mohon lengkapi semua field', 'error');
            return;
        }

        try {
            showLoading(true);

            // Convert date string to Timestamp
            const dateObj = new Date(date);

            await addDoc(collection(db, 'transactions'), {
                type: type,
                category: category,
                amount: amount,
                date: Timestamp.fromDate(dateObj),
                description: description,
                createdAt: Timestamp.now()
            });

            // Reset form
            transactionForm.reset();
            transactionCategory.disabled = true;
            transactionCategory.innerHTML = '<option value="">Pilih tipe terlebih dahulu</option>';
            setDefaultDate();

            showAlert('Transaksi berhasil ditambahkan!', 'success');
        } catch (error) {
            console.error('Error adding transaction:', error);
            showAlert('Gagal menambahkan transaksi', 'error');
        } finally {
            showLoading(false);
        }
    }

function listenToTransactions() {
    const q = query(collection(db, 'transactions'), orderBy('date', 'desc'));

    onSnapshot(q, (snapshot) => {
        transactions = [];
        snapshot.forEach((doc) => {
            transactions.push({
                id: doc.id,
                ...doc.data()
            });
        });

        renderTransactions();
        updateDashboard();
        showLoading(false);
    }, (error) => {
        console.error('Error listening to transactions:', error);
        showAlert('Gagal memuat transaksi', 'error');
        showLoading(false);
    });
}

async function deleteTransaction(id) {
    if (!confirm('Yakin ingin menghapus transaksi ini?')) {
        return;
    }

    try {
        showLoading(true);
        await deleteDoc(doc(db, 'transactions', id));
        showAlert('Transaksi berhasil dihapus', 'success');
    } catch (error) {
        console.error('Error deleting transaction:', error);
        showAlert('Gagal menghapus transaksi', 'error');
    } finally {
        showLoading(false);
    }
}

// ==========================================
// FILTER FUNCTIONS
// ==========================================
function handleFilterChange() {
    currentFilter = timeFilter.value;
    renderTransactions();
    updateDashboard();
}

function filterTransactions() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return transactions.filter(transaction => {
        const transactionDate = transaction.date.toDate();

        switch (currentFilter) {
            case 'today':
                return transactionDate >= today;

            case 'week':
                const weekAgo = new Date(today);
                weekAgo.setDate(weekAgo.getDate() - 7);
                return transactionDate >= weekAgo;

            case 'month':
                const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                return transactionDate >= monthStart;

            case 'all':
            default:
                return true;
        }
    });
}

// ==========================================
// RENDER FUNCTIONS
// ==========================================
function renderTransactions() {
    const filteredTransactions = filterTransactions();

    // Clear list
    transactionList.innerHTML = '';

    if (filteredTransactions.length === 0) {
        transactionList.appendChild(emptyState);
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    filteredTransactions.forEach(transaction => {
        const item = createTransactionElement(transaction);
        transactionList.appendChild(item);
    });
}

function createTransactionElement(transaction) {
    const div = document.createElement('div');
    div.className = `transaction-item ${transaction.type}`;

    const formattedDate = formatDate(transaction.date.toDate());
    const formattedAmount = formatCurrency(transaction.amount);
    const typeText = transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran';

    div.innerHTML = `
        <div class="transaction-info">
            <div class="transaction-header">
                <span class="transaction-type-badge ${transaction.type}">${typeText}</span>
                <span class="transaction-category">${transaction.category}</span>
            </div>
            <p class="transaction-description">${transaction.description}</p>
            <p class="transaction-date">📅 ${formattedDate}</p>
        </div>
        <div class="transaction-amount ${transaction.type}">
            ${transaction.type === 'income' ? '+' : '-'} ${formattedAmount}
        </div>
        <button class="btn btn-danger" onclick="deleteTransaction('${transaction.id}')">
            🗑️ Hapus
        </button>
    `;

    return div;
}

// ==========================================
// DASHBOARD CALCULATIONS
// ==========================================
function updateDashboard() {
    const filteredTransactions = filterTransactions();

    let income = 0;
    let expense = 0;

    filteredTransactions.forEach(transaction => {
        if (transaction.type === 'income') {
            income += transaction.amount;
        } else if (transaction.type === 'expense') {
            expense += transaction.amount;
        }
    });

    // Calculate final balance: Initial Balance + Total Income - Total Expense
    const final = initialBalance + income - expense;

    // Update display
    totalIncome.textContent = formatCurrency(income);
    totalExpense.textContent = formatCurrency(expense);
    finalBalance.textContent = formatCurrency(final);
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

function showLoading(show) {
    if (show) {
        loadingOverlay.classList.remove('hidden');
    } else {
        loadingOverlay.classList.add('hidden');
    }
}

function showAlert(message, type = 'success') {
    alertMessage.textContent = message;
    alertToast.className = `alert-toast ${type}`;
    alertToast.classList.remove('hidden');

    setTimeout(() => {
        alertToast.classList.add('hidden');
    }, 3000);
}

// ==========================================
// EXPOSE FUNCTIONS TO GLOBAL SCOPE
// (Required for inline onclick handlers)
// ==========================================
window.deleteTransaction = deleteTransaction;
