// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";
// Firebase 配置信息（请用你的项目配置信息替换）
const firebaseConfig = {
    apiKey: "AIzaSyBcud7fjbO0kkZWK_TXp7cOGyqpp_0Fm64",
    authDomain: "bookmark-593c3.firebaseapp.com",
    projectId: "bookmark-593c3",
    storageBucket: "bookmark-593c3.appspot.com",
    messagingSenderId: "1035399975271",
    appId: "1:1035399975271:web:a843fc14973f98503e9fc2",
    measurementId: "G-8J1GX33KL1"
  };

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);

// 初始化 Firebase Auth 和 Firestore
const auth = firebase.auth();
const db = firebase.firestore();

// 输出调试信息，确保 Firebase 已成功初始化
console.log("Firebase 初始化成功：", firebase);
console.log("Firebase Auth 对象：", window.auth);
console.log("Firebase Firestore 对象：", window.db);
