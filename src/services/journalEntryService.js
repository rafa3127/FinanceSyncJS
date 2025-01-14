import { JournalEntry } from "../models/transactions/JournalEntry.js";

/**
 * Fetches an journal entry from Firebase by its document ID.
 * @param {string} id - The document ID of the Journal Entry.
 * @returns {Promise<JournalEntry>} A promise that resolves with the JournalEntry instance.
 */
async function getJournalEntryById(id) {
    const db = getFirestore();
    const docRef = doc(db, 'journalEntries', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return new JournalEntry({ id: docSnap.id, ...docSnap.data() });
    } else {
        throw new Error('No journal entry found with the given ID.');
    }
}

/**
 * Retrieves a list of journal entries from Firebase based on provided filters.
 * @param {Object} filters - The filters to apply for the journal entries.
 * @param {string} [filters.userId] - The user ID to filter journal entries by.
 * @param {string} [filters.type] - The type to filter journal entries by.
 * @returns {Promise<JournalEntry[]>} A promise that resolves with an array of Journalentry instances.
 */

async function listJournalEntries(filters = {}) {
    const db = getFirestore();
    const journalEntriessRef = collection(db, 'journalEntries');
    let q = query(journalEntriessRef);

    const { userId, type, ...rest } = filters

    if (userId) {
        q = query(q, where("userId", "==", userId));
    }

    Object.entries( rest ).forEach( ([key, value]) => {
        q = query(q, where( key, "==", value))
    })

    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => new JournalEntry({ id: doc.id, ...doc.data() }));
}

export { getJournalEntryById, listJournalEntries }