# FinanceSyncJS

[![NPM Version](https://img.shields.io/npm/v/financesyncjs.svg)](https://www.npmjs.com/package/financesyncjs)
[![License](https://img.shields.io/npm/l/financesyncjs.svg)](https://github.com/rafa3127/FinanceSyncJS/blob/main/LICENSE)
JavaScript library extending [balance-book-js](https://github.com/rafa3127/BalanceBookJS) to add **data persistence and synchronization** for accounting objects using Google Firebase (Firestore).

## Features

* Object-Oriented models (`Account`, `Transaction`, etc.) inheriting from `balance-book-js`.
* **Data Persistence:** Models can save, update, and delete themselves in Firestore via methods (`.save()`, `.delete()`).
* **Service Functions for Reading:** Provides service functions to query and retrieve model instances from Firestore (`getAccountById`, `listAccounts`, etc.).
* **Internal Firebase Initialization:** Handles Firebase app setup internally.
* Asynchronous operations using Promises (`async/await`) for all database interactions.

## Core Concepts

`FinanceSyncJS` provides:

* **Models:** Classes like `Account`, `Asset`, `Liability`, `Equity`, `Income`, `Expense`, and `JournalEntry`. These objects hold your accounting data and contain methods to interact with Firestore (save, delete). They inherit core logic from `balance-book-js`.
* **Services:** Functions focused on reading and querying data from Firestore, returning instances of the corresponding Models (e.g., `getAccountById`, `listAccounts`).
* **Initialization:** A function (`initFirebase`) to configure the Firebase connection once for the library.

## Prerequisites

* Node.js (LTS recommended)
* npm
* A Google account and a **Firebase** project with **Firestore** enabled.
* `balance-book-js` (Installed as a dependency of `FinanceSyncJS`).

## Installation

```bash
npm install financesyncjs firebase
```
*Note: `firebase` SDK is required for configuration. `balance-book-js` should be installed automatically as a dependency.*

## Firebase Setup

You only need to provide your Firebase project configuration once when your application starts.

**1. Get Firebase Configuration:** Obtain the `firebaseConfig` object from your Firebase project settings.

**2. Initialize `FinanceSyncJS`:** Call `initFirebase` at the start of your application, passing your configuration.

   ```javascript
   import { initFirebase } from 'financesyncjs';

   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     // ... other config properties
   };

   // Call this once when your application starts
   initFirebase(firebaseConfig);

   // Now the library is configured to interact with Firebase.
   ```
   *Handle your credentials securely (e.g., using environment variables).*

## API Reference

All listed functions and classes are imported directly from `financesyncjs`.

### Initialization

* **`initFirebase(firebaseConfig)`**: Initializes the Firebase application instance used internally by the library. Must be called once before using Models or Services. Takes your Firebase project configuration object. Returns the Firebase App instance.
* **`getFirebaseApp()`**: Returns the currently initialized Firebase App instance if needed, or throws an error if `initFirebase` hasn't been called.

### Models

Objects representing your accounting data, with methods for persistence.

* **`Account` (Base Class)**
    * Inherits from `balance-book-js.Account`.
    * `constructor(data)`: Creates an instance. `data` object includes `id?`, `userId`, `type`, `name`, `initialBalance` or `balance`, `isDebitPositive`, and optional `data` for extra fields.
    * `.id` (string | undefined): Firestore document ID. Set after first `.save()` if new.
    * `.userId` (string): Identifier for the user owning the account.
    * `.type` (string): Account type ('asset', 'liability', etc.).
    * `.name` (string): Account name.
    * `.isDebitPositive` (boolean): Inherited.
    * `.data` (object): Stores additional custom data.
    * `.getBalance()`: Inherited method.
    * `async .save()`: Creates the account in Firestore if it's new (no `id`), or updates it if an `id` exists. Sets the `id` property after creation. Returns `Promise<void>`.
    * `async .delete()`: Deletes the account from Firestore. Requires `id` to be set. Returns `Promise<void>`.
    * `.serialize()`: Returns a plain object representation suitable for Firestore.

* **`Asset`, `Liability`, `Equity`, `Income`, `Expense` (Subclasses)**
    * Inherit from `Account`.
    * Constructors typically take `data` (like `Account`'s constructor but without `type` and `isDebitPositive`, as these are preset) and call `super()` with the correct type and `isDebitPositive` value.
    * Inherit `.save()`, `.delete()`, etc., from `Account`.

* **`JournalEntry`**
    * Inherits from `balance-book-js.JournalEntry`.
    * `constructor(data)`: Creates an instance. `data` object includes `id?`, `userId`, `description`, `date?` (defaults to `new Date()`), and optional `data` for extra fields.
    * `.id` (string | undefined): Firestore document ID. Set after first `.save()` if new.
    * `.userId` (string): Identifier for the user owning the entry.
    * `.description` (string): Inherited.
    * `.date` (Date): Inherited.
    * `.entries` (Array): Inherited array of entry objects.
    * `.data` (object): Stores additional custom data.
    * `async .save()`: Creates the journal entry in Firestore if new, or updates if `id` exists. Serializes entries including `accountId`. Sets `id` property after creation. Returns `Promise<void>`.
    * `async .addEntryById(accountId, amount, type)`: Fetches the `Account` instance using `getAccountById` service, then adds the entry using the base class logic. Returns `Promise<void>`.
    * `.serialize()`: Returns a plain object representation for Firestore, mapping entries to `{ accountId, amount, type }`.
    * Other inherited methods: `.addEntry()`, `.getDebitTotal()`, `.getCreditTotal()`, `.isValid()`.

### Services (Read Operations)

Functions to query and retrieve data from Firestore, returning Model instances.

* **`getAccountById(accountId)`**: Fetches a specific account by its Firestore ID. Returns `Promise<Account>`. Throws error if not found.
* **`listAccounts(filters?)`**: Retrieves an array of accounts matching the filters. `filters` is an object (e.g., `{ userId: '...', type: 'asset' }`). Returns `Promise<Account[]>`.
* **`getJournalEntryById(journalEntryId)`**: Fetches a specific journal entry by its Firestore ID. Returns `Promise<JournalEntry>`. Throws error if not found.
* **`listJournalEntries(filters?)`**: Retrieves an array of journal entries matching the filters. `filters` is an object (e.g., `{ userId: '...' }`). Returns `Promise<JournalEntry[]>`.

## Basic Usage Workflow Example

```javascript
import {
    initFirebase,
    Account, // Or Asset, Liability etc.
    JournalEntry,
    getAccountById,
    listAccounts
} from 'financesyncjs';

// 1. Initialize Library (once at app start)
const firebaseConfig = { /* ... */ };
initFirebase(firebaseConfig);

// --- Sometime later in your application ---

async function manageAccounting() {
    const userId = 'user-123'; // Example User ID

    try {
        // 2. Create a new Account instance
        const cashAccount = new Account({
            userId: userId,
            name: 'Main Cash',
            type: 'asset', // Explicitly set type for base Account class
            isDebitPositive: true,
            initialBalance: 500,
            data: { notes: 'Primary checking' }
        });

        // 3. Save the new account to Firestore
        await cashAccount.save(); // Creates the document and sets cashAccount.id
        console.log('Cash account saved with ID:', cashAccount.id);

        // 4. Create a new Journal Entry instance
        const incomeEntry = new JournalEntry({
            userId: userId,
            description: 'Received payment for services',
            date: new Date()
        });

        // 5. Add entries by Account ID (uses getAccountById internally)
        const incomeAccountId = 'some-income-account-id'; // Assume this ID exists
        await incomeEntry.addEntryById(cashAccount.id, 150, 'debit'); // Debit Cash
        await incomeEntry.addEntryById(incomeAccountId, 150, 'credit'); // Credit Income

        // 6. Save the Journal Entry to Firestore
        if (incomeEntry.isValid()) { // Check balance from base class
            await incomeEntry.save();
            console.log('Income journal entry saved with ID:', incomeEntry.id);
        } else {
            console.error('Journal entry is not balanced!');
        }

        // 7. Retrieve an account using a service
        const fetchedAccount = await getAccountById(cashAccount.id);
        console.log('Fetched Account Name:', fetchedAccount.name);
        console.log('Fetched Account Balance:', fetchedAccount.getBalance()); // Use inherited method

        // 8. List all asset accounts for the user
        const assetAccounts = await listAccounts({ userId: userId, type: 'asset' });
        console.log(`Found ${assetAccounts.length} asset accounts.`);

        // 9. Update an account
        fetchedAccount.data.notes = 'Updated notes'; // Modify the instance
        await fetchedAccount.save(); // Updates the existing document in Firestore
        console.log('Account updated.');

    } catch (error) {
        console.error('An accounting operation failed:', error);
    }
}

manageAccounting();
```

## Error Handling

Model methods (`.save`, `.delete`, `.addEntryById`) and Service functions return Promises. Use `try...catch` with `async/await` or `.catch()` to handle potential errors from Firebase or validation.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.