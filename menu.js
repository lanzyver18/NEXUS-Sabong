// menu.js
export function injectMenu() {
    if (document.getElementById('nexus-side-menu')) return;

    const menuHTML = `
        <button class="menu-trigger" id="menu-open-btn">☰</button>
        <div class="menu-overlay" id="nexus-menu-overlay"></div>
        <div id="nexus-side-menu" class="sidebar">
            <div class="sidebar-header">
                <div class="logo">NEXUS</div>
                <button class="close-btn" id="menu-close-btn" style="background:none; border:none; color:#888; font-size:2rem; cursor:pointer;">×</button>
            </div>
            <div class="sidebar-links">
                <a href="/">🏠 Home</a>
                <a href="/games/">🐓 Sabong Arena</a>
                <a href="/profile/">👤 My Profile</a>
                
                <hr style="border: 0; border-top: 1px solid #222; margin: 10px 0;">
                <p style="color: #444; font-size: 0.65rem; margin-left: 5px; letter-spacing: 1px;">RECORDS</p>
                
                <a href="/history/wallet.html">💰 Wallet History</a>
                <a href="/history/bets.html">📝 Bet History</a>
                
                <hr style="border: 0; border-top: 1px solid #222; margin: 10px 0;">
                <a href="/wallet/" style="color: #D4AF37;">📥 Cash-In / Out</a>
                
                <div id="agent-link-container"></div>
            </div>
            <div class="sidebar-footer">
                <button id="nexus-logout" class="logout-btn">🚪 Logout Session</button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', menuHTML);

    const menu = document.getElementById('nexus-side-menu');
    const overlay = document.getElementById('nexus-menu-overlay');
    const openBtn = document.getElementById('menu-open-btn');
    const closeBtn = document.getElementById('menu-close-btn');
    const logoutBtn = document.getElementById('nexus-logout');

    // Sidebar Toggle Logic
    openBtn.onclick = () => {
        menu.classList.add('active');
        overlay.classList.add('active');
    };

    const close = () => {
        menu.classList.remove('active');
        overlay.classList.remove('active');
    };

    closeBtn.onclick = close;
    overlay.onclick = close;

    // Logout Action
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            if (confirm("Logout from NEXUS?")) {
                if (window.firebaseAuth) {
                    window.firebaseAuth.signOut().then(() => window.location.href = "/login/");
                } else {
                    window.location.href = "/login/";
                }
            }
        };
    }

    // Role-Based Menu (Optional: Show Agent Manager if not a Player)
    checkRoleForMenu();
}

async function checkRoleForMenu() {
    // We wait for the Firebase Auth to be ready
    if (window.firebaseAuth) {
        window.firebaseAuth.onAuthStateChanged(async (user) => {
            if (user) {
                // You can pull the role from a global variable or fetch it here
                // For now, this is a placeholder to show how to add the Agent Manager link
                const container = document.getElementById('agent-link-container');
                if (container) {
                    // If you want to show the Agent link to everyone except PLAYERS:
                    // container.innerHTML = `<a href="/admin/agents.html" style="color: #00ff88;">👥 Agent Manager</a>`;
                }
            }
        });
    }
}
