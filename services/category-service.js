// ==========================================
// CATEGORY SERVICE - CRUD OPERATIONS
// ==========================================
import {
    db,
    collection,
    addDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
    orderBy,
    Timestamp
} from './firebase-service.js';

const CATEGORIES_COLLECTION = 'categories';

/**
 * Get all categories or filter by type
 * @param {string} type - 'income', 'expense', or null for all
 * @returns {Promise<Array>} Array of category objects
 */
export async function getCategories(type = null) {
    try {
        const categoriesRef = collection(db, CATEGORIES_COLLECTION);
        let q;

        if (type) {
            q = query(categoriesRef, where('type', '==', type));
        } else {
            q = query(categoriesRef);
        }

        const querySnapshot = await getDocs(q);
        const categories = [];

        querySnapshot.forEach((doc) => {
            categories.push({
                id: doc.id,
                ...doc.data()
            });
        });

        // Sort client-side to avoid Firestore index requirements
        categories.sort((a, b) => a.name.localeCompare(b.name));

        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}

/**
 * Add a new category
 * @param {string} name - Category name
 * @param {string} type - 'income' or 'expense'
 * @returns {Promise<object>} Created category object
 */
export async function addCategory(name, type) {
    try {
        if (!name || !type) {
            throw new Error('Name and type are required');
        }

        if (type !== 'income' && type !== 'expense') {
            throw new Error('Type must be "income" or "expense"');
        }

        const categoryData = {
            name: name.trim(),
            type: type,
            createdAt: Timestamp.now()
        };

        const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), categoryData);

        return {
            id: docRef.id,
            ...categoryData
        };
    } catch (error) {
        console.error('Error adding category:', error);
        throw error;
    }
}

/**
 * Delete a category
 * @param {string} categoryId - Category ID to delete
 * @returns {Promise<void>}
 */
export async function deleteCategory(categoryId) {
    try {
        if (!categoryId) {
            throw new Error('Category ID is required');
        }

        await deleteDoc(doc(db, CATEGORIES_COLLECTION, categoryId));
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
}

/**
 * Initialize default categories if none exist
 * @returns {Promise<void>}
 */
export async function initializeDefaultCategories() {
    try {
        const categories = await getCategories();

        // Only initialize if no categories exist
        if (categories.length === 0) {
            console.log('Initializing default categories...');

            // Default income categories
            const defaultIncomeCategories = [
                'Salary',
                'Freelance',
                'Investments',
                'Business',
                'Gift'
            ];

            // Default expense categories
            const defaultExpenseCategories = [
                'Groceries',
                'Rent',
                'Transport',
                'Utilities',
                'Entertainment',
                'Healthcare',
                'Shopping',
                'Food & Dining',
                'Education'
            ];

            // Add income categories
            for (const name of defaultIncomeCategories) {
                await addCategory(name, 'income');
            }

            // Add expense categories
            for (const name of defaultExpenseCategories) {
                await addCategory(name, 'expense');
            }

            console.log('Default categories initialized successfully');
        }
    } catch (error) {
        console.error('Error initializing default categories:', error);
        throw error;
    }
}
