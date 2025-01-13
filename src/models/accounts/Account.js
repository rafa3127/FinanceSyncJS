import { Account as BaseAccount } from 'balance-book-js';
import { createAccount, updateAccount } from '../../firebase/firebaseUtils.js';

/**
 * Represents an accounting account with Firebase integration.
 */
class Account extends BaseAccount {
    /**
     * Creates an instance of Account.
     * @param {Object} data - The data to initialize the account.
     * @param {string} [data.id] - The Firebase document ID, if already exists.
     * @param {string} data.userId - The ID of the user who owns the account.
     * @param {string} data.name - The name of the account.
     * @param {number} data.initialBalance - The initial balance of the account.
     * @param {boolean} data.isDebitPositive - Indicates if debit balances are positive.
     * @param {string} data.type - The type of the account (e.g., 'asset', 'liability').
     */
    constructor(originalData) {
        const { id, userId, type, name, initialBalance, isDebitPositive, data = {}, ...rest } = originalData
        super(name, initialBalance, isDebitPositive);
        this.id = id;
        this.userId = userId; // Add userId to the account properties
        this.type = type;
        this.data = {...data,...rest}
    }

    /**
     * Saves the current state of the account to Firebase.
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     */
    async save() {
        if (this.id) {
            await updateAccount(this.id, this.serialize());
        } else {
            this.id = await createAccount(this.serialize());
        }
    }

    /**
     * Deletes the account from Firebase.
     * @returns {Promise<void>} A promise that resolves when the account is deleted.
     * @throws {Error} If the account ID does not exist.
     */
        async delete() {
            if (!this.id) {
                throw new Error('Cannot delete an account without an ID.');
            }
    
            await deleteAccount(this.id);
        }

    /**
     * Serializes the account data for Firebase.
     * @returns {Object} The serialized data object.
     */
    serialize() {
        return {
            userId: this.userId,
            name: this.name,
            balance: this.getBalance(),
            isDebitPositive: this.isDebitPositive,
            type: this.type, // Include the type in the serialized data
            data: this.data
        };
    }
}

export { Account }