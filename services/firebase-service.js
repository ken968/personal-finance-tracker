// ==========================================
// FIREBASE SERVICE - CORE INITIALIZATION
// ==========================================
import { db } from '../firebase-config.js';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

// Export Firestore database instance
export { db };

// Export Firestore functions for use in other services
export {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
  orderBy,
  Timestamp
};
