// menu.js
import { doc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

export function injectMenu() {
    if (document.getElementById('nexus-side-menu')) return;

    const currentPath = window.location.pathname;

    const menuHTML = `
        <button class="menu-trigger" id="menu-open-btn">☰</button>
        <div class="menu-overlay" id="nexus-menu-overlay"></div>
        <div id="nexus-side-menu" class="sidebar">
            <div class="sidebar-header" style="display:flex; justify-content:space-between; align-items:center; padding: 25px 20px;">
                <div style="color:#D4AF37; font-family:'Goldman'; font-size:1.5rem; font-weight:bold; letter-spacing:2px;">NEXUS</div>
                <button id="menu-close-btn" style="background:none; border:none; color:#444; font-size:1.8rem; cursor:pointer;">&times;</button>
            </div>

            <div id="sidebar-user-box" style="padding: 0 20px 20px; border-bottom: 1px solid #1a1a1a; margin-bottom: 15px;">
                <small style="color: #444; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 1px;">Main Wallet</small>
                <div id="sidebar-balance" style="color: #00ff88; font-family: 'Goldman'; font-size: 1.2rem; margin-top: 2px;">₱0.00</div>
                <div id="sidebar-id" style="color: #666; font-size: 0.65rem; margin-top: 4px;">ID: LOADING...</div>
            </div>
            
            <div class="sidebar-links">
                <a href="/" class="${currentPath === '/' ? 'active' : ''}">Arena Lobby</a>
                <a href="/games/" class="${currentPath.includes('/games/') ? 'active' : ''}">Sabong Arena</a>
                <a href="/profile/" class="${currentPath.includes('/profile/') ? 'active' : ''}">My Profile</a>
                
                <div class="menu-category">FINANCE</div>
                <a href="/wallet/" class="${currentPath.includes('/wallet/') ? 'active' : ''}" style="color:var(--gold);">Nexus Wallet</a>
                <a href="/history/wallet.html" class="${currentPath.includes('wallet.html') ? 'active' : ''}">Transaction Logs</a>
                <a href="/history/bets.html" class="${currentPath.includes('bets.html') ? 'active' : ''}">Betting Records</a>
                
                <div id="agent-manager-section"></div>
            </div>

            <div class="sidebar-footer" style="padding: 20px; border-top: 1px solid #1a1a1a;">
                <button id="nexus-logout" class="logout-btn" style="width:100%; padding:12px; border-radius:8px; background:#111; color:#ff4444; border:1px solid #222; font-size:0.7rem; font-weight:bold; cursor:pointer; transition: 0.3s;">LOGOUT SESSION</button>
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

    openBtn.onclick = () => {
        menu.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const close = () => {
        menu.classList.remove('active'); overlay.classList.remove('active');
        document.body.style.overflow = ''; 
    };

    closeBtn.onclick = close;
    overlay.onclick = close;

    if (logoutBtn) {
        logoutBtn.onclick = () => {
            if (confirm("Sign out from NEXUS?")) {
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
            const userRef = doc(db, "users", user.uid);
            
            // REAL-TIME DATA STREAM FOR SIDEBAR
            onSnapshot(userRef, (snap) => {
                if (snap.exists()) {
                    const data = snap.data();
                    const level = data.level || 6; 
                    const bal = data.balance || 0;

                    // Update Sidebar Balance & ID
                    document.getElementById('sidebar-balance').innerText = `₱${bal.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
                    document.getElementById('sidebar-id').innerText = `ID: ${data.username.toUpperCase()}`;

                    const container = document.getElementById('agent-manager-section');
                    if (!container) return;

                    // UPDATED HIERARCHY LOGIC (1-5 are Management, 6 is Player)
                    if (level >= 1 && level <= 5) {
                        const currentPath = window.location.pathname;
                        let links = `
                            <div class="menu-category">MANAGEMENT</div>
                            <a href="/admin/agents.html" class="${currentPath.includes('agents.html') ? 'active' : ''}">Network Manager</a>
                        `;

                        if (level === 1) {
                            links += `<a href="/admin/index.html" class="${currentPath.includes('index.html') ? 'active' : ''}" style="color: #00ff88; border-left: 2px solid #00ff88; background: rgba(0, 255, 136, 0.05);">Command Center</a>`;
                        }

                        container.innerHTML = links;
                    }
                }
            });
        }
    });
}
