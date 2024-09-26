// firebase-config.js

// 使用模块化语法导入 Firebase 模块
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js';

// Firebase 配置信息（请从 Firebase 控制台获取）
const firebaseConfig = {
  apiKey: "AIzaSyBcud7fjbO0kkZWK_TXp7cOGyqpp_0Fm64",
  authDomain: "bookmark-593c3.firebaseapp.com",
  projectId: "bookmark-593c3",
  storageBucket: "bookmark-593c3.appspot.com",
  messagingSenderId: "1035399975271",
  appId: "1:1035399975271:web:a843fc14973f98503e9fc2",
  // measurementId: "G-8J1GX33KL1"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 初始化 Firebase Auth 和 Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// 导出 createUserWithEmailAndPassword 和 signInWithEmailAndPassword 函数
export { createUserWithEmailAndPassword, signInWithEmailAndPassword };

// 调试输出，确保 Firebase 初始化成功
console.log("Firebase 初始化成功：", app);
console.log("Firebase Auth 对象：", auth);
console.log("Firebase Firestore 对象：", db);
