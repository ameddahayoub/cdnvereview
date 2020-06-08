var firebaseConfig = {
    apiKey: "AIzaSyC3fOGWSafYmB1CKM8rDh_kVDHA08h6dRw",
    authDomain: "vereview.firebaseapp.com",
    databaseURL: "https://vereview.firebaseio.com",
    projectId: "vereview",
    storageBucket: "vereview.appspot.com",
    messagingSenderId: "278465510459",
    appId: "1:278465510459:web:cdda6a9ab3560f7700f01e",
    measurementId: "G-VCJ7449BLG"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Make auth and firestore references
const auth = firebase.auth();
const db = firebase.firestore();
var sessionUser;