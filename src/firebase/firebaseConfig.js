// Importing Firebase libraries
import { initializeApp, getApps, getApp } from 'firebase/app';

/**
 * Initializes the Firebase application with given configuration.
 * @param {Object} config The Firebase configuration object.
 * @returns The initialized Firebase application.
 */
export function initFirebase(config) {
    if (!getApps().length) {  // Ensures Firebase is only initialized once
        return initializeApp(config);
    } else {
        console.log('Firebase is already initialized.');
        return getApp();  // Returns the already initialized Firebase app
    }
}

/**
 * Returns the current Firebase application instance.
 * @returns The Firebase application instance.
 */
export function getFirebaseApp() {
    if (!getApps().length) {
        throw new Error("Firebase is not initialized. Please call initFirebase first.");
    }
    return getApp();  // Returns the initialized Firebase app
}
