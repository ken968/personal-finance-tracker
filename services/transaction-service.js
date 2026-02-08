import {
    db,
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
    Timestamp
} from './firebase-service.js';
import { getSettings } from './settings-service.js';

const TRANSACTIONS_COLLECTION = 'transactions';

/**
 * FUNGSI UTAMA: Ambil Transaksi (Dibutuhkan oleh History & Modal)
 * Saya kembalikan namanya menjadi getTransactions agar tidak error.
 */
export async function getTransactions(filters = {}) {
    try {
        const querySnapshot = await getDocs(query(collection(db, TRANSACTIONS_COLLECTION)));
        let transactions = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date ? doc.data().date.toDate() : new Date(),
            amount: Number(doc.data().amount) || 0
        }));

        // Filter manual jika ada filter tanggal dari History
        if (filters.startDate || filters.endDate || filters.type || filters.category) {
            transactions = transactions.filter(t => {
                const date = t.date;
                const start = filters.startDate ? filters.startDate.toDate() : new Date(0);
                const end = filters.endDate ? filters.endDate.toDate() : new Date(2100, 0, 1);

                const dateMatch = date >= start && date <= end;
                const typeMatch = filters.type && filters.type !== 'all' ? t.type === filters.type : true;
                const categoryMatch = filters.category && filters.category !== 'all' ? t.category === filters.category : true;

                return dateMatch && typeMatch && categoryMatch;
            });
        }

        return transactions.sort((a, b) => b.date - a.date);
    } catch (error) {
        console.error("Error getTransactions:", error);
        return [];
    }
}

/**
 * FUNGSI SALDO UTAMA: All-Time Balance (Untuk Dashboard Atas)
 */
// Ganti fungsi getBalance di transaction-service.js dengan ini:
export async function getBalance() {
    try {
        // 1. Ambil SEMUA transaksi tanpa filter query Firestore
        const snapshot = await getDocs(collection(db, TRANSACTIONS_COLLECTION));
        const allTransactions = snapshot.docs.map(doc => doc.data());

        // 2. Ambil Saldo Awal
        const settings = await getSettings();
        const initialBalance = Number(settings?.initialBalance) || 0;

        // 3. Hitung murni dari awal
        let total = initialBalance;
        allTransactions.forEach(t => {
            const amount = Number(t.amount) || 0;
            if (t.type === 'income') total += amount;
            else if (t.type === 'expense') total -= amount;
            else if (t.type === 'investment') total -= amount;
        });

        return total;
    } catch (error) {
        console.error("Gagal hitung saldo global:", error);
        return 0;
    }
}

/**
 * FUNGSI STATISTIK: Untuk Grafik & Summary (Bisa Terfilter)
 */
export async function getStats(timeFrame = 'all') {
    try {
        const allTransactions = await getTransactions();

        let startDate = null;
        if (timeFrame && timeFrame.toUpperCase() !== 'ALL') {
            startDate = new Date();
            const period = timeFrame.toUpperCase();
            if (period === '1D') startDate.setHours(0, 0, 0, 0);
            else if (period === '1W') startDate.setDate(startDate.getDate() - 7);
            else if (period === '1M') startDate.setMonth(startDate.getMonth() - 1);
            else if (period === '1Y') startDate.setFullYear(startDate.getFullYear() - 1);
        }

        const filtered = allTransactions.filter(t => !startDate || t.date >= startDate);

        let income = 0;
        let expense = 0;
        let investment = 0;
        const categoryMap = {};

        filtered.forEach(t => {
            if (t.type === 'income') income += t.amount;
            else if (t.type === 'expense') expense += t.amount;
            else if (t.type === 'investment') investment += t.amount;

            const key = `${t.type}_${t.category}`;
            if (!categoryMap[key]) {
                categoryMap[key] = { category: t.category, type: t.type, total: 0 };
            }
            categoryMap[key].total += t.amount;
        });

        return {
            totalIncome: income,
            totalExpense: expense,
            totalInvestment: investment,
            balance: income - expense - investment,
            transactions: filtered,
            categoryBreakdown: Object.values(categoryMap)
        };
    } catch (error) {
        return { totalIncome: 0, totalExpense: 0, transactions: [], categoryBreakdown: [] };
    }
}

// Fungsi CRUD (Wajib ada agar Modal & History tidak crash)
export async function addTransaction(data) {
    return await addDoc(collection(db, TRANSACTIONS_COLLECTION), {
        ...data,
        amount: Number(data.amount),
        date: Timestamp.fromDate(new Date(data.date)),
        createdAt: Timestamp.now()
    });
}
export async function updateTransaction(id, data) {
    return await updateDoc(doc(db, TRANSACTIONS_COLLECTION, id), {
        ...data,
        amount: Number(data.amount),
        date: Timestamp.fromDate(new Date(data.date))
    });
}
export async function deleteTransaction(id) {
    return await deleteDoc(doc(db, TRANSACTIONS_COLLECTION, id));
}