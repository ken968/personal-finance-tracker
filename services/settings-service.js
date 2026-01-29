import { db, doc, getDoc, setDoc, collection } from './firebase-service.js';

const SETTINGS_COLLECTION = 'settings';
const SETTINGS_DOC_ID = 'general';

/**
 * Get application settings (including initial balance)
 */
export async function getSettings() {
    try {
        const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return { initialBalance: 0 };
        }
    } catch (error) {
        console.error("Error getting settings:", error);
        return { initialBalance: 0 };
    }
}

/**
 * Update initial balance
 * @param {number} amount 
 */
export async function updateInitialBalance(amount) {
    try {
        const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
        await setDoc(docRef, { initialBalance: Number(amount) }, { merge: true });
    } catch (error) {
        console.error("Error updating initial balance:", error);
        throw error;
    }
}
