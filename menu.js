// menu.js
import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

export function injectMenu() {
    if (document.getElementById('nexus-side-menu')) return;

    const currentPath = window.location.pathname;

    const menuHTML = `
        <button class="menu-trigger" id="menu-open-btn">☰</button>
        <div class="menu-overlay" id="nexus-menu-overlay"></div>
        <div id="nexus-side-menu" class="sidebar">
            <div class="sidebar-header" style="padding: 30px 25px 20px;">
                <div style="color:#D4AF37; font-family:'Goldman'; font-size:1.6rem; font-weight:bold; letter-spacing:3px;">NEXUS</div>
                <button id="menu-close-btn" style="position:absolute; right:20px; top:25px; background:none; border:none; color:#444; font-size:1.8rem; cursor:pointer;">&times;</button>
            </div>

            <div id="sidebar-user-box" style="padding: 0 25px 25px; border-bottom: 1px solid #1a1a1a; margin-bottom: 15px;">
                <div style="display:flex; justify-content:space-between; align-items:flex-end;">
                    <div>
                        <small style="color: #444; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 1px; display:block; margin-bottom:4px;">Main Wallet</small>
                        <div id="sidebar-balance" style="color: #00ff88; font-family: 'Goldman'; font-size: 1.3rem; line-height:1;">₱0.00</div>
                    </div>
                    <div id="sidebar-role-badge" style="font-size:0.5rem; background:#222; color:#D4AF37; padding:3px 8px; border-radius:4px; border:1px solid #333; font-weight:bold;">PLAYER</div>
                </div>
                <div id="sidebar-id" style="color: #666; font-size: 0.65rem; margin-top: 10px; font-family:monospace;">ID: LOADING...</div>
            </div>
            
            <div class="sidebar-links">
                <a href="/" class="${currentPath === '/' || currentPath === '/index.html' ? 'active' : ''}">Home</a>
                <a href="/games/" class="${currentPath.includes('/games/') ? 'active' : ''}">Games</a>
                <a href="/profile/" class="${currentPath.includes('/profile/') ? 'active' : ''}">My Profile</a>
                
                <div class="menu-category">FINANCE & LOGS</div>
                <a href="/wallet/" class="${currentPath.includes('/wallet/') ? 'active' : ''}" style="color:var(--gold);">Nexus Wallet</a>
                <a href="/history/wallet.html" class="${currentPath.includes('wallet.html') ? 'active' : ''}">Transaction History</a>
                <a href="/history/bets.html" class="${currentPath.includes('bets.html') ? 'active' : ''}">Betting Records</a>
                
                <div id="agent-manager-section"></div>

                <div class="menu-category">COMMUNITY</div>
                <a href="https://t.me/YOUR_CHANNEL" target="_blank">Telegram Channel</a>
                <a href="https://m.me/YOUR_PAGE" target="_blank">Facebook Support</a>
            </div>

            <div class="sidebar-footer" style="padding: 20px; margin-top:auto;">
                <button id="nexus-logout" class="logout-btn" style="width:100%; padding:14px; border-radius:10px; background:rgba(255, 68, 68, 0.05); color:#ff4444; border:1px solid rgba(255, 68, 68, 0.1); font-size:0.7rem; font-weight:bold; cursor:pointer; transition: 0.3s; font-family:'Goldman';">LOGOUT SESSION</button>
            </div>
        </div>
    `;

    const nav = document.querySelector('.top-nav');
    if (nav) {
        nav.insertAdjacentHTML('afterbegin', menuHTML);
    } else {
        document.body.insertAdjacentHTML('afterbegin', menuHTML);
    }

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
            if (confirm("End your NEXUS session?")) {
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
                    const bal = data.balance || 0;

                    // Update UI Elements
                    document.getElementById('sidebar-balance').innerText = `₱${bal.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
                    document.getElementById('sidebar-id').innerText = `ID: ${data.username.toUpperCase()}`;
                    document.getElementById('sidebar-role-badge').innerText = data.role.replace("_", " ");

                    const container = document.getElementById('agent-manager-section');
                    if (!container) return;

                    // MANAGEMENT VISIBILITY (Level 1-5)
                    if (level >= 1 && level <= 5) {
                        const currentPath = window.location.pathname;
                        let links = `
                            <div class="menu-category">MANAGEMENT PULSE</div>
                            <div style="background:rgba(212, 175, 55, 0.03); border-radius:10px; padding:12px; margin:0 0 10px 0; border:1px solid rgba(212, 175, 55, 0.1);">
                                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                                    <small style="color:#555; font-size:0.5rem;">EARNINGS</small>
                                    <span style="color:#D4AF37; font-size:0.6rem; font-weight:bold;">₱${(data.totalCommission || 0).toLocaleString()}</span>
                                </div>
                                <div style="display:flex; justify-content:space-between;">
                                    <small style="color:#555; font-size:0.5rem;">RATE</small>
                                    <span style="color:#fff; font-size:0.6rem; font-weight:bold;">${data.commissionRate}%</span>
                                </div>
                            </div>
                            <a href="/admin/agents.html" class="${currentPath.includes('agents.html') ? 'active' : ''}">Network Manager</a>
                        `;

                        if (level === 1) {
                            links += `<a href="/admin/index.html" class="${currentPath.includes('index.html') ? 'active' : ''}" style="color: #00ff88; border-left: 2px solid #00ff88; background: rgba(0, 255, 136, 0.05); margin-top:5px;">Command Center</a>`;
                        }

                        container.innerHTML = links;
                    }
                }
            });
        }
    });
}
