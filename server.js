// Import the Firebase SDK
const firebase = require('firebase/app');
require('firebase/database');

// Configure your Firebase project
const firebaseConfig = {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_AUTH_DOMAIN',
    databaseURL: 'YOUR_DATABASE_URL',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_STORAGE_BUCKET',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID'
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the Firebase database
const database = firebase.database();

// Now you can start using the Firebase database
// For example, you can read data from the database
database.ref('movies').once('value')
    .then(snapshot => {
        const movies = snapshot.val();
        console.log(movies);
    })
    .catch(error => {
        console.error('Error reading data:', error);
    });


    
