/**
 * Customer-Facing Experience Views
 * Mobile-first, frictionless, friendly, and accessible.
 * Flow: Landing -> Info -> Question 1 -> Question 2 -> Question 3 -> Comment -> AI Generation -> Review Draft -> Google Redirect -> Completion
 */

import confetti from 'canvas-confetti';

export function renderCustomerApp(store) {
  const biz = store.getCurrentBusiness();
  const session = store.customerSession;
  const isFrame = store.mobileFrameMode;
  const override = store.overrideState;

  // Handle Error State Overrides
  if (override === 'error-invalid-qr') {
    return renderCustomerContainer(isFrame, renderInvalidQrError());
  }
  if (override === 'error-inactive' || biz.status === 'Inactive') {
    return renderCustomerContainer(isFrame, renderInactiveBusinessError(biz));
  }
  if (override === 'error-ai-fail') {
    return renderCustomerContainer(isFrame, renderAiFailureState(biz));
  }

  let contentHtml = '';

  switch (session.step) {
    case 'landing':
      contentHtml = renderCustomerLanding(biz);
      break;
    case 'info':
      contentHtml = renderCustomerInfo(biz, session);
      break;
    case 'questions':
      contentHtml = renderQuestionStep(biz, session);
      break;
    case 'comment':
      contentHtml = renderCustomerCommentStep(biz, session);
      break;
    case 'generating':
      contentHtml = renderCustomerGeneratingStep(biz);
      break;
    case 'review':
      contentHtml = renderCustomerReviewDraftStep(store, biz, session);
      break;
    case 'completion':
      contentHtml = renderCustomerCompletionStep(biz, session);
      break;
    default:
      contentHtml = renderCustomerLanding(biz);
  }

  return renderCustomerContainer(isFrame, contentHtml);
}

function renderCustomerContainer(isFrame, innerHtml) {
  return `
    <div class="customer-simulator-container ${isFrame ? '' : 'fullscreen'}">
      <div class="mobile-device-frame">
        <!-- Simulated Mobile Status Bar -->
        <div class="mobile-status-bar">
          <span>9:41</span>
          <div class="mobile-camera-notch"></div>
          <div style="display:flex; gap:4px; align-items:center;">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        <div class="customer-viewport">
          ${innerHtml}
        </div>
      </div>
    </div>
  `;
}

// 1. Customer Landing Screen
function renderCustomerLanding(biz) {
  return `
    <div style="display:flex; flex-direction:column; justify-content:space-between; height:100%; padding:10px 0;">
      <div class="customer-brand-header" style="margin-top:20px;">
        <div class="customer-biz-logo">
          ${biz.logoText || 'BZ'}
        </div>
        <h1 class="customer-biz-name">${biz.name}</h1>
        <div class="customer-biz-cat">${biz.category}</div>
      </div>

      <div style="text-align:center; padding:0 10px; margin:auto 0;">
        <div style="width:64px; height:64px; border-radius:50%; background:var(--primary-50); color:var(--primary-600); display:flex; align-items:center; justify-content:center; margin:0 auto 20px; font-size:28px;">
          ✨
        </div>
        <h2 style="font-size:24px; font-weight:800; color:var(--slate-900); margin-bottom:8px;">
          Share your experience with us
        </h2>
        <p style="font-size:14px; color:var(--slate-600); line-height:1.5;">
          Answer 3 quick questions. Our AI will craft an authentic review draft you can easily post to Google in seconds.
        </p>
        <div style="margin-top:14px; font-size:12px; font-weight:700; color:var(--primary-600); background:var(--primary-50); padding:6px 14px; border-radius:var(--radius-full); display:inline-block;">
          ⏱️ Takes less than 45 seconds
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:10px;">
        <button class="btn btn-primary btn-lg" style="width:100%; border-radius:16px;" data-action="customer-start">
          Continue &rarr;
        </button>
        <div style="text-align:center;">
          <a href="#" style="font-size:11px; color:var(--slate-400);" onclick="alert('Privacy Reassurance:\\n\\nYour feedback is private. We do not sell your data or subscribe you to marketing communications.'); return false;">
            Privacy & Trust Notice
          </a>
        </div>
      </div>
    </div>
  `;
}

// 2. Customer Information Screen
function renderCustomerInfo(biz, session) {
  return `
    <div style="display:flex; flex-direction:column; justify-content:space-between; height:100%; padding:10px 0;">
      <div>
        <button class="btn-icon" data-action="customer-back-to-landing" style="margin-bottom:12px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>

        <div class="customer-progress-bar">
          <div class="customer-progress-fill" style="width: 15%;"></div>
        </div>

        <h2 style="font-size:22px; font-weight:800; color:var(--slate-900); margin-bottom:6px;">
          A quick hello!
        </h2>
        <p style="font-size:13px; color:var(--slate-500); line-height:1.5; margin-bottom:24px;">
          Let us know who's sharing feedback so ${biz.name} can address you by name.
        </p>

        <form id="customerInfoForm" data-action="submit-customer-info">
          <div class="form-group">
            <label class="form-label">Your Name <span class="req">*</span></label>
            <input type="text" name="name" class="form-input" required placeholder="e.g. Alex Morgan" style="padding:12px; font-size:14px; border-radius:12px;">
          </div>

          <div class="form-group" style="margin-top:16px;">
            <label class="form-label">Mobile Number <span style="font-size:11px; color:var(--slate-400); font-weight:normal;">(Optional)</span></label>
            <input type="tel" name="mobile" class="form-input" placeholder="+1 (555) 000-0000" style="padding:12px; font-size:14px; border-radius:12px;">
            <span class="form-hint">Used only if the business needs to resolve a specific issue.</span>
          </div>

          <!-- Strict Non-marketing Consent Notice -->
          <div style="background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:10px; padding:12px; margin-top:20px; font-size:11px; line-height:1.4; color:var(--slate-500);">
            🔒 <strong>Data Privacy:</strong> Providing your information is strictly for feedback recognition. Feedback permission is never combined with promotional marketing consent.
          </div>

          <div style="margin-top:28px;">
            <button type="submit" class="btn btn-primary btn-lg" style="width:100%; border-radius:16px;">
              Start Questions &rarr;
            </button>
          </div>
        </form>
      </div>

      <div style="text-align:center;">
        <button class="btn btn-ghost btn-sm" data-action="skip-customer-info" style="color:var(--slate-500);">
          Continue Anonymously
        </button>
      </div>
    </div>
  `;
}

// 3. Question Step (One at a time: 1 of 3, 2 of 3, 3 of 3)
function renderQuestionStep(biz, session) {
  const currentIdx = session.currentQuestionIndex;
  const questions = session.selectedQuestions;
  const currentQ = questions[currentIdx] || { text: 'How was your experience?', category: 'General' };
  const total = questions.length || 3;
  const progressPct = ((currentIdx + 1) / total) * 80;

  return `
    <div style="display:flex; flex-direction:column; justify-content:space-between; height:100%; padding:10px 0;">
      <div>
        <div class="customer-progress-bar">
          <div class="customer-progress-fill" style="width: ${progressPct}%;"></div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <span class="question-counter">Question ${currentIdx + 1} of ${total}</span>
          <span class="badge badge-slate">${currentQ.category}</span>
        </div>
      </div>

      <div class="question-card">
        <h2 class="question-title">${currentQ.text}</h2>

        <div class="star-rating-box" id="starRatingContainer">
          ${[1, 2, 3, 4, 5].map(star => `
            <button type="button" class="star-btn" data-action="rate-star" data-rating="${star}" aria-label="${star} Stars">
              <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            </button>
          `).join('')}
        </div>

        <div class="rating-sentiment-label" id="ratingSentimentLabel">
          Tap a star to rate
        </div>
      </div>

      <div style="text-align:center; font-size:12px; color:var(--slate-400);">
        Select 1 to 5 stars to continue
      </div>
    </div>
  `;
}

// 4. Optional Customer Comment Step
function renderCustomerCommentStep(biz, session) {
  const commonTags = [
    "Friendly staff",
    "Quick service",
    "Delicious food",
    "Cozy atmosphere",
    "Clean & sanitized",
    "Great value",
    "Will return!"
  ];

  return `
    <div style="display:flex; flex-direction:column; justify-content:space-between; height:100%; padding:10px 0;">
      <div>
        <div class="customer-progress-bar">
          <div class="customer-progress-fill" style="width: 90%;"></div>
        </div>

        <div style="margin-bottom:16px;">
          <span class="question-counter">Final Touch</span>
          <h2 style="font-size:22px; font-weight:800; color:var(--slate-900); margin-top:8px;">
            Anything specific to add?
          </h2>
          <p style="font-size:13px; color:var(--slate-500); line-height:1.5;">
            Mention a staff member's name, favorite item, or suggestion. This is completely optional.
          </p>
        </div>

        <!-- Quick Tap Suggestion Chips -->
        <div class="comment-tags" id="commentTagsContainer">
          ${commonTags.map(tag => `
            <button type="button" class="comment-chip" data-action="append-tag" data-tag="${tag}">
              + ${tag}
            </button>
          `).join('')}
        </div>

        <div class="form-group" style="margin-top:14px;">
          <textarea id="customerCommentTextarea" class="form-textarea" placeholder="Type your comment or tap the suggestions above..." style="height:110px; font-size:14px; border-radius:14px;"></textarea>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:10px;">
        <button class="btn btn-ai btn-lg" style="width:100%; border-radius:16px;" data-action="submit-comment-and-generate">
          ✨ Generate Review Draft &rarr;
        </button>
        <button class="btn btn-ghost btn-sm" style="color:var(--slate-500);" data-action="skip-comment-and-generate">
          Skip and Generate
        </button>
      </div>
    </div>
  `;
}

// 5. AI Generating State (Animated Shimmer)
function renderCustomerGeneratingStep(biz) {
  return `
    <div class="ai-generating-view">
      <div class="ai-orb-pulse">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
        </svg>
      </div>

      <h2 class="ai-gen-title">Crafting your review...</h2>
      <p class="ai-gen-sub">
        Synthesizing your ratings for ${biz.name} into an authentic draft.
      </p>

      <div style="margin-top:28px; width:160px; height:6px; background:var(--slate-100); border-radius:99px; overflow:hidden;">
        <div style="height:100%; background:var(--ai-gradient); border-radius:99px; width:70%; animation:shimmer 1.2s infinite;"></div>
      </div>
    </div>
  `;
}

// 6. Generated Review Draft Screen
function renderCustomerReviewDraftStep(store, biz, session) {
  const currentDraft = session.editedReview || session.generatedReview;
  const tone = store.selectedTone;

  return `
    <div style="display:flex; flex-direction:column; justify-content:space-between; height:100%; padding:10px 0;">
      <div>
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
          <h2 style="font-size:20px; font-weight:800; color:var(--slate-900);">
            Your Review Draft
          </h2>
          <span class="badge badge-ai">✨ AI Assisted</span>
        </div>

        <p style="font-size:12px; color:var(--slate-500); line-height:1.4; margin-bottom:14px;">
          Based on your actual answers. Feel free to edit the text below before continuing to Google.
        </p>

        <!-- Tone Adjustment Selector -->
        <div class="tone-buttons">
          <button class="tone-btn ${tone === 'natural' ? 'active' : ''}" data-action="change-tone" data-tone="natural">
            Warm & Natural
          </button>
          <button class="tone-btn ${tone === 'concise' ? 'active' : ''}" data-action="change-tone" data-tone="concise">
            Short & Direct
          </button>
          <button class="tone-btn ${tone === 'detailed' ? 'active' : ''}" data-action="change-tone" data-tone="detailed">
            Detailed
          </button>
        </div>

        <!-- Editable Review Card -->
        <div class="review-draft-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-size:11px; font-weight:700; color:var(--slate-400); text-transform:uppercase;">Editable Text</span>
            <span style="font-size:11px; color:var(--primary-600); cursor:pointer;" onclick="document.getElementById('draftTextarea').focus();">✏️ Edit</span>
          </div>

          <textarea id="draftTextarea" class="review-draft-editor" oninput="window.appStore.updateEditedReviewText(this.value);">${currentDraft}</textarea>
        </div>

        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:10px 12px; font-size:11px; color:#166534; display:flex; gap:8px;">
          <span>💡</span>
          <span>Clicking below copies your draft to your clipboard and opens ${biz.name}'s Google page. Simply paste and post!</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div style="display:flex; flex-direction:column; gap:10px; margin-top:16px;">
        <!-- Primary Action -->
        <button class="btn-google-primary" data-action="copy-and-redirect" data-google-url="${biz.googleReviewUrl || ''}">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.35 11.1H12v3.8h5.37c-.52 2.5-2.6 4.33-5.37 4.33-3.04 0-5.5-2.46-5.5-5.5s2.46-5.5 5.5-5.5c1.37 0 2.62.5 3.58 1.42l2.69-2.69C16.89 4.37 14.58 3.5 12 3.5 7.31 3.5 3.5 7.31 3.5 12s3.81 8.5 8.5 8.5c4.97 0 8.25-3.5 8.25-8.4 0-.6-.06-1.3-.15-1.9z"/>
          </svg>
          Copy & Continue to Google
        </button>

        <!-- Fallback Split Actions -->
        <div class="fallback-actions">
          <button class="btn-google-secondary" data-action="just-copy-review">
            📋 Copy Review
          </button>
          <button class="btn-google-secondary" data-action="just-redirect-google" data-google-url="${biz.googleReviewUrl || ''}">
            🌐 Open Google Page
          </button>
        </div>
      </div>
    </div>
  `;
}

// 7. Customer Completion Screen
function renderCustomerCompletionStep(biz, session) {
  // Trigger celebratory confetti
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  } catch (e) {
    // Ignore in non-visual test
  }

  return `
    <div class="completion-container">
      <div class="completion-check-icon">
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>

      <h2 style="font-size:24px; font-weight:800; color:var(--slate-900); margin-bottom:8px;">
        Thank You!
      </h2>
      <p style="font-size:14px; color:var(--slate-600); line-height:1.6; max-width:280px; margin-bottom:24px;">
        Your feedback has been delivered to <strong>${biz.name}</strong>.
      </p>

      <div style="background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:14px; padding:16px; width:100%; text-align:left; font-size:12px; color:var(--slate-700); line-height:1.6; margin-bottom:28px;">
        <div style="font-weight:700; color:var(--slate-900); margin-bottom:6px;">Next steps on Google:</div>
        1. Google Review window has been opened.<br>
        2. Long press or right-click the review box and select <strong>Paste</strong>.<br>
        3. Tap <strong>Post</strong> to submit your review!
      </div>

      <button class="btn btn-secondary btn-lg" style="width:100%; border-radius:16px;" data-action="customer-start-again">
        Done
      </button>

      <div style="margin-top:20px; font-size:11px; color:var(--slate-400);">
        * Redirect logged by RevioPulse AI &bull; Google review posting completed by customer
      </div>
    </div>
  `;
}

// Error Screens
function renderInvalidQrError() {
  return `
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; text-align:center; padding:20px;">
      <div style="width:68px; height:68px; border-radius:50%; background:var(--danger-50); color:var(--danger-500); display:flex; align-items:center; justify-content:center; font-size:32px; margin-bottom:20px;">
        ⚠️
      </div>
      <h2 style="font-size:22px; font-weight:800; color:var(--slate-900); margin-bottom:8px;">Invalid QR Code</h2>
      <p style="font-size:13px; color:var(--slate-500); line-height:1.6; max-width:280px; margin-bottom:24px;">
        This feedback QR code is invalid, expired, or has been regenerated by the business. Please scan the current tabletop code.
      </p>
      <button class="btn btn-primary" onclick="window.appStore.setOverrideState('normal');">
        Try Active Session
      </button>
    </div>
  `;
}

function renderInactiveBusinessError(biz) {
  return `
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; text-align:center; padding:20px;">
      <div style="width:68px; height:68px; border-radius:50%; background:var(--warning-50); color:var(--warning-600); display:flex; align-items:center; justify-content:center; font-size:32px; margin-bottom:20px;">
        ⏸️
      </div>
      <h2 style="font-size:22px; font-weight:800; color:var(--slate-900); margin-bottom:8px;">Business Temporarily Inactive</h2>
      <p style="font-size:13px; color:var(--slate-500); line-height:1.6; max-width:280px; margin-bottom:24px;">
        <strong>${biz.name}</strong>'s feedback channel is currently paused. Please check back later or contact staff directly.
      </p>
      <button class="btn btn-secondary" onclick="window.appStore.setBusiness('biz-1'); window.appStore.setOverrideState('normal');">
        Switch to Active Business
      </button>
    </div>
  `;
}

function renderAiFailureState(biz) {
  return `
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; text-align:center; padding:20px;">
      <div style="width:68px; height:68px; border-radius:50%; background:var(--warning-50); color:var(--warning-600); display:flex; align-items:center; justify-content:center; font-size:32px; margin-bottom:20px;">
        🤖
      </div>
      <h2 style="font-size:22px; font-weight:800; color:var(--slate-900); margin-bottom:8px;">AI Synthesis Retry</h2>
      <p style="font-size:13px; color:var(--slate-500); line-height:1.6; max-width:280px; margin-bottom:24px;">
        The AI review generator encountered a temporary timeout. You can retry synthesis or proceed directly with a clean draft.
      </p>
      <div style="display:flex; gap:10px;">
        <button class="btn btn-secondary" onclick="window.appStore.setOverrideState('normal'); window.appStore.generateAiReview('natural');">
          Retry Synthesis
        </button>
        <button class="btn btn-primary" onclick="window.appStore.setOverrideState('normal');">
          Continue with Standard Draft
        </button>
      </div>
    </div>
  `;
}
