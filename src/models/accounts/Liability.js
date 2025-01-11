import { Account } from './Account.js';

/**
 * Represents a liability account with Firebase integration.
 * Liabilities typically have a credit balance, so isDebitPositive is set to false.
 * @extends {Account}
 */
class Liability extends Account {
    /**
     * Creates an instance of Liability.
     * @param {Object} data - The data to initialize the liability account.
     * @param {string} data.id - The Firebase document ID, if already exists.
     * @param {string} data.name - The name of the account.
     * @param {number} data.initialBalance - The initial balance of the account.
     * @param {string} data.userId - The ID of the user who owns the account.
     */
    constructor(data) {
        super({ ...data, type: 'liability', isDebitPositive: false });
    }
}

export { Liability };
