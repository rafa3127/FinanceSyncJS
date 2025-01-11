import { Account } from './Account.js';

/**
 * Represents an equity account with Firebase integration.
 * Equities typically have a credit balance, so isDebitPositive is set to false.
 * @extends {Account}
 */
class Equity extends Account {
    /**
     * Creates an instance of Equity.
     * @param {Object} data - The data to initialize the equity account.
     * @param {string} data.id - The Firebase document ID, if already exists.
     * @param {string} data.name - The name of the account.
     * @param {number} data.initialBalance - The initial balance of the account.
     * @param {string} data.userId - The ID of the user who owns the account.
     */
    constructor(data) {
        super({ ...data, type: 'equity', isDebitPositive: false });
    }
}

export { Equity };
