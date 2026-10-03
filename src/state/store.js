import { INITIAL_DATA } from '../data/mockData.js';
import { generateReviewDraft } from '../utils/aiGenerator.js';

const STORAGE_KEY = 'reviopulse_store_v1';

class Store {
  constructor() {
    this.data = this.loadData();
    this.listeners = new Set();

    // App Navigation State
    this.currentRole = 'business'; // 'admin' | 'business' | 'customer'
    this.currentBusinessId = 'biz-1';
    this.adminView = 'dashboard';
    this.businessView = 'dashboard';
    this.activeParams = {};

    // Customer Session State
    this.customerSession = this.createInitialCustomerSession();

    // Showcase & State Overrides
    this.overrideState = 'normal'; // 'normal' | 'empty' | 'loading' | 'error-invalid-qr' | 'error-inactive' | 'error-ai-fail'
    this.mobileFrameMode = true; // For customer view simulator
    this.selectedTone = 'natural';
    this.activeModal = null; // { type, data }
    this.toasts = [];
  }

  loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed to load store from localStorage", e);
    }
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }

  saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn("Failed to save store to localStorage", e);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener(this);
      } catch (err) {
        console.error("Listener error", err);
      }
    }
  }

  // --- Toast Manager ---
  showToast(message, type = 'success') {
    const id = 'toast_' + Date.now();
    this.toasts.push({ id, message, type });
    this.notify();
    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t.id !== id);
      this.notify();
    }, 3800);
  }

  // --- Modal Manager ---
  openModal(type, data = null) {
    this.activeModal = { type, data };
    this.notify();
  }

  closeModal() {
    this.activeModal = null;
    this.notify();
  }

  // --- Navigation & Role ---
  setRole(role) {
    this.currentRole = role;
    if (role === 'customer') {
      this.startCustomerSession(this.currentBusinessId);
    }
    this.notify();
  }

  setBusiness(bizId) {
    this.currentBusinessId = bizId;
    if (this.currentRole === 'customer') {
      this.startCustomerSession(bizId);
    }
    this.notify();
  }

  setView(view, params = {}) {
    if (this.currentRole === 'admin') {
      this.adminView = view;
    } else if (this.currentRole === 'business') {
      this.businessView = view;
    }
    this.activeParams = params;
    this.notify();
  }

  setOverrideState(state) {
    this.overrideState = state;
    this.notify();
  }

  toggleMobileFrame() {
    this.mobileFrameMode = !this.mobileFrameMode;
    this.notify();
  }

  resetToInitial() {
    localStorage.removeItem(STORAGE_KEY);
    this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
    this.overrideState = 'normal';
    this.customerSession = this.createInitialCustomerSession();
    this.showToast("Demo data successfully reset to initial default!", "info");
    this.saveData();
  }

  // --- Current Context Getters ---
  getCurrentBusiness() {
    return this.data.businesses.find(b => b.id === this.currentBusinessId) || this.data.businesses[0];
  }

  // --- Super Admin Actions ---
  createBusiness(bizInput) {
    const newId = `biz-${Date.now().toString().slice(-4)}`;
    const newBiz = {
      id: newId,
      name: bizInput.name,
      owner: bizInput.owner,
      category: bizInput.category,
      status: bizInput.status || 'Active',
      address: bizInput.address || '',
      phone: bizInput.phone || '',
      email: bizInput.email,
      username: bizInput.username || `biz_${newId}`,
      logoText: bizInput.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase(),
      googleReviewUrl: bizInput.googleReviewUrl || '',
      createdDate: new Date().toISOString().split('T')[0],
      defaultLanguage: 'English (US)',
      metrics: {
        qrScans: 0,
        customerInfoCompleted: 0,
        feedbackCompleted: 0,
        aiReviewsGenerated: 0,
        googleRedirects: 0,
        avgRating: 5.0,
        ratingTrend: "0.0",
        scansTrend: "0%",
        feedbackTrend: "0%",
        redirectsTrend: "0%"
      },
      categories: [
        { id: `cat-${Date.now()}-1`, name: "Staff & Service", questionCount: 2, status: "Active", avgRating: 5.0, responses: 0 },
        { id: `cat-${Date.now()}-2`, name: "Quality & Value", questionCount: 1, status: "Active", avgRating: 5.0, responses: 0 }
      ],
      ratingDistribution: { star5: 0, star4: 0, star3: 0, star2: 0, star1: 0 },
      monthlyTrends: [
        { month: "October", staff: 5.0, food: 5.0, service: 5.0, ambience: 5.0, waitingTime: 5.0 }
      ],
      questions: [
        { id: `q-${Date.now()}-1`, text: "How would you rate our staff friendliness and service?", category: "Staff & Service", type: "1–5 Rating", status: "Active", createdDate: new Date().toISOString().split('T')[0] },
        { id: `q-${Date.now()}-2`, text: "How satisfied were you with the quality provided?", category: "Quality & Value", type: "1–5 Rating", status: "Active", createdDate: new Date().toISOString().split('T')[0] }
      ],
      feedbackList: [],
      customers: []
    };

    this.data.businesses.unshift(newBiz);
    this.data.platform.metrics.totalBusinesses += 1;
    if (newBiz.status === 'Active') {
      this.data.platform.metrics.activeBusinesses += 1;
    } else {
      this.data.platform.metrics.inactiveBusinesses += 1;
    }

    this.data.platform.activityLog.unshift({
      id: `act-${Date.now()}`,
      event: "Business Created",
      businessName: newBiz.name,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      type: "success"
    });

    this.saveData();
    return newBiz;
  }

  updateBusiness(bizId, fields) {
    const biz = this.data.businesses.find(b => b.id === bizId);
    if (!biz) return;
    const oldStatus = biz.status;
    Object.assign(biz, fields);

    if (fields.status && fields.status !== oldStatus) {
      if (fields.status === 'Active') {
        this.data.platform.metrics.activeBusinesses += 1;
        this.data.platform.metrics.inactiveBusinesses -= 1;
      } else {
        this.data.platform.metrics.activeBusinesses -= 1;
        this.data.platform.metrics.inactiveBusinesses += 1;
      }
    }

    this.data.platform.activityLog.unshift({
      id: `act-${Date.now()}`,
      event: "Business Updated",
      businessName: biz.name,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      type: "info"
    });

    this.saveData();
    this.showToast(`Business "${biz.name}" updated successfully.`);
  }

  deleteBusiness(bizId) {
    const idx = this.data.businesses.findIndex(b => b.id === bizId);
    if (idx === -1) return;
    const deleted = this.data.businesses.splice(idx, 1)[0];

    this.data.platform.metrics.totalBusinesses -= 1;
    if (deleted.status === 'Active') {
      this.data.platform.metrics.activeBusinesses -= 1;
    } else {
      this.data.platform.metrics.inactiveBusinesses -= 1;
    }

    this.data.platform.activityLog.unshift({
      id: `act-${Date.now()}`,
      event: "Business Deleted",
      businessName: deleted.name,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      type: "danger"
    });

    if (this.currentBusinessId === bizId) {
      this.currentBusinessId = this.data.businesses[0]?.id || '';
    }

    this.saveData();
    this.showToast(`Business "${deleted.name}" deleted.`, 'danger');
  }

  // --- Category Actions ---
  addCategory(bizId, catData) {
    const biz = this.data.businesses.find(b => b.id === bizId);
    if (!biz) return;
    const newCat = {
      id: `cat-${Date.now()}`,
      name: catData.name,
      questionCount: 0,
      status: catData.status || 'Active',
      avgRating: 5.0,
      responses: 0
    };
    biz.categories.push(newCat);
    this.saveData();
    this.showToast(`Category "${newCat.name}" added successfully.`);
  }

  updateCategory(bizId, catId, fields) {
    const biz = this.data.businesses.find(b => b.id === bizId);
    if (!biz) return;
    const cat = biz.categories.find(c => c.id === catId);
    if (!cat) return;
    Object.assign(cat, fields);
    this.saveData();
    this.showToast(`Category "${cat.name}" updated.`);
  }

  deleteCategory(bizId, catId) {
    const biz = this.data.businesses.find(b => b.id === bizId);
    if (!biz) return;
    biz.categories = biz.categories.filter(c => c.id !== catId);
    this.saveData();
    this.showToast(`Category removed.`, 'warning');
  }

  // --- Question Actions ---
  addQuestion(bizId, qData) {
    const biz = this.data.businesses.find(b => b.id === bizId);
    if (!biz) return;
    const newQ = {
      id: `q-${Date.now()}`,
      text: qData.text,
      category: qData.category,
      type: qData.type || '1–5 Rating',
      status: qData.status || 'Active',
      createdDate: new Date().toISOString().split('T')[0]
    };
    biz.questions.unshift(newQ);
    // update questionCount on category
    const cat = biz.categories.find(c => c.name === qData.category);
    if (cat) cat.questionCount = (cat.questionCount || 0) + 1;

    this.saveData();
    this.showToast(`Question added to question bank.`);
  }

  updateQuestion(bizId, qId, fields) {
    const biz = this.data.businesses.find(b => b.id === bizId);
    if (!biz) return;
    const q = biz.questions.find(item => item.id === qId);
    if (!q) return;
    Object.assign(q, fields);
    this.saveData();
    this.showToast(`Question updated.`);
  }

  deleteQuestion(bizId, qId) {
    const biz = this.data.businesses.find(b => b.id === bizId);
    if (!biz) return;
    const q = biz.questions.find(item => item.id === qId);
    if (q) {
      const cat = biz.categories.find(c => c.name === q.category);
      if (cat && cat.questionCount > 0) cat.questionCount -= 1;
    }
    biz.questions = biz.questions.filter(item => item.id !== qId);
    this.saveData();
    this.showToast(`Question deleted.`, 'warning');
  }

  // --- Google Review URL ---
  updateGoogleReviewUrl(bizId, url) {
    const biz = this.data.businesses.find(b => b.id === bizId);
    if (!biz) return;
    biz.googleReviewUrl = url.trim();
    this.saveData();
    this.showToast(`Google Review URL saved successfully.`);
  }

  // --- Customer Flow State Machine ---
  createInitialCustomerSession() {
    return {
      step: 'landing', // 'landing' | 'info' | 'questions' | 'comment' | 'generating' | 'review' | 'completion'
      currentQuestionIndex: 0,
      customerName: '',
      customerMobile: '',
      selectedQuestions: [],
      answers: [],
      comment: '',
      generatedReview: '',
      editedReview: '',
      redirectLogged: false
    };
  }

  startCustomerSession(bizId) {
    const biz = this.data.businesses.find(b => b.id === bizId) || this.data.businesses[0];
    if (!biz) return;

    // Pick 3 active questions randomly or deterministically
    const activeQuestions = biz.questions.filter(q => q.status === 'Active');
    let selected = [];
    if (activeQuestions.length <= 3) {
      selected = [...activeQuestions];
    } else {
      // shuffle and take 3
      selected = [...activeQuestions].sort(() => 0.5 - Math.random()).slice(0, 3);
    }

    // Increment QR Scan count for this business
    biz.metrics.qrScans += 1;
    this.data.platform.metrics.totalQrScans += 1;

    this.customerSession = {
      step: 'landing',
      currentQuestionIndex: 0,
      customerName: '',
      customerMobile: '',
      selectedQuestions: selected,
      answers: [],
      comment: '',
      generatedReview: '',
      editedReview: '',
      redirectLogged: false
    };

    this.saveData();
  }

  setCustomerStep(step) {
    this.customerSession.step = step;
    this.notify();
  }

  saveCustomerInfo(name, mobile) {
    this.customerSession.customerName = name.trim();
    this.customerSession.customerMobile = mobile.trim();
    this.customerSession.step = 'questions';
    this.customerSession.currentQuestionIndex = 0;

    const biz = this.getCurrentBusiness();
    if (biz) {
      biz.metrics.customerInfoCompleted += 1;
    }
    this.saveData();
  }

  submitRating(rating) {
    const currentQ = this.customerSession.selectedQuestions[this.customerSession.currentQuestionIndex];
    if (!currentQ) return;

    // record or update answer
    const existingIdx = this.customerSession.answers.findIndex(a => a.questionId === currentQ.id);
    const answerObj = {
      questionId: currentQ.id,
      question: currentQ.text,
      category: currentQ.category,
      rating: rating
    };

    if (existingIdx >= 0) {
      this.customerSession.answers[existingIdx] = answerObj;
    } else {
      this.customerSession.answers.push(answerObj);
    }

    // Move to next question or comment screen
    if (this.customerSession.currentQuestionIndex < this.customerSession.selectedQuestions.length - 1) {
      this.customerSession.currentQuestionIndex += 1;
      this.notify();
    } else {
      this.customerSession.step = 'comment';
      this.notify();
    }
  }

  submitCustomerComment(comment) {
    this.customerSession.comment = (comment || "").trim();
    this.customerSession.step = 'generating';
    this.notify();

    const biz = this.getCurrentBusiness();
    if (biz) {
      biz.metrics.feedbackCompleted += 1;
      biz.metrics.aiReviewsGenerated += 1;
      this.data.platform.metrics.totalFeedbackSessions += 1;
      this.data.platform.metrics.totalAiGenerations += 1;
    }

    // Simulate AI synthesis process (1.2s delay)
    setTimeout(() => {
      const generated = generateReviewDraft({
        businessName: biz.name,
        answers: this.customerSession.answers,
        comment: this.customerSession.comment,
        tone: this.selectedTone
      });

      this.customerSession.generatedReview = generated;
      this.customerSession.editedReview = generated;
      this.customerSession.step = 'review';
      this.saveData();
    }, 1200);
  }

  regenerateDraftWithTone(tone) {
    this.selectedTone = tone;
    const biz = this.getCurrentBusiness();
    const generated = generateReviewDraft({
      businessName: biz.name,
      answers: this.customerSession.answers,
      comment: this.customerSession.comment,
      tone: tone
    });
    this.customerSession.generatedReview = generated;
    this.customerSession.editedReview = generated;
    this.notify();
  }

  updateEditedReviewText(text) {
    this.customerSession.editedReview = text;
    this.notify();
  }

  recordRedirectAndComplete() {
    const biz = this.getCurrentBusiness();
    if (biz && !this.customerSession.redirectLogged) {
      biz.metrics.googleRedirects += 1;
      this.data.platform.metrics.totalGoogleRedirects += 1;
      this.customerSession.redirectLogged = true;

      // Save as feedback record in business feedback history
      const newFeedback = {
        id: `fb-${Date.now()}`,
        customerName: this.customerSession.customerName || 'Anonymous Customer',
        customerMobile: this.customerSession.customerMobile || 'Not provided',
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        answers: this.customerSession.answers,
        comment: this.customerSession.comment,
        generatedReview: this.customerSession.generatedReview,
        editedReview: this.customerSession.editedReview !== this.customerSession.generatedReview ? this.customerSession.editedReview : null,
        redirectStatus: 'Redirected',
        sessionStatus: 'Completed'
      };
      biz.feedbackList.unshift(newFeedback);

      // Customer profile management
      if (this.customerSession.customerName) {
        let cust = biz.customers.find(c => c.mobile === this.customerSession.customerMobile);
        const avg = (this.customerSession.answers.reduce((s, a) => s + a.rating, 0) / (this.customerSession.answers.length || 1)).toFixed(1);
        if (!cust) {
          cust = {
            id: `cust-${Date.now()}`,
            name: this.customerSession.customerName,
            mobile: this.customerSession.customerMobile,
            firstSeen: new Date().toISOString().split('T')[0],
            lastSeen: new Date().toISOString().split('T')[0],
            sessionCount: 1,
            avgRating: parseFloat(avg),
            history: [{
              date: new Date().toISOString().split('T')[0],
              ratings: this.customerSession.answers.map(a => `${a.category}: ${a.rating}/5`).join(', '),
              comment: this.customerSession.comment
            }]
          };
          biz.customers.unshift(cust);
        } else {
          cust.sessionCount += 1;
          cust.lastSeen = new Date().toISOString().split('T')[0];
          cust.history.unshift({
            date: new Date().toISOString().split('T')[0],
            ratings: this.customerSession.answers.map(a => `${a.category}: ${a.rating}/5`).join(', '),
            comment: this.customerSession.comment
          });
        }
      }
    }

    this.customerSession.step = 'completion';
    this.saveData();
  }
}

export const store = new Store();
