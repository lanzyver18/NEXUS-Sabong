// NEXUS OS HUD - menu.js
import { doc, onSnapshot, getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

export function injectMenu() {
    if (document.getElementById('nexus-side-menu')) return;

    const currentPath = window.location.pathname;

    const menuHTML = `
        <button class="menu-trigger" id="menu-open-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <div class="menu-overlay" id="nexus-menu-overlay"></div>
        <div id="nexus-side-menu" class="sidebar">
            
            <div class="sidebar-header" style="padding: 35px 25px 20px; position:relative;">
                <div style="color:#D4AF37; font-family:'Goldman'; font-size:1.4rem; font-weight:bold; letter-spacing:4px;">NEXUS<span style="color:#fff; opacity:0.2;">OS</span></div>
                <button id="menu-close-btn" style="position:absolute; right:20px; top:32px; background:none; border:none; color:#444; font-size:1.5rem; cursor:pointer;">&times;</button>
            </div>

            <div id="sidebar-user-box" style="padding: 0 25px 25px; border-bottom: 1px solid #111; margin-bottom: 10px;">
                <div style="background: linear-gradient(145deg, #0a0a0a, #050505); border: 1px solid #1a1a1a; padding: 18px; border-radius: 16px; position:relative; overflow:hidden;">
                    <div style="position:absolute; top:0; left:0; width:3px; height:100%; background:var(--gold);"></div>
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                        <div>
                            <small style="color: #444; font-size: 0.5rem; text-transform: uppercase; letter-spacing: 2px; display:block; margin-bottom:4px;">Available Liquidity</small>
                            <div id="sidebar-balance" style="color: #00ff88; font-family: 'Goldman'; font-size: 1.4rem; letter-spacing:-1px;">₱0.00</div>
                        </div>
                        <div id="sidebar-role-badge" style="font-size:0.5rem; background:#D4AF37; color:#000; padding:2px 8px; border-radius:4px; font-weight:bold; font-family:'Goldman';">PLAYER</div>
                    </div>
                    <div style="display:flex; justify-content:space-between; border-top:1px solid #111; pt:10px; margin-top:10px; padding-top:10px;">
                        <div style="font-size:0.6rem; color:#444;">ID: <span id="sidebar-id" style="color:#888; font-family:monospace;">---</span></div>
                        <div style="font-size:0.6rem; color:#444;">STATUS: <span style="color:#00ff88;">ONLINE</span></div>
                    </div>
                </div>
            </div>
            
            <div class="sidebar-links">
                <div class="menu-category">CORE INTERFACE</div>
                <a href="/" class="${currentPath === '/' || currentPath === '/index.html' ? 'active' : ''}">
                    <span style="margin-right:12px;">◈</span> Dashboard
                </a>
                <a href="/games/" class="${currentPath.includes('/games/') ? 'active' : ''}">
                    <span style="margin-right:12px;">🎮</span> Arena Games
                </a>
                <a href="/profile/" class="${currentPath.includes('/profile/') ? 'active' : ''}">
                    <span style="margin-right:12px;">👤</span> Security Profile
                </a>
                
                <div class="menu-category">FINANCIAL PROTOCOLS</div>
                <a href="/wallet/" class="${currentPath.includes('/wallet/') ? 'active' : ''}" style="border-left: 2px solid var(--gold); background: rgba(212,175,55,0.02);">
                    <span style="margin-right:12px;">💰</span> Nexus Wallet
                </a>
                <a href="/history/wallet.html" class="${currentPath.includes('wallet.html') ? 'active' : ''}">
                    <span style="margin-right:12px;">▤</span> Finance Logs
                </a>
                <a href="/history/bets.html" class="${currentPath.includes('bets.html') ? 'active' : ''}">
                    <span style="margin-right:12px;">⚔</span> Battle Records
                </a>
                
                <div id="agent-manager-section"></div>

                <div class="menu-category">EXTERNAL NODES</div>
                <a href="https://t.me/YOUR_CHANNEL" target="_blank">
                    <span style="margin-right:12px;">✈</span> Telegram Grid
                </a>
                <a href="https://m.me/YOUR_PAGE" target="_blank">
                    <span style="margin-right:12px;">💬</span> Neural Support
                </a>
            </div>

            <div class="sidebar-footer" style="padding: 20px; border-top:1px solid #111; background:#030303;">
                <button id="nexus-logout" style="width:100%; padding:14px; border-radius:12px; background:rgba(255, 68, 68, 0.05); color:#ff4444; border:1px solid rgba(255, 68, 68, 0.1); font-size:0.7rem; font-weight:bold; cursor:pointer; transition: 0.3s; font-family:'Goldman'; letter-spacing:1px;">TERMINATE SESSION</button>
                <div style="text-align:center; color:#222; font-size:0.5rem; margin-top:15px; letter-spacing:2px;">NEXUS ENGINE v2.6.4</div>
            </div>
        </div>
    `;

    const nav = document.querySelector('.top-nav');
    if (nav) nav.insertAdjacentHTML('afterbegin', menuHTML);
    else document.body.insertAdjacentHTML('afterbegin', menuHTML);

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
            if (confirm("CONFIRM TERMINATION: Disconnect from Nexus?")) {
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

    if (!auth || !db) {
        setTimeout(syncSidebarData, 500);
        return;
    }

    auth.onAuthStateChanged(async (user) => {
        if (user) {
            onSnapshot(doc(db, "users", user.uid), (snap) => {
                if (snap.exists()) {
                    const data = snap.data();
                    const level = data.level || 6; 

                    // HUD Updates
                    document.getElementById('sidebar-balance').innerText = `₱${(data.balance || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}`;
                    document.getElementById('sidebar-id').innerText = data.username.toUpperCase();
                    document.getElementById('sidebar-role-badge').innerText = data.role.replace("_", " ");

                    const container = document.getElementById('agent-manager-section');
                    if (!container) return;

                    // MANAGEMENT PULSE (Visible for Levels 1-5)
                    if (level <= 5) {
                        const currentPath = window.location.pathname;
                        let links = `
                            <div class="menu-category">MANAGEMENT PULSE</div>
                            <div style="background:rgba(212, 175, 55, 0.02); border-radius:14px; padding:15px; margin:0 18px 10px; border:1px solid rgba(212, 175, 55, 0.08);">
                                <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                                    <small style="color:#444; font-size:0.5rem; letter-spacing:1px;">TOTAL YIELD</small>
                                    <span style="color:var(--gold); font-size:0.65rem; font-weight:bold; font-family:'Goldman';">₱${(data.totalCommission || 0).toLocaleString()}</span>
                                </div>
                                <div style="height:1px; background:#111; margin:8px 0;"></div>
                                <div style="display:flex; justify-content:space-between;">
                                    <small style="color:#444; font-size:0.5rem; letter-spacing:1px;">ACTIVE NODES</small>
                                    <span style="color:#fff; font-size:0.6rem; font-weight:bold;">${data.downlineCount || 'SYNCING...'}</span>
                                </div>
                            </div>
                            <a href="/admin/agents.html" class="${currentPath.includes('agents.html') ? 'active' : ''}">
                                <span style="margin-right:12px;">📊</span> Network Manager
                            </a>
                        `;

                        if (level === 1) {
                            links += `<a href="/admin/index.html" class="${currentPath.includes('index.html') ? 'active' : ''}" style="color: #00ff88; border-left: 2px solid #00ff88; background: rgba(0, 255, 136, 0.03); margin-top:5px;">
                                <span style="margin-right:12px;">⚡</span> Command Center
                            </a>`;
                        }

                        container.innerHTML = links;
                    }
                }
            });
        }
    });
}
