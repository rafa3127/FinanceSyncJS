import { getFirestore, doc, setDoc, updateDoc, collection, deleteDoc, addDoc } from 'firebase/firestore';

/**
 * Creates a new account document in Firebase Firestore.
 * @param {Object} accountData - The account data to be stored.
 * @returns {Promise<string>} The document ID of the newly created account.
 */
async function createAccount(accountData) {
    const db = getFirestore();
    const docRef = doc(collection(db, 'accounts'));
    await setDoc(docRef, accountData);
    return docRef.id;
}

/**
 * Updates an existing account document in Firebase Firestore.
 * @param {string} id - The document ID of the account to update.
 * @param {Object} accountData - The updated data for the account.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 */
async function updateAccount(id, accountData) {
    const db = getFirestore();
    const docRef = doc(db, 'accounts', id);
    await updateDoc(docRef, accountData);
}

/**
 * Deletes an account document from Firebase Firestore.
 * @param {string} id - The document ID of the account to be deleted.
 * @returns {Promise<void>} A promise that resolves when the document is deleted.
 */
async function deleteAccount(id) {
    const db = getFirestore();
    const docRef = doc(db, 'accounts', id);
    await deleteDoc(docRef);
}

/**
 * Creates a new journal entry document in Firebase Firestore.
 * @param {Object} entryData - The data for the new journal entry.
 * @returns {Promise<string>} A promise that resolves with the ID of the newly created document.
 */
async function createJournalEntry(entryData) {
    const db = getFirestore();
    const entriesRef = collection(db, 'journalEntries');
    const docRef = await addDoc(entriesRef, entryData);
    return docRef.id;
}

/**
 * Updates an existing journal entry document in Firebase Firestore.
 * @param {string} id - The document ID of the journal entry to update.
 * @param {Object} entryData - The updated data for the journal entry.
 * @returns {Promise<void>} A promise that resolves when the document is successfully updated.
 */
async function updateJournalEntry(id, entryData) {
    const db = getFirestore();
    const docRef = doc(db, 'journalEntries', id);
    await updateDoc(docRef, entryData);
}


export { createAccount, updateAccount, deleteAccount, createJournalEntry, updateJournalEntry };
