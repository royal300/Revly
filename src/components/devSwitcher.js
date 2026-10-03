/**
 * Top Developer & Role Switcher Bar
 * Provides instant switching between Super Admin, Business Dashboard, and Customer Flow,
 * plus business switcher and state override inspectors (Empty, Loading, Error states).
 */

export function renderDevSwitcher(store) {
  const currentRole = store.currentRole;
  const currentBiz = store.getCurrentBusiness();
  const allBusinesses = store.data.businesses;
  const overrideState = store.overrideState;

  return `
    <header class="dev-switcher-bar" role="banner" aria-label="Environment and Role Switcher">
      <div class="dev-switcher-left">
        <div class="dev-brand">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <span>RevioPulse AI</span>
          <span class="dev-brand-badge">SaaS v1.0</span>
        </div>

        <nav class="dev-pills" aria-label="Portals">
          <button class="dev-pill ${currentRole === 'business' ? 'active' : ''}" data-action="switch-role" data-role="business">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            Business Portal
          </button>
          <button class="dev-pill ${currentRole === 'customer' ? 'active' : ''}" data-action="switch-role" data-role="customer">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
              <line x1="12" y1="18" x2="12.01" y2="18"/>
            </svg>
            Customer Flow (QR)
          </button>
          <button class="dev-pill ${currentRole === 'admin' ? 'active' : ''}" data-action="switch-role" data-role="admin">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Super Admin
          </button>
        </nav>
      </div>

      <div class="dev-switcher-right">
        ${currentRole !== 'admin' ? `
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:11px; color:#94a3b8;">Active Business:</span>
            <select class="dev-select" data-action="switch-biz" aria-label="Switch active business">
              ${allBusinesses.map(b => `
                <option value="${b.id}" ${b.id === store.currentBusinessId ? 'selected' : ''}>
                  ${b.name} (${b.status})
                </option>
              `).join('')}
            </select>
          </div>
        ` : ''}

        ${currentRole === 'customer' ? `
          <button class="dev-pill" data-action="toggle-mobile-frame" title="Toggle Mobile Mockup Frame">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
            </svg>
            ${store.mobileFrameMode ? 'Frame: Mobile' : 'Frame: Full'}
          </button>
        ` : ''}

        <div style="display:flex; align-items:center; gap:6px;">
          <span style="font-size:11px; color:#94a3b8;">State Inspector:</span>
          <select class="dev-select" data-action="switch-state-override" aria-label="State Override">
            <option value="normal" ${overrideState === 'normal' ? 'selected' : ''}>Normal State</option>
            <option value="loading" ${overrideState === 'loading' ? 'selected' : ''}>Loading Skeleton</option>
            <option value="empty" ${overrideState === 'empty' ? 'selected' : ''}>Empty State</option>
            <option value="error-invalid-qr" ${overrideState === 'error-invalid-qr' ? 'selected' : ''}>Error: Invalid QR</option>
            <option value="error-inactive" ${overrideState === 'error-inactive' ? 'selected' : ''}>Error: Inactive Business</option>
            <option value="error-ai-fail" ${overrideState === 'error-ai-fail' ? 'selected' : ''}>Error: AI Fail</option>
          </select>
        </div>

        <button class="dev-pill" data-action="reset-demo" title="Reset all data back to default">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          Reset Demo
        </button>
      </div>
    </header>
  `;
}
