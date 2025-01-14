import { JournalEntry as BaseJournalEntry } from 'balance-book-js';
import { createJournalEntry, updateJournalEntry } from '../../firebase/firebaseUtils.js';
import { getAccountById } from '../../services/accountService.js';

/**
 * Represents a journal entry with Firebase integration, including user identification.
 * @extends {BaseJournalEntry}
 */
class JournalEntry extends BaseJournalEntry {
    constructor(originalData) {
      const {description, userId, date = new Date(), data = {}, ...rest} = originalData

        super(description, date);
        this.userId = userId; // Add userId to journal entry properties
        this.data = {...data, ...rest}
    }

    async save() {
        const entryData = this.serialize();
        if (this.id) {
            await updateJournalEntry(this.id, entryData);
        } else {
            this.id = await createJournalEntry(entryData);
        }
    }

    async addEntryById(accountId, amount, type) {
        try {
          const account = await getAccountById(accountId);
          super.addEntry(account, amount, type);
        } catch (error) {
          console.error('Error adding entry by ID:', error);
          throw error;
        }
      }

    /**
   * Serializes the journal entry data for Firebase.
   * @returns {Object} The serialized data object.
   */
  serialize() {
    const entriesData = this.entries.map(entry => ({
      accountId: entry.account.id, 
      amount: entry.amount,
      type: entry.type
    }));

    return {
      description: this.description,
      date: this.date,
      userId: this.userId,
      entries: entriesData
    };
  }
}

export { JournalEntry };
