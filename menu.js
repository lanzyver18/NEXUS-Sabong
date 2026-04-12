// menu.js
export function injectMenu() {
    // Check if it already exists to prevent duplicates
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
                <a href="/history/wallet.html">💰 Wallet History</a>
                <a href="/history/bets.html">📝 Bet History</a>
                <a href="/wallet/" style="color: #D4AF37;">📥 Cash-In / Out</a>
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
}
