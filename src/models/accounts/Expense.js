import { Account } from './Account.js';

/**
 * Represents an expense account with Firebase integration.
 * Expenses typically have a debit balance, so isDebitPositive is set to true.
 * @extends {Account}
 */
class Expense extends Account {
    /**
     * Creates an instance of Expense.
     * @param {Object} data - The data to initialize the expense account.
     * @param {string} data.id - The Firebase document ID, if already exists.
     * @param {string} data.name - The name of the account.
     * @param {number} data.initialBalance - The initial balance of the account.
     * @param {string} data.userId - The ID of the user who owns the account.
     * @param {string} data.category - The category of the account.
     */
    constructor(data) {
        super({ ...data, type: 'expense', isDebitPositive: true });
    }
}

export { Expense };
