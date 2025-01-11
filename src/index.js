// CLASSES
import { Account } from './models/accounts/Account.js';
import { Asset } from './models/accounts/Asset.js';
import { Liability } from './models/accounts/Liability.js';
import { Equity } from './models/accounts/Equity.js';
import { Income } from './models/accounts/Income.js';
import { Expense } from './models/accounts/Expense.js';
import { initFirebase, getFirebaseApp } from './firebase/firebaseConfig.js';

//SERVICES
import { listAccounts, getAccountById } from './services/accountService.js';

//TRANSACTIONS
import { JournalEntry  } from './models/transactions/JournalEntry.js';


const firebase = { initFirebase, getFirebaseApp }

const transactions = {
    JournalEntry
}

const srv = {
    listAccounts,
    getAccountById
}

export {
    Account,
    Asset,
    Equity,
    Expense,
    Income,
    Liability,
    firebase,
    transactions,
    srv
}


