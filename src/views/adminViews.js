/**
 * Super Admin Application Views
 * Manages businesses, platform metrics, onboarding, and platform activity logs.
 */

export function renderAdminApp(store) {
  const currentView = store.adminView;
  const platform = store.data.platform;

  return `
    <div class="admin-shell">
      <!-- Admin Sidebar -->
      <aside class="admin-sidebar" role="navigation" aria-label="Super Admin Navigation">
        <div class="admin-brand">
          <div class="admin-brand-icon">⚡</div>
          <div>
            <div class="admin-brand-title">RevioPulse</div>
            <div class="admin-brand-sub">Super Admin</div>
          </div>
        </div>

        <nav class="admin-nav">
          <button class="admin-nav-item ${currentView === 'dashboard' ? 'active' : ''}" data-action="admin-navigate" data-view="dashboard">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            Dashboard
          </button>

          <button class="admin-nav-item ${currentView === 'businesses' || currentView === 'create-business' || currentView === 'edit-business' || currentView === 'business-details' ? 'active' : ''}" data-action="admin-navigate" data-view="businesses">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16"></path>
              <path d="M1 21h22"></path>
            </svg>
            Businesses
          </button>

          <button class="admin-nav-item ${currentView === 'activity' ? 'active' : ''}" data-action="admin-navigate" data-view="activity">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
            Platform Activity
          </button>

          <button class="admin-nav-item ${currentView === 'profile' ? 'active' : ''}" data-action="admin-navigate" data-view="profile">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Admin Profile
          </button>
        </nav>

        <div class="admin-user-profile">
          <div style="display:flex; align-items:center;">
            <div class="admin-avatar">${platform.superAdmin.avatar}</div>
            <div class="admin-user-info">
              <div class="admin-user-name">${platform.superAdmin.name}</div>
              <div class="admin-user-role">Super Admin</div>
            </div>
          </div>
          <button class="btn-icon" data-action="admin-logout" title="Logout" style="color:#94a3b8;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </aside>

      <!-- Admin Main View -->
      <main class="app-main" id="adminMain">
        ${renderAdminViewContent(store)}
      </main>
    </div>
  `;
}

function renderAdminViewContent(store) {
  const view = store.adminView;
  switch (view) {
    case 'dashboard':
      return renderAdminDashboard(store);
    case 'businesses':
      return renderAdminBusinessesList(store);
    case 'create-business':
      return renderAdminCreateBusinessScreen(store);
    case 'edit-business':
      return renderAdminEditBusinessScreen(store);
    case 'business-details':
      return renderAdminBusinessDetailsScreen(store);
    case 'activity':
      return renderAdminActivityFeed(store);
    case 'profile':
      return renderAdminProfile(store);
    default:
      return renderAdminDashboard(store);
  }
}

// 1. Super Admin Dashboard View
function renderAdminDashboard(store) {
  const m = store.data.platform.metrics;
  const recentBusinesses = store.data.businesses.slice(0, 5);
  const recentActivity = store.data.platform.activityLog.slice(0, 6);

  return `
    <header class="app-header">
      <div>
        <h1 class="business-greeting">Platform Overview</h1>
        <div class="business-subgreeting">System-wide performance, business accounts, and volume metrics</div>
      </div>
      <div style="display:flex; gap:10px;">
        <button class="btn btn-secondary btn-sm" data-action="admin-navigate" data-view="activity">
          View Audit Log
        </button>
        <button class="btn btn-primary btn-sm" data-action="admin-navigate" data-view="create-business">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          New Business
        </button>
      </div>
    </header>

    <div class="app-content animate-fade">
      <!-- Platform Level Metrics Cards -->
      <div class="grid-kpi" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Total Businesses</span>
            <div class="kpi-icon-wrap" style="color:var(--primary-600); background:var(--primary-50);">🏢</div>
          </div>
          <div class="kpi-value">${m.totalBusinesses}</div>
          <div class="kpi-bottom">
            <span class="kpi-trend up">Live</span>
            <span class="kpi-period">${m.activeBusinesses} active &bull; ${m.inactiveBusinesses} inactive</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Active Accounts</span>
            <div class="kpi-icon-wrap" style="color:var(--success-600); background:var(--success-50);">✅</div>
          </div>
          <div class="kpi-value">${m.activeBusinesses}</div>
          <div class="kpi-bottom">
            <span class="kpi-trend up">${Math.round((m.activeBusinesses/m.totalBusinesses)*100)}%</span>
            <span class="kpi-period">Account health rate</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Total QR Scans</span>
            <div class="kpi-icon-wrap" style="color:var(--info-600); background:var(--info-50);">📱</div>
          </div>
          <div class="kpi-value">${m.totalQrScans.toLocaleString()}</div>
          <div class="kpi-bottom">
            <span class="kpi-trend up">+14.6%</span>
            <span class="kpi-period">Platform aggregate</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Feedback Sessions</span>
            <div class="kpi-icon-wrap" style="color:#7c3aed; background:#f5f3ff;">💬</div>
          </div>
          <div class="kpi-value">${m.totalFeedbackSessions.toLocaleString()}</div>
          <div class="kpi-bottom">
            <span class="kpi-trend up">+12.2%</span>
            <span class="kpi-period">Completed surveys</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">AI Review Drafts</span>
            <div class="kpi-icon-wrap" style="color:#ec4899; background:#fdf2f8;">✨</div>
          </div>
          <div class="kpi-value">${m.totalAiGenerations.toLocaleString()}</div>
          <div class="kpi-bottom">
            <span class="kpi-trend up">+18.0%</span>
            <span class="kpi-period">AI synthesized</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Google Redirects</span>
            <div class="kpi-icon-wrap" style="color:#0284c7; background:#e0f2fe;">🔗</div>
          </div>
          <div class="kpi-value">${m.totalGoogleRedirects.toLocaleString()}</div>
          <div class="kpi-bottom">
            <span class="kpi-trend up">+15.4%</span>
            <span class="kpi-period">To review pages</span>
          </div>
        </div>
      </div>

      <!-- Business Activity Chart and Platform Event Feed -->
      <div class="grid-dashboard-main">
        <!-- Business Activity Chart Simulation -->
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">Business Growth & Activity Trends</h2>
              <div class="card-subtitle">Aggregated feedback sessions vs. Google redirects over the past 3 months</div>
            </div>
            <div class="date-pill-group">
              <button class="date-pill">90 Days</button>
              <button class="date-pill active">30 Days</button>
              <button class="date-pill">7 Days</button>
            </div>
          </div>

          <!-- Chart Visual Bars -->
          <div style="display:flex; align-items:flex-end; gap:20px; height:180px; padding:20px 10px 0; border-bottom:1px solid var(--border-subtle);">
            ${[
              { label: 'Week 1', sessions: 280, redirects: 210 },
              { label: 'Week 2', sessions: 340, redirects: 265 },
              { label: 'Week 3', sessions: 410, redirects: 320 },
              { label: 'Week 4', sessions: 520, redirects: 415 }
            ].map(w => `
              <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:8px;">
                <div style="width:100%; display:flex; gap:6px; justify-content:center; align-items:flex-end; height:130px;">
                  <div style="width:24px; height:${(w.sessions/550)*120}px; background:var(--primary-500); border-radius:4px 4px 0 0;" title="${w.sessions} Sessions"></div>
                  <div style="width:24px; height:${(w.redirects/550)*120}px; background:#10b981; border-radius:4px 4px 0 0;" title="${w.redirects} Redirects"></div>
                </div>
                <div style="font-size:11px; font-weight:600; color:var(--slate-500);">${w.label}</div>
              </div>
            `).join('')}
          </div>
          <div style="display:flex; justify-content:center; gap:24px; margin-top:14px; font-size:12px; font-weight:600;">
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="width:10px; height:10px; background:var(--primary-500); border-radius:2px;"></span>
              <span>Feedback Sessions</span>
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="width:10px; height:10px; background:#10b981; border-radius:2px;"></span>
              <span>Google Redirects</span>
            </div>
          </div>
        </div>

        <!-- Recent Platform Activity Feed -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Recent Activity</h2>
            <button class="btn btn-ghost btn-sm" data-action="admin-navigate" data-view="activity">View All</button>
          </div>
          <div class="activity-timeline">
            ${recentActivity.map(act => `
              <div class="activity-item">
                <div class="activity-dot ${act.type || 'info'}"></div>
                <div class="activity-title">${act.event}</div>
                <div style="font-size:12px; font-weight:600; color:var(--slate-700);">${act.businessName}</div>
                <div class="activity-meta">${act.timestamp}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Recent Businesses Table -->
      <div class="card" style="margin-top:20px;">
        <div class="card-header">
          <div>
            <h2 class="card-title">Recent Businesses</h2>
            <div class="card-subtitle">Recently registered or active customer accounts</div>
          </div>
          <button class="btn btn-secondary btn-sm" data-action="admin-navigate" data-view="businesses">
            Manage All Businesses (${store.data.businesses.length})
          </button>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Business Name</th>
                <th>Category</th>
                <th>Owner / Contact</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>QR Scans</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${recentBusinesses.map(b => `
                <tr>
                  <td>
                    <div style="display:flex; align-items:center; gap:10px;">
                      <div style="width:32px; height:32px; border-radius:8px; background:var(--primary-50); color:var(--primary-600); font-weight:800; display:flex; align-items:center; justify-content:center; font-size:12px;">
                        ${b.logoText || 'BZ'}
                      </div>
                      <div>
                        <div style="font-weight:700; color:var(--slate-900); cursor:pointer;" data-action="admin-view-biz" data-id="${b.id}">${b.name}</div>
                        <div style="font-size:11px; color:var(--slate-400);">${b.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span class="badge badge-slate">${b.category}</span></td>
                  <td>${b.owner}</td>
                  <td>
                    <span class="badge ${b.status === 'Active' ? 'badge-active' : 'badge-inactive'}">
                      <span class="badge-dot"></span>
                      ${b.status}
                    </span>
                  </td>
                  <td>${b.createdDate}</td>
                  <td><strong>${b.metrics?.qrScans || 0}</strong></td>
                  <td style="text-align:right;">
                    <div style="display:inline-flex; gap:4px;">
                      <button class="btn btn-secondary btn-sm" data-action="admin-view-biz" data-id="${b.id}" title="View Details">
                        View
                      </button>
                      <button class="btn btn-ghost btn-sm" data-action="open-edit-business" data-id="${b.id}" title="Edit">
                        Edit
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
  `;
}

// 2. Super Admin Businesses Management Page
function renderAdminBusinessesList(store) {
  const businesses = store.data.businesses;

  return `
    <header class="app-header">
      <div>
        <h1 class="business-greeting">Business Directory</h1>
        <div class="business-subgreeting">Manage client businesses, activation states, and credentials</div>
      </div>
      <button class="btn btn-primary" data-action="admin-navigate" data-view="create-business">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        Create Business
      </button>
    </header>

    <div class="app-content animate-fade">
      <!-- Search, Filter & Sort Bar -->
      <div class="filter-bar">
        <div class="filter-group-left">
          <div class="search-input-wrap" style="flex:1;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" id="adminBizSearch" class="form-input" placeholder="Search by business name, owner, or email..." oninput="window.filterAdminBusinesses && window.filterAdminBusinesses()">
          </div>

          <select id="adminStatusFilter" class="form-select" style="width:140px;" onchange="window.filterAdminBusinesses && window.filterAdminBusinesses()">
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select id="adminCatFilter" class="form-select" style="width:170px;" onchange="window.filterAdminBusinesses && window.filterAdminBusinesses()">
            <option value="all">All Categories</option>
            <option value="Cafe & Restaurant">Cafe & Restaurant</option>
            <option value="Healthcare / Dental">Healthcare / Dental</option>
            <option value="Hospitality & Travel">Hospitality & Travel</option>
            <option value="Salon & Personal Care">Salon & Personal Care</option>
          </select>
        </div>

        <div class="filter-group-right">
          <span style="font-size:12px; color:var(--slate-500);">Showing <strong>${businesses.length}</strong> businesses</span>
        </div>
      </div>

      <!-- Businesses Table -->
      <div class="table-responsive">
        <table class="data-table" id="adminBusinessesTable">
          <thead>
            <tr>
              <th>Business Name</th>
              <th>Owner / Contact</th>
              <th>Category</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>QR Scans</th>
              <th>AI Drafts</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${businesses.map(b => `
              <tr data-biz-row="${b.id}" data-name="${b.name.toLowerCase()}" data-owner="${b.owner.toLowerCase()}" data-status="${b.status}" data-cat="${b.category}">
                <td>
                  <div style="display:flex; align-items:center; gap:10px;">
                    <div style="width:34px; height:34px; border-radius:8px; background:var(--primary-50); color:var(--primary-600); font-weight:800; display:flex; align-items:center; justify-content:center; font-size:12px;">
                      ${b.logoText || 'BZ'}
                    </div>
                    <div>
                      <div style="font-weight:700; color:var(--slate-900); cursor:pointer;" data-action="admin-view-biz" data-id="${b.id}">${b.name}</div>
                      <div style="font-size:11px; color:var(--slate-400);">${b.email} &bull; ${b.phone}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style="font-weight:600;">${b.owner}</div>
                  <div style="font-size:11px; color:var(--slate-400);">@${b.username}</div>
                </td>
                <td><span class="badge badge-slate">${b.category}</span></td>
                <td>
                  <span class="badge ${b.status === 'Active' ? 'badge-active' : 'badge-inactive'}">
                    <span class="badge-dot"></span>
                    ${b.status}
                  </span>
                </td>
                <td>${b.createdDate}</td>
                <td><strong>${b.metrics?.qrScans || 0}</strong></td>
                <td><span class="badge badge-ai">${b.metrics?.aiReviewsGenerated || 0}</span></td>
                <td style="text-align:right;">
                  <div style="display:inline-flex; gap:4px; align-items:center;">
                    <button class="btn btn-secondary btn-sm" data-action="admin-view-biz" data-id="${b.id}" title="View Details">
                      View
                    </button>
                    <button class="btn btn-ghost btn-sm" data-action="open-edit-business" data-id="${b.id}" title="Edit Profile">
                      Edit
                    </button>
                    ${b.status === 'Active' ? `
                      <button class="btn btn-ghost btn-sm" style="color:var(--warning-600);" data-action="open-deactivate-business" data-id="${b.id}" title="Deactivate">
                        Deactivate
                      </button>
                    ` : `
                      <button class="btn btn-ghost btn-sm" style="color:var(--success-600);" data-action="toggle-status" data-id="${b.id}" title="Activate">
                        Activate
                      </button>
                    `}
                    <button class="btn btn-ghost btn-sm" data-action="open-reset-password" data-id="${b.id}" title="Reset Password">
                      Key
                    </button>
                    <button class="btn btn-ghost btn-sm" style="color:var(--danger-500);" data-action="open-delete-business" data-id="${b.id}" title="Delete Business">
                      Trash
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="pagination">
          <div>Showing 1 to ${businesses.length} of ${businesses.length} entries</div>
          <div class="pagination-controls">
            <button class="page-btn" disabled>&laquo;</button>
            <button class="page-btn active">1</button>
            <button class="page-btn" disabled>&raquo;</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 3. Super Admin Create Business Full Screen
function renderAdminCreateBusinessScreen(store) {
  return `
    <header class="app-header">
      <div style="display:flex; align-items:center; gap:12px;">
        <button class="btn-icon" data-action="admin-navigate" data-view="businesses">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        <div>
          <h1 class="business-greeting">Create New Business Account</h1>
          <div class="business-subgreeting">Register a client business and provision automated feedback setup</div>
        </div>
      </div>
    </header>

    <div class="app-content animate-fade" style="max-width:860px; margin:0 auto;">
      <div class="card">
        <form data-action="submit-create-business">
          <div style="margin-bottom:20px; padding-bottom:14px; border-bottom:1px solid var(--border-subtle);">
            <h3 style="font-size:16px; font-weight:700;">Account & Identity Details</h3>
            <p style="font-size:12px; color:var(--slate-500);">Provide client business details to initialize their dedicated QR and question bank.</p>
          </div>

          <div class="form-group">
            <label class="form-label">Business Name <span class="req">*</span></label>
            <input type="text" name="name" class="form-input" required placeholder="e.g. Blue Bottle Coffee & Bakery">
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
            <div class="form-group">
              <label class="form-label">Owner / Contact Person <span class="req">*</span></label>
              <input type="text" name="owner" class="form-input" required placeholder="e.g. Sarah Jenkins">
            </div>
            <div class="form-group">
              <label class="form-label">Industry Category <span class="req">*</span></label>
              <select name="category" class="form-select" required>
                <option value="Cafe & Restaurant">Cafe & Restaurant</option>
                <option value="Healthcare / Dental">Healthcare / Dental</option>
                <option value="Hospitality & Travel">Hospitality & Travel</option>
                <option value="Salon & Personal Care">Salon & Personal Care</option>
                <option value="Retail & Specialty Store">Retail & Specialty Store</option>
                <option value="Automotive Services">Automotive Services</option>
                <option value="Professional Services">Professional Services</option>
              </select>
            </div>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
            <div class="form-group">
              <label class="form-label">Email Address <span class="req">*</span></label>
              <input type="email" name="email" class="form-input" required placeholder="sarah@company.com">
            </div>
            <div class="form-group">
              <label class="form-label">Mobile Number <span class="req">*</span></label>
              <input type="tel" name="phone" class="form-input" required placeholder="+1 (555) 019-2834">
            </div>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
            <div class="form-group">
              <label class="form-label">Username for Dashboard Login <span class="req">*</span></label>
              <input type="text" name="username" class="form-input" required placeholder="e.g. bluebottle_admin">
            </div>
            <div class="form-group">
              <label class="form-label">Initial Password <span class="req">*</span></label>
              <div style="position:relative;">
                <input type="password" id="screenInitPassword" name="password" class="form-input" required value="SecurePass@2026">
                <button type="button" class="btn-icon" style="position:absolute; right:4px; top:4px;" onclick="const el=document.getElementById('screenInitPassword'); el.type = el.type==='password'?'text':'password';">
                  👁
                </button>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Physical Business Address</label>
            <input type="text" name="address" class="form-input" placeholder="e.g. 104 Pike Place, Seattle, WA 98101">
          </div>

          <div class="form-group">
            <label class="form-label">Google Review URL (Optional - can be configured later)</label>
            <input type="url" name="googleReviewUrl" class="form-input" placeholder="https://search.google.com/local/writereview?placeid=...">
            <span class="form-hint">Customers will be redirected here after AI drafts their review.</span>
          </div>

          <div class="form-group">
            <label class="form-label">Initial Status</label>
            <select name="status" class="form-select">
              <option value="Active" selected>Active (QR immediately accessible)</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:24px; padding-top:16px; border-top:1px solid var(--border-subtle);">
            <button type="button" class="btn btn-secondary" data-action="admin-navigate" data-view="businesses">Cancel</button>
            <button type="submit" class="btn btn-primary">Provision & Create Business</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// 4. Super Admin Edit Business Screen
function renderAdminEditBusinessScreen(store) {
  const bizId = store.activeParams.id || store.currentBusinessId;
  const biz = store.data.businesses.find(b => b.id === bizId);
  if (!biz) return renderAdminBusinessesList(store);

  return `
    <header class="app-header">
      <div style="display:flex; align-items:center; gap:12px;">
        <button class="btn-icon" data-action="admin-navigate" data-view="businesses">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        <div>
          <h1 class="business-greeting">Edit: ${biz.name}</h1>
          <div class="business-subgreeting">Update client business settings and credentials</div>
        </div>
      </div>
    </header>

    <div class="app-content animate-fade" style="max-width:800px; margin:0 auto;">
      <div class="card">
        <form data-action="submit-edit-business" data-id="${biz.id}">
          <div class="form-group">
            <label class="form-label">Business Name <span class="req">*</span></label>
            <input type="text" name="name" class="form-input" required value="${biz.name}">
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
            <div class="form-group">
              <label class="form-label">Owner / Contact <span class="req">*</span></label>
              <input type="text" name="owner" class="form-input" required value="${biz.owner}">
            </div>
            <div class="form-group">
              <label class="form-label">Category <span class="req">*</span></label>
              <select name="category" class="form-select" required>
                <option value="Cafe & Restaurant" ${biz.category === 'Cafe & Restaurant' ? 'selected' : ''}>Cafe & Restaurant</option>
                <option value="Healthcare / Dental" ${biz.category === 'Healthcare / Dental' ? 'selected' : ''}>Healthcare / Dental</option>
                <option value="Hospitality & Travel" ${biz.category === 'Hospitality & Travel' ? 'selected' : ''}>Hospitality & Travel</option>
                <option value="Salon & Personal Care" ${biz.category === 'Salon & Personal Care' ? 'selected' : ''}>Salon & Personal Care</option>
                <option value="Retail & Specialty Store" ${biz.category === 'Retail & Specialty Store' ? 'selected' : ''}>Retail & Specialty Store</option>
                <option value="Automotive Services" ${biz.category === 'Automotive Services' ? 'selected' : ''}>Automotive Services</option>
                <option value="Professional Services" ${biz.category === 'Professional Services' ? 'selected' : ''}>Professional Services</option>
              </select>
            </div>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" name="email" class="form-input" required value="${biz.email}">
            </div>
            <div class="form-group">
              <label class="form-label">Phone</label>
              <input type="tel" name="phone" class="form-input" value="${biz.phone}">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Physical Address</label>
            <input type="text" name="address" class="form-input" value="${biz.address}">
          </div>

          <div class="form-group">
            <label class="form-label">Account Status</label>
            <select name="status" class="form-select">
              <option value="Active" ${biz.status === 'Active' ? 'selected' : ''}>Active</option>
              <option value="Inactive" ${biz.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
            </select>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:24px; padding-top:16px; border-top:1px solid var(--border-subtle);">
            <button type="button" class="btn btn-secondary" data-action="open-reset-password" data-id="${biz.id}">
              Reset Password
            </button>
            <div style="display:flex; gap:10px;">
              <button type="button" class="btn btn-secondary" data-action="admin-navigate" data-view="businesses">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `;
}

// 5. Super Admin Business Details Screen
function renderAdminBusinessDetailsScreen(store) {
  const bizId = store.activeParams.id || store.currentBusinessId;
  const biz = store.data.businesses.find(b => b.id === bizId);
  if (!biz) return renderAdminBusinessesList(store);

  return `
    <header class="app-header">
      <div style="display:flex; align-items:center; gap:12px;">
        <button class="btn-icon" data-action="admin-navigate" data-view="businesses">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        <div>
          <h1 class="business-greeting">${biz.name}</h1>
          <div class="business-subgreeting">Account ID: ${biz.id} &bull; Created ${biz.createdDate}</div>
        </div>
      </div>
      <div style="display:flex; gap:10px;">
        <button class="btn btn-secondary btn-sm" data-action="open-edit-business" data-id="${biz.id}">
          Edit Details
        </button>
        <button class="btn btn-primary btn-sm" data-action="switch-to-business-portal" data-id="${biz.id}">
          Launch Business Portal &rarr;
        </button>
      </div>
    </header>

    <div class="app-content animate-fade">
      <div class="grid-kpi" style="margin-bottom:20px;">
        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">QR Scans</span>
            <div class="kpi-icon-wrap">📱</div>
          </div>
          <div class="kpi-value">${biz.metrics?.qrScans || 0}</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Feedback Sessions</span>
            <div class="kpi-icon-wrap">💬</div>
          </div>
          <div class="kpi-value">${biz.metrics?.feedbackCompleted || 0}</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">AI Drafts Generated</span>
            <div class="kpi-icon-wrap">✨</div>
          </div>
          <div class="kpi-value">${biz.metrics?.aiReviewsGenerated || 0}</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Google Redirects</span>
            <div class="kpi-icon-wrap">🔗</div>
          </div>
          <div class="kpi-value">${biz.metrics?.googleRedirects || 0}</div>
        </div>
      </div>

      <div class="grid-two-col">
        <!-- Business Information Card -->
        <div class="card">
          <h3 class="card-title" style="margin-bottom:14px;">Business Information</h3>
          <div style="display:flex; flex-direction:column; gap:12px; font-size:13px;">
            <div style="display:flex; justify-content:space-between; padding-bottom:8px; border-bottom:1px solid var(--border-subtle);">
              <span style="color:var(--slate-500);">Account Status</span>
              <span class="badge ${biz.status === 'Active' ? 'badge-active' : 'badge-inactive'}">${biz.status}</span>
            </div>
            <div style="display:flex; justify-content:space-between; padding-bottom:8px; border-bottom:1px solid var(--border-subtle);">
              <span style="color:var(--slate-500);">Owner / Contact</span>
              <span style="font-weight:700;">${biz.owner}</span>
            </div>
            <div style="display:flex; justify-content:space-between; padding-bottom:8px; border-bottom:1px solid var(--border-subtle);">
              <span style="color:var(--slate-500);">Category</span>
              <span style="font-weight:600;">${biz.category}</span>
            </div>
            <div style="display:flex; justify-content:space-between; padding-bottom:8px; border-bottom:1px solid var(--border-subtle);">
              <span style="color:var(--slate-500);">Email Address</span>
              <span>${biz.email}</span>
            </div>
            <div style="display:flex; justify-content:space-between; padding-bottom:8px; border-bottom:1px solid var(--border-subtle);">
              <span style="color:var(--slate-500);">Mobile Phone</span>
              <span>${biz.phone}</span>
            </div>
            <div style="display:flex; justify-content:space-between; padding-bottom:8px; border-bottom:1px solid var(--border-subtle);">
              <span style="color:var(--slate-500);">Physical Address</span>
              <span>${biz.address || 'Not specified'}</span>
            </div>
            <div style="display:flex; justify-content:space-between; padding-bottom:8px; border-bottom:1px solid var(--border-subtle);">
              <span style="color:var(--slate-500);">Google Review URL</span>
              <span style="max-width:250px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:var(--primary-600);">
                ${biz.googleReviewUrl || 'Not configured'}
              </span>
            </div>
          </div>
        </div>

        <!-- Quick Actions & Onboarding Credentials -->
        <div class="card">
          <h3 class="card-title" style="margin-bottom:14px;">Account Access & Actions</h3>
          <p style="font-size:12px; color:var(--slate-500); margin-bottom:14px;">Credentials used by the business owner to access their business dashboard.</p>

          <div class="credentials-box">
            <div class="credentials-row">
              <span class="credentials-label">Portal URL:</span>
              <span class="credentials-val">https://app.reviopulse.ai/portal</span>
            </div>
            <div class="credentials-row">
              <span class="credentials-label">Username:</span>
              <span class="credentials-val">${biz.username}</span>
            </div>
            <div class="credentials-row">
              <span class="credentials-label">Status:</span>
              <span style="color:${biz.status==='Active' ? '#4ade80' : '#f87171'}; font-weight:700;">${biz.status}</span>
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:8px; margin-top:16px;">
            <button class="btn btn-secondary" data-action="switch-to-business-portal" data-id="${biz.id}">
              Login As Business
            </button>
            <button class="btn btn-secondary" data-action="open-reset-password" data-id="${biz.id}">
              Reset Business Password
            </button>
            <button class="btn btn-ghost" style="color:var(--danger-500);" data-action="open-delete-business" data-id="${biz.id}">
              Delete Business Account
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 6. Super Admin Activity Feed
function renderAdminActivityFeed(store) {
  const logs = store.data.platform.activityLog;

  return `
    <header class="app-header">
      <div>
        <h1 class="business-greeting">Platform Activity & Audit Log</h1>
        <div class="business-subgreeting">Real-time chronicle of account changes, activations, and security events</div>
      </div>
    </header>

    <div class="app-content animate-fade" style="max-width:860px; margin:0 auto;">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Activity Trail</h2>
          <span style="font-size:12px; color:var(--slate-500);">${logs.length} logged events</span>
        </div>

        <div class="activity-timeline" style="margin-top:10px;">
          ${logs.map(log => `
            <div class="activity-item">
              <div class="activity-dot ${log.type || 'info'}"></div>
              <div class="activity-title" style="font-size:14px; font-weight:700;">${log.event}</div>
              <div style="font-size:13px; color:var(--slate-800); font-weight:600;">${log.businessName}</div>
              <div class="activity-meta">${log.timestamp} &bull; Verified Platform Action</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// 7. Super Admin Profile Screen
function renderAdminProfile(store) {
  const admin = store.data.platform.superAdmin;

  return `
    <header class="app-header">
      <div>
        <h1 class="business-greeting">Super Admin Profile</h1>
        <div class="business-subgreeting">Manage administrative security credentials and profile</div>
      </div>
    </header>

    <div class="app-content animate-fade" style="max-width:680px; margin:0 auto;">
      <div class="card">
        <div style="display:flex; align-items:center; gap:16px; margin-bottom:24px; padding-bottom:16px; border-bottom:1px solid var(--border-subtle);">
          <div class="admin-avatar" style="width:60px; height:60px; font-size:22px; background:var(--primary-600);">${admin.avatar}</div>
          <div>
            <h2 style="font-size:18px; font-weight:800; color:var(--slate-900);">${admin.name}</h2>
            <div style="font-size:13px; color:var(--slate-500);">${admin.role}</div>
            <div style="font-size:11px; color:var(--slate-400); margin-top:2px;">Last login: ${admin.lastLogin}</div>
          </div>
        </div>

        <form onsubmit="event.preventDefault(); window.appStore.showToast('Admin profile saved successfully.');">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-input" value="${admin.name}">
          </div>

          <div class="form-group">
            <label class="form-label">Super Admin Email</label>
            <input type="email" class="form-input" value="${admin.email}">
          </div>

          <div class="form-group">
            <label class="form-label">Current Role</label>
            <input type="text" class="form-input" value="${admin.role}" disabled>
          </div>

          <div style="display:flex; justify-content:flex-end; margin-top:20px;">
            <button type="submit" class="btn btn-primary">Save Profile</button>
          </div>
        </form>
      </div>
    </div>
  `;
}
