/* sidebar.css */
:root {
    --gold: #D4AF37;
    --bg-dark: #0a0a0a;
}

/* Sidebar Container */
.sidebar {
    position: fixed;
    top: 0;
    left: -280px; /* Hidden by default */
    width: 280px;
    height: 100%;
    background: var(--bg-dark);
    border-right: 1px solid #222;
    transition: 0.3s ease-in-out;
    z-index: 2000;
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}

.sidebar.active {
    left: 0;
    box-shadow: 10px 0 50px rgba(0,0,0,0.9);
}

/* Menu Trigger Button */
.menu-trigger {
    position: fixed;
    top: 15px;
    left: 15px;
    z-index: 1001;
    background: rgba(0,0,0,0.8);
    color: var(--gold);
    border: 1px solid var(--gold);
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 1.2rem;
    cursor: pointer;
    font-family: 'Goldman', sans-serif;
}

/* Header & Links */
.sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.sidebar-header .logo {
    color: var(--gold);
    font-family: 'Goldman', sans-serif;
    font-size: 1.5rem;
    font-weight: bold;
}

.close-btn {
    background: none;
    border: none;
    color: #888;
    font-size: 2rem;
    cursor: pointer;
}

.sidebar-links a {
    display: block;
    padding: 15px 0;
    color: #eee;
    text-decoration: none;
    font-size: 0.95rem;
    border-bottom: 1px solid #111;
    transition: 0.2s;
}

.sidebar-links a:hover {
    color: var(--gold);
    padding-left: 10px;
}

/* Footer & Logout */
.sidebar-footer {
    margin-top: auto;
    padding-top: 20px;
    border-top: 1px solid #222;
}

    // Inside your injectMenu function in menu.js
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            if (confirm("Logout from NEXUS?")) {
                // Check if firebaseAuth was made global in the main script
                if (window.firebaseAuth) {
                    window.firebaseAuth.signOut().then(() => {
                        window.location.href = "/login/";
                    });
                } else {
                    window.location.href = "/login/";
                }
            }
        };
    }

/* Dark Overlay */
.menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    display: none;
    z-index: 1999;
}

.menu-overlay.active {
    display: block;
}
