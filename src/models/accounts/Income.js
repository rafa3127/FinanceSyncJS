import { Account } from './Account.js';

/**
 * Represents an income account with Firebase integration.
 * Income typically has a credit balance, so isDebitPositive is set to false.
 * @extends {Account}
 */
class Income extends Account {
    /**
     * Creates an instance of Income.
     * @param {Object} data - The data to initialize the income account.
     * @param {string} data.id - The Firebase document ID, if already exists.
     * @param {string} data.name - The name of the account.
     * @param {number} data.initialBalance - The initial balance of the account.
     * @param {string} data.userId - The ID of the user who owns the account.
     * @param {string} data.category - The category of the account.
     */
    constructor(data) {
        super({ ...data, type: 'income', isDebitPositive: false });
    }
}

export { Income };
