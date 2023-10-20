// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: "upload-img-plagin.firebaseapp.com",
    projectId: "upload-img-plagin",
    storageBucket: "upload-img-plagin.appspot.com",
    messagingSenderId: "882384709175",
    appId: "1:882384709175:web:f8d34ea8c8f2bdef7741b2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);


// request.resource.size < 2 * 1024 * 1024 &&
//     request.resource.contentType.matchc('image/.*')