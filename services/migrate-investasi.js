// ==========================================
// DATA MIGRATION - Move Investasi to Investment Type
// ==========================================
import {
    db,
    collection,
    getDocs,
    updateDoc,
    doc,
    query,
    where
} from './firebase-service.js';

const TRANSACTIONS_COLLECTION = 'transactions';

/**
 * Migrate all "Investasi" expense transactions to "investment" type
 * @returns {Promise<object>} Migration results
 */
export async function migrateInvestasiToInvestment() {
    try {
        console.log('Starting migration: Investasi → Investment...');

        // Get all transactions
        const querySnapshot = await getDocs(collection(db, TRANSACTIONS_COLLECTION));
        const allTransactions = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log(`Total transactions found: ${allTransactions.length}`);

        // Filter transactions that need migration
        const toMigrate = allTransactions.filter(t =>
            t.type === 'expense' && t.category === 'Investasi'
        );

        console.log(`Transactions to migrate: ${toMigrate.length}`);

        // Migrate each transaction
        let migratedCount = 0;
        let errorCount = 0;
        const errors = [];

        for (const transaction of toMigrate) {
            try {
                await updateDoc(doc(db, TRANSACTIONS_COLLECTION, transaction.id), {
                    type: 'investment',
                    category: 'Lainnya' // Change from "Investasi" to "Lainnya" (Others)
                });
                migratedCount++;
                console.log(`Migrated transaction ${transaction.id}: ${transaction.category} → Lainnya - Rp ${transaction.amount}`);
            } catch (error) {
                errorCount++;
                errors.push({
                    transactionId: transaction.id,
                    error: error.message
                });
                console.error(`Error migrating transaction ${transaction.id}:`, error);
            }
        }

        const results = {
            totalTransactions: allTransactions.length,
            foundToMigrate: toMigrate.length,
            migratedCount,
            errorCount,
            errors
        };

        console.log('Migration completed!', results);
        return results;

    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    }
}

/**
 * Check if migration is needed
 * @returns {Promise<boolean>} True if migration is needed
 */
export async function needsMigration() {
    try {
        const querySnapshot = await getDocs(collection(db, TRANSACTIONS_COLLECTION));
        const transactions = querySnapshot.docs.map(doc => doc.data());

        const needsMigration = transactions.some(t =>
            t.type === 'expense' && t.category === 'Investasi'
        );

        return needsMigration;
    } catch (error) {
        console.error('Error checking migration status:', error);
        return false;
    }
}
