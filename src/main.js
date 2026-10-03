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
  clientCustomers: [],
  customerSearchQuery: '',
  adminSearchQuery: '',
  customizationDraft: null,
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

// SVG Icon Suite for Crisp Professional UI
const Icons = {
  bolt: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
  sparkles: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/></svg>`,
  users: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  qr: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3z"/><path d="M14 20h6"/><path d="M20 14v6"/></svg>`,
  star: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  building: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><line x1="8" y1="6" x2="10" y2="6"/><line x1="14" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/></svg>`,
  chart: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  palette: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
  phone: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,
  search: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  copy: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  lock: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  user: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  trash: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  externalLink: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
  plus: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
  google: `<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/><path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9z"/><path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.9 7.5 23.5 12 23.5z"/></svg>`
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
        <div style="display:flex; align-items:center; gap:14px; margin-bottom:24px;">
          <div class="brand-icon" style="width:44px; height:44px;">
            ${Icons.bolt}
          </div>
          <div>
            <div style="font-size:24px; font-weight:800; color:#0f172a; letter-spacing:-0.035em; line-height:1.2;">Revly</div>
            <div style="font-size:12px; color:#64748b; font-weight:600;">AI Review & Customer Feedback SaaS</div>
          </div>
        </div>

        <div style="display:inline-flex; align-items:center; gap:6px; background:#eef2ff; border:1px solid #e0e7ff; padding:5px 12px; border-radius:99px; margin-bottom:20px;">
          <span class="live-pill-dot" style="background:#4f46e5; box-shadow:none;"></span>
          <span style="font-size:11.5px; font-weight:700; color:#4f46e5;">OpenAI GPT-4o-mini Connected</span>
        </div>

        <h2 style="font-size:18px; font-weight:800; color:#0f172a; margin-bottom:6px;">Sign in to your dashboard</h2>
        <p style="font-size:13px; color:#64748b; margin-bottom:24px;">Enter your credentials to access your business portal</p>

        ${state.error ? `
          <div style="background:#fee2e2; border:1px solid #fecaca; color:#b91c1c; padding:12px 16px; border-radius:10px; font-size:13px; margin-bottom:20px; display:flex; align-items:center; gap:8px;">
            <span>⚠️</span> <span>${state.error}</span>
          </div>
        ` : ''}

        <form id="loginForm" onsubmit="handleLogin(event)">
          <div style="margin-bottom:18px;">
            <label class="input-label">Username</label>
            <div style="position:relative;">
              <span style="position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#94a3b8; pointer-events:none; display:flex;">
                ${Icons.user}
              </span>
              <input type="text" id="loginUsername" class="pro-input" required placeholder="admin or client username" style="padding-left:42px;" autofocus>
            </div>
          </div>

          <div style="margin-bottom:24px;">
            <label class="input-label">Password</label>
            <div style="position:relative;">
              <span style="position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#94a3b8; pointer-events:none; display:flex;">
                ${Icons.lock}
              </span>
              <input type="password" id="loginPassword" class="pro-input" required placeholder="Enter password" style="padding-left:42px;">
            </div>
          </div>

          <button type="submit" class="btn-pro btn-pro-primary btn-pro-lg" style="width:100%;" ${state.loading ? 'disabled' : ''}>
            ${state.loading ? 'Authenticating...' : 'Sign In to Portal &rarr;'}
          </button>
        </form>

        <div style="margin-top:28px; padding-top:20px; border-top:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center;">
          <div style="font-size:11.5px; font-weight:600; color:#64748b;">
            Quick demo credentials:
          </div>
          <div style="display:flex; gap:6px;">
            <button type="button" class="btn-pro btn-pro-secondary btn-pro-sm" onclick="quickFill('admin', 'admin123')">
              Super Admin
            </button>
            <button type="button" class="btn-pro btn-pro-secondary btn-pro-sm" onclick="quickFill('royalcafe', 'password123')">
              Royal Cafe
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

  const q = (state.adminSearchQuery || '').toLowerCase().trim();
  const filteredClients = state.clients.filter(c => {
    if (!q) return true;
    return (c.name || '').toLowerCase().includes(q) ||
           (c.username || '').toLowerCase().includes(q) ||
           (c.phone || '').toLowerCase().includes(q);
  });

  return `
    <div class="dashboard-shell">
      <!-- Sidebar -->
      <aside class="dash-sidebar">
        <div class="sidebar-header">
          <div class="brand-icon">
            ${Icons.bolt}
          </div>
          <div>
            <div class="brand-title">Revly</div>
            <div class="brand-sub">Super Admin Portal</div>
          </div>
        </div>

        <nav class="sidebar-nav">
          <div class="nav-category-label">Management</div>
          <button class="nav-link active">
            ${Icons.users}
            Client Businesses
          </button>
        </nav>

        <div class="sidebar-footer">
          <div class="user-badge">
            <div class="user-avatar" style="background:#4f46e5;">SA</div>
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
              ${Icons.plus}
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
                <div class="kpi-icon-bubble" style="background:#eef2ff; color:#4f46e5;">
                  ${Icons.building}
                </div>
              </div>
              <div class="kpi-number">${totalClients}</div>
              <div class="kpi-footer">
                <span class="badge-pro badge-emerald">Active</span> Registered accounts
              </div>
            </div>

            <div class="kpi-card">
              <div class="kpi-top">
                <span class="kpi-label">Total QR Scans</span>
                <div class="kpi-icon-bubble" style="background:#f0f9ff; color:#0284c7;">
                  ${Icons.qr}
                </div>
              </div>
              <div class="kpi-number">${totalScans}</div>
              <div class="kpi-footer">
                Platform aggregate visits
              </div>
            </div>

            <div class="kpi-card">
              <div class="kpi-top">
                <span class="kpi-label">AI Reviews Placed</span>
                <div class="kpi-icon-bubble" style="background:#fdf2f8; color:#db2777;">
                  ${Icons.sparkles}
                </div>
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
                <div class="dash-card-desc">View business credentials, preview QR flows, and manage passwords</div>
              </div>
              <div class="search-input-wrap" style="max-width:320px;">
                ${Icons.search}
                <input type="text" class="pro-input" placeholder="Search clients..." value="${state.adminSearchQuery || ''}" oninput="state.adminSearchQuery = this.value; render();" style="padding-left:40px;">
              </div>
            </div>

            <div class="table-container">
              <table class="pro-table">
                <thead>
                  <tr>
                    <th>Business Name</th>
                    <th>Username</th>
                    <th>Phone Number</th>
                    <th>Status</th>
                    <th style="text-align:right;">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredClients.length === 0 ? `
                    <tr>
                      <td colspan="5" style="text-align:center; padding:48px 20px; color:#64748b;">
                        <div style="font-size:32px; margin-bottom:12px;">🏢</div>
                        <div style="font-weight:700; color:#0f172a; margin-bottom:4px;">No client businesses found</div>
                        <div style="font-size:13px; margin-bottom:16px;">Try adjusting your search query or register a new business client.</div>
                        <button class="btn-pro btn-pro-primary" onclick="openModal('create-client')">+ Create New Client</button>
                      </td>
                    </tr>
                  ` : filteredClients.map(c => `
                    <tr>
                      <td>
                        <div style="display:flex; align-items:center; gap:12px;">
                          <div style="width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg, #eef2ff, #e0e7ff); color:#4f46e5; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:13px; border:1px solid #c7d2fe;">
                            ${c.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div style="font-weight:700; font-size:14px; color:#0f172a;">${c.name}</div>
                            <div style="font-size:11px; color:#64748b;">ID #${c.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code style="background:#f1f5f9; padding:4px 8px; border-radius:6px; font-size:12px; color:#334155; font-weight:600; border:1px solid #e2e8f0;">@${c.username}</code>
                      </td>
                      <td>
                        <span style="color:#475569; font-size:13px; font-family:var(--font-mono);">${c.phone || '—'}</span>
                      </td>
                      <td>
                        <span class="badge-pro badge-emerald">
                          <span style="width:5px; height:5px; border-radius:50%; background:#10b981;"></span>
                          Active
                        </span>
                      </td>
                      <td style="text-align:right;">
                        <div style="display:inline-flex; gap:6px;">
                          <a href="/?scan=${c.username}" target="_blank" class="btn-pro btn-pro-secondary btn-pro-sm" title="Preview Customer QR Flow">
                            ${Icons.externalLink}
                            View QR
                          </a>
                          <button class="btn-pro btn-pro-secondary btn-pro-sm" onclick="openModal('reset-password', { id: ${c.id}, name: '${c.name.replace(/'/g, "\\'")}' })" title="Reset Client Password">
                            ${Icons.lock}
                            Password
                          </button>
                          <button class="btn-pro btn-pro-danger btn-pro-sm" onclick="deleteClient(${c.id})" title="Delete Client">
                            ${Icons.trash}
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
    const [pRes, aRes, cRes, qRes, custRes] = await Promise.all([
      fetch(`${API_BASE}/client/profile/${id}`).then(r => r.json()),
      fetch(`${API_BASE}/client/analytics/${id}`).then(r => r.json()),
      fetch(`${API_BASE}/client/categories/${id}`).then(r => r.json()),
      fetch(`${API_BASE}/client/questions/${id}`).then(r => r.json()),
      fetch(`${API_BASE}/client/customers/${id}`).then(r => r.json()).catch(() => [])
    ]);
    state.clientProfile = pRes;
    state.clientAnalytics = aRes;
    state.clientCategories = cRes;
    state.clientQuestions = qRes;
    state.clientCustomers = Array.isArray(custRes) ? custRes : [];
  } catch (e) {
    console.error('Error loading client data:', e);
  }
}

function renderClientBusiness() {
  const user = state.currentUser;
  const p = state.clientProfile || user;
  const a = state.clientAnalytics || { total_scans: 0, total_generated: 0, category_ratings: [], recent_feedback: [] };
  const custCount = state.clientCustomers ? state.clientCustomers.length : 0;

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
            ${Icons.qr}
            Profile & QR Studio
          </button>

          <button class="nav-link ${state.currentTab === 'customization' ? 'active' : ''}" onclick="switchTab('customization')">
            ${Icons.palette}
            Customization
            <span class="badge-pro badge-indigo" style="margin-left:auto; font-size:10px; padding:2px 7px;">Live</span>
          </button>

          <button class="nav-link ${state.currentTab === 'analytics' ? 'active' : ''}" onclick="switchTab('analytics')">
            ${Icons.chart}
            Analytics & Reviews
          </button>

          <button class="nav-link ${state.currentTab === 'customers' ? 'active' : ''}" onclick="switchTab('customers')">
            ${Icons.users}
            Customers
            <span class="badge-pro badge-indigo" style="margin-left:auto; font-size:11px; padding:2px 8px;">${custCount}</span>
          </button>

          <button class="nav-link ${state.currentTab === 'questions' ? 'active' : ''}" onclick="switchTab('questions')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Questions & Category
          </button>
        </nav>

        <div class="sidebar-footer">
          <div class="user-badge">
            <div class="user-avatar" style="background:#4f46e5;">${(p.name || user.name).slice(0, 1).toUpperCase()}</div>
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
              ${state.currentTab === 'customization' ? 'Review Page Customization & Mobile Studio' : ''}
              ${state.currentTab === 'analytics' ? 'Analytics & Performance' : ''}
              ${state.currentTab === 'customers' ? 'Customer Directory & Unique Visitors' : ''}
              ${state.currentTab === 'questions' ? 'Questions & Categories' : ''}
            </h1>
          </div>
          <div class="topbar-right">
            <span class="live-pill">
              <span class="live-pill-dot"></span>
              AI Active (gpt-4o-mini)
            </span>
            <a href="/?scan=${user.username}" target="_blank" class="btn-pro btn-pro-primary">
              ${Icons.externalLink}
              Test Customer QR &rarr;
            </a>
          </div>
        </header>

        <div class="dash-content">
          ${state.currentTab === 'profile' ? renderClientProfileTab(p) : ''}
          ${state.currentTab === 'customization' ? renderClientCustomizationTab(p) : ''}
          ${state.currentTab === 'analytics' ? renderClientAnalyticsTab(a) : ''}
          ${state.currentTab === 'customers' ? renderClientCustomersTab() : ''}
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

        <div style="display:flex; flex-direction:column; gap:12px;">
          <button class="btn-pro btn-pro-primary" onclick="downloadQrCode()">
            ${Icons.qr}
            Download Tabletop Stand (PNG)
          </button>

          <div style="display:flex; gap:8px;">
            <input type="text" class="pro-input" style="font-size:12px; font-family:var(--font-mono);" value="${scanUrl}" readonly>
            <button class="btn-pro btn-pro-secondary btn-pro-sm" onclick="navigator.clipboard.writeText('${scanUrl}'); alert('Customer review scan link copied to clipboard!');">
              ${Icons.copy}
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

// Client Tab: Customization & Live Mobile Screen Studio
function renderClientCustomizationTab(p) {
  if (!state.customizationDraft) {
    state.customizationDraft = {
      bgColor: p.bg_color || '#edf4fc',
      logoUrl: p.logo_url || '',
      bannerUrl: p.banner_url || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
      qrColor: p.qr_color || '#0f172a'
    };
  }

  const d = state.customizationDraft;
  const presets = [
    { name: 'Soft Bluish', color: '#edf4fc' },
    { name: 'Sky Blue', color: '#e0f2fe' },
    { name: 'Indigo Mist', color: '#eef2ff' },
    { name: 'Cool Slate', color: '#f1f5f9' },
    { name: 'Pure White', color: '#ffffff' },
    { name: 'Dark Slate', color: '#0f172a' }
  ];

  return `
    <div class="customization-grid">
      <!-- Left: Customization Settings -->
      <div class="dash-card">
        <h2 class="dash-card-title">Review Page Appearance</h2>
        <div class="dash-card-desc" style="margin-bottom:24px;">
          Customize how customers see your review station. Changes preview live in the mobile screen on the right.
        </div>

        <form onsubmit="handleSaveCustomization(event)">
          <!-- 1. Background Color -->
          <div style="margin-bottom:24px; padding-bottom:20px; border-bottom:1px solid #f1f5f9;">
            <label class="input-label">Screen Background Color (Solid)</label>
            <div style="font-size:12px; color:#64748b; margin-bottom:10px;">
              Select a solid background tone for the customer review page.
            </div>

            <div class="color-swatches-row">
              ${presets.map(opt => `
                <button type="button" 
                  class="color-swatch-circle ${d.bgColor === opt.color ? 'active' : ''}" 
                  style="background:${opt.color};"
                  title="${opt.name}"
                  onclick="updateCustomization('bgColor', '${opt.color}')">
                </button>
              `).join('')}

              <div style="display:flex; align-items:center; gap:8px; margin-left:8px;">
                <input type="color" value="${d.bgColor && d.bgColor.startsWith('#') && d.bgColor.length === 7 ? d.bgColor : '#edf4fc'}" 
                  style="width:36px; height:36px; border:none; border-radius:8px; cursor:pointer;" 
                  oninput="updateCustomization('bgColor', this.value)" title="Choose custom color">
                <span style="font-family:var(--font-mono); font-size:12px; color:#475569;">${d.bgColor}</span>
              </div>
            </div>
          </div>

          <!-- 2. Business Logo -->
          <div style="margin-bottom:24px; padding-bottom:20px; border-bottom:1px solid #f1f5f9;">
            <label class="input-label">Business Logo Image URL</label>
            <div style="font-size:12px; color:#64748b; margin-bottom:8px;">
              Appears at the very top of the review page.
            </div>
            <input type="url" class="pro-input" placeholder="https://example.com/logo.png" 
              value="${d.logoUrl || ''}" 
              oninput="updateCustomization('logoUrl', this.value)">
            
            <div style="display:flex; gap:8px; margin-top:8px; flex-wrap:wrap;">
              <button type="button" class="btn-pro btn-pro-secondary btn-pro-sm" 
                onclick="updateCustomization('logoUrl', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=200&q=80')">
                Coffee Cup Logo
              </button>
              <button type="button" class="btn-pro btn-pro-secondary btn-pro-sm" 
                onclick="updateCustomization('logoUrl', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80')">
                Dining Logo
              </button>
              <button type="button" class="btn-pro btn-pro-secondary btn-pro-sm" 
                onclick="updateCustomization('logoUrl', '')" style="color:#ef4444;">
                Reset to Initials
              </button>
            </div>
          </div>

          <!-- 3. Rectangular Banner Image -->
          <div style="margin-bottom:24px; padding-bottom:20px; border-bottom:1px solid #f1f5f9;">
            <label class="input-label">Cover / Rectangular Image Banner</label>
            <div style="font-size:12px; color:#64748b; margin-bottom:8px;">
              Appears below the logo on the first customer page.
            </div>
            <input type="url" class="pro-input" placeholder="https://example.com/banner.jpg" 
              value="${d.bannerUrl || ''}" 
              oninput="updateCustomization('bannerUrl', this.value)">
            
            <div style="display:flex; gap:8px; margin-top:8px; flex-wrap:wrap;">
              <button type="button" class="btn-pro btn-pro-secondary btn-pro-sm" 
                onclick="updateCustomization('bannerUrl', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80')">
                Cozy Cafe
              </button>
              <button type="button" class="btn-pro btn-pro-secondary btn-pro-sm" 
                onclick="updateCustomization('bannerUrl', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80')">
                Fine Dining
              </button>
              <button type="button" class="btn-pro btn-pro-secondary btn-pro-sm" 
                onclick="updateCustomization('bannerUrl', 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=800&q=80')">
                Lounge Bar
              </button>
            </div>
          </div>

          <!-- 4. Action Button Color -->
          <div style="margin-bottom:28px;">
            <label class="input-label">Brand Button & QR Accent Color</label>
            <div class="color-swatches-row">
              ${[
                { color: '#0f172a', name: 'Dark Slate' },
                { color: '#4f46e5', name: 'Royal Indigo' },
                { color: '#0284c7', name: 'Sky Ocean' },
                { color: '#059669', name: 'Emerald' },
                { color: '#dc2626', name: 'Crimson' }
              ].map(opt => `
                <button type="button" 
                  class="color-swatch-circle ${d.qrColor === opt.color ? 'active' : ''}" 
                  style="background:${opt.color};"
                  title="${opt.name}"
                  onclick="updateCustomization('qrColor', '${opt.color}')">
                </button>
              `).join('')}
            </div>
          </div>

          <button type="submit" class="btn-pro btn-pro-primary btn-pro-lg" style="width:100%;">
            ${Icons.check}
            Save Customization Changes
          </button>
        </form>
      </div>

      <!-- Right: Live Mobile Screen Simulator -->
      <div class="mobile-preview-wrapper">
        <div style="font-size:12px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:12px;">
          Live Mobile Screen Preview
        </div>

        <div class="mobile-device-mockup">
          <div class="mobile-notch">
            <div class="mobile-notch-dot"></div>
          </div>

          <div class="mobile-device-screen" style="background:${d.bgColor};">
            <!-- Mobile Top Status Bar -->
            <div style="display:flex; justify-content:space-between; align-items:center; padding:0 8px 10px; font-size:11px; font-weight:700; color:#334155; opacity:0.8;">
              <span>9:41</span>
              <div style="display:flex; align-items:center; gap:5px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="1" y="16" width="3" height="6" rx="1"/><rect x="7" y="12" width="3" height="10" rx="1"/><rect x="13" y="7" width="3" height="15" rx="1"/><rect x="19" y="2" width="3" height="20" rx="1"/></svg>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="7" width="18" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="4" y="9" width="10" height="6" rx="1"/><path d="M22 11v2"/></svg>
              </div>
            </div>
            <!-- Simulated White Card on Screen -->
            <div style="background:#ffffff; border-radius:20px; padding:20px 16px; border:1px solid rgba(0,0,0,0.06); box-shadow:0 8px 24px rgba(0,0,0,0.06); text-align:center; margin-top:10px;">
              <!-- 1. Top Logo -->
              ${d.logoUrl ? `
                <img src="${d.logoUrl}" class="customer-logo-img" style="width:56px; height:56px; border-radius:16px; margin:0 auto 12px;">
              ` : `
                <div class="customer-logo-img" style="width:56px; height:56px; border-radius:16px; background:#4f46e5; color:#fff; display:flex; align-items:center; justify-content:center; font-size:22px; font-weight:800; margin:0 auto 12px;">
                  ${(p.name || 'R').slice(0, 2).toUpperCase()}
                </div>
              `}

              <!-- 2. Rectangular Banner Image -->
              <img src="${d.bannerUrl || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80'}" 
                class="customer-banner-img" style="height:110px; border-radius:10px; margin-bottom:14px;">

              <!-- 3. Business Name & Description -->
              <h3 style="font-size:17px; font-weight:800; color:#0f172a; margin-bottom:6px;">${p.name || 'Your Business'}</h3>
              <p style="font-size:11px; color:#64748b; line-height:1.4; margin-bottom:14px;">
                Share your experience in 3 quick questions. Our AI prepares your review.
              </p>

              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:6px 10px; font-size:10px; color:#475569; margin-bottom:18px;">
                ⏱️ 45 seconds &bull; 100% genuine
              </div>

              <!-- Button with Brand Color -->
              <div style="background:${d.qrColor || '#4f46e5'}; color:#ffffff; font-weight:700; font-size:13px; padding:10px 16px; border-radius:10px; box-shadow:0 2px 6px rgba(0,0,0,0.15);">
                Start Feedback &rarr;
              </div>
            </div>

            <div style="text-align:center; margin-top:auto; padding-top:14px; font-size:10px; color:#64748b;">
              &bull; Live customer view &bull;
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function updateCustomization(field, value) {
  if (!state.customizationDraft) {
    const p = state.clientProfile || state.currentUser;
    state.customizationDraft = {
      bgColor: p.bg_color || '#edf4fc',
      logoUrl: p.logo_url || '',
      bannerUrl: p.banner_url || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
      qrColor: p.qr_color || '#0f172a'
    };
  }
  state.customizationDraft[field] = value;
  render();
}

async function handleSaveCustomization(e) {
  e.preventDefault();
  const d = state.customizationDraft;
  try {
    const res = await fetch(`${API_BASE}/client/profile/${state.currentUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bg_color: d.bgColor,
        logo_url: d.logoUrl,
        banner_url: d.bannerUrl,
        qr_color: d.qrColor
      })
    });
    if (res.ok) {
      alert('Customization saved successfully!');
      await loadClientData();
      render();
    } else {
      alert('Failed to save customization');
    }
  } catch (err) {
    alert('Error saving customization');
  }
}

// Client Tab 2: Analytics
function renderClientAnalyticsTab(a) {
  return `
    <!-- Key Metrics Grid -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">No. of QR Scans</span>
          <div class="kpi-icon-bubble" style="background:#eef2ff; color:#4f46e5;">
            ${Icons.qr}
          </div>
        </div>
        <div class="kpi-number">${a.total_scans}</div>
        <div class="kpi-footer">
          Customers who visited review page via QR
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Reviews Generated</span>
          <div class="kpi-icon-bubble" style="background:#ecfdf5; color:#059669;">
            ${Icons.sparkles}
          </div>
        </div>
        <div class="kpi-number">${a.total_generated}</div>
        <div class="kpi-footer">
          AI-assisted review drafts completed
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Conversion Rate</span>
          <div class="kpi-icon-bubble" style="background:#fffbeb; color:#d97706;">
            ${Icons.chart}
          </div>
        </div>
        <div class="kpi-number">${a.total_scans > 0 ? Math.round((a.total_generated / a.total_scans) * 100) : 0}%</div>
        <div class="kpi-footer">
          Scan to completed review conversion
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

// Client Tab: Customers Directory (Unique by Mobile Number)
function renderClientCustomersTab() {
  const customers = state.clientCustomers || [];
  const query = (state.customerSearchQuery || '').toLowerCase().trim();

  const filtered = customers.filter(c => {
    if (!query) return true;
    return (c.name || '').toLowerCase().includes(query) || (c.mobile || '').toLowerCase().includes(query);
  });

  const totalUnique = customers.length;
  const totalVisits = customers.reduce((sum, c) => sum + (Number(c.visit_count) || 1), 0);
  const repeatCount = customers.filter(c => (Number(c.visit_count) || 1) > 1).length;
  const repeatRate = totalUnique > 0 ? Math.round((repeatCount / totalUnique) * 100) : 0;
  const totalDrafts = customers.reduce((sum, c) => sum + (Number(c.reviews_count) || 0), 0);

  return `
    <!-- Top KPI Cards for Customers -->
    <div class="customer-stats-grid">
      <div class="customer-stat-box">
        <div class="customer-stat-icon" style="background:#eef2ff; color:#4f46e5;">
          ${Icons.users}
        </div>
        <div>
          <div class="customer-stat-val">${totalUnique}</div>
          <div class="customer-stat-lbl">Unique Customers</div>
        </div>
      </div>

      <div class="customer-stat-box">
        <div class="customer-stat-icon" style="background:#ecfdf5; color:#059669;">
          ${Icons.qr}
        </div>
        <div>
          <div class="customer-stat-val">${totalVisits}</div>
          <div class="customer-stat-lbl">Total Scans / Visits</div>
        </div>
      </div>

      <div class="customer-stat-box">
        <div class="customer-stat-icon" style="background:#fffbeb; color:#d97706;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
        </div>
        <div>
          <div class="customer-stat-val">${repeatCount}</div>
          <div class="customer-stat-lbl">Repeat Visitors (${repeatRate}%)</div>
        </div>
      </div>

      <div class="customer-stat-box">
        <div class="customer-stat-icon" style="background:#f1f5f9; color:#0f172a;">
          ${Icons.star}
        </div>
        <div>
          <div class="customer-stat-val">${totalDrafts}</div>
          <div class="customer-stat-lbl">Reviews Placed</div>
        </div>
      </div>
    </div>

    <!-- Main Customer Table Card -->
    <div class="dash-card">
      <div class="search-filter-row">
        <div>
          <h2 class="dash-card-title" style="margin-bottom:4px;">Customer Directory</h2>
          <div class="dash-card-desc">All customers who scanned your QR code, grouped uniquely by verified mobile number.</div>
        </div>

        <div class="search-input-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" class="pro-input" placeholder="Search by name or mobile number..." value="${state.customerSearchQuery || ''}" oninput="state.customerSearchQuery = this.value; render();">
        </div>
      </div>

      ${filtered.length === 0 ? `
        <div class="empty-state-pro" style="padding:48px 20px; text-align:center;">
          <div style="font-size:36px; margin-bottom:12px;">👥</div>
          <h3 style="font-size:16px; font-weight:700; color:#0f172a; margin-bottom:6px;">${query ? 'No matching customers found' : 'No customer records yet'}</h3>
          <p style="font-size:13px; color:#64748b; max-width:400px; margin:0 auto;">${query ? 'Try searching with a different name or mobile number.' : 'When customers scan your QR code and provide their contact details, they will be tracked here with their unique visit counts.'}</p>
        </div>
      ` : `
        <div class="table-container">
          <table class="pro-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Mobile Number (Unique)</th>
                <th>Total Scans / Visits</th>
                <th>Reviews Drafted</th>
                <th>Last Visited</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map(c => `
                <tr>
                  <td>
                    <div class="customer-name-cell">
                      <div class="customer-avatar-circle">
                        ${(c.name || 'G').slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <div style="font-weight:700; color:#0f172a; font-size:14px;">${c.name || 'Guest'}</div>
                        <div style="font-size:11px; color:#94a3b8;">ID #${c.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="customer-mobile-pill">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                      ${c.mobile}
                    </span>
                  </td>
                  <td>
                    <div style="display:flex; align-items:center; gap:6px;">
                      <span class="visit-count-badge ${Number(c.visit_count) > 1 ? 'repeat-visitor-badge' : ''}">
                        ${c.visit_count} ${Number(c.visit_count) === 1 ? 'Scan' : 'Scans'}
                      </span>
                      ${Number(c.visit_count) > 1 ? '<span style="font-size:11px; font-weight:700; color:#d97706; background:#fffbeb; padding:2px 6px; border-radius:4px; border:1px solid #fef3c7;">Repeat</span>' : ''}
                    </div>
                  </td>
                  <td>
                    <span class="badge-pro badge-indigo">${c.reviews_count || 0} Drafts</span>
                  </td>
                  <td>
                    <div style="font-size:13px; color:#334155; font-weight:600;">
                      ${new Date(c.last_visited).toLocaleDateString(undefined, { month:'short', day:'numeric', year:'numeric' })}
                    </div>
                    <div style="font-size:11px; color:#94a3b8;">
                      ${new Date(c.last_visited).toLocaleTimeString(undefined, { hour:'2-digit', minute:'2-digit' })}
                    </div>
                  </td>
                  <td style="text-align:right;">
                    <button class="btn-pro btn-pro-danger btn-pro-sm" onclick="deleteCustomer(${c.id})" title="Delete customer record">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `;
}

async function deleteCustomer(id) {
  if (!confirm('Are you sure you want to remove this customer record?')) return;
  try {
    const res = await fetch(`${API_BASE}/client/customers/${id}`, { method: 'DELETE' });
    if (res.ok) {
      state.clientCustomers = state.clientCustomers.filter(c => c.id !== id);
      render();
    }
  } catch (err) {
    console.error('Failed to delete customer:', err);
  }
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
      <div class="customer-clean-page" style="background: #edf4fc;">
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
      <div class="customer-clean-page" style="background: #edf4fc;">
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
    const logoHtml = s.logoUrl
      ? `<img src="${s.logoUrl}" alt="${s.businessName}" class="customer-logo-img">`
      : `<div class="customer-logo-img" style="background:${s.qrColor || '#4f46e5'}; color:#ffffff; display:flex; align-items:center; justify-content:center; font-size:26px; font-weight:800; margin:0 auto 14px;">${s.businessName.slice(0, 2).toUpperCase()}</div>`;

    const bannerHtml = s.bannerUrl
      ? `<img src="${s.bannerUrl}" alt="${s.businessName} cover" class="customer-banner-img">`
      : `<img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80" alt="${s.businessName} banner" class="customer-banner-img">`;

    bodyHtml = `
      <div style="text-align:center;">
        <!-- 1. Top Logo -->
        ${logoHtml}

        <!-- 2. Rectangular Image Banner -->
        ${bannerHtml}

        <!-- 3. Rest of Content -->
        <h1 style="font-size:24px; font-weight:800; color:#0f172a; margin-bottom:8px; line-height:1.3;">${s.businessName}</h1>
        <p style="font-size:14px; color:#64748b; line-height:1.6; margin-bottom:24px;">
          Share your experience in 3 quick questions. Our AI will help prepare your review draft.
        </p>

        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:12px 14px; font-size:13px; color:#475569; margin-bottom:28px; display:flex; align-items:center; justify-content:center; gap:8px;">
          ${Icons.bolt}
          <span>Takes less than 45 seconds &bull; 100% genuine</span>
        </div>
      </div>

      <button class="btn-pro btn-pro-primary btn-pro-lg" onclick="customerNextStep(2)" style="width:100%; font-size:16px; padding:14px 20px; background:${s.qrColor || '#4f46e5'};">
        ${Icons.sparkles}
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
            <div style="position:relative;">
              <span style="position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#94a3b8; pointer-events:none; display:flex;">
                ${Icons.user}
              </span>
              <input type="text" id="custNameInput" class="pro-input" placeholder="e.g. Alex" value="${state.customerInfo.name}" style="padding-left:42px; font-size:14px;">
            </div>
          </div>

          <div style="margin-bottom:24px;">
            <label class="input-label" style="font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Mobile Number (Optional)</label>
            <div style="position:relative;">
              <span style="position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#94a3b8; pointer-events:none; display:flex;">
                ${Icons.phone}
              </span>
              <input type="tel" id="custMobileInput" class="pro-input" placeholder="+1 (555) 000-0000" value="${state.customerInfo.mobile}" style="padding-left:42px; font-size:14px;">
            </div>
          </div>

          <button type="submit" class="btn-pro btn-pro-primary btn-pro-lg" style="width:100%; font-size:15px; padding:13px 20px; background:${s.qrColor || '#4f46e5'};">
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
            ${Icons.sparkles}
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
            <span class="badge-pro badge-indigo">${Icons.sparkles} AI Generated</span>
          </div>

          <p style="font-size:13px; color:#64748b; margin-bottom:16px; line-height:1.4;">
            Feel free to edit your text below before continuing to Google.
          </p>

          <textarea id="editableDraft" class="review-arial-box" rows="7" placeholder="Your review text..." oninput="state.generatedReview = this.value; this.style.height='auto'; this.style.height=(this.scrollHeight+10)+'px'">${state.generatedReview}</textarea>

          <div style="background:#ecfdf5; border:1px solid #bbf7d0; border-radius:10px; padding:12px 14px; font-size:12px; color:#047857; line-height:1.5; margin-bottom:24px; display:flex; align-items:flex-start; gap:8px;">
            <span style="display:flex; margin-top:1px;">${Icons.check}</span>
            <span>Clicking below copies this review and opens ${s.businessName}'s Google review page. Simply paste and post!</span>
          </div>

          <button class="btn-pro btn-pro-primary btn-pro-lg" style="width:100%; font-size:16px; padding:14px 20px; display:flex; align-items:center; justify-content:center; gap:10px; background:#0f172a;" onclick="copyAndRedirectToGoogle()">
            ${Icons.google}
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
        <div style="width:72px; height:72px; border-radius:50%; background:#ecfdf5; color:#10b981; display:flex; align-items:center; justify-content:center; font-size:32px; margin:0 auto 20px; border:2px solid #bbf7d0;">
          ${Icons.check}
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

  const topHeader = state.customerStep > 1 ? `
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; padding-bottom:16px; border-bottom:1px solid #f1f5f9;">
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="font-size:18px;">⭐</span>
        <span style="font-weight:700; font-size:15px; color:#0f172a;">${s.businessName}</span>
      </div>
      <span style="font-size:12px; font-weight:600; color:#475569; background:#f8fafc; border:1px solid #e2e8f0; padding:4px 10px; border-radius:99px;">Verified Review</span>
    </div>
  ` : '';

  return `
    <div class="customer-clean-page" style="background: ${s.bgColor || '#edf4fc'};">
      <div class="customer-clean-card">
        ${topHeader}
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

  // Instantly record to customer directory if mobile is provided
  if (state.customerInfo.mobile && state.customerSession) {
    fetch(`${API_BASE}/customer/record-info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: state.customerSession.clientId,
        name: state.customerInfo.name,
        mobile: state.customerInfo.mobile
      })
    }).catch(err => console.warn('Could not record customer info immediately', err));
  }

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
window.updateCustomization = updateCustomization;
window.handleSaveCustomization = handleSaveCustomization;
window.handleAddCategory = handleAddCategory;
window.deleteCategory = deleteCategory;
window.handleAddQuestion = handleAddQuestion;
window.deleteQuestion = deleteQuestion;
window.customerNextStep = customerNextStep;
window.skipCustomerInfo = skipCustomerInfo;
window.handleCustomerInfoSubmit = handleCustomerInfoSubmit;
window.rateStar = rateStar;
window.copyAndRedirectToGoogle = copyAndRedirectToGoogle;
window.deleteCustomer = deleteCustomer;

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
