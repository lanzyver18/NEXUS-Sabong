// NEXUS OS HUD - Polished menu.js
import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

export function injectMenu() {
    if (document.getElementById('nexus-side-menu')) return;

    const currentPath = window.location.pathname;

    const menuHTML = `
        <div class="menu-overlay" id="nexus-menu-overlay"></div>
        <div id="nexus-side-menu" class="sidebar">
            
            <div class="sidebar-header" style="padding: 40px 25px 25px; display: flex; justify-content: space-between; align-items: center;">
                <div style="color:#D4AF37; font-family:'Goldman'; font-size:1.4rem; font-weight:bold; letter-spacing:4px; display: flex; align-items: center;">
                    NEXUS<span style="color:#fff; opacity:0.2; font-size: 0.8rem; margin-left: 5px;">OS</span>
                </div>
                <button id="menu-close-btn" style="background:rgba(255,255,255,0.05); border:1px solid #222; color:#555; width: 35px; height: 35px; border-radius: 50%; cursor:pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">&times;</button>
            </div>

            <div id="sidebar-user-box" style="padding: 0 20px 25px; margin-bottom: 10px;">
                <div style="background: #080808; border: 1px solid #1a1a1a; padding: 20px; border-radius: 20px; position:relative; box-shadow: inset 0 0 20px rgba(0,0,0,0.5);">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:15px;">
                        <div>
                            <small style="color: #444; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 2px; display:block; margin-bottom:6px;">Net Liquidity</small>
                            <div id="sidebar-balance" style="color: #00ff88; font-family: 'Goldman'; font-size: 1.5rem; text-shadow: 0 0 15px rgba(0,255,136,0.2);">₱0.00</div>
                        </div>
                        <div id="sidebar-role-badge" style="font-size:0.55rem; background:var(--gold); color:#000; padding:4px 10px; border-radius:6px; font-weight:bold; font-family:'Goldman'; box-shadow: 0 4px 10px rgba(212,175,55,0.2);">PLAYER</div>
                    </div>
                    <div style="display:flex; justify-content:space-between; border-top:1px solid #151515; padding-top:12px;">
                        <div style="font-size:0.6rem; color:#444; font-family:'Goldman';">ID: <span id="sidebar-id" style="color:#888;">---</span></div>
                        <div style="font-size:0.6rem; color:#00ff88; font-family:'Goldman'; display: flex; align-items: center;">
                            <span style="width: 6px; height: 6px; background: #00ff88; border-radius: 50%; margin-right: 5px; display: inline-block; box-shadow: 0 0 8px #00ff88;"></span> ONLINE
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="sidebar-links" style="padding: 0 15px;">
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

            <div class="sidebar-footer" style="padding: 20px; border-top:1px solid #111; background:#030303; margin-top: auto;">
                <button id="nexus-logout" style="width:100%; padding:16px; border-radius:14px; background:rgba(255, 68, 68, 0.05); color:#ff4444; border:1px solid rgba(255, 68, 68, 0.1); font-size:0.75rem; font-weight:bold; cursor:pointer; transition: 0.3s; font-family:'Goldman'; letter-spacing:2px;">TERMINATE SESSION</button>
                <div style="text-align:center; color:#1a1a1a; font-size:0.5rem; margin-top:15px; letter-spacing:3px; font-weight: bold;">NEXUS ENGINE v2.6.4</div>
            </div>
        </div>
    `;

    // INJECTION LOGIC: Fixed overlapping burger button
    const nav = document.querySelector('.top-nav');
    if (nav) {
        // Remove old burger if it exists
        const oldBtn = document.getElementById('menu-open-btn');
        if (oldBtn) oldBtn.remove();
        
        nav.insertAdjacentHTML('afterbegin', `
            <button class="menu-trigger" id="menu-open-btn" style="position: relative; left: 0; top: 0; transform: none; margin-right: 15px;">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
        `);
        document.body.insertAdjacentHTML('beforeend', menuHTML);
    }

    // Logic for opening/closing
    const menu = document.getElementById('nexus-side-menu');
    const overlay = document.getElementById('nexus-menu-overlay');
    const openBtn = document.getElementById('menu-open-btn');
    const closeBtn = document.getElementById('menu-close-btn');

    const toggleMenu = (isOpen) => {
        menu.classList.toggle('active', isOpen);
        overlay.classList.toggle('active', isOpen);
    };

    openBtn.onclick = () => toggleMenu(true);
    closeBtn.onclick = () => toggleMenu(false);
    overlay.onclick = () => toggleMenu(false);

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
                    document.getElementById('sidebar-id').innerText = data.username.toUpperCase();
                    document.getElementById('sidebar-role-badge').innerText = data.role.replace("_", " ");
                    
                    const container = document.getElementById('agent-manager-section');
                    if (container && data.level <= 5) {
                        container.innerHTML = `
                            <div class="menu-category">MANAGEMENT</div>
                            <a href="/admin/agents.html" class="nav-link ${window.location.pathname.includes('agents') ? 'active' : ''}">
                                <span class="nav-icon">📊</span> Network Manager
                            </a>
                            ${data.level === 1 ? `
                                <a href="/admin/index.html" class="nav-link ${window.location.pathname.includes('index') ? 'active' : ''}" style="color: #00ff88;">
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
