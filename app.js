// 获取 DOM 元素
const authContainer = document.getElementById('auth-container');
const bookmarkContainer = document.getElementById('bookmark-container');
const userEmailInput = document.getElementById('user-email');
const userPasswordInput = document.getElementById('user-password');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const authError = document.getElementById('auth-error');

const showFormBtn = document.getElementById('show-form');
const bookmarkForm = document.getElementById('bookmark-form');
const addBookmarkBtn = document.getElementById('add-bookmark');
const bookmarkNameInput = document.getElementById('bookmark-name');
const bookmarkUrlInput = document.getElementById('bookmark-url');
const bookmarkList = document.getElementById('bookmark-list');
const logoutBtn = document.getElementById('logout-btn');

// 用户登录
loginBtn.addEventListener('click', () => {
    const email = userEmailInput.value.trim();
    const password = userPasswordInput.value.trim();

    // Firebase 登录
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            authError.textContent = ''; // 登录成功
        })
        .catch((error) => {
            authError.textContent = error.message; // 显示错误信息
        });
});
// 确保 `auth` 和 `db` 对象在 `app.js` 中可用
console.log("在 app.js 中，Firebase Auth 对象：", window.auth);
console.log("在 app.js 中，Firebase Firestore 对象：", window.db);

// 用户注册
registerBtn.addEventListener('click', () => {
    const email = userEmailInput.value.trim();
    const password = userPasswordInput.value.trim();

    // Firebase 注册
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            authError.textContent = 'Registration successful!'; // 注册成功后提示
            console.log('User registered successfully:', userCredential.user);
        })
        .catch((error) => {
            authError.textContent = error.message; // 显示错误信息
        });
});

// 显示/隐藏添加书签表单
showFormBtn.addEventListener('click', () => {
    bookmarkForm.style.display = bookmarkForm.style.display === 'block' ? 'none' : 'block';
});

// 监听用户状态变化
auth.onAuthStateChanged((user) => {
    if (user) {
        // 用户已登录，显示书签管理界面
        authContainer.style.display = 'none';
        bookmarkContainer.style.display = 'block';
        renderBookmarks(user.uid); // 渲染当前用户的书签
    } else {
        // 用户未登录，显示登录/注册界面
        authContainer.style.display = 'block';
        bookmarkContainer.style.display = 'none';
    }
});

// 添加书签
addBookmarkBtn.addEventListener('click', () => {
    const name = bookmarkNameInput.value.trim();
    const url = bookmarkUrlInput.value.trim();
    const user = auth.currentUser;

    if (!name || !url) {
        alert('Please fill in both fields.'); // 验证输入
        return;
    }

    // 保存书签到 Firestore
    db.collection('bookmarks').add({
        userId: user.uid,
        name,
        url
    }).then(() => {
        bookmarkNameInput.value = ''; // 清空表单
        bookmarkUrlInput.value = '';
        bookmarkForm.style.display = 'none';
    }).catch((error) => {
        console.error('Error adding bookmark: ', error); // 错误处理
    });
});

// 渲染书签列表
function renderBookmarks(userId) {
    db.collection('bookmarks').where('userId', '==', userId)
        .onSnapshot((snapshot) => {
            bookmarkList.innerHTML = ''; // 清空当前书签列表
            snapshot.forEach((doc) => {
                const bookmark = doc.data();
                const bookmarkItem = document.createElement('div');
                bookmarkItem.className = 'bookmark-item';
                bookmarkItem.innerHTML = `
                    <a href="${bookmark.url}" target="_blank">${bookmark.name}</a>
                    <button onclick="deleteBookmark('${doc.id}')">Delete</button>
                `;
                bookmarkList.appendChild(bookmarkItem); // 添加到页面
            });
        });
}

// 删除书签
function deleteBookmark(id) {
    db.collection('bookmarks').doc(id).delete()
        .then(() => {
            console.log('Bookmark deleted successfully');
        })
        .catch((error) => {
            console.error('Error removing bookmark: ', error);
        });
}

// 用户退出登录
logoutBtn.addEventListener('click', () => {
    auth.signOut().then(() => {
        console.log('User logged out');
    }).catch((error) => {
        console.error('Error logging out: ', error);
    });
});

// app.js

// 确保 `auth` 和 `db` 对象已经定义
console.log("在 app.js 中，Firebase Auth 对象：", auth);
console.log("在 app.js 中，Firebase Firestore 对象：", db);

// 用户登录按钮点击事件
loginBtn.addEventListener('click', () => {
    const email = userEmailInput.value.trim();
    const password = userPasswordInput.value.trim();

    // Firebase 登录
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            console.log('用户登录成功');
            authError.textContent = ''; // 登录成功，清空错误信息
        })
        .catch((error) => {
            console.error('登录失败：', error.message); // 显示错误信息
            authError.textContent = error.message;
        });
});
