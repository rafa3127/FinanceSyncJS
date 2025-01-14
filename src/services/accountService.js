import { getFirestore, doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { Account } from '../models/accounts/Account.js'; // Asumiendo que la clase Account está en 'models'

/**
 * Fetches an account from Firebase by its document ID.
 * @param {string} id - The document ID of the account.
 * @returns {Promise<Account>} A promise that resolves with the Account instance.
 */
async function getAccountById(id) {
    const db = getFirestore();
    const docRef = doc(db, 'accounts', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return new Account({ id: docSnap.id, ...docSnap.data() });
    } else {
        throw new Error('No account found with the given ID.');
    }
}

/**
 * Retrieves a list of accounts from Firebase based on provided filters.
 * @param {Object} filters - The filters to apply for the accounts.
 * @param {string} [filters.userId] - The user ID to filter accounts by.
 * @param {string} [filters.type] - The type to filter accounts by.
 * @returns {Promise<Account[]>} A promise that resolves with an array of Account instances.
 */
async function listAccounts(filters = {}) {
    const db = getFirestore();
    const accountsRef = collection(db, 'accounts');
    let q = query(accountsRef);

    const { userId, type, ...rest } = filters

    if (userId) {
        q = query(q, where("userId", "==", userId));
    }

    if (type) {
        q = query(q, where("type", "==", type));
    }

    Object.entries( rest ).forEach( ([key, value]) => {
        q = query(q, where( key, "==", value))
    })

    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => new Account({ id: doc.id, ...doc.data() }));
}

export { getAccountById, listAccounts };
