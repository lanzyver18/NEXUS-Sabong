// NEXUS OS HUD - Polished menu.js
import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

export function injectMenu() {
    if (document.getElementById('nexus-side-menu')) return;

    const currentPath = window.location.pathname;

    const menuHTML = `
        <div class="menu-overlay" id="nexus-menu-overlay"></div>
        <div id="nexus-side-menu" class="sidebar">
            
            <div class="sidebar-header">
                <div class="sidebar-logo">
                    NEXUS<span>OS</span>
                </div>
                <button id="menu-close-btn">&times;</button>
            </div>

            <div id="sidebar-user-box">
                <div class="sidebar-card">
                    <div class="sidebar-card-glow"></div>
                    <div class="card-row">
                        <div>
                            <small>Net Liquidity</small>
                            <div id="sidebar-balance">₱0.00</div>
                        </div>
                        <div id="sidebar-role-badge">PLAYER</div>
                    </div>
                    <div class="card-footer">
                        <div>ID: <span id="sidebar-id">---</span></div>
                        <div class="status-indicator"><span class="dot"></span> ONLINE</div>
                    </div>
                </div>
            </div>
            
            <div class="sidebar-links">
                <div class="menu-category">CORE INTERFACE</div>
                <a href="/" class="nav-link ${currentPath === '/' || currentPath === '/index.html' ? 'active' : ''}">
                    <span class="nav-icon">◈</span> Dashboard
                </a>
                <a href="/games/" class="nav-link ${currentPath.includes('/games/') ? 'active' : ''}">
                    <span class="nav-icon">🎮</span> Arena Games
                </a>
                <a href="/profile/" class="nav-link ${currentPath.includes('/profile/') ? 'active' : ''}">
                    <span class="nav-icon">👤</span> Security Profile
                </a>
                
                <div class="menu-category">FINANCIAL PROTOCOLS</div>
                <a href="/wallet/" class="nav-link ${currentPath.includes('/wallet/') ? 'active' : ''}">
                    <span class="nav-icon">💰</span> Nexus Wallet
                </a>
                <a href="/history/wallet.html" class="nav-link ${currentPath.includes('wallet.html') ? 'active' : ''}">
                    <span class="nav-icon">▤</span> Finance Logs
                </a>
                
                <div id="agent-manager-section"></div>

                <div class="menu-category">COMMUNICATIONS</div>
                <a href="https://t.me/" target="_blank" class="nav-link">
                    <span class="nav-icon">✈</span> Telegram Grid
                </a>
            </div>

            <div class="sidebar-footer">
                <button id="nexus-logout">TERMINATE SESSION</button>
                <div class="engine-ver">NEXUS ENGINE v2.6.4</div>
            </div>
        </div>
    `;

    // INJECTION LOGIC: Fixed stretching bug
    const nav = document.querySelector('.top-nav');
    if (nav) {
        // Create trigger if it doesn't exist
        if (!document.getElementById('menu-open-btn')) {
            nav.insertAdjacentHTML('afterbegin', `
                <button class="menu-trigger" id="menu-open-btn">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
            `);
        }
        // Append Sidebar to body (avoids nav layout inheritance)
        document.body.insertAdjacentHTML('beforeend', menuHTML);
    }

    const menu = document.getElementById('nexus-side-menu');
    const overlay = document.getElementById('nexus-menu-overlay');
    const openBtn = document.getElementById('menu-open-btn');
    const closeBtn = document.getElementById('menu-close-btn');

    const toggleMenu = (isOpen) => {
        menu.classList.toggle('active', isOpen);
        overlay.classList.toggle('active', isOpen);
        document.body.classList.toggle('menu-open', isOpen);
    };

    if (openBtn) openBtn.onclick = () => toggleMenu(true);
    if (closeBtn) closeBtn.onclick = () => toggleMenu(false);
    if (overlay) overlay.onclick = () => toggleMenu(false);

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
                    const balEl = document.getElementById('sidebar-balance');
                    const idEl = document.getElementById('sidebar-id');
                    const roleEl = document.getElementById('sidebar-role-badge');
                    
                    if (balEl) balEl.innerText = `₱${(data.balance || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}`;
                    if (idEl) idEl.innerText = data.username.toUpperCase();
                    if (roleEl) roleEl.innerText = data.role.replace("_", " ");
                    
                    const container = document.getElementById('agent-manager-section');
                    if (container && data.level <= 5) {
                        container.innerHTML = `
                            <div class="menu-category">MANAGEMENT</div>
                            <a href="/admin/agents.html" class="nav-link ${window.location.pathname.includes('agents') ? 'active' : ''}">
                                <span class="nav-icon">📊</span> Network Manager
                            </a>
                            ${data.level === 1 ? `
                                <a href="/admin/index.html" class="nav-link ${window.location.pathname.includes('index') ? 'active' : ''}" style="color: #00ff88; border-color: rgba(0,255,136,0.1);">
                                    <span class="nav-icon">⚡</span> Command Center
                                </a>
                            ` : ''}
                        `;
                    }
                }
            });
        }
    });
}
