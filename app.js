// app.js

// 导入 Firebase 的 `auth` 对象和 `createUserWithEmailAndPassword` 方法
import { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword } from './firebase-config.js';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js';


// 获取 HTML 中的 DOM 元素
const registerBtn = document.getElementById('register-btn');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userEmailInput = document.getElementById('user-email');
const userPasswordInput = document.getElementById('user-password');
const authError = document.getElementById('auth-error');
const showFormBtn = document.getElementById('show-form');
const bookmarkForm = document.getElementById('bookmark-form');

// 获取 Firestore 数据库的引用
const bookmarksCollection = collection(db, 'bookmarks');

// 添加书签到数据库
const addBookmarkBtn = document.getElementById('add-bookmark');
console.log('addBookmarkBtn:', addBookmarkBtn); // 检查按钮是否正确获取到

// 获取网站的 Favicon URL
function getFaviconUrl(bookmarkUrl) {
    try {
        const url = new URL(bookmarkUrl); // 确保 URL 格式正确
        const domain = url.hostname;
        const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain_url=${domain}`;
        console.log('Favicon URL:', faviconUrl); // 输出 Favicon URL 进行调试
        return faviconUrl;
    } catch (error) {
        console.error('获取 Favicon URL 失败:', error);
        return ''; // 如果 URL 不正确，则返回空字符串
    }
}


// 页面加载时检查用户登录状态
onAuthStateChanged(auth, (user) => {
    if (user) {
        // 如果用户已登录，显示书签管理页面
        console.log('用户已登录：', user);
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('bookmark-container').style.display = 'block';
    } else {
        // 如果用户未登录，显示登录页面
        console.log('用户未登录');
        document.getElementById('auth-container').style.display = 'block';
        document.getElementById('bookmark-container').style.display = 'none';
    }
});


// 获取登出按钮
logoutBtn.addEventListener('click', () => {
    auth.signOut()
        .then(() => {
            console.log('用户已登出');
            // 显示登录页面
            document.getElementById('auth-container').style.display = 'block';
            document.getElementById('bookmark-container').style.display = 'none';
            alert('您已成功登出');
        })
        .catch((error) => {
            console.error('登出失败：', error.message);
            alert('登出失败，请重试');
        });
});


// 用户注册按钮点击事件
registerBtn.addEventListener('click', () => {
    const email = userEmailInput.value.trim();
    const password = userPasswordInput.value.trim();

    // 使用 createUserWithEmailAndPassword 方法进行注册
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log('用户注册成功：', userCredential.user);
            authError.textContent = 'Registration successful!'; // 显示成功信息
        })
        .catch((error) => {
            console.error('注册失败：', error.message); // 显示错误信息
            authError.textContent = error.message;
        });
});


// 用户登录按钮点击事件
loginBtn.addEventListener('click', () => {
    // 获取用户输入的邮箱和密码
    const email = userEmailInput.value.trim();
    const password = userPasswordInput.value.trim();

    // 检查 email 和 password 是否已定义并不为空
    if (email && password) {
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                console.log('登录成功');
                authError.textContent = ''; // 清空错误信息
                document.getElementById('auth-container').style.display = 'none';
                document.getElementById('bookmark-container').style.display = 'block';
                loadBookmarks(); // 加载书签
                
            })
            .catch((error) => {
                console.error('登录失败：', error.message); // 显示错误信息
                authError.textContent = error.message;
            });
    } else {
        console.error('Email 或 Password 为空');
        authError.textContent = '请输入有效的邮箱和密码';
    }

});


// 显示/隐藏添加书签表单
showFormBtn.addEventListener('click', () => {
    bookmarkForm.style.display = bookmarkForm.style.display === 'block' ? 'none' : 'block';
});


// 添加书签到 Firestore-云端数据库
addBookmarkBtn.addEventListener('click', async () => {
    const bookmarkName = document.getElementById('bookmark-name').value.trim();
    let bookmarkURL = document.getElementById('bookmark-url').value.trim();

    if (bookmarkName && bookmarkURL) {
        // 确保 URL 以 http:// 或 https:// 开头
        if (!bookmarkURL.startsWith('http://') && !bookmarkURL.startsWith('https://')) {
            bookmarkURL = 'http://' + bookmarkURL;
        }

        const faviconUrl = getFaviconUrl(bookmarkURL);

        console.log('Favicon URL:', faviconUrl); // 调试输出 Favicon URL

        try {
            // 将书签信息添加到 Firestore 数据库中
            await addDoc(bookmarksCollection, {
                name: bookmarkName,
                url: bookmarkURL,
                favicon: faviconUrl, // 将 Favicon URL 保存到数据库
                user: auth.currentUser.uid // 记录当前用户的 UID
            });
            console.log('书签添加成功');
            alert('书签添加成功');
            // 清空输入框
            document.getElementById('bookmark-name').value = '';
            document.getElementById('bookmark-url').value = '';
            // 加载书签到页面
            loadBookmarks();
        } catch (error) {
            console.error('书签添加失败：', error.message);
            alert('书签添加失败，请重试');
        }
    } else {
        alert('请输入书签名称和URL');
    }
});


// 从 Firestore 获取并显示书签
async function loadBookmarks() {
    const bookmarkList = document.getElementById('bookmark-list');
    bookmarkList.innerHTML = ''; // 清空当前显示的书签

    try {
        const querySnapshot = await getDocs(bookmarksCollection);
        querySnapshot.forEach((doc) => {
            const bookmarkData = doc.data();
            if (bookmarkData.user === auth.currentUser.uid) { // 只显示当前用户的书签
                const bookmarkItem = document.createElement('div');
                bookmarkItem.className = 'bookmark-item';

                // 如果 favicon 字段存在，则使用它，否则显示占位符
                const faviconSrc = bookmarkData.favicon || 'https://via.placeholder.com/32?text=?';
                bookmarkItem.innerHTML = `
                    <img src="${faviconSrc}" alt="favicon" class="bookmark-favicon">
                    <a href="${bookmarkData.url}" target="_blank" class="bookmark-name-link">
                        <h3 contenteditable="false" class="bookmark-name">${bookmarkData.name}</h3>
                    </a>
                    <button class="edit-bookmark" data-id="${doc.id}">Edit</button>
                    <button class="save-bookmark" data-id="${doc.id}" style="display: none;">Save</button>
                    <button class="delete-bookmark" data-id="${doc.id}">Delete</button>
                `;
                bookmarkList.appendChild(bookmarkItem);
            }
        });

        // 为编辑和删除按钮添加事件监听
        const editButtons = document.querySelectorAll('.edit-bookmark');
        const saveButtons = document.querySelectorAll('.save-bookmark');
        const deleteButtons = document.querySelectorAll('.delete-bookmark');

        editButtons.forEach(button => {
            button.addEventListener('click', handleEdit);
        });

        saveButtons.forEach(button => {
            button.addEventListener('click', handleSave);
        });

        deleteButtons.forEach(button => {
            button.addEventListener('click', handleDelete);
        });

    } catch (error) {
        console.error('加载书签失败：', error.message);
        alert('加载书签失败，请重试');
    }
}


// 编辑按钮点击事件
function handleEdit(event) {
    const bookmarkItem = event.target.closest('.bookmark-item');
    const bookmarkName = bookmarkItem.querySelector('.bookmark-name');
    const bookmarkLink = bookmarkItem.querySelector('.bookmark-name-link');


    // 添加一个一次性事件监听器，在编辑模式下防止点击链接跳转
    function preventLinkClick(e) {
        e.preventDefault(); // 阻止默认点击行为
    }
    bookmarkLink.addEventListener('click', preventLinkClick);

    bookmarkName.contentEditable = true; // 启用编辑模式
    bookmarkName.focus(); // 聚焦到编辑元素

    // 禁用链接点击
    bookmarkLink.style.pointerEvents = 'none'; // 禁用点击事件
    bookmarkLink.style.color = '#aaa'; // 可选：修改样式，显示不可点击状态

    // 切换按钮显示
    bookmarkItem.querySelector('.edit-bookmark').style.display = 'none';
    bookmarkItem.querySelector('.save-bookmark').style.display = 'block';

    // 在保存时移除事件监听器
    bookmarkItem.querySelector('.save-bookmark').addEventListener('click', () => {
        bookmarkLink.removeEventListener('click', preventLinkClick);
    });
}

// 保存按钮点击事件
function handleSave(event) {
    
    const bookmarkItem = event.target.closest('.bookmark-item');
    const bookmarkName = bookmarkItem.querySelector('.bookmark-name');
    const bookmarkLink = bookmarkItem.querySelector('.bookmark-name-link');
    const bookmarkId = event.target.dataset.id; // 获取书签的文档 ID

    const updatedName = bookmarkName.textContent.trim(); // 获取编辑后的书签名称

    bookmarkName.contentEditable = false; // 退出编辑模式

    // 恢复链接点击
    bookmarkLink.style.pointerEvents = 'auto'; // 启用点击事件
    bookmarkLink.style.color = ''; // 恢复原始样式

    // 切换按钮显示
    bookmarkItem.querySelector('.edit-bookmark').style.display = 'block';
    bookmarkItem.querySelector('.save-bookmark').style.display = 'none';

    // 更新数据库中的书签名称
    updateDoc(doc(db, 'bookmarks', bookmarkId), {
        name: updatedName
    })
    .then(() => {
        console.log('书签更新成功');
        alert('书签更新成功');
    })
    .catch(error => {
        console.error('书签更新失败:', error);
        alert('书签更新失败，请重试');
    });
}

//删除按钮
async function handleDelete(event) {
    const bookmarkId = event.target.getAttribute('data-id');
    try {
        // 删除书签数据
        const bookmarkRef = doc(db, 'bookmarks', bookmarkId);
        await deleteDoc(bookmarkRef);
        console.log('书签删除成功');
        alert('书签删除成功');
        loadBookmarks(); // 重新加载书签列表
    } catch (error) {
        console.error('书签删除失败：', error.message);
        alert('书签删除失败，请重试');
    }
}

