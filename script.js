document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Real-time Clock ---
    const dateTimeDisplay = document.getElementById('current-date-time');
    function updateTime() {
        const now = new Date();
        dateTimeDisplay.textContent = now.toLocaleString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    }
    setInterval(updateTime, 1000);
    updateTime();

    // --- 2. Element Variables ---
    const authContainer = document.getElementById('auth-container');
    const mainContent = document.getElementById('main-content');
    const userInfo = document.getElementById('user-info');
    const welcomeMsg = document.getElementById('welcome-msg');
    
    const showLoginBtn = document.getElementById('show-login');
    const showSignupBtn = document.getElementById('show-signup');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    // Load registered users from local storage
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // --- 3. Toggle Forms Logic ---
    showLoginBtn.addEventListener('click', () => {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        showLoginBtn.classList.add('active');
        showSignupBtn.classList.remove('active');
    });

    showSignupBtn.addEventListener('click', () => {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        showSignupBtn.classList.add('active');
        showLoginBtn.classList.remove('active');
    });

    // --- 4. Session State Management ---
    function checkLoginStatus() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            // User is logged in: show features, hide auth
            authContainer.style.display = 'none';
            mainContent.style.display = 'grid'; 
            userInfo.style.display = 'block';
            welcomeMsg.textContent = `Welcome, ${currentUser}!`;
        } else {
            // User is NOT logged in: show auth, hide features
            authContainer.style.display = 'block';
            mainContent.style.display = 'none';
            userInfo.style.display = 'none';
        }
    }

    // --- 5. Sign Up Logic ---
    document.getElementById('signup-btn').addEventListener('click', () => {
        const username = document.getElementById('signup-username').value.trim();
        const password = document.getElementById('signup-password').value.trim();
        const errorDisplay = document.getElementById('signup-error');
        const successDisplay = document.getElementById('signup-success');
        
        errorDisplay.textContent = '';
        successDisplay.textContent = '';

        if (!username || !password) {
            errorDisplay.textContent = 'Please fill in all fields.';
            return;
        }

        // Check if user already exists
        if (users.some(user => user.username === username)) {
            errorDisplay.textContent = 'Username already exists.';
            return;
        }

        // Save new user
        users.push({ username, password });
        localStorage.setItem('users', JSON.stringify(users));
        successDisplay.textContent = 'Account created successfully! Switching to login...';
        
        document.getElementById('signup-username').value = '';
        document.getElementById('signup-password').value = '';
        
        // Auto-switch to login tab after brief pause
        setTimeout(() => showLoginBtn.click(), 1500);
    });

    // --- 6. Login Logic ---
    document.getElementById('login-btn').addEventListener('click', () => {
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value.trim();
        const errorDisplay = document.getElementById('login-error');
        
        errorDisplay.textContent = '';

        // Validate credentials
        const validUser = users.find(u => u.username === username && u.password === password);
        
        if (validUser) {
            localStorage.setItem('currentUser', username);
            document.getElementById('login-username').value = '';
            document.getElementById('login-password').value = '';
            checkLoginStatus(); // Update view
        } else {
            errorDisplay.textContent = 'Invalid username or password.';
        }
    });

    // --- 7. Logout Logic ---
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        checkLoginStatus(); // Reverts view to auth screen
    });

    // Check status immediately when the page loads
    checkLoginStatus();
});