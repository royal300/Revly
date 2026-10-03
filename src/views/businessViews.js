/**
 * Business Application Views
 * Comprehensive multi-tenant business dashboard, feedback management,
 * customer analytics, question bank, Google Review setup, and QR code studio.
 */

export function renderBusinessApp(store) {
  const currentView = store.businessView;
  const biz = store.getCurrentBusiness();
  const override = store.overrideState;

  // Handle Empty State Override for Business
  const isEmptyOverride = override === 'empty';
  const isLoadingOverride = override === 'loading';

  return `
    <div class="business-shell">
      <!-- Business Sidebar -->
      <aside class="app-sidebar" role="navigation" aria-label="Business Navigation">
        <div style="padding: 22px 20px; border-bottom: 1px solid var(--border-subtle); display:flex; align-items:center; gap:10px;">
          <div style="width:36px; height:36px; border-radius:10px; background:var(--primary-600); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:14px; box-shadow:var(--shadow-primary);">
            ${biz.logoText || 'BZ'}
          </div>
          <div style="min-width:0; flex:1;">
            <div style="font-size:14px; font-weight:800; color:var(--slate-900); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${biz.name}
            </div>
            <div style="font-size:11px; color:var(--slate-500); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${biz.category}
            </div>
          </div>
        </div>

        <nav style="padding: 16px 12px; display:flex; flex-direction:column; gap:3px; flex:1; overflow-y:auto;">
          <button class="admin-nav-item ${currentView === 'dashboard' ? 'active' : ''}" style="color:var(--slate-700);" data-action="biz-navigate" data-view="dashboard">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Dashboard
          </button>

          <button class="admin-nav-item ${currentView === 'feedback' ? 'active' : ''}" style="color:var(--slate-700);" data-action="biz-navigate" data-view="feedback">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            Feedback
          </button>

          <button class="admin-nav-item ${currentView === 'analytics' ? 'active' : ''}" style="color:var(--slate-700);" data-action="biz-navigate" data-view="analytics">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            Analytics
          </button>

          <button class="admin-nav-item ${currentView === 'customers' ? 'active' : ''}" style="color:var(--slate-700);" data-action="biz-navigate" data-view="customers">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Customers
          </button>

          <div style="height:1px; background:var(--border-subtle); margin:8px 0;"></div>

          <div style="font-size:10px; font-weight:700; text-transform:uppercase; color:var(--slate-400); padding:4px 14px; letter-spacing:0.06em;">Review Journey</div>

          <button class="admin-nav-item ${currentView === 'questions' ? 'active' : ''}" style="color:var(--slate-700);" data-action="biz-navigate" data-view="questions">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            Questions Bank
          </button>

          <button class="admin-nav-item ${currentView === 'categories' ? 'active' : ''}" style="color:var(--slate-700);" data-action="biz-navigate" data-view="categories">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
            Categories
          </button>

          <button class="admin-nav-item ${currentView === 'google-setup' ? 'active' : ''}" style="color:var(--slate-700);" data-action="biz-navigate" data-view="google-setup">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
            Google Review Setup
          </button>

          <button class="admin-nav-item ${currentView === 'qr-code' ? 'active' : ''}" style="color:var(--slate-700);" data-action="biz-navigate" data-view="qr-code">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><path d="M14 14h3v3h-3z"></path><path d="M14 20h6"></path><path d="M20 14v6"></path></svg>
            QR Code & Print Studio
          </button>

          <div style="height:1px; background:var(--border-subtle); margin:8px 0;"></div>

          <button class="admin-nav-item ${currentView === 'profile' ? 'active' : ''}" style="color:var(--slate-700);" data-action="biz-navigate" data-view="profile">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            Business Profile
          </button>

          <button class="admin-nav-item ${currentView === 'settings' ? 'active' : ''}" style="color:var(--slate-700);" data-action="biz-navigate" data-view="settings">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            Settings
          </button>
        </nav>

        <div style="padding:14px 16px; border-top:1px solid var(--border-subtle); display:flex; align-items:center; justify-content:space-between;">
          <div>
            <div style="font-size:12px; font-weight:700; color:var(--slate-800);">${biz.owner}</div>
            <div style="font-size:10px; color:var(--slate-400);">Logged in</div>
          </div>
          <button class="btn-icon" data-action="biz-logout" title="Sign out">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </button>
        </div>
      </aside>

      <!-- Business Main View Area -->
      <main class="app-main" id="bizMain">
        ${renderBusinessContent(store, currentView, biz, isEmptyOverride, isLoadingOverride)}
      </main>
    </div>
  `;
}

function renderBusinessContent(store, view, biz, isEmpty, isLoading) {
  if (isLoading) {
    return renderLoadingSkeletonScreen();
  }

  switch (view) {
    case 'dashboard':
      return renderBusinessDashboard(store, biz, isEmpty);
    case 'feedback':
      return renderFeedbackPage(store, biz, isEmpty);
    case 'analytics':
      return renderAnalyticsPage(store, biz, isEmpty);
    case 'customers':
      return renderCustomersPage(store, biz, isEmpty);
    case 'questions':
      return renderQuestionsPage(store, biz, isEmpty);
    case 'categories':
      return renderCategoriesPage(store, biz, isEmpty);
    case 'google-setup':
      return renderGoogleSetupPage(store, biz);
    case 'qr-code':
      return renderQrCodePage(store, biz);
    case 'profile':
      return renderBusinessProfilePage(store, biz);
    case 'settings':
      return renderBusinessSettingsPage(store, biz);
    default:
      return renderBusinessDashboard(store, biz, isEmpty);
  }
}

// 1. Business Dashboard View
function renderBusinessDashboard(store, biz, isEmpty) {
  const m = biz.metrics;
  const categories = biz.categories;
  const dist = biz.ratingDistribution;

  return `
    <header class="app-header">
      <div class="business-header-left">
        <h1 class="business-greeting">Good Morning, ${biz.name}</h1>
        <div class="business-subgreeting">Here's your live customer feedback pulse and review conversion summary</div>
      </div>
      <div style="display:flex; align-items:center; gap:12px;">
        <div class="date-pill-group">
          <button class="date-pill">7 Days</button>
          <button class="date-pill active">30 Days</button>
          <button class="date-pill">This Month</button>
          <button class="date-pill">Previous Month</button>
        </div>
        <button class="btn btn-primary btn-sm" data-action="biz-navigate" data-view="qr-code">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          Get QR Standee
        </button>
      </div>
    </header>

    <div class="app-content animate-fade">
      ${!biz.googleReviewUrl ? `
        <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:var(--radius-lg); padding:14px 18px; margin-bottom:20px; display:flex; align-items:center; justify-content:space-between; gap:16px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:32px; height:32px; border-radius:50%; background:#fef3c7; color:#d97706; display:flex; align-items:center; justify-content:center; font-weight:800;">⚠️</div>
            <div>
              <div style="font-size:13px; font-weight:700; color:#92400e;">Google Review URL is not configured yet</div>
              <div style="font-size:12px; color:#b45309;">Add your Google review URL to automatically redirect customers after feedback.</div>
            </div>
          </div>
          <button class="btn btn-warning btn-sm" data-action="biz-navigate" data-view="google-setup" style="background:#f59e0b; color:#fff; border:none;">
            Configure URL
          </button>
        </div>
      ` : ''}

      <!-- Main KPI Cards with comparison indicators -->
      <div class="grid-kpi">
        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">QR Scans</span>
            <div class="kpi-icon-wrap">📱</div>
          </div>
          <div class="kpi-value">${isEmpty ? '0' : m.qrScans.toLocaleString()}</div>
          <div class="kpi-bottom">
            <span class="kpi-trend up">${m.scansTrend}</span>
            <span class="kpi-period">vs. last month</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Completed Feedback</span>
            <div class="kpi-icon-wrap" style="color:var(--success-600); background:var(--success-50);">💬</div>
          </div>
          <div class="kpi-value">${isEmpty ? '0' : m.feedbackCompleted.toLocaleString()}</div>
          <div class="kpi-bottom">
            <span class="kpi-trend up">${m.feedbackTrend}</span>
            <span class="kpi-period">vs. last month</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">AI Reviews Generated</span>
            <div class="kpi-icon-wrap" style="color:#7c3aed; background:#f5f3ff;">✨</div>
          </div>
          <div class="kpi-value">${isEmpty ? '0' : m.aiReviewsGenerated.toLocaleString()}</div>
          <div class="kpi-bottom">
            <span class="kpi-trend up">+16.2%</span>
            <span class="kpi-period">vs. last month</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Google Redirects</span>
            <div class="kpi-icon-wrap" style="color:#0284c7; background:#e0f2fe;">🔗</div>
          </div>
          <div class="kpi-value">${isEmpty ? '0' : m.googleRedirects.toLocaleString()}</div>
          <div class="kpi-bottom">
            <span class="kpi-trend up">${m.redirectsTrend}</span>
            <span class="kpi-period">vs. last month</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Feedback Rating</span>
            <div class="kpi-icon-wrap" style="color:#d97706; background:#fef3c7;">★</div>
          </div>
          <div class="kpi-value">${isEmpty ? '—' : `${m.avgRating} / 5`}</div>
          <div class="kpi-bottom">
            <span class="kpi-trend up">${m.ratingTrend}</span>
            <span class="kpi-period">Internal survey avg</span>
          </div>
        </div>
      </div>

      <!-- Customer Journey Funnel Section -->
      <div class="card" style="margin-bottom:24px;">
        <div class="card-header">
          <div>
            <h2 class="card-title">Customer Journey Funnel</h2>
            <div class="card-subtitle">End-to-end conversion: From physical QR scan to Google review redirect</div>
          </div>
          <div style="font-size:12px; color:var(--slate-500);">
            Overall Funnel Conversion: <strong>${isEmpty ? '0%' : `${Math.round((m.googleRedirects / m.qrScans) * 100)}%`}</strong>
          </div>
        </div>

        <div class="funnel-container">
          <!-- Step 1: QR Scans -->
          <div class="funnel-step">
            <div style="width:130px; font-size:12px; font-weight:700; color:var(--slate-800);">1. QR Scans</div>
            <div class="funnel-step-bar-wrap">
              <div class="funnel-step-track">
                <div class="funnel-step-fill" style="width:100%;">
                  ${isEmpty ? '0' : m.qrScans.toLocaleString()} Scans
                </div>
              </div>
            </div>
            <div class="funnel-conversion-badge">100%</div>
          </div>

          <!-- Step 2: Customer Info Completed -->
          <div class="funnel-step">
            <div style="width:130px; font-size:12px; font-weight:700; color:var(--slate-800);">2. Customer Info</div>
            <div class="funnel-step-bar-wrap">
              <div class="funnel-step-track">
                <div class="funnel-step-fill" style="width:${isEmpty ? 0 : (m.customerInfoCompleted / m.qrScans) * 100}%;">
                  ${isEmpty ? '0' : m.customerInfoCompleted.toLocaleString()} Provided Info
                </div>
              </div>
            </div>
            <div class="funnel-conversion-badge">${isEmpty ? '0%' : `${Math.round((m.customerInfoCompleted / m.qrScans) * 100)}%`}</div>
          </div>

          <!-- Step 3: Questions Completed -->
          <div class="funnel-step">
            <div style="width:130px; font-size:12px; font-weight:700; color:var(--slate-800);">3. Questions Done</div>
            <div class="funnel-step-bar-wrap">
              <div class="funnel-step-track">
                <div class="funnel-step-fill" style="width:${isEmpty ? 0 : (m.feedbackCompleted / m.qrScans) * 100}%;">
                  ${isEmpty ? '0' : m.feedbackCompleted.toLocaleString()} Rated 3 Questions
                </div>
              </div>
            </div>
            <div class="funnel-conversion-badge">${isEmpty ? '0%' : `${Math.round((m.feedbackCompleted / m.qrScans) * 100)}%`}</div>
          </div>

          <!-- Step 4: AI Reviews Generated -->
          <div class="funnel-step">
            <div style="width:130px; font-size:12px; font-weight:700; color:var(--slate-800);">4. AI Draft Ready</div>
            <div class="funnel-step-bar-wrap">
              <div class="funnel-step-track">
                <div class="funnel-step-fill ai" style="width:${isEmpty ? 0 : (m.aiReviewsGenerated / m.qrScans) * 100}%;">
                  ${isEmpty ? '0' : m.aiReviewsGenerated.toLocaleString()} Drafts Generated
                </div>
              </div>
            </div>
            <div class="funnel-conversion-badge">${isEmpty ? '0%' : `${Math.round((m.aiReviewsGenerated / m.qrScans) * 100)}%`}</div>
          </div>

          <!-- Step 5: Google Redirects -->
          <div class="funnel-step">
            <div style="width:130px; font-size:12px; font-weight:700; color:var(--slate-800);">5. Google Redirect</div>
            <div class="funnel-step-bar-wrap">
              <div class="funnel-step-track">
                <div class="funnel-step-fill redirect" style="width:${isEmpty ? 0 : (m.googleRedirects / m.qrScans) * 100}%;">
                  ${isEmpty ? '0' : m.googleRedirects.toLocaleString()} Redirected to Google
                </div>
              </div>
            </div>
            <div class="funnel-conversion-badge">${isEmpty ? '0%' : `${Math.round((m.googleRedirects / m.qrScans) * 100)}%`}</div>
          </div>
        </div>

        <div style="margin-top:12px; font-size:11px; color:var(--slate-400); text-align:right;">
          * Note: Google Redirects log customer hand-off to the Google review interface; Google does not permit programmatic verification of published reviews.
        </div>
      </div>

      <!-- Category Performance & Rating Distribution -->
      <div class="grid-two-col">
        <!-- Category Performance Table -->
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">Category Performance</h2>
              <div class="card-subtitle">Ratings breakdown across feedback touchpoints</div>
            </div>
            <button class="btn btn-ghost btn-sm" data-action="biz-navigate" data-view="categories">Manage</button>
          </div>

          ${isEmpty || categories.length === 0 ? `
            <div class="empty-state">
              <div class="empty-icon-wrap">📊</div>
              <div class="empty-title">No categories tracked yet</div>
              <div class="empty-desc">Create feedback categories to structure your question bank and analytics.</div>
              <button class="btn btn-primary btn-sm" data-action="open-add-category">Add Category</button>
            </div>
          ` : `
            <div>
              ${categories.map(c => `
                <div class="cat-stat-card">
                  <div>
                    <div class="cat-stat-title">${c.name}</div>
                    <div class="cat-stat-meta">${c.responses} responses &bull; ${c.questionCount} questions active</div>
                  </div>
                  <div class="cat-score-badge">
                    <span>★</span>
                    <span>${c.avgRating.toFixed(1)}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Rating Distribution 5-star to 1-star -->
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">Rating Distribution</h2>
              <div class="card-subtitle">Platform customer sentiment breakdown</div>
            </div>
            <span class="badge badge-active">${isEmpty ? '0' : m.feedbackCompleted} Total Ratings</span>
          </div>

          ${isEmpty ? `
            <div class="empty-state">
              <div class="empty-icon-wrap">⭐</div>
              <div class="empty-title">No rating data yet</div>
              <div class="empty-desc">Ratings will populate here once customers scan your QR code.</div>
            </div>
          ` : `
            <div style="padding: 10px 0;">
              ${[
                { stars: 5, count: dist.star5, pct: Math.round((dist.star5 / m.feedbackCompleted) * 100) },
                { stars: 4, count: dist.star4, pct: Math.round((dist.star4 / m.feedbackCompleted) * 100) },
                { stars: 3, count: dist.star3, pct: Math.round((dist.star3 / m.feedbackCompleted) * 100) },
                { stars: 2, count: dist.star2, pct: Math.round((dist.star2 / m.feedbackCompleted) * 100) },
                { stars: 1, count: dist.star1, pct: Math.round((dist.star1 / m.feedbackCompleted) * 100) }
              ].map(r => `
                <div class="rating-dist-row">
                  <div class="rating-dist-label">${r.stars} Star</div>
                  <div class="rating-dist-bar">
                    <div class="rating-dist-fill" style="width: ${r.pct}%;"></div>
                  </div>
                  <div class="rating-dist-count">${r.count}</div>
                  <div style="width:38px; text-align:right; font-size:11px; color:var(--slate-400);">${r.pct}%</div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}

// 2. Feedback Management Page
function renderFeedbackPage(store, biz, isEmpty) {
  const feedbacks = isEmpty ? [] : biz.feedbackList;

  return `
    <header class="app-header">
      <div>
        <h1 class="business-greeting">Customer Feedback Records</h1>
        <div class="business-subgreeting">Detailed responses, customer comments, and AI-generated review drafts</div>
      </div>
      <div style="font-size:12px; color:var(--slate-500);">
        Total: <strong>${feedbacks.length}</strong> records
      </div>
    </header>

    <div class="app-content animate-fade">
      <div class="filter-bar">
        <div class="filter-group-left">
          <div class="search-input-wrap" style="flex:1;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" class="form-input" placeholder="Search by customer name or keyword..." oninput="window.filterFeedbackTable && window.filterFeedbackTable()">
          </div>

          <select class="form-select" style="width:140px;">
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="1-2">1-2 Stars</option>
          </select>

          <select class="form-select" style="width:160px;">
            <option value="all">All Redirect States</option>
            <option value="Redirected">Redirected to Google</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      ${feedbacks.length === 0 ? `
        <div class="empty-state">
          <div class="empty-icon-wrap">💬</div>
          <div class="empty-title">No customer feedback yet</div>
          <div class="empty-desc">Completed feedback sessions from customers scanning your QR code will appear here.</div>
          <button class="btn btn-primary" data-action="biz-navigate" data-view="qr-code">View Business QR Code</button>
        </div>
      ` : `
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Date & Time</th>
                <th>Ratings Given</th>
                <th>Overall Feedback Snippet</th>
                <th>Google Status</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${feedbacks.map(f => `
                <tr style="cursor:pointer;" data-action="open-feedback-detail" data-id="${f.id}">
                  <td>
                    <div style="font-weight:700; color:var(--slate-900);">${f.customerName}</div>
                    <div style="font-size:11px; color:var(--slate-400);">${f.customerMobile}</div>
                  </td>
                  <td>${f.date}</td>
                  <td>
                    <div style="display:flex; flex-wrap:wrap; gap:4px; max-width:260px;">
                      ${f.answers.map(a => `
                        <span style="font-size:11px; background:var(--bg-subtle); padding:2px 6px; border-radius:4px; border:1px solid var(--border-subtle);">
                          ${a.category.split(' ')[0]}: ★${a.rating}
                        </span>
                      `).join('')}
                    </div>
                  </td>
                  <td style="max-width:280px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                    ${f.comment ? `"${f.comment}"` : f.generatedReview}
                  </td>
                  <td>
                    <span class="badge ${f.redirectStatus === 'Redirected' ? 'badge-success' : 'badge-warning'}">
                      <span class="badge-dot"></span>
                      ${f.redirectStatus}
                    </span>
                  </td>
                  <td style="text-align:right;">
                    <button class="btn btn-secondary btn-sm" data-action="open-feedback-detail" data-id="${f.id}">
                      View Details
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

// 3. Advanced Analytics & Monthly Understanding Page
function renderAnalyticsPage(store, biz, isEmpty) {
  const m = biz.metrics;
  const trends = biz.monthlyTrends;

  return `
    <header class="app-header">
      <div>
        <h1 class="business-greeting">Performance Analytics</h1>
        <div class="business-subgreeting">In-depth insights, longitudinal trends, and monthly feedback understanding</div>
      </div>
      <div class="date-pill-group">
        <button class="date-pill active">Monthly Report</button>
        <button class="date-pill">Quarterly</button>
      </div>
    </header>

    <div class="app-content animate-fade">
      <!-- Monthly Understanding Report Card -->
      <div class="card" style="background:linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); color:#fff; border:none; margin-bottom:24px; padding:28px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px;">
          <div>
            <div style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; color:#a5b4fc;">Monthly Executive Understanding</div>
            <h2 style="font-size:24px; font-weight:800; color:#fff; margin-top:4px;">October Executive Summary</h2>
          </div>
          <span class="badge badge-ai" style="background:rgba(255,255,255,0.15); color:#fff; border:none; padding:6px 12px;">AI Synthesized Report</span>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:16px; margin-bottom:20px;">
          <div style="background:rgba(255,255,255,0.06); padding:16px; border-radius:var(--radius-md); border:1px solid rgba(255,255,255,0.1);">
            <div style="font-size:11px; color:#94a3b8; font-weight:600;">TOTAL RESPONSES</div>
            <div style="font-size:24px; font-weight:800; color:#fff; margin-top:4px;">842</div>
            <div style="font-size:11px; color:#4ade80; margin-top:2px;">+12% vs. September</div>
          </div>

          <div style="background:rgba(255,255,255,0.06); padding:16px; border-radius:var(--radius-md); border:1px solid rgba(255,255,255,0.1);">
            <div style="font-size:11px; color:#94a3b8; font-weight:600;">AVERAGE FEEDBACK</div>
            <div style="font-size:24px; font-weight:800; color:#fde047; margin-top:4px;">4.62 / 5</div>
            <div style="font-size:11px; color:#4ade80; margin-top:2px;">+0.18 MoM improvement</div>
          </div>

          <div style="background:rgba(255,255,255,0.06); padding:16px; border-radius:var(--radius-md); border:1px solid rgba(255,255,255,0.1);">
            <div style="font-size:11px; color:#94a3b8; font-weight:600;">HIGHEST RATED CATEGORY</div>
            <div style="font-size:18px; font-weight:800; color:#fff; margin-top:4px;">Staff & Hospitality</div>
            <div style="font-size:11px; color:#38bdf8; margin-top:2px;">4.80 / 5.0 (+0.12 delta)</div>
          </div>

          <div style="background:rgba(255,255,255,0.06); padding:16px; border-radius:var(--radius-md); border:1px solid rgba(255,255,255,0.1);">
            <div style="font-size:11px; color:#94a3b8; font-weight:600;">PRIMARY IMPROVEMENT AREA</div>
            <div style="font-size:18px; font-weight:800; color:#f87171; margin-top:4px;">Waiting Time</div>
            <div style="font-size:11px; color:#fca5a5; margin-top:2px;">3.92 / 5.0 (Lowest scored)</div>
          </div>
        </div>

        <p style="font-size:13px; line-height:1.6; color:#cbd5e1; max-width:800px;">
          Customers consistently praise your team's friendliness and food quality in their AI drafts. Waiting times during afternoon peak hours represent the primary customer friction point. Optimizing queue management will directly elevate Google review conversion.
        </p>
      </div>

      <!-- Longitudinal Trend Table -->
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">Category Ratings Over Time</h2>
            <div class="card-subtitle">Month-over-month category score progression</div>
          </div>
        </div>

        <div class="table-responsive">
          <table class="data-table trend-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>August</th>
                <th>September</th>
                <th>October</th>
                <th>Quarter Trend</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Staff & Hospitality</strong></td>
                <td>4.65</td>
                <td>4.72</td>
                <td><strong>4.80</strong></td>
                <td><span class="trend-pill positive">&uarr; +0.15</span></td>
              </tr>
              <tr>
                <td><strong>Food & Pastries</strong></td>
                <td>4.50</td>
                <td>4.58</td>
                <td><strong>4.64</strong></td>
                <td><span class="trend-pill positive">&uarr; +0.14</span></td>
              </tr>
              <tr>
                <td><strong>Service Speed</strong></td>
                <td>4.15</td>
                <td>4.22</td>
                <td><strong>4.30</strong></td>
                <td><span class="trend-pill positive">&uarr; +0.15</span></td>
              </tr>
              <tr>
                <td><strong>Ambience & Music</strong></td>
                <td>4.55</td>
                <td>4.62</td>
                <td><strong>4.70</strong></td>
                <td><span class="trend-pill positive">&uarr; +0.15</span></td>
              </tr>
              <tr>
                <td><strong>Waiting Time</strong></td>
                <td>3.70</td>
                <td>3.81</td>
                <td><strong>3.92</strong></td>
                <td><span class="trend-pill positive">&uarr; +0.22</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// 4. Customers Management Page
function renderCustomersPage(store, biz, isEmpty) {
  const customers = isEmpty ? [] : biz.customers;

  return `
    <header class="app-header">
      <div>
        <h1 class="business-greeting">Customer Directory</h1>
        <div class="business-subgreeting">Repeat visit histories and historical satisfaction scores</div>
      </div>
      <div style="font-size:12px; color:var(--slate-500);">
        Total: <strong>${customers.length}</strong> known customers
      </div>
    </header>

    <div class="app-content animate-fade">
      ${customers.length === 0 ? `
        <div class="empty-state">
          <div class="empty-icon-wrap">👥</div>
          <div class="empty-title">No customers yet</div>
          <div class="empty-desc">Customer profiles will appear automatically as customers provide their name during QR feedback sessions.</div>
        </div>
      ` : `
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Mobile Number</th>
                <th>Sessions Completed</th>
                <th>Average Rating</th>
                <th>First Visit</th>
                <th>Last Feedback</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${customers.map(c => `
                <tr>
                  <td>
                    <div style="font-weight:700; color:var(--slate-900);">${c.name}</div>
                  </td>
                  <td>${c.mobile}</td>
                  <td><strong>${c.sessionCount}</strong> visits</td>
                  <td><span style="color:#d97706; font-weight:700;">★ ${c.avgRating}</span></td>
                  <td>${c.firstSeen}</td>
                  <td>${c.lastSeen}</td>
                  <td style="text-align:right;">
                    <button class="btn btn-secondary btn-sm" data-action="open-customer-detail" data-id="${c.id}">
                      View History
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

// 5. Question Bank Management Page
function renderQuestionsPage(store, biz, isEmpty) {
  const questions = isEmpty ? [] : biz.questions;

  return `
    <header class="app-header">
      <div>
        <h1 class="business-greeting">Question Bank</h1>
        <div class="business-subgreeting">Manage your structured survey questions for QR feedback sessions</div>
      </div>
      <button class="btn btn-primary" data-action="open-add-question">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        Add Question
      </button>
    </header>

    <div class="app-content animate-fade">
      <!-- Dynamic Selection Info Banner -->
      <div style="background:var(--primary-50); border:1px solid var(--primary-200); border-radius:var(--radius-lg); padding:16px 20px; margin-bottom:20px; display:flex; align-items:center; gap:14px;">
        <div style="font-size:24px;">💡</div>
        <div style="font-size:13px; line-height:1.5; color:var(--primary-900);">
          <strong>Dynamic Question Selection Rule:</strong> Each customer QR scan automatically presents <strong>exactly 3 active questions</strong> randomly selected from this question bank. This keeps customer survey friction ultra-low (under 45 seconds) while gathering comprehensive coverage across all categories over time.
        </div>
      </div>

      ${questions.length === 0 ? `
        <div class="empty-state">
          <div class="empty-icon-wrap">❓</div>
          <div class="empty-title">No questions in your bank yet</div>
          <div class="empty-desc">Add questions to enable your AI customer feedback flow.</div>
          <button class="btn btn-primary" data-action="open-add-question">Add First Question</button>
        </div>
      ` : `
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Category</th>
                <th>Question Type</th>
                <th>Status</th>
                <th>Created Date</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${questions.map(q => `
                <tr>
                  <td style="font-weight:600; color:var(--slate-900); max-width:380px;">${q.text}</td>
                  <td><span class="badge badge-slate">${q.category}</span></td>
                  <td>${q.type}</td>
                  <td>
                    <span class="badge ${q.status === 'Active' ? 'badge-active' : 'badge-inactive'}">
                      <span class="badge-dot"></span>
                      ${q.status}
                    </span>
                  </td>
                  <td>${q.createdDate}</td>
                  <td style="text-align:right;">
                    <div style="display:inline-flex; gap:4px;">
                      <button class="btn btn-secondary btn-sm" data-action="open-edit-question" data-id="${q.id}">Edit</button>
                      <button class="btn btn-ghost btn-sm" style="color:var(--danger-500);" data-action="open-delete-question" data-id="${q.id}">Delete</button>
                    </div>
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

// 6. Categories Management Page
function renderCategoriesPage(store, biz, isEmpty) {
  const categories = isEmpty ? [] : biz.categories;

  return `
    <header class="app-header">
      <div>
        <h1 class="business-greeting">Feedback Categories</h1>
        <div class="business-subgreeting">Organize and analyze feedback touchpoints</div>
      </div>
      <button class="btn btn-primary" data-action="open-add-category">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        Add Category
      </button>
    </header>

    <div class="app-content animate-fade">
      ${categories.length === 0 ? `
        <div class="empty-state">
          <div class="empty-icon-wrap">🏷️</div>
          <div class="empty-title">No categories configured</div>
          <div class="empty-desc">Create categories (e.g., Staff, Food, Service, Ambience) to structure your questions.</div>
          <button class="btn btn-primary" data-action="open-add-category">Create Category</button>
        </div>
      ` : `
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Assigned Questions</th>
                <th>Avg Feedback Rating</th>
                <th>Total Responses</th>
                <th>Status</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${categories.map(c => `
                <tr>
                  <td><strong style="color:var(--slate-900); font-size:14px;">${c.name}</strong></td>
                  <td>${c.questionCount} Questions</td>
                  <td><span style="color:#d97706; font-weight:700;">★ ${c.avgRating.toFixed(1)}</span></td>
                  <td>${c.responses} ratings</td>
                  <td>
                    <span class="badge ${c.status === 'Active' ? 'badge-active' : 'badge-inactive'}">
                      <span class="badge-dot"></span>
                      ${c.status}
                    </span>
                  </td>
                  <td style="text-align:right;">
                    <div style="display:inline-flex; gap:4px;">
                      <button class="btn btn-secondary btn-sm" data-action="open-edit-category" data-id="${c.id}">Edit</button>
                      <button class="btn btn-ghost btn-sm" style="color:var(--danger-500);" data-action="open-delete-category" data-id="${c.id}">Delete</button>
                    </div>
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

// 7. Google Review Setup Page
function renderGoogleSetupPage(store, biz) {
  return `
    <header class="app-header">
      <div>
        <h1 class="business-greeting">Google Review Setup</h1>
        <div class="business-subgreeting">Configure destination URL for post-feedback customer redirects</div>
      </div>
    </header>

    <div class="app-content animate-fade" style="max-width:760px; margin:0 auto;">
      <div class="card">
        <form data-action="submit-google-url" data-id="${biz.id}">
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:18px;">
            <div style="width:44px; height:44px; border-radius:12px; background:#e8f0fe; color:#1a73e8; display:flex; align-items:center; justify-content:center; font-size:22px; font-weight:800;">
              G
            </div>
            <div>
              <h2 class="card-title">Google Review Destination Link</h2>
              <div class="card-subtitle">Where customers are directed once they copy their AI review draft</div>
            </div>
          </div>

          <!-- Educational Policy Disclaimer Box -->
          <div style="background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:16px; margin-bottom:20px; font-size:13px; line-height:1.6; color:var(--slate-700);">
            <div style="font-weight:700; color:var(--slate-900); margin-bottom:4px;">How Google Review Redirects Work:</div>
            Customers will copy their AI-assisted review draft with one click and then immediately be redirected to this Google review link. Due to Google's strict security policies, the customer manually pastes their review draft into Google's review box. The system records verified redirects, not automated submissions.
          </div>

          <div class="form-group">
            <label class="form-label">Paste Your Google Review Link <span class="req">*</span></label>
            <input type="url" name="googleReviewUrl" class="form-input" required value="${biz.googleReviewUrl || ''}" placeholder="https://search.google.com/local/writereview?placeid=ChIJ...">
            <span class="form-hint">Tip: Find your Place ID in Google Business Profile or copy your Google Maps "Get more reviews" link.</span>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:24px; padding-top:16px; border-top:1px solid var(--border-subtle);">
            ${biz.googleReviewUrl ? `
              <a href="${biz.googleReviewUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                Test Google Link
              </a>
            ` : '<div></div>'}

            <button type="submit" class="btn btn-primary">
              Save Google Link
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// 8. QR Code Studio & Print Standee Page
function renderQrCodePage(store, biz) {
  const customerUrl = `${window.location.origin}${window.location.pathname}?portal=customer&biz=${biz.id}`;

  return `
    <header class="app-header">
      <div>
        <h1 class="business-greeting">QR Code & Print Studio</h1>
        <div class="business-subgreeting">Download and print scannable QR cards for table tents, counters, and receipts</div>
      </div>
      <div style="display:flex; gap:10px;">
        <button class="btn btn-secondary" data-action="open-print-tent-card" data-id="${biz.id}">
          🖨️ Print Standee Preview
        </button>
        <button class="btn btn-primary" data-action="download-biz-qr" data-id="${biz.id}" data-url="${customerUrl}" data-name="${biz.name}">
          ⬇️ Download High-Res PNG
        </button>
      </div>
    </header>

    <div class="app-content animate-fade">
      <div class="qr-preview-wrapper">
        <!-- Standee Display Card -->
        <div class="qr-card-container">
          <div style="font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; color:var(--primary-600); margin-bottom:4px;">
            Feedback & Review Station
          </div>
          <h2 class="qr-card-title">${biz.name}</h2>
          <div class="qr-card-sub">Scan with phone camera to share your experience</div>

          <div class="qr-canvas-holder">
            <canvas id="bizMainQrCanvas" width="220" height="220"></canvas>
          </div>

          <div style="font-size:12px; font-weight:700; color:var(--slate-800);">
            3 Quick Questions &bull; Instant AI Draft
          </div>
          <div class="qr-card-tag">
            Powered by RevioPulse AI
          </div>
        </div>

        <!-- Management & Sharing Tools -->
        <div style="flex:1; min-width:320px; display:flex; flex-direction:column; gap:20px;">
          <div class="card">
            <h3 class="card-title" style="margin-bottom:12px;">Customer Direct Access URL</h3>
            <p style="font-size:13px; color:var(--slate-600); margin-bottom:14px;">
              This unique URL powers the QR code. You can also send this link directly via SMS, WhatsApp, or post-purchase emails.
            </p>
            <div style="display:flex; gap:8px;">
              <input type="text" class="form-input" id="directCustomerUrlInput" value="${customerUrl}" readonly>
              <button class="btn btn-secondary" data-action="copy-direct-url">Copy</button>
            </div>
          </div>

          <div class="card">
            <h3 class="card-title" style="margin-bottom:12px;">Best Practices for Maximum Scans</h3>
            <ul style="font-size:13px; color:var(--slate-700); line-height:1.7; padding-left:18px;">
              <li><strong>Tabletop Tent Cards:</strong> Position acrylic standees at every dine-in table or waiting area.</li>
              <li><strong>Billing Counter:</strong> Place a card next to the payment terminal where customers pause.</li>
              <li><strong>Staff Encouragement:</strong> Remind staff to mention: <em>"It only takes 30 seconds to get your review draft!"</em></li>
            </ul>
          </div>

          <div class="card" style="border-color:rgba(239, 68, 68, 0.2);">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <h3 class="card-title" style="color:var(--danger-500); font-size:14px;">Regenerate QR Code</h3>
                <div class="card-subtitle">Creates a new security token. Note: Previously printed QR codes will stop working.</div>
              </div>
              <button class="btn btn-secondary btn-sm" style="color:var(--danger-500);" data-action="open-regenerate-qr" data-id="${biz.id}">
                Regenerate QR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 9. Business Profile Page
function renderBusinessProfilePage(store, biz) {
  return `
    <header class="app-header">
      <div>
        <h1 class="business-greeting">Business Profile</h1>
        <div class="business-subgreeting">Manage your public storefront identity and contact information</div>
      </div>
    </header>

    <div class="app-content animate-fade" style="max-width:760px; margin:0 auto;">
      <div class="card">
        <form data-action="submit-edit-business" data-id="${biz.id}">
          <div class="form-group">
            <label class="form-label">Business Name <span class="req">*</span></label>
            <input type="text" name="name" class="form-input" required value="${biz.name}">
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
            <div class="form-group">
              <label class="form-label">Industry Category <span class="req">*</span></label>
              <input type="text" name="category" class="form-input" required value="${biz.category}">
            </div>
            <div class="form-group">
              <label class="form-label">Owner Name <span class="req">*</span></label>
              <input type="text" name="owner" class="form-input" required value="${biz.owner}">
            </div>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
            <div class="form-group">
              <label class="form-label">Contact Email <span class="req">*</span></label>
              <input type="email" name="email" class="form-input" required value="${biz.email}">
            </div>
            <div class="form-group">
              <label class="form-label">Phone Number</label>
              <input type="tel" name="phone" class="form-input" value="${biz.phone}">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Storefront Address</label>
            <input type="text" name="address" class="form-input" value="${biz.address}">
          </div>

          <div class="form-group">
            <label class="form-label">Default Customer Language</label>
            <select name="defaultLanguage" class="form-select">
              <option value="English (US)" selected>English (US)</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>

          <div style="display:flex; justify-content:flex-end; margin-top:24px; padding-top:16px; border-top:1px solid var(--border-subtle);">
            <button type="submit" class="btn btn-primary">Save Profile Changes</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// 10. Business Settings Page
function renderBusinessSettingsPage(store, biz) {
  return `
    <header class="app-header">
      <div>
        <h1 class="business-greeting">Account & Review Settings</h1>
        <div class="business-subgreeting">Manage AI drafting parameters and notification preferences</div>
      </div>
    </header>

    <div class="app-content animate-fade" style="max-width:760px; margin:0 auto;">
      <div class="card" style="margin-bottom:20px;">
        <h3 class="card-title" style="margin-bottom:14px;">AI Review Generation Guidelines</h3>
        <div style="font-size:13px; line-height:1.6; color:var(--slate-700);">
          <div style="margin-bottom:12px;">
            <strong>Authenticity Safeguard:</strong> RevioPulse AI strictly synthesizes ratings and customer comments provided during the session. It does not fabricate claims or manipulate negative feedback.
          </div>
          <div style="margin-bottom:12px;">
            <strong>Customer Control:</strong> Customers are always presented with an editable text draft and must manually choose to copy and submit to Google.
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title" style="margin-bottom:14px;">Notification Preferences</h3>
        <div style="display:flex; flex-direction:column; gap:12px;">
          <label style="display:flex; align-items:center; gap:10px; font-size:13px; cursor:pointer;">
            <input type="checkbox" checked style="width:16px; height:16px;">
            <span>Receive email summary when customer submits constructive (1-3 star) feedback</span>
          </label>
          <label style="display:flex; align-items:center; gap:10px; font-size:13px; cursor:pointer;">
            <input type="checkbox" checked style="width:16px; height:16px;">
            <span>Receive weekly feedback performance & Google redirect summary</span>
          </label>
        </div>
        <div style="margin-top:20px; text-align:right;">
          <button class="btn btn-primary btn-sm" onclick="window.appStore.showToast('Settings saved.');">Save Preferences</button>
        </div>
      </div>
    </div>
  `;
}

// Skeleton Loading Screen Helper
function renderLoadingSkeletonScreen() {
  return `
    <header class="app-header">
      <div class="skeleton skeleton-title" style="width:240px;"></div>
    </header>
    <div class="app-content animate-fade">
      <div class="grid-kpi">
        <div class="skeleton skeleton-card"></div>
        <div class="skeleton skeleton-card"></div>
        <div class="skeleton skeleton-card"></div>
        <div class="skeleton skeleton-card"></div>
      </div>
      <div class="card" style="height:280px; margin-top:20px;">
        <div class="skeleton skeleton-text" style="width:40%;"></div>
        <div class="skeleton skeleton-text" style="margin-top:20px; height:180px;"></div>
      </div>
    </div>
  `;
}
