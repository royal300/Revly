import QRCode from 'qrcode';

const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : '/api';

// App State
let state = {
  currentUser: JSON.parse(localStorage.getItem('revly_user') || 'null'),
  currentTab: 'profile', // 'profile' | 'analytics' | 'questions'
  clients: [], // For Super Admin
  clientProfile: null,
  clientAnalytics: null,
  clientCategories: [],
  clientQuestions: [],
  modal: null, // { type, data }
  // Customer Flow State
  customerSession: null,
  customerStep: 1, // 1: welcome, 2: info, 3: questions, 4: generating/review, 5: done
  customerInfo: { name: '', mobile: '' },
  currentQuestionIdx: 0,
  customerAnswers: [],
  generatedReview: '',
  loading: false,
  error: ''
};

// Check for direct QR scan route (?scan=username or ?biz=username)
const urlParams = new URLSearchParams(window.location.search);
const scanUsername = urlParams.get('scan') || urlParams.get('biz');

// -------------------------------------------------------------
// MAIN RENDER LOOP
// -------------------------------------------------------------
function render() {
  const app = document.getElementById('app');
  if (!app) return;

  // 1. If customer scan URL is active, render Customer User Flow
  if (scanUsername) {
    app.innerHTML = renderCustomerFlow();
    setTimeout(() => {
      const draftEl = document.getElementById('editableDraft');
      if (draftEl) {
        draftEl.style.height = 'auto';
        draftEl.style.height = Math.max(160, draftEl.scrollHeight + 10) + 'px';
      }
    }, 50);
    return;
  }

  // 2. If not logged in, render Modern Login Page
  if (!state.currentUser) {
    app.innerHTML = renderLoginPage();
    return;
  }

  // 3. If logged in as Super Admin
  if (state.currentUser.role === 'admin') {
    app.innerHTML = renderSuperAdmin();
    return;
  }

  // 4. If logged in as Client Business
  app.innerHTML = renderClientBusiness();

  // Post-render QR generation if canvas exists
  setTimeout(() => {
    const qrCanvas = document.getElementById('clientQrCanvas');
    if (qrCanvas && state.currentUser) {
      const scanUrl = `${window.location.origin}/?scan=${state.currentUser.username}`;
      QRCode.toCanvas(qrCanvas, scanUrl, {
        width: 220,
        margin: 2,
        color: {
          dark: state.clientProfile?.qr_color || '#0f172a',
          light: '#ffffff'
        }
      });
    }
  }, 50);
}

// -------------------------------------------------------------
// 1. MODERN PROFESSIONAL LOGIN PAGE
// -------------------------------------------------------------
function renderLoginPage() {
  return `
    <div class="login-split-page">
      <div class="login-card-pro">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:28px;">
          <div class="brand-icon" style="width:44px; height:44px; font-size:22px;">⚡</div>
          <div>
            <div style="font-size:24px; font-weight:800; color:#0f172a; letter-spacing:-0.03em;">Revly</div>
            <div style="font-size:12px; color:#64748b; font-weight:600;">AI Review & Feedback Platform</div>
          </div>
        </div>

        <h2 style="font-size:18px; font-weight:800; color:#0f172a; margin-bottom:6px;">Sign in to your dashboard</h2>
        <p style="font-size:13px; color:#64748b; margin-bottom:24px;">Enter your credentials to access your portal</p>

        ${state.error ? `
          <div style="background:#fee2e2; border:1px solid #fecaca; color:#b91c1c; padding:12px 16px; border-radius:10px; font-size:13px; margin-bottom:20px; display:flex; align-items:center; gap:8px;">
            <span>⚠️</span> <span>${state.error}</span>
          </div>
        ` : ''}

        <form id="loginForm" onsubmit="handleLogin(event)">
          <div style="margin-bottom:18px;">
            <label class="input-label">Username</label>
            <input type="text" id="loginUsername" class="pro-input" required placeholder="admin or client username" autofocus>
          </div>

          <div style="margin-bottom:24px;">
            <label class="input-label">Password</label>
            <input type="password" id="loginPassword" class="pro-input" required placeholder="Enter password">
          </div>

          <button type="submit" class="btn-pro btn-pro-primary" style="width:100%; padding:13px;" ${state.loading ? 'disabled' : ''}>
            ${state.loading ? 'Authenticating...' : 'Sign In to Dashboard &rarr;'}
          </button>
        </form>

        <div style="margin-top:28px; padding-top:20px; border-top:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
          <div style="font-size:11px; color:#64748b;">
            Quick demo credentials:
          </div>
          <div style="display:flex; gap:6px;">
            <button type="button" class="btn-pro btn-pro-secondary btn-pro-sm" onclick="quickFill('admin', 'admin123')">
              Admin
            </button>
            <button type="button" class="btn-pro btn-pro-secondary btn-pro-sm" onclick="quickFill('royalcafe', 'password123')">
              Client
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function quickFill(u, p) {
  document.getElementById('loginUsername').value = u;
  document.getElementById('loginPassword').value = p;
}

async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  state.loading = true;
  state.error = '';
  render();

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (!res.ok) {
      state.error = data.error || 'Login failed';
    } else {
      state.currentUser = data.user;
      localStorage.setItem('revly_user', JSON.stringify(data.user));
      // Load initial panel data
      if (data.user.role === 'admin') {
        await loadAdminClients();
      } else {
        await loadClientData();
      }
    }
  } catch (err) {
    state.error = 'Unable to connect to server';
  } finally {
    state.loading = false;
    render();
  }
}

function handleLogout() {
  state.currentUser = null;
  localStorage.removeItem('revly_user');
  render();
}

// -------------------------------------------------------------
// 2. SUPER ADMIN DASHBOARD
// 1. Create new Client
// 2. Client List (only name, username, phone)
// 3. User update password
// -------------------------------------------------------------
async function loadAdminClients() {
  try {
    const res = await fetch(`${API_BASE}/admin/clients`);
    if (res.ok) {
      state.clients = await res.json();
    }
  } catch (e) {
    console.error(e);
  }
}

function renderSuperAdmin() {
  const totalClients = state.clients.length;
  const totalScans = state.clients.reduce((sum, c) => sum + (Number(c.scan_count) || 0), 0);
  const totalGenerated = state.clients.reduce((sum, c) => sum + (Number(c.generated_count) || 0), 0);

  return `
    <div class="dashboard-shell">
      <!-- Sidebar -->
      <aside class="dash-sidebar">
        <div class="sidebar-header">
          <div class="brand-icon">⚡</div>
          <div>
            <div class="brand-title">Revly</div>
            <div class="brand-sub">Super Admin</div>
          </div>
        </div>

        <nav class="sidebar-nav">
          <div class="nav-category-label">Management</div>
          <button class="nav-link active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Client Businesses
          </button>
        </nav>

        <div class="sidebar-footer">
          <div class="user-badge">
            <div class="user-avatar">SA</div>
            <div class="user-meta">
              <div class="user-name">Super Admin</div>
              <div class="user-role">Platform Manager</div>
            </div>
          </div>
          <button class="btn-pro btn-pro-secondary btn-pro-sm" onclick="handleLogout()" title="Logout" style="padding:6px 10px;">
            Logout
          </button>
        </div>
      </aside>

      <!-- Main Dashboard Area -->
      <main class="dash-main">
        <header class="dash-topbar">
          <div class="topbar-left">
            <h1 class="page-heading">Client Directory</h1>
          </div>
          <div class="topbar-right">
            <span class="live-pill">
              <span class="live-pill-dot"></span>
              Live Database Connected
            </span>
            <button class="btn-pro btn-pro-primary" onclick="openModal('create-client')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Create New Client
            </button>
          </div>
        </header>

        <div class="dash-content">
          <!-- KPI Cards -->
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-top">
                <span class="kpi-label">Active Businesses</span>
                <div class="kpi-icon-bubble" style="background:#eef2ff; color:#4f46e5;">🏢</div>
              </div>
              <div class="kpi-number">${totalClients}</div>
              <div class="kpi-footer">
                <span class="badge-pro badge-emerald">Live</span> Registered accounts
              </div>
            </div>

            <div class="kpi-card">
              <div class="kpi-top">
                <span class="kpi-label">Total QR Scans</span>
                <div class="kpi-icon-bubble" style="background:#f0f9ff; color:#0284c7;">📱</div>
              </div>
              <div class="kpi-number">${totalScans}</div>
              <div class="kpi-footer">
                Platform aggregate visits
              </div>
            </div>

            <div class="kpi-card">
              <div class="kpi-top">
                <span class="kpi-label">AI Reviews Placed</span>
                <div class="kpi-icon-bubble" style="background:#fdf2f8; color:#db2777;">✨</div>
              </div>
              <div class="kpi-number">${totalGenerated}</div>
              <div class="kpi-footer">
                Powered by gpt-4o-mini
              </div>
            </div>
          </div>

          <!-- Client Table Card -->
          <div class="dash-card">
            <div class="dash-card-header">
              <div>
                <h2 class="dash-card-title">All Client Accounts</h2>
                <div class="dash-card-desc">View business credentials and update passwords</div>
              </div>
              <div style="font-size:12px; color:#64748b;">
                Showing <strong>${totalClients}</strong> clients
              </div>
            </div>

            <div class="table-container">
              <table class="pro-table">
                <thead>
                  <tr>
                    <th>Business Name</th>
                    <th>Username</th>
                    <th>Phone Number</th>
                    <th style="text-align:right;">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${state.clients.length === 0 ? `
                    <tr>
                      <td colspan="4" style="text-align:center; padding:48px 20px; color:#64748b;">
                        <div style="font-size:32px; margin-bottom:12px;">🏢</div>
                        <div style="font-weight:700; color:#0f172a; margin-bottom:4px;">No client businesses created yet</div>
                        <div style="font-size:13px; margin-bottom:16px;">Click the button below to register your first client account.</div>
                        <button class="btn-pro btn-pro-primary" onclick="openModal('create-client')">+ Create New Client</button>
                      </td>
                    </tr>
                  ` : state.clients.map(c => `
                    <tr>
                      <td>
                        <div style="display:flex; align-items:center; gap:10px;">
                          <div style="width:34px; height:34px; border-radius:8px; background:#eef2ff; color:#4f46e5; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:13px;">
                            ${c.name.slice(0, 2).toUpperCase()}
                          </div>
                          <span style="font-weight:700; font-size:14px; color:#0f172a;">${c.name}</span>
                        </div>
                      </td>
                      <td>
                        <code style="background:#f1f5f9; padding:4px 8px; border-radius:6px; font-size:12px; color:#334155; font-weight:600;">@${c.username}</code>
                      </td>
                      <td>
                        <span style="color:#475569; font-size:13px;">${c.phone || '—'}</span>
                      </td>
                      <td style="text-align:right;">
                        <div style="display:inline-flex; gap:6px;">
                          <a href="/?scan=${c.username}" target="_blank" class="btn-pro btn-pro-secondary btn-pro-sm" title="Preview Customer QR Flow">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                            View QR
                          </a>
                          <button class="btn-pro btn-pro-secondary btn-pro-sm" onclick="openModal('reset-password', { id: ${c.id}, name: '${c.name.replace(/'/g, "\\'")}' })" title="Reset Client Password">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            Reset Password
                          </button>
                          <button class="btn-pro btn-pro-danger btn-pro-sm" onclick="deleteClient(${c.id})" title="Delete Client">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      ${renderModal()}
    </div>
  `;
}

async function handleCreateClient(e) {
  e.preventDefault();
  const name = document.getElementById('clientName').value;
  const username = document.getElementById('clientUsername').value;
  const password = document.getElementById('clientPassword').value;
  const phone = document.getElementById('clientPhone').value;

  try {
    const res = await fetch(`${API_BASE}/admin/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, username, password, phone })
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Failed to create client');
    } else {
      closeModal();
      await loadAdminClients();
      render();
    }
  } catch (err) {
    alert('Error connecting to server');
  }
}

async function handleResetPassword(e, clientId) {
  e.preventDefault();
  const newPassword = document.getElementById('newPasswordInput').value;

  try {
    const res = await fetch(`${API_BASE}/admin/clients/${clientId}/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword })
    });
    if (res.ok) {
      alert('Password updated successfully');
      closeModal();
    } else {
      alert('Failed to update password');
    }
  } catch (err) {
    alert('Error updating password');
  }
}

async function deleteClient(id) {
  if (!confirm('Are you sure you want to delete this client? All questions, scans, and feedback will be removed.')) return;
  try {
    await fetch(`${API_BASE}/admin/clients/${id}`, { method: 'DELETE' });
    await loadAdminClients();
    render();
  } catch (e) {
    alert('Failed to delete client');
  }
}

// -------------------------------------------------------------
// 3. CLIENT BUSINESS DASHBOARD
// 1. Profile: Business Name, Google review link, Choose QR
// 2. Analytics: No of scan (visited), generated (placed), category rating & feedback
// 3. Question & Category: Set questions and categories
// -------------------------------------------------------------
async function loadClientData() {
  if (!state.currentUser) return;
  const id = state.currentUser.id;
  try {
    const [pRes, aRes, cRes, qRes] = await Promise.all([
      fetch(`${API_BASE}/client/profile/${id}`).then(r => r.json()),
      fetch(`${API_BASE}/client/analytics/${id}`).then(r => r.json()),
      fetch(`${API_BASE}/client/categories/${id}`).then(r => r.json()),
      fetch(`${API_BASE}/client/questions/${id}`).then(r => r.json())
    ]);
    state.clientProfile = pRes;
    state.clientAnalytics = aRes;
    state.clientCategories = cRes;
    state.clientQuestions = qRes;
  } catch (e) {
    console.error('Error loading client data:', e);
  }
}

function renderClientBusiness() {
  const user = state.currentUser;
  const p = state.clientProfile || user;
  const a = state.clientAnalytics || { total_scans: 0, total_generated: 0, category_ratings: [], recent_feedback: [] };

  return `
    <div class="dashboard-shell">
      <!-- Modern Sidebar -->
      <aside class="dash-sidebar">
        <div class="sidebar-header">
          <div class="brand-icon">
            ${(p.name || user.name).slice(0, 2).toUpperCase()}
          </div>
          <div style="min-width:0; flex:1;">
            <div class="brand-title" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${p.name || user.name}
            </div>
            <div class="brand-sub">Business Portal</div>
          </div>
        </div>

        <nav class="sidebar-nav">
          <div class="nav-category-label">Workspace</div>
          <button class="nav-link ${state.currentTab === 'profile' ? 'active' : ''}" onclick="switchTab('profile')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><path d="M14 14h3v3h-3z"></path><path d="M14 20h6"></path><path d="M20 14v6"></path></svg>
            Profile & QR Studio
          </button>

          <button class="nav-link ${state.currentTab === 'analytics' ? 'active' : ''}" onclick="switchTab('analytics')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            Analytics & Reviews
          </button>

          <button class="nav-link ${state.currentTab === 'questions' ? 'active' : ''}" onclick="switchTab('questions')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            Questions & Category
          </button>
        </nav>

        <div class="sidebar-footer">
          <div class="user-badge">
            <div class="user-avatar">${(p.name || user.name).slice(0, 1).toUpperCase()}</div>
            <div class="user-meta">
              <div class="user-name">${p.name || user.name}</div>
              <div class="user-role">@${user.username}</div>
            </div>
          </div>
          <button class="btn-pro btn-pro-secondary btn-pro-sm" onclick="handleLogout()" title="Logout" style="padding:6px 10px;">
            Logout
          </button>
        </div>
      </aside>

      <!-- Main Dashboard Area -->
      <main class="dash-main">
        <header class="dash-topbar">
          <div class="topbar-left">
            <h1 class="page-heading">
              ${state.currentTab === 'profile' ? 'Profile & QR Studio' : ''}
              ${state.currentTab === 'analytics' ? 'Analytics & Performance' : ''}
              ${state.currentTab === 'questions' ? 'Questions & Categories' : ''}
            </h1>
          </div>
          <div class="topbar-right">
            <span class="live-pill">
              <span class="live-pill-dot"></span>
              AI Active (gpt-4o-mini)
            </span>
            <a href="/?scan=${user.username}" target="_blank" class="btn-pro btn-pro-primary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              Test Customer QR &rarr;
            </a>
          </div>
        </header>

        <div class="dash-content">
          ${state.currentTab === 'profile' ? renderClientProfileTab(p) : ''}
          ${state.currentTab === 'analytics' ? renderClientAnalyticsTab(a) : ''}
          ${state.currentTab === 'questions' ? renderClientQuestionsTab() : ''}
        </div>
      </main>

      ${renderModal()}
    </div>
  `;
}

function switchTab(tab) {
  state.currentTab = tab;
  render();
}

// Client Tab 1: Profile & QR Studio
function renderClientProfileTab(p) {
  const scanUrl = `${window.location.origin}/?scan=${state.currentUser.username}`;

  return `
    <div style="display:grid; grid-template-columns: 1.2fr 0.8fr; gap:24px; align-items:flex-start;">
      <!-- Profile Form -->
      <div class="dash-card">
        <h2 class="dash-card-title" style="margin-bottom:6px;">Business Profile Details</h2>
        <div class="dash-card-desc" style="margin-bottom:20px;">Configure your business name and Google review destination link</div>

        <form onsubmit="handleSaveProfile(event)">
          <div style="margin-bottom:18px;">
            <label class="input-label">Business Name</label>
            <input type="text" id="profName" class="pro-input" required value="${p.name || ''}" placeholder="e.g. Royal Cafe & Lounge">
          </div>

          <div style="margin-bottom:18px;">
            <label class="input-label">Google Review Page Link</label>
            <input type="url" id="profGoogleUrl" class="pro-input" placeholder="https://search.google.com/local/writereview?placeid=..." value="${p.google_review_url || ''}">
            <span style="font-size:11px; color:#64748b; margin-top:4px; display:block;">
              Paste your Google Maps review link. Customers will be redirected here after generating their review draft.
            </span>
          </div>

          <div style="margin-bottom:24px;">
            <label class="input-label">Choose QR Code Color</label>
            <div style="display:flex; gap:10px; margin-top:8px;">
              ${[
                { color: '#0f172a', name: 'Dark Slate' },
                { color: '#4f46e5', name: 'Indigo' },
                { color: '#0284c7', name: 'Ocean Blue' },
                { color: '#059669', name: 'Emerald' },
                { color: '#dc2626', name: 'Crimson' }
              ].map(opt => `
                <button type="button" 
                  onclick="selectColor('${opt.color}')" 
                  style="width:36px; height:36px; border-radius:50%; background:${opt.color}; border:${(p.qr_color || '#0f172a') === opt.color ? '3px solid #6366f1' : '2px solid #ffffff'}; box-shadow:0 1px 3px rgba(0,0,0,0.2); cursor:pointer;"
                  title="${opt.name}">
                </button>
              `).join('')}
              <input type="hidden" id="profQrColor" value="${p.qr_color || '#0f172a'}">
            </div>
          </div>

          <button type="submit" class="btn-pro btn-pro-primary">
            Save Profile Changes
          </button>
        </form>
      </div>

      <!-- QR Studio Card -->
      <div class="dash-card" style="text-align:center;">
        <h2 class="dash-card-title" style="margin-bottom:4px;">Live Scannable QR Code</h2>
        <div class="dash-card-desc" style="margin-bottom:20px;">Display at tables, reception counters, or billing stations</div>

        <div style="background:#ffffff; border:2px solid #e2e8f0; border-radius:20px; padding:24px 20px; box-shadow:var(--shadow-md); display:inline-block; margin-bottom:20px;">
          <div style="font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; color:#4f46e5; margin-bottom:4px;">
            Scan to Review
          </div>
          <div style="font-size:17px; font-weight:800; color:#0f172a; margin-bottom:12px;">
            ${p.name || state.currentUser.name}
          </div>

          <div style="background:#f8fafc; padding:12px; border-radius:14px; border:1px solid #e2e8f0; display:inline-block;">
            <canvas id="clientQrCanvas" width="220" height="220"></canvas>
          </div>

          <div style="font-size:11px; font-weight:600; color:#64748b; margin-top:10px;">
            3 Quick Questions &bull; AI Review Draft
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:10px;">
          <button class="btn-pro btn-pro-primary" onclick="downloadQrCode()">
            ⬇️ Download QR Image (PNG)
          </button>

          <div style="display:flex; gap:6px;">
            <input type="text" class="pro-input" style="font-size:12px;" value="${scanUrl}" readonly>
            <button class="btn-pro btn-pro-secondary btn-pro-sm" onclick="navigator.clipboard.writeText('${scanUrl}'); alert('Customer scan link copied to clipboard!');">
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function selectColor(color) {
  document.getElementById('profQrColor').value = color;
  const qrCanvas = document.getElementById('clientQrCanvas');
  if (qrCanvas && state.currentUser) {
    const scanUrl = `${window.location.origin}/?scan=${state.currentUser.username}`;
    QRCode.toCanvas(qrCanvas, scanUrl, {
      width: 220,
      margin: 2,
      color: { dark: color, light: '#ffffff' }
    });
  }
}

async function handleSaveProfile(e) {
  e.preventDefault();
  const name = document.getElementById('profName').value;
  const google_review_url = document.getElementById('profGoogleUrl').value;
  const qr_color = document.getElementById('profQrColor').value;

  try {
    const res = await fetch(`${API_BASE}/client/profile/${state.currentUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, google_review_url, qr_color })
    });
    if (res.ok) {
      alert('Profile updated successfully');
      await loadClientData();
      render();
    }
  } catch (err) {
    alert('Failed to save profile');
  }
}

function downloadQrCode() {
  const canvas = document.getElementById('clientQrCanvas');
  if (!canvas) return;
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = `${state.currentUser.username}_qr_code.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Client Tab 2: Analytics
function renderClientAnalyticsTab(a) {
  return `
    <!-- Key Metrics Grid -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">No. of Scans</span>
          <div class="kpi-icon-bubble" style="background:#eef2ff; color:#4f46e5;">📱</div>
        </div>
        <div class="kpi-number">${a.total_scans}</div>
        <div class="kpi-footer">
          Customers who visited review page via QR
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Reviews Generated</span>
          <div class="kpi-icon-bubble" style="background:#ecfdf5; color:#059669;">✨</div>
        </div>
        <div class="kpi-number">${a.total_generated}</div>
        <div class="kpi-footer">
          AI-assisted review drafts completed
        </div>
      </div>
    </div>

    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px; align-items:flex-start;">
      <!-- Category-Wise Ratings -->
      <div class="dash-card">
        <h2 class="dash-card-title">Category-wise Rating & Feedback</h2>
        <div class="dash-card-desc" style="margin-bottom:20px;">Average star ratings across feedback categories</div>

        ${a.category_ratings.length === 0 ? `
          <div style="color:#64748b; font-size:13px; text-align:center; padding:32px 10px;">
            No rating feedback received yet. Scan your QR code to test!
          </div>
        ` : `
          <div style="display:flex; flex-direction:column; gap:12px;">
            ${a.category_ratings.map(c => `
              <div class="cat-rating-row">
                <div style="min-width:120px;">
                  <strong style="font-size:13px; color:#0f172a;">${c.category_name}</strong>
                  <div style="font-size:11px; color:#64748b;">${c.response_count} response${c.response_count > 1 ? 's' : ''}</div>
                </div>

                <div class="cat-rating-bar">
                  <div class="cat-rating-fill" style="width:${(Number(c.avg_rating) / 5) * 100}%;"></div>
                </div>

                <div style="font-size:15px; font-weight:800; color:#d97706; min-width:60px; text-align:right;">
                  ★ ${c.avg_rating}
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <!-- Recent Feedback & Review Drafts -->
      <div class="dash-card">
        <h2 class="dash-card-title">Recent Feedback Streams</h2>
        <div class="dash-card-desc" style="margin-bottom:20px;">Customer answers and AI review drafts generated</div>

        ${a.recent_feedback.length === 0 ? `
          <div style="color:#64748b; font-size:13px; text-align:center; padding:32px 10px;">
            No customer reviews generated yet.
          </div>
        ` : `
          <div style="display:flex; flex-direction:column; gap:14px; max-height:480px; overflow-y:auto;">
            ${a.recent_feedback.map(f => `
              <div style="padding:16px; background:#f8fafc; border-radius:12px; border:1px solid #e2e8f0;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <div style="width:28px; height:28px; border-radius:50%; background:#eef2ff; color:#4f46e5; font-weight:800; display:flex; align-items:center; justify-content:center; font-size:11px;">
                      ${(f.customer_name || 'A').slice(0, 1).toUpperCase()}
                    </div>
                    <strong style="color:#0f172a; font-size:13px;">${f.customer_name || 'Anonymous Customer'}</strong>
                  </div>
                  <span style="font-size:11px; color:#94a3b8;">${new Date(f.created_at).toLocaleDateString()}</span>
                </div>
                <p style="font-size:13px; color:#334155; line-height:1.6; background:#fff; padding:12px; border-radius:8px; border:1px solid #f1f5f9;">
                  "${f.generated_review}"
                </p>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    </div>
  `;
}

// Client Tab 3: Questions & Categories
function renderClientQuestionsTab() {
  return `
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px; align-items:flex-start;">
      <!-- Categories Section -->
      <div class="dash-card">
        <div class="dash-card-header">
          <div>
            <h2 class="dash-card-title">Feedback Categories</h2>
            <div class="dash-card-desc">Group your questions by service touchpoints</div>
          </div>
          <button class="btn-pro btn-pro-primary btn-pro-sm" onclick="openModal('add-category')">
            + Add Category
          </button>
        </div>

        <div class="table-container">
          <table class="pro-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Questions</th>
                <th style="text-align:right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${state.clientCategories.length === 0 ? `
                <tr>
                  <td colspan="3" style="text-align:center; padding:24px; color:#64748b;">No categories created yet.</td>
                </tr>
              ` : state.clientCategories.map(cat => `
                <tr>
                  <td><strong style="color:#0f172a;">${cat.name}</strong></td>
                  <td><span class="badge-pro badge-indigo">${cat.question_count} questions</span></td>
                  <td style="text-align:right;">
                    <button class="btn-pro btn-pro-danger btn-pro-sm" onclick="deleteCategory(${cat.id})">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Questions Section -->
      <div class="dash-card">
        <div class="dash-card-header">
          <div>
            <h2 class="dash-card-title">Question Bank</h2>
            <div class="dash-card-desc">Random 3 questions are selected for each scan</div>
          </div>
          <button class="btn-pro btn-pro-primary btn-pro-sm" onclick="openModal('add-question')">
            + Add Question
          </button>
        </div>

        <div class="table-container">
          <table class="pro-table">
            <thead>
              <tr>
                <th>Question Text</th>
                <th>Category</th>
                <th style="text-align:right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${state.clientQuestions.length === 0 ? `
                <tr>
                  <td colspan="3" style="text-align:center; padding:24px; color:#64748b;">No questions added yet.</td>
                </tr>
              ` : state.clientQuestions.map(q => `
                <tr>
                  <td style="font-weight:600; color:#0f172a; max-width:240px;">${q.question_text}</td>
                  <td><span class="badge-pro badge-indigo">${q.category_name}</span></td>
                  <td style="text-align:right;">
                    <button class="btn-pro btn-pro-danger btn-pro-sm" onclick="deleteQuestion(${q.id})">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

async function handleAddCategory(e) {
  e.preventDefault();
  const name = document.getElementById('catNameInput').value;
  try {
    const res = await fetch(`${API_BASE}/client/categories/${state.currentUser.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    if (res.ok) {
      closeModal();
      await loadClientData();
      render();
    }
  } catch (err) {
    alert('Failed to add category');
  }
}

async function deleteCategory(id) {
  if (!confirm('Delete this category and its questions?')) return;
  try {
    await fetch(`${API_BASE}/client/categories/${id}`, { method: 'DELETE' });
    await loadClientData();
    render();
  } catch (err) {
    alert('Failed to delete category');
  }
}

async function handleAddQuestion(e) {
  e.preventDefault();
  const category_id = document.getElementById('qCatSelect').value;
  const question_text = document.getElementById('qTextInput').value;

  try {
    const res = await fetch(`${API_BASE}/client/questions/${state.currentUser.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category_id, question_text })
    });
    if (res.ok) {
      closeModal();
      await loadClientData();
      render();
    }
  } catch (err) {
    alert('Failed to add question');
  }
}

async function deleteQuestion(id) {
  if (!confirm('Delete this question?')) return;
  try {
    await fetch(`${API_BASE}/client/questions/${id}`, { method: 'DELETE' });
    await loadClientData();
    render();
  } catch (err) {
    alert('Failed to delete question');
  }
}

// -------------------------------------------------------------
// 4. USER FLOW (Customer Mobile Experience)
// 1. Scan
// 2. Name, Mobile (optional)
// 3. Random 3 questions one by one then generate review with gpt-4o-mini
// -------------------------------------------------------------
async function initCustomerSession() {
  if (state.customerSession) return;
  try {
    const res = await fetch(`${API_BASE}/customer/session/${scanUsername}`);
    if (res.ok) {
      state.customerSession = await res.json();
      render();
    } else {
      state.error = 'Business not found or invalid QR link';
      render();
    }
  } catch (e) {
    state.error = 'Unable to connect';
    render();
  }
}

function renderCustomerFlow() {
  if (!state.customerSession && !state.error) {
    initCustomerSession();
    return `
      <div class="customer-clean-page">
        <div class="customer-clean-card" style="text-align:center; padding:50px 24px;">
          <div style="width:48px; height:48px; border:3px solid #e2e8f0; border-top-color:#4f46e5; border-radius:50%; margin:0 auto 20px; animation:spin 0.8s linear infinite;"></div>
          <div style="font-size:16px; font-weight:700; color:#0f172a;">Connecting to review station...</div>
          <p style="font-size:13px; color:#64748b; margin-top:6px;">Please wait a moment</p>
        </div>
      </div>
    `;
  }

  if (state.error) {
    return `
      <div class="customer-clean-page">
        <div class="customer-clean-card" style="text-align:center; padding:50px 24px;">
          <div style="font-size:36px; margin-bottom:16px;">⚠️</div>
          <h2 style="font-size:20px; font-weight:800; color:#ef4444; margin-bottom:8px;">Notice</h2>
          <p style="color:#64748b; font-size:14px; line-height:1.5;">${state.error}</p>
        </div>
      </div>
    `;
  }

  const s = state.customerSession;

  let bodyHtml = '';

  // Step 1: Welcome
  if (state.customerStep === 1) {
    bodyHtml = `
      <div style="text-align:center; margin-top:8px;">
        <div style="width:72px; height:72px; border-radius:20px; background:#4f46e5; color:#ffffff; display:flex; align-items:center; justify-content:center; font-size:28px; font-weight:800; margin:0 auto 20px; box-shadow:0 8px 20px rgba(79, 70, 229, 0.25);">
          ${s.businessName.slice(0, 2).toUpperCase()}
        </div>
        <h1 style="font-size:24px; font-weight:800; color:#0f172a; margin-bottom:8px; line-height:1.3;">${s.businessName}</h1>
        <p style="font-size:14px; color:#64748b; line-height:1.6; margin-bottom:28px;">
          Share your experience in 3 quick questions. Our AI will help prepare your review draft.
        </p>

        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:14px 16px; font-size:13px; color:#475569; margin-bottom:32px; display:flex; align-items:center; justify-content:center; gap:8px;">
          <span>⏱️</span>
          <span>Takes less than 45 seconds &bull; 100% genuine</span>
        </div>
      </div>

      <button class="btn-pro btn-pro-primary btn-pro-lg" onclick="customerNextStep(2)" style="width:100%; font-size:16px; padding:14px 20px;">
        Start Feedback &rarr;
      </button>
    `;
  }

  // Step 2: Name & Mobile (Optional)
  else if (state.customerStep === 2) {
    bodyHtml = `
      <div>
        <div style="font-size:12px; font-weight:700; color:#4f46e5; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px;">Step 1 of 2</div>
        <h2 style="font-size:22px; font-weight:800; color:#0f172a; margin-bottom:6px;">Your Information</h2>
        <p style="font-size:13px; color:#64748b; margin-bottom:24px; line-height:1.5;">Optional: tell us your name so ${s.businessName} knows who visited.</p>

        <form onsubmit="handleCustomerInfoSubmit(event)">
          <div style="margin-bottom:18px;">
            <label class="input-label" style="font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Your Name (Optional)</label>
            <input type="text" id="custNameInput" class="pro-input" placeholder="e.g. Alex" value="${state.customerInfo.name}" style="padding:12px 14px; font-size:14px;">
          </div>

          <div style="margin-bottom:24px;">
            <label class="input-label" style="font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Mobile Number (Optional)</label>
            <input type="tel" id="custMobileInput" class="pro-input" placeholder="+1 (555) 000-0000" value="${state.customerInfo.mobile}" style="padding:12px 14px; font-size:14px;">
          </div>

          <button type="submit" class="btn-pro btn-pro-primary btn-pro-lg" style="width:100%; font-size:15px; padding:13px 20px;">
            Continue to Questions &rarr;
          </button>
        </form>
      </div>

      <div style="text-align:center; margin-top:16px;">
        <button class="btn-pro btn-pro-secondary btn-pro-sm" onclick="skipCustomerInfo()" style="color:#64748b; border:none; background:transparent; font-size:13px; cursor:pointer;">
          Skip & Continue Anonymously
        </button>
      </div>
    `;
  }

  // Step 3: Random 3 Questions (One by One)
  else if (state.customerStep === 3) {
    const questions = s.questions;
    if (!questions || questions.length === 0) {
      bodyHtml = `
        <div style="text-align:center; padding:40px 10px;">
          <p style="color:#64748b; font-size:14px;">No questions configured by the business yet.</p>
        </div>
      `;
    } else {
      const currentQ = questions[state.currentQuestionIdx];
      const totalQ = questions.length;

      bodyHtml = `
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <span class="badge-pro badge-indigo" style="font-weight:700;">Question ${state.currentQuestionIdx + 1} of ${totalQ}</span>
            <span style="font-size:13px; font-weight:700; color:#475569;">${currentQ.category_name}</span>
          </div>

          <div style="height:6px; background:#e2e8f0; border-radius:99px; margin-bottom:32px; overflow:hidden;">
            <div style="height:100%; background:#4f46e5; border-radius:99px; width:${((state.currentQuestionIdx + 1) / totalQ) * 100}%; transition:width 0.3s ease;"></div>
          </div>

          <div style="text-align:center; padding:10px 0;">
            <h2 style="font-size:22px; font-weight:800; color:#0f172a; line-height:1.4; margin-bottom:28px;">
              ${currentQ.question_text}
            </h2>

            <div class="star-interactive-row">
              ${[1, 2, 3, 4, 5].map(star => `
                <button type="button" class="star-btn-lg" title="${star} Star" onclick="rateStar(${currentQ.id}, '${currentQ.category_name.replace(/'/g, "\\'")}', '${currentQ.question_text.replace(/'/g, "\\'")}', ${star})">
                  ★
                </button>
              `).join('')}
            </div>

            <div style="font-size:14px; font-weight:700; color:#d97706; margin-top:16px;">
              Tap a star (1 to 5) to rate
            </div>
          </div>
        </div>

        <div style="text-align:center; font-size:12px; color:#94a3b8; margin-top:24px;">
          Automatically moves to next question
        </div>
      `;
    }
  }

  // Step 4: Generating or Generated Review Screen
  else if (state.customerStep === 4) {
    if (state.loading) {
      bodyHtml = `
        <div style="text-align:center; padding:50px 10px;">
          <div style="width:68px; height:68px; border-radius:50%; background:linear-gradient(135deg, #4f46e5, #06b6d4); display:flex; align-items:center; justify-content:center; color:#fff; font-size:30px; margin:0 auto 20px; box-shadow:0 10px 25px rgba(79, 70, 229, 0.3);">
            ✨
          </div>
          <h2 style="font-size:22px; font-weight:800; color:#0f172a; margin-bottom:8px;">Crafting your review...</h2>
          <p style="font-size:14px; color:#64748b; line-height:1.5;">Our AI is synthesizing your answers into an authentic review draft.</p>
        </div>
      `;
    } else {
      bodyHtml = `
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <h2 style="font-size:20px; font-weight:800; color:#0f172a;">Your Review Draft</h2>
            <span class="badge-pro badge-indigo">✨ AI Generated</span>
          </div>

          <p style="font-size:13px; color:#64748b; margin-bottom:16px; line-height:1.4;">
            Feel free to edit your text below before continuing to Google.
          </p>

          <textarea id="editableDraft" class="review-arial-box" rows="7" placeholder="Your review text..." oninput="state.generatedReview = this.value; this.style.height='auto'; this.style.height=(this.scrollHeight+10)+'px'">${state.generatedReview}</textarea>

          <div style="background:#ecfdf5; border:1px solid #bbf7d0; border-radius:10px; padding:12px 14px; font-size:12px; color:#047857; line-height:1.5; margin-bottom:24px; display:flex; align-items:flex-start; gap:8px;">
            <span style="font-size:16px;">💡</span>
            <span>Clicking below copies this review and opens ${s.businessName}'s Google review page. Simply paste and post!</span>
          </div>

          <button class="btn-pro btn-pro-primary btn-pro-lg" style="width:100%; font-size:16px; padding:14px 20px; display:flex; align-items:center; justify-content:center; gap:10px;" onclick="copyAndRedirectToGoogle()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M21.35 11.1H12v3.8h5.37c-.52 2.5-2.6 4.33-5.37 4.33-3.04 0-5.5-2.46-5.5-5.5s2.46-5.5 5.5-5.5c1.37 0 2.62.5 3.58 1.42l2.69-2.69C16.89 4.37 14.58 3.5 12 3.5 7.31 3.5 3.5 7.31 3.5 12s3.81 8.5 8.5 8.5c4.97 0 8.25-3.5 8.25-8.4 0-.6-.06-1.3-.15-1.9z"/></svg>
            Copy & Continue to Google &rarr;
          </button>
        </div>
      `;
    }
  }

  // Step 5: Completed
  else if (state.customerStep === 5) {
    bodyHtml = `
      <div style="text-align:center; padding:40px 10px;">
        <div style="width:72px; height:72px; border-radius:50%; background:#ecfdf5; color:#10b981; display:flex; align-items:center; justify-content:center; font-size:36px; margin:0 auto 20px; border:2px solid #bbf7d0;">
          ✓
        </div>
        <h2 style="font-size:24px; font-weight:800; color:#0f172a; margin-bottom:8px;">Thank You!</h2>
        <p style="font-size:14px; color:#64748b; line-height:1.6; margin-bottom:28px;">
          Your review draft was copied to your clipboard. Simply paste and submit it on the Google review window.
        </p>

        <button class="btn-pro btn-pro-secondary btn-pro-lg" onclick="customerNextStep(1)" style="width:100%;">
          Start New Review
        </button>
      </div>
    `;
  }

  return `
    <div class="customer-clean-page">
      <div class="customer-clean-card">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; padding-bottom:16px; border-bottom:1px solid #f1f5f9;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:18px;">⭐</span>
            <span style="font-weight:700; font-size:15px; color:#0f172a;">${s.businessName}</span>
          </div>
          <span style="font-size:12px; font-weight:600; color:#475569; background:#f8fafc; border:1px solid #e2e8f0; padding:4px 10px; border-radius:99px;">Verified Review</span>
        </div>
        ${bodyHtml}
      </div>
    </div>
  `;
}

function customerNextStep(step) {
  state.customerStep = step;
  render();
}

function skipCustomerInfo() {
  state.customerInfo.name = 'Guest';
  state.customerInfo.mobile = '';
  state.customerStep = 3;
  state.currentQuestionIdx = 0;
  state.customerAnswers = [];
  render();
}

function handleCustomerInfoSubmit(e) {
  e.preventDefault();
  state.customerInfo.name = document.getElementById('custNameInput').value.trim();
  state.customerInfo.mobile = document.getElementById('custMobileInput').value.trim();
  state.customerStep = 3;
  state.currentQuestionIdx = 0;
  state.customerAnswers = [];
  render();
}

function rateStar(qId, catName, qText, rating) {
  state.customerAnswers.push({
    category_id: qId,
    category_name: catName,
    question_text: qText,
    rating: rating
  });

  const totalQ = state.customerSession.questions.length;
  if (state.currentQuestionIdx < totalQ - 1) {
    state.currentQuestionIdx += 1;
    render();
  } else {
    // Generate AI review
    generateCustomerReview();
  }
}

async function generateCustomerReview() {
  state.customerStep = 4;
  state.loading = true;
  render();

  try {
    const res = await fetch(`${API_BASE}/customer/generate-review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: state.customerSession.clientId,
        customerName: state.customerInfo.name || 'Anonymous',
        customerMobile: state.customerInfo.mobile || '',
        answers: state.customerAnswers
      })
    });
    const data = await res.json();
    state.generatedReview = data.reviewDraft;
    state.feedbackId = data.feedbackId;
    state.googleReviewUrl = data.googleReviewUrl;
  } catch (err) {
    state.generatedReview = `I had a great experience at ${state.customerSession.businessName}. The service was excellent!`;
  } finally {
    state.loading = false;
    render();
  }
}

async function copyAndRedirectToGoogle() {
  const text = state.generatedReview || document.getElementById('editableDraft')?.value;
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    console.warn('Clipboard write error');
  }

  // Record redirect
  if (state.feedbackId) {
    fetch(`${API_BASE}/customer/redirect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedbackId: state.feedbackId })
    });
  }

  // Open Google link
  const url = state.googleReviewUrl || state.customerSession.googleReviewUrl;
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    alert('Review text copied! Note: Google Review URL is not configured yet by the business.');
  }

  state.customerStep = 5;
  render();
}

// -------------------------------------------------------------
// MODALS
// -------------------------------------------------------------
function openModal(type, data = null) {
  state.modal = { type, data };
  render();
}

function closeModal() {
  state.modal = null;
  render();
}

function renderModal() {
  if (!state.modal) return '';
  const { type, data } = state.modal;

  if (type === 'create-client') {
    return `
      <div class="pro-modal-backdrop" onclick="closeModal()">
        <div class="pro-modal-box" onclick="event.stopPropagation()">
          <div class="pro-modal-header">
            <h3 class="pro-modal-title">Create New Client</h3>
            <button class="close-btn" onclick="closeModal()">&times;</button>
          </div>
          <form onsubmit="handleCreateClient(event)">
            <div class="pro-modal-body">
              <div style="margin-bottom:16px;">
                <label class="input-label">Business Name</label>
                <input type="text" id="clientName" class="pro-input" required placeholder="e.g. Apex Dental Care">
              </div>
              <div style="margin-bottom:16px;">
                <label class="input-label">Username</label>
                <input type="text" id="clientUsername" class="pro-input" required placeholder="e.g. apexdental">
              </div>
              <div style="margin-bottom:16px;">
                <label class="input-label">Initial Password</label>
                <input type="text" id="clientPassword" class="pro-input" required value="Pass@123">
              </div>
              <div style="margin-bottom:16px;">
                <label class="input-label">Phone Number</label>
                <input type="tel" id="clientPhone" class="pro-input" placeholder="+1 (555) 123-4567">
              </div>
            </div>
            <div class="pro-modal-footer">
              <button type="button" class="btn-pro btn-pro-secondary" onclick="closeModal()">Cancel</button>
              <button type="submit" class="btn-pro btn-pro-primary">Create Client Account</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  if (type === 'reset-password') {
    return `
      <div class="pro-modal-backdrop" onclick="closeModal()">
        <div class="pro-modal-box" onclick="event.stopPropagation()">
          <div class="pro-modal-header">
            <h3 class="pro-modal-title">Reset Client Password</h3>
            <button class="close-btn" onclick="closeModal()">&times;</button>
          </div>
          <form onsubmit="handleResetPassword(event, ${data.id})">
            <div class="pro-modal-body">
              <p style="font-size:13px; color:#64748b; margin-bottom:16px;">
                Enter a new password for <strong>${data.name}</strong>:
              </p>
              <div>
                <label class="input-label">New Password</label>
                <input type="text" id="newPasswordInput" class="pro-input" required value="Pass@${Math.floor(100 + Math.random() * 900)}">
              </div>
            </div>
            <div class="pro-modal-footer">
              <button type="button" class="btn-pro btn-pro-secondary" onclick="closeModal()">Cancel</button>
              <button type="submit" class="btn-pro btn-pro-primary">Update Password</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  if (type === 'add-category') {
    return `
      <div class="pro-modal-backdrop" onclick="closeModal()">
        <div class="pro-modal-box" onclick="event.stopPropagation()">
          <div class="pro-modal-header">
            <h3 class="pro-modal-title">Add Feedback Category</h3>
            <button class="close-btn" onclick="closeModal()">&times;</button>
          </div>
          <form onsubmit="handleAddCategory(event)">
            <div class="pro-modal-body">
              <div>
                <label class="input-label">Category Name</label>
                <input type="text" id="catNameInput" class="pro-input" required placeholder="e.g. Ambience & Cleanliness">
              </div>
            </div>
            <div class="pro-modal-footer">
              <button type="button" class="btn-pro btn-pro-secondary" onclick="closeModal()">Cancel</button>
              <button type="submit" class="btn-pro btn-pro-primary">Add Category</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  if (type === 'add-question') {
    return `
      <div class="pro-modal-backdrop" onclick="closeModal()">
        <div class="pro-modal-box" onclick="event.stopPropagation()">
          <div class="pro-modal-header">
            <h3 class="pro-modal-title">Add Question to Bank</h3>
            <button class="close-btn" onclick="closeModal()">&times;</button>
          </div>
          <form onsubmit="handleAddQuestion(event)">
            <div class="pro-modal-body">
              <div style="margin-bottom:16px;">
                <label class="input-label">Category</label>
                <select id="qCatSelect" class="pro-select" required>
                  ${state.clientCategories.map(c => `
                    <option value="${c.id}">${c.name}</option>
                  `).join('')}
                </select>
              </div>
              <div>
                <label class="input-label">Question Text</label>
                <input type="text" id="qTextInput" class="pro-input" required placeholder="e.g. How clean and comfortable was the space?">
              </div>
            </div>
            <div class="pro-modal-footer">
              <button type="button" class="btn-pro btn-pro-secondary" onclick="closeModal()">Cancel</button>
              <button type="submit" class="btn-pro btn-pro-primary">Save Question</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  return '';
}

// Global window mappings for inline event triggers
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.quickFill = quickFill;
window.openModal = openModal;
window.closeModal = closeModal;
window.handleCreateClient = handleCreateClient;
window.handleResetPassword = handleResetPassword;
window.deleteClient = deleteClient;
window.switchTab = switchTab;
window.selectColor = selectColor;
window.handleSaveProfile = handleSaveProfile;
window.downloadQrCode = downloadQrCode;
window.handleAddCategory = handleAddCategory;
window.deleteCategory = deleteCategory;
window.handleAddQuestion = handleAddQuestion;
window.deleteQuestion = deleteQuestion;
window.customerNextStep = customerNextStep;
window.skipCustomerInfo = skipCustomerInfo;
window.handleCustomerInfoSubmit = handleCustomerInfoSubmit;
window.rateStar = rateStar;
window.copyAndRedirectToGoogle = copyAndRedirectToGoogle;

// Initial Boot
if (state.currentUser) {
  if (state.currentUser.role === 'admin') {
    loadAdminClients().then(render);
  } else {
    loadClientData().then(render);
  }
} else {
  render();
}
