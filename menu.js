// menu.js
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

export function injectMenu() {
    if (document.getElementById('nexus-side-menu')) return;

    const menuHTML = `
        <button class="menu-trigger" id="menu-open-btn">☰</button>
        <div class="menu-overlay" id="nexus-menu-overlay"></div>
        <div id="nexus-side-menu" class="sidebar">
            <div class="sidebar-header" style="display:flex; justify-content:space-between; align-items:center;">
                <div style="color:#D4AF37; font-family:'Goldman'; font-size:1.5rem; font-weight:bold;">NEXUS</div>
                <button id="menu-close-btn" style="background:none; border:none; color:#666; font-size:2rem; cursor:pointer;">&times;</button>
            </div>
            
            <div class="sidebar-links">
                <a href="/">Home</a>
                <a href="/games/">Sabong Arena</a>
                <a href="/profile/">My Profile</a>
                
                <div style="margin: 15px 0 5px 0; color:#444; font-size:0.7rem; font-weight:bold; letter-spacing:1px;">RECORDS</div>
                <a href="/history/wallet.html">Wallet History</a>
                <a href="/history/bets.html">Bet History</a>
                
                <div style="margin: 15px 0 5px 0; color:#444; font-size:0.7rem; font-weight:bold; letter-spacing:1px;">FINANCE</div>
                <a href="/wallet/" style="color:#D4AF37;">Cash-In / Out</a>
                
                <div id="agent-manager-section"></div>
            </div>

            <div class="sidebar-footer">
                <button id="nexus-logout" class="logout-btn">LOGOUT SESSION</button>
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
        document.body.style.overflow = 'hidden';
    };

    const close = () => {
        menu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = ''; 
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

    // Initialize Hierarchy Check
    checkUserTier();
}

async function checkUserTier() {
    const auth = window.firebaseAuth;
    const db = window.firebaseDb; // Ensure you also pass db to window in your main files

    if (!auth || !db) return;

    auth.onAuthStateChanged(async (user) => {
        if (user) {
            try {
                const userRef = doc(db, "users", user.uid);
                const snap = await getDoc(userRef);
                
                if (snap.exists()) {
                    const data = snap.data();
                    const level = data.level || 7; // Default to Player if level is missing
                    
                    // Levels 1-6 are Admin/Agents
                    if (level >= 1 && level <= 6) {
                        const container = document.getElementById('agent-manager-section');
                        container.innerHTML = `
                            <div style="margin: 15px 0 5px 0; color:#444; font-size:0.7rem; font-weight:bold; letter-spacing:1px;">MANAGEMENT</div>
                            <a href="/admin/agents.html" style="color:#00ff88;">👥 Agent Manager</a>
                        `;
                    }
                }
            } catch (error) {
                console.error("Hierarchy check failed:", error);
            }
        }
    });
}
