/**
 * Modal System for RevioPulse AI
 * Handles Create/Edit Business, Add Question, Add Category, Feedback Details, Customer Profiles,
 * Password Reset, and Destructive Confirmation Dialogs.
 */

export function renderModalContainer(store) {
  const activeModal = store.activeModal;
  if (!activeModal) return '';

  const { type, data } = activeModal;

  let modalHtml = '';

  switch (type) {
    case 'create-business':
      modalHtml = renderCreateBusinessModal();
      break;
    case 'edit-business':
      modalHtml = renderEditBusinessModal(data);
      break;
    case 'reset-password':
      modalHtml = renderResetPasswordModal(data);
      break;
    case 'confirm-delete-business':
      modalHtml = renderConfirmDeleteModal({
        title: 'Delete Business Account',
        message: `Are you sure you want to permanently delete <strong>${data.name}</strong>? This action cannot be undone and will delete all question banks, QR configurations, and historical feedback.`,
        confirmText: 'Delete Business',
        confirmAction: 'execute-delete-business',
        id: data.id
      });
      break;
    case 'confirm-deactivate-business':
      modalHtml = renderConfirmDeleteModal({
        title: 'Deactivate Business',
        message: `Deactivating <strong>${data.name}</strong> will temporarily disable customer QR scans and AI review generation. Customers scanning the QR will receive an inactive notice.`,
        confirmText: 'Deactivate',
        confirmAction: 'execute-deactivate-business',
        id: data.id,
        isWarning: true
      });
      break;
    case 'add-question':
      modalHtml = renderAddQuestionModal(store);
      break;
    case 'edit-question':
      modalHtml = renderEditQuestionModal(store, data);
      break;
    case 'confirm-delete-question':
      modalHtml = renderConfirmDeleteModal({
        title: 'Delete Question',
        message: `Are you sure you want to delete the question <em>"${data.text}"</em>? This will remove it from future dynamic session selection.`,
        confirmText: 'Delete Question',
        confirmAction: 'execute-delete-question',
        id: data.id
      });
      break;
    case 'add-category':
      modalHtml = renderAddCategoryModal();
      break;
    case 'edit-category':
      modalHtml = renderEditCategoryModal(data);
      break;
    case 'confirm-delete-category':
      modalHtml = renderConfirmDeleteModal({
        title: 'Delete Category',
        message: `Are you sure you want to delete category <strong>"${data.name}"</strong>? Existing question bank items assigned to this category will need reassignment.`,
        confirmText: 'Delete Category',
        confirmAction: 'execute-delete-category',
        id: data.id
      });
      break;
    case 'feedback-detail':
      modalHtml = renderFeedbackDetailModal(data);
      break;
    case 'customer-detail':
      modalHtml = renderCustomerDetailModal(data);
      break;
    case 'print-tent-card':
      modalHtml = renderPrintTentCardModal(store, data);
      break;
    case 'confirm-regenerate-qr':
      modalHtml = renderConfirmDeleteModal({
        title: 'Regenerate Business QR Code',
        message: `Regenerating the QR code will invalidate previously printed stickers or tent-cards. Are you sure you want to proceed?`,
        confirmText: 'Regenerate QR',
        confirmAction: 'execute-regenerate-qr',
        id: data.id,
        isWarning: true
      });
      break;
    default:
      return '';
  }

  return `
    <div class="modal-backdrop open" data-action="close-modal-backdrop">
      <div class="modal-content" onclick="event.stopPropagation()">
        ${modalHtml}
      </div>
    </div>
  `;
}

// 1. Create Business Modal
function renderCreateBusinessModal() {
  return `
    <div class="modal-header">
      <h3 class="modal-title">Create New Business Account</h3>
      <button class="btn-icon" data-action="close-modal" aria-label="Close">&times;</button>
    </div>
    <form id="createBusinessForm" data-action="submit-create-business">
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Business Name <span class="req">*</span></label>
          <input type="text" name="name" class="form-input" required placeholder="e.g. Blue Bottle Coffee & Bakery">
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
          <div class="form-group">
            <label class="form-label">Owner / Contact Name <span class="req">*</span></label>
            <input type="text" name="owner" class="form-input" required placeholder="e.g. Sarah Jenkins">
          </div>
          <div class="form-group">
            <label class="form-label">Category <span class="req">*</span></label>
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

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
          <div class="form-group">
            <label class="form-label">Email Address <span class="req">*</span></label>
            <input type="email" name="email" class="form-input" required placeholder="sarah@company.com">
          </div>
          <div class="form-group">
            <label class="form-label">Mobile Number <span class="req">*</span></label>
            <input type="tel" name="phone" class="form-input" required placeholder="+1 (555) 019-2834">
          </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
          <div class="form-group">
            <label class="form-label">Username <span class="req">*</span></label>
            <input type="text" name="username" class="form-input" required placeholder="e.g. bluebottle_hq">
          </div>
          <div class="form-group">
            <label class="form-label">Initial Password <span class="req">*</span></label>
            <div style="position:relative;">
              <input type="password" id="initPassword" name="password" class="form-input" required value="SecurePass@2026">
              <button type="button" class="btn-icon" style="position:absolute; right:4px; top:4px;" onclick="const el=document.getElementById('initPassword'); el.type = el.type==='password'?'text':'password';">
                👁
              </button>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Physical Address</label>
          <input type="text" name="address" class="form-input" placeholder="123 Main Street, Suite A, Seattle, WA">
        </div>

        <div class="form-group">
          <label class="form-label">Status</label>
          <select name="status" class="form-select">
            <option value="Active" selected>Active (Instant QR Activation)</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-action="close-modal">Cancel</button>
        <button type="submit" class="btn btn-primary">Create Business Account</button>
      </div>
    </form>
  `;
}

// 2. Edit Business Modal
function renderEditBusinessModal(biz) {
  return `
    <div class="modal-header">
      <h3 class="modal-title">Edit Business: ${biz.name}</h3>
      <button class="btn-icon" data-action="close-modal" aria-label="Close">&times;</button>
    </div>
    <form id="editBusinessForm" data-action="submit-edit-business" data-id="${biz.id}">
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Business Name <span class="req">*</span></label>
          <input type="text" name="name" class="form-input" required value="${biz.name}">
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
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

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
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
          <label class="form-label">Address</label>
          <input type="text" name="address" class="form-input" value="${biz.address}">
        </div>

        <div class="form-group">
          <label class="form-label">Account Status</label>
          <select name="status" class="form-select">
            <option value="Active" ${biz.status === 'Active' ? 'selected' : ''}>Active</option>
            <option value="Inactive" ${biz.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-action="close-modal">Cancel</button>
        <button type="submit" class="btn btn-primary">Save Changes</button>
      </div>
    </form>
  `;
}

// 3. Reset Password Modal
function renderResetPasswordModal(biz) {
  return `
    <div class="modal-header">
      <h3 class="modal-title">Reset Password</h3>
      <button class="btn-icon" data-action="close-modal" aria-label="Close">&times;</button>
    </div>
    <form data-action="submit-reset-password" data-id="${biz.id}">
      <div class="modal-body">
        <p style="font-size:13px; color:var(--slate-600); margin-bottom:16px;">
          Set a new temporary password for <strong>${biz.name}</strong> (${biz.username}).
        </p>
        <div class="form-group">
          <label class="form-label">New Password <span class="req">*</span></label>
          <input type="text" name="newPassword" class="form-input" required value="RevioPass@${Math.floor(1000 + Math.random() * 9000)}">
          <span class="form-hint">Provide this password securely to the business owner.</span>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-action="close-modal">Cancel</button>
        <button type="submit" class="btn btn-primary">Update Password</button>
      </div>
    </form>
  `;
}

// 4. Confirm Delete / Destructive Modal
function renderConfirmDeleteModal({ title, message, confirmText, confirmAction, id, isWarning = false }) {
  return `
    <div class="modal-header">
      <h3 class="modal-title" style="color:${isWarning ? 'var(--warning-600)' : 'var(--danger-500)'}">${title}</h3>
      <button class="btn-icon" data-action="close-modal" aria-label="Close">&times;</button>
    </div>
    <div class="modal-body">
      <div style="display:flex; gap:16px; align-items:flex-start;">
        <div style="width:40px; height:40px; border-radius:50%; background:${isWarning ? 'var(--warning-50)' : 'var(--danger-50)'}; color:${isWarning ? 'var(--warning-600)' : 'var(--danger-500)'}; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <div style="font-size:13px; line-height:1.6; color:var(--slate-700);">
          ${message}
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-action="close-modal">Cancel</button>
      <button type="button" class="btn ${isWarning ? 'btn-primary' : 'btn-danger'}" data-action="${confirmAction}" data-id="${id}">${confirmText}</button>
    </div>
  `;
}

// 5. Add Question Modal
function renderAddQuestionModal(store) {
  const biz = store.getCurrentBusiness();
  return `
    <div class="modal-header">
      <h3 class="modal-title">Add Question to Question Bank</h3>
      <button class="btn-icon" data-action="close-modal" aria-label="Close">&times;</button>
    </div>
    <form data-action="submit-add-question">
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Question Text <span class="req">*</span></label>
          <textarea name="text" class="form-textarea" required placeholder="e.g. How satisfied were you with the promptness of our service?"></textarea>
          <span class="form-hint">Keep questions clear, objective, and easy for customers to answer.</span>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
          <div class="form-group">
            <label class="form-label">Category <span class="req">*</span></label>
            <select name="category" class="form-select" required>
              ${biz.categories.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Question Type</label>
            <select name="type" class="form-select" disabled>
              <option value="1–5 Rating" selected>1–5 Rating (Standard Star Scale)</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Status</label>
          <select name="status" class="form-select">
            <option value="Active" selected>Active (Eligible for customer sessions)</option>
            <option value="Inactive">Inactive (Hidden)</option>
          </select>
        </div>

        <div style="background:var(--primary-50); border:1px solid var(--primary-200); border-radius:var(--radius-md); padding:10px 12px; font-size:12px; color:var(--primary-800); display:flex; gap:8px;">
          <span>ℹ️</span>
          <span>The system dynamically selects 3 active questions randomly for each customer session to keep completion times under 45 seconds.</span>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-action="close-modal">Cancel</button>
        <button type="submit" class="btn btn-primary">Add Question</button>
      </div>
    </form>
  `;
}

// 6. Edit Question Modal
function renderEditQuestionModal(store, q) {
  const biz = store.getCurrentBusiness();
  return `
    <div class="modal-header">
      <h3 class="modal-title">Edit Question</h3>
      <button class="btn-icon" data-action="close-modal" aria-label="Close">&times;</button>
    </div>
    <form data-action="submit-edit-question" data-id="${q.id}">
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Question Text <span class="req">*</span></label>
          <textarea name="text" class="form-textarea" required>${q.text}</textarea>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
          <div class="form-group">
            <label class="form-label">Category <span class="req">*</span></label>
            <select name="category" class="form-select" required>
              ${biz.categories.map(c => `<option value="${c.name}" ${c.name === q.category ? 'selected' : ''}>${c.name}</option>`).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Status</label>
            <select name="status" class="form-select">
              <option value="Active" ${q.status === 'Active' ? 'selected' : ''}>Active</option>
              <option value="Inactive" ${q.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
            </select>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-action="close-modal">Cancel</button>
        <button type="submit" class="btn btn-primary">Save Question</button>
      </div>
    </form>
  `;
}

// 7. Add Category Modal
function renderAddCategoryModal() {
  return `
    <div class="modal-header">
      <h3 class="modal-title">Add Feedback Category</h3>
      <button class="btn-icon" data-action="close-modal" aria-label="Close">&times;</button>
    </div>
    <form data-action="submit-add-category">
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Category Name <span class="req">*</span></label>
          <input type="text" name="name" class="form-input" required placeholder="e.g. Cleanliness & Hygiene">
          <span class="form-hint">Used to organize questions and track performance in analytics.</span>
        </div>
        <div class="form-group">
          <label class="form-label">Status</label>
          <select name="status" class="form-select">
            <option value="Active" selected>Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-action="close-modal">Cancel</button>
        <button type="submit" class="btn btn-primary">Add Category</button>
      </div>
    </form>
  `;
}

// 8. Edit Category Modal
function renderEditCategoryModal(cat) {
  return `
    <div class="modal-header">
      <h3 class="modal-title">Edit Category</h3>
      <button class="btn-icon" data-action="close-modal" aria-label="Close">&times;</button>
    </div>
    <form data-action="submit-edit-category" data-id="${cat.id}">
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Category Name <span class="req">*</span></label>
          <input type="text" name="name" class="form-input" required value="${cat.name}">
        </div>
        <div class="form-group">
          <label class="form-label">Status</label>
          <select name="status" class="form-select">
            <option value="Active" ${cat.status === 'Active' ? 'selected' : ''}>Active</option>
            <option value="Inactive" ${cat.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-action="close-modal">Cancel</button>
        <button type="submit" class="btn btn-primary">Save Changes</button>
      </div>
    </form>
  `;
}

// 9. Feedback Detail Modal
function renderFeedbackDetailModal(fb) {
  return `
    <div class="modal-header">
      <div>
        <h3 class="modal-title">Customer Feedback Record</h3>
        <div class="card-subtitle">Session ID: ${fb.id} &bull; ${fb.date}</div>
      </div>
      <button class="btn-icon" data-action="close-modal" aria-label="Close">&times;</button>
    </div>
    <div class="modal-body">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; padding-bottom:12px; border-bottom:1px solid var(--border-subtle);">
        <div>
          <div style="font-size:15px; font-weight:800; color:var(--slate-900);">${fb.customerName}</div>
          <div style="font-size:12px; color:var(--slate-500);">${fb.customerMobile}</div>
        </div>
        <div style="display:flex; gap:8px;">
          <span class="badge ${fb.redirectStatus === 'Redirected' ? 'badge-success' : 'badge-warning'}">
            <span class="badge-dot"></span>
            Google ${fb.redirectStatus}
          </span>
          <span class="badge badge-active">${fb.sessionStatus}</span>
        </div>
      </div>

      <div style="margin-bottom:16px;">
        <label class="form-label" style="margin-bottom:6px;">Questions & Ratings Answered</label>
        <div class="answer-chip-list">
          ${fb.answers.map(a => `
            <div class="answer-chip">
              <strong>${a.category}:</strong>
              <span>${'★'.repeat(a.rating)}${'☆'.repeat(5 - a.rating)} (${a.rating}/5)</span>
            </div>
          `).join('')}
        </div>
      </div>

      ${fb.comment ? `
        <div style="margin-bottom:16px;">
          <label class="form-label" style="margin-bottom:6px;">Customer's Optional Comment</label>
          <div style="background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:10px 14px; font-size:13px; color:var(--slate-700); font-style:italic;">
            "${fb.comment}"
          </div>
        </div>
      ` : ''}

      <div style="margin-bottom:16px;">
        <label class="form-label" style="margin-bottom:6px; color:#7c3aed;">
          <span>AI-Generated Review Draft</span>
          <span class="badge badge-ai">Synthesized</span>
        </label>
        <div style="background:#f5f3ff; border:1px solid rgba(124, 58, 237, 0.2); border-radius:var(--radius-md); padding:12px 14px; font-size:13px; line-height:1.6; color:#4c1d95;">
          ${fb.generatedReview}
        </div>
      </div>

      ${fb.editedReview ? `
        <div style="margin-bottom:8px;">
          <label class="form-label" style="margin-bottom:6px; color:var(--slate-700);">Customer's Final Edited Review</label>
          <div style="background:var(--bg-surface); border:1px solid var(--border-strong); border-radius:var(--radius-md); padding:12px 14px; font-size:13px; line-height:1.6; color:var(--slate-800);">
            ${fb.editedReview}
          </div>
        </div>
      ` : ''}
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-action="close-modal">Close</button>
    </div>
  `;
}

// 10. Customer Detail Profile Modal
function renderCustomerDetailModal(cust) {
  return `
    <div class="modal-header">
      <div>
        <h3 class="modal-title">${cust.name}</h3>
        <div class="card-subtitle">${cust.mobile} &bull; Customer since ${cust.firstSeen}</div>
      </div>
      <button class="btn-icon" data-action="close-modal" aria-label="Close">&times;</button>
    </div>
    <div class="modal-body">
      <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:12px; margin-bottom:20px;">
        <div style="background:var(--bg-subtle); padding:12px; border-radius:var(--radius-md); text-align:center;">
          <div style="font-size:11px; color:var(--slate-500); font-weight:600;">TOTAL VISITS</div>
          <div style="font-size:20px; font-weight:800; color:var(--slate-900);">${cust.sessionCount}</div>
        </div>
        <div style="background:var(--bg-subtle); padding:12px; border-radius:var(--radius-md); text-align:center;">
          <div style="font-size:11px; color:var(--slate-500); font-weight:600;">AVG RATING</div>
          <div style="font-size:20px; font-weight:800; color:#d97706;">★ ${cust.avgRating}</div>
        </div>
        <div style="background:var(--bg-subtle); padding:12px; border-radius:var(--radius-md); text-align:center;">
          <div style="font-size:11px; color:var(--slate-500); font-weight:600;">LAST FEEDBACK</div>
          <div style="font-size:13px; font-weight:700; color:var(--slate-800); margin-top:4px;">${cust.lastSeen}</div>
        </div>
      </div>

      <label class="form-label" style="margin-bottom:10px;">Visit & Feedback History</label>
      <div class="activity-timeline">
        ${cust.history.map(h => `
          <div class="activity-item">
            <div class="activity-dot success"></div>
            <div class="activity-title" style="font-weight:700;">${h.date}</div>
            <div style="font-size:12px; color:var(--slate-600);">${h.ratings}</div>
            ${h.comment ? `<div style="font-size:12px; color:var(--slate-500); font-style:italic;">"${h.comment}"</div>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-action="close-modal">Close</button>
    </div>
  `;
}

// 11. Print Tent Card Preview Modal
function renderPrintTentCardModal(store, biz) {
  return `
    <div class="modal-header">
      <h3 class="modal-title">Table Tent & Standee Print Preview</h3>
      <button class="btn-icon" data-action="close-modal" aria-label="Close">&times;</button>
    </div>
    <div class="modal-body" style="display:flex; flex-direction:column; align-items:center;">
      <div id="printArea" style="width:340px; border:3px solid #0f172a; border-radius:18px; padding:32px 24px; background:#fff; text-align:center; box-shadow:0 10px 25px rgba(0,0,0,0.15);">
        <div style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; color:var(--primary-600); margin-bottom:6px;">Your Opinion Matters</div>
        <h2 style="font-size:22px; font-weight:800; color:#0f172a; margin-bottom:4px;">${biz.name}</h2>
        <p style="font-size:12px; color:#64748b; margin-bottom:16px;">Scan to share your thoughts & generate your Google review draft in 30 seconds!</p>

        <div style="background:#f8fafc; border:2px dashed #cbd5e1; border-radius:16px; padding:16px; display:inline-block; margin-bottom:16px;">
          <canvas id="modalPrintQrCanvas" width="200" height="200"></canvas>
        </div>

        <div style="font-size:11px; font-weight:700; color:#0f172a;">1. Scan QR &bull; 2. Rate Experience &bull; 3. Post to Google</div>
        <div style="font-size:10px; color:#94a3b8; margin-top:8px;">Powered by RevioPulse AI</div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-action="close-modal">Close</button>
      <button type="button" class="btn btn-primary" onclick="window.print();">🖨️ Print Standee</button>
    </div>
  `;
}
