import { Account } from './Account.js';

/**
 * Represents an asset account with Firebase integration.
 * Assets typically have a debit balance, so isDebitPositive is set to true.
 * @extends {Account}
 */
class Asset extends Account {
    /**
     * Creates an instance of Asset.
     * @param {Object} data - The data to initialize the asset account.
     * @param {string} data.id - The Firebase document ID, if already exists.
     * @param {string} data.name - The name of the account.
     * @param {number} data.initialBalance - The initial balance of the account.
     * @param {string} data.userId - The ID of the user who owns the account.
     */
    constructor(data) {
        super({ ...data, type: 'asset', isDebitPositive: true });
    }
}

export { Asset };
