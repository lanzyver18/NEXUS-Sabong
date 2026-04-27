import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

export function injectMenu() {
    if (document.getElementById('nexus-bottom-nav')) return;

    const currentPath = window.location.pathname;

    const bottomNavHTML = `
        <div class="bottom-nav" id="nexus-bottom-nav">
            <a href="/" class="nav-item ${currentPath === '/' ? 'active' : ''}">
                <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                <span>HOME</span>
            </a>
            <a href="/games/" class="nav-item ${currentPath.includes('/games/') ? 'active' : ''}">
                <svg viewBox="0 0 24 24"><path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
                <span>GAMES</span>
            </a>
            <a href="/wallet/" class="nav-item ${currentPath.includes('/wallet/') ? 'active' : ''}" style="color: #00ff88;">
                <svg viewBox="0 0 24 24"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
                <span>WALLET</span>
            </a>
            <a href="/profile/" class="nav-item ${currentPath.includes('/profile/') ? 'active' : ''}">
                <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                <span>PROFILE</span>
            </a>
            <div class="nav-item" id="menu-open-btn" style="cursor:pointer;">
                <svg viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
                <span>MORE</span>
            </div>
        </div>

        <div class="menu-overlay" id="nexus-menu-overlay"></div>
        
        <div id="nexus-side-menu" class="sidebar">
            <div style="padding: 40px 25px 20px; display: flex; justify-content: space-between; align-items: center;">
                <div style="color:var(--gold); font-family:'Goldman'; font-size:1.2rem; font-weight:bold; letter-spacing:2px;">NEXUS SYSTEM</div>
                <button id="menu-close-btn" style="background:none; border:none; color:#444; font-size:1.8rem; cursor:pointer;">&times;</button>
            </div>

            <div id="sidebar-user-box" style="padding: 0 25px 25px; border-bottom: 1px solid #111; margin-bottom: 15px;">
                <div style="background: #0a0a0a; border: 1px solid #1a1a1a; padding: 15px; border-radius: 12px;">
                    <small style="color: #444; font-size: 0.5rem; text-transform: uppercase; letter-spacing: 1px;">AVAILABLE BALANCE</small>
                    <div id="sidebar-balance" style="color: #00ff88; font-family: 'Goldman'; font-size: 1.4rem;">₱0.00</div>
                    <div style="display:flex; justify-content:space-between; margin-top:10px; font-size:0.6rem; color:#444;">
                        <span id="sidebar-id">ID: ---</span>
                        <span id="sidebar-role-badge" style="color:var(--gold);">PLAYER</span>
                    </div>
                </div>
            </div>
            
            <div class="sidebar-links" style="padding: 0 25px; overflow-y: auto;">
                <div class="menu-category" style="color:#333; font-size:0.6rem; letter-spacing:2px; margin-bottom:10px;">RECORDS</div>
                <a href="/history/wallet.html" style="display:block; color:#888; text-decoration:none; padding:12px 0; border-bottom:1px solid #111; font-size:0.8rem;">Financial Logs</a>
                <a href="/history/bets.html" style="display:block; color:#888; text-decoration:none; padding:12px 0; border-bottom:1px solid #111; font-size:0.8rem;">Betting History</a>
                
                <div id="agent-manager-section"></div>

                <div class="menu-category" style="color:#333; font-size:0.6rem; letter-spacing:2px; margin: 20px 0 10px;">SUPPORT</div>
                <a href="https://t.me/" target="_blank" style="display:block; color:#888; text-decoration:none; padding:12px 0; border-bottom:1px solid #111; font-size:0.8rem;">Telegram Official</a>
            </div>

            <div style="padding: 20px; margin-top:auto; border-top:1px solid #111;">
                <button id="nexus-logout" style="width:100%; padding:14px; border-radius:10px; background:rgba(255, 68, 68, 0.05); color:#ff4444; border:1px solid rgba(255, 68, 68, 0.1); font-size:0.7rem; font-weight:bold; cursor:pointer; font-family:'Goldman';">LOGOUT SESSION</button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', bottomNavHTML);

    const menu = document.getElementById('nexus-side-menu');
    const overlay = document.getElementById('nexus-menu-overlay');
    const openBtn = document.getElementById('menu-open-btn');
    const closeBtn = document.getElementById('menu-close-btn');
    const logoutBtn = document.getElementById('nexus-logout');

    const toggleMenu = (isOpen) => {
        menu.classList.toggle('active', isOpen);
        overlay.classList.toggle('active', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : ''; 
    };

    openBtn.onclick = () => toggleMenu(true);
    closeBtn.onclick = () => toggleMenu(false);
    overlay.onclick = () => toggleMenu(false);

    if (logoutBtn) {
        logoutBtn.onclick = () => {
            if (confirm("Terminate Nexus Session?")) {
                if (window.firebaseAuth) window.firebaseAuth.signOut().then(() => window.location.href = "/login/");
                else window.location.href = "/login/";
            }
        };
    }

    syncSidebarData();
}

async function syncSidebarData() {
    const auth = window.firebaseAuth;
    const db = window.firebaseDb;
    if (!auth || !db) return setTimeout(syncSidebarData, 500);

    auth.onAuthStateChanged(user => {
        if (user) {
            onSnapshot(doc(db, "users", user.uid), (snap) => {
                if (snap.exists()) {
                    const data = snap.data();
                    document.getElementById('sidebar-balance').innerText = `₱${(data.balance || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}`;
                    document.getElementById('sidebar-id').innerText = `ID: ${data.username.toUpperCase()}`;
                    document.getElementById('sidebar-role-badge').innerText = data.role.replace("_", " ");
                    
                    const container = document.getElementById('agent-manager-section');
                    if (container && data.level <= 5) {
                        container.innerHTML = `
                            <div class="menu-category" style="color:#333; font-size:0.6rem; letter-spacing:2px; margin:20px 0 10px;">MANAGEMENT</div>
                            <a href="/admin/agents.html" style="display:block; color:var(--gold); text-decoration:none; padding:12px 0; border-bottom:1px solid #111; font-size:0.8rem; font-weight:bold;">Network Manager</a>
                            ${data.level === 1 ? `<a href="/admin/index.html" style="display:block; color:#00ff88; text-decoration:none; padding:12px 0; border-bottom:1px solid #111; font-size:0.8rem;">Command Center</a>` : ''}
                        `;
                    }
                }
            });
        }
    });
}
