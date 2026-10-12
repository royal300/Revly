const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const https = require('https');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env if present
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const match = trimmed.match(/^([\w.-]+)\s*=\s*(.*)?$/);
    if (match) {
      const key = match[1];
      let val = match[2] || '';
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  });
}

const app = express();
const PORT = process.env.PORT || 3095;
const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || 'mypass';
const DB_NAME = process.env.DB_NAME || 'revly';

app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Ensure uploads directory exists and is statically served
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Serve static frontend from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Image Upload Endpoint (Handles direct image uploads for Logo and Banner)
app.post('/api/upload', async (req, res) => {
  const { data, filename } = req.body;
  if (!data) {
    return res.status(400).json({ error: 'No image data provided' });
  }

  try {
    const matches = data.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ error: 'Invalid image format. Expected base64 Data URL.' });
    }
    const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const buffer = Buffer.from(matches[2], 'base64');

    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ error: 'Image exceeds maximum 10MB limit' });
    }

    const safeName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = path.join(uploadsDir, safeName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeName}`;
    res.json({ success: true, url: publicUrl });
  } catch (err) {
    console.error('Error in /api/upload:', err);
    res.status(500).json({ error: 'Failed to process image upload' });
  }
});

// MySQL Pool Connection to revly database
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

/**
 * Intelligently pick 1 SEO keyword from client's list based on customer feedback
 */
/**
 * Universal Intelligent SEO Keyword Selector
 * Dynamically adapts to ANY business type (Salon, Clinic, Gym, Cafe, Retail, Garage, etc.)
 */
function pickIntelligentSeoKeyword(businessName, answers = [], rawKeywords = '') {
  // Safe general defaults if client hasn't added custom keywords yet
  const cleanBiz = (businessName || 'this place').trim();
  const defaultList = [
    `top rated ${cleanBiz.toLowerCase()} experience`,
    'great customer service',
    'friendly and professional staff',
    'reliable local business',
    'highly recommended'
  ];

  let list = (rawKeywords && typeof rawKeywords === 'string' && rawKeywords.trim())
    ? rawKeywords.split(/,|\n/).map(k => k.trim()).filter(k => k.length > 2)
    : [];

  if (list.length === 0) {
    list = defaultList;
  }

  // 1. Analyze sentiment per category
  let totalRating = 0;
  let count = 0;
  const negativeCategoryWords = new Set();
  const positiveCategoryWords = new Set();

  for (const a of answers) {
    const r = Number(a.rating) || 5;
    totalRating += r;
    count++;
    
    // Extract meaningful words (> 2 chars) from category name and question text
    const text = ((a.category_name || '') + ' ' + (a.question_text || '')).toLowerCase();
    const words = text.match(/[a-z]{3,}/g) || [];
    const stopWords = ['how', 'was', 'our', 'the', 'you', 'your', 'and', 'for', 'with', 'rate', 'give', 'what', 'did'];

    if (r <= 3) {
      // Customer gave average or poor rating (<= 3) for this aspect
      words.forEach(w => {
        if (!stopWords.includes(w)) negativeCategoryWords.add(w);
      });
    } else if (r >= 4) {
      // Customer was satisfied (>= 4) with this aspect
      words.forEach(w => {
        if (!stopWords.includes(w)) positiveCategoryWords.add(w);
      });
    }
  }

  const avgRating = count > 0 ? (totalRating / count) : 4.5;

  // STRICT RULE: If overall experience is poor (<= 3.0), do NOT inject glowing ranking keywords
  if (avgRating <= 3.0) {
    return ''; // Skip SEO keyword injection to maintain authentic review
  }

  // 2. Filter candidates: strictly disqualify keywords that contain words from negative/average categories
  let candidates = list.filter(k => {
    const kLower = k.toLowerCase();
    for (const negWord of negativeCategoryWords) {
      if (kLower.includes(negWord)) {
        return false;
      }
    }
    return true;
  });

  // Industry-specific fallback disqualifications when negative words are flagged
  // Food & Cafe
  if (negativeCategoryWords.has('food') || negativeCategoryWords.has('drinks') || negativeCategoryWords.has('taste') || negativeCategoryWords.has('beverage')) {
    candidates = candidates.filter(k => !/food|pizza|dish|burger|coffee|taste|eat|menu|drink|beverage|snack|tea|cafe/i.test(k));
  }
  // Salon & Spa
  if (negativeCategoryWords.has('hair') || negativeCategoryWords.has('haircut') || negativeCategoryWords.has('styling') || negativeCategoryWords.has('facial') || negativeCategoryWords.has('treatment') || negativeCategoryWords.has('spa')) {
    candidates = candidates.filter(k => !/hair|facial|styling|treatment|spa|cut|color|salon/i.test(k));
  }
  // Clinic, Dental & Medical
  if (negativeCategoryWords.has('doctor') || negativeCategoryWords.has('treatment') || negativeCategoryWords.has('consultation') || negativeCategoryWords.has('teeth') || negativeCategoryWords.has('dental')) {
    candidates = candidates.filter(k => !/treatment|doctor|dentist|dental|surgery|clinic|consultation/i.test(k));
  }
  // Gym & Fitness
  if (negativeCategoryWords.has('trainer') || negativeCategoryWords.has('workout') || negativeCategoryWords.has('equipment') || negativeCategoryWords.has('fitness')) {
    candidates = candidates.filter(k => !/trainer|workout|gym|fitness|equipment/i.test(k));
  }

  // 3. Priority boost: Prioritize keywords that match positive category aspects
  const positiveMatches = candidates.filter(k => {
    const kLower = k.toLowerCase();
    for (const posWord of positiveCategoryWords) {
      if (kLower.includes(posWord)) return true;
    }
    return false;
  });

  if (positiveMatches.length > 0 && Math.random() < 0.7) {
    candidates = positiveMatches;
  }

  if (candidates.length === 0) {
    candidates = list.length > 0 ? list : defaultList;
  }

  // Pick exactly 1 keyword
  const chosen = candidates[Math.floor(Math.random() * candidates.length)];
  return chosen || '';
}

/**
 * Call OpenAI gpt-4o-mini to generate an authentic customer review draft
 */
async function callGpt4oMini(businessName, answers, customerName, customerComments = 'None provided', seoKeywords = '') {
  return new Promise((resolve, reject) => {
    const targetKeyword = pickIntelligentSeoKeyword(businessName, answers, seoKeywords);

    // Build richer feedback summary — include question context so AI understands what each aspect means
    const sentimentMap = r => r >= 5 ? 'excellent' : r >= 4 ? 'good' : r === 3 ? 'okay' : r === 2 ? 'disappointing' : 'bad';
    const ratingsSummary = answers.map(a => {
      const aspect = a.question_text ? `${a.category_name} (${a.question_text})` : a.category_name;
      return `- ${aspect}: ${sentimentMap(Number(a.rating) || 3)}`;
    }).join('\n');

    // SEO keyword — weave in naturally
    const kwLine = targetKeyword
      ? `If it fits naturally, use this phrase once: "${targetKeyword}". Do NOT force it.`
      : '';

    // Customer's own comment — highest priority signal
    const commentLine = (customerComments && customerComments.trim() && customerComments.trim().toLowerCase() !== 'none provided')
      ? `What the customer said in their own words: "${customerComments.trim()}" — incorporate this naturally.`
      : '';

    // Random opening seed — forces different starts every time
    const openingSeeds = [
      'Start with what you noticed first when you walked in or started using the service.',
      'Start with how you felt overall after the experience.',
      'Start with a specific thing that stood out to you — good or bad.',
      'Start with why you went there and whether it was worth it.',
      'Start with a recommendation or casual observation about the place.',
      'Start with something small but memorable about the experience.',
    ];
    const openingSeed = openingSeeds[Math.floor(Math.random() * openingSeeds.length)];

    const systemPrompt = `You are a real Indian customer writing your own Google review after visiting a local business. Write in first person ("I", "we", "my"). If you give advice to others, use second person ("you should", "worth visiting"). Your review must feel personal — like you are telling a friend what actually happened, not a generic summary. Every review must have a completely different opening, different tone, and different length. Never start with "Had a" or "I had a". Never mention stars, numbers, ratings, or surveys. Never invent specific food names, procedures, or services unless the customer mentioned them. Keep it honest — if something was okay or bad, say so naturally. 2–4 sentences, 30–80 words. Return ONLY the review.`;

    const userPrompt = `Business visited: ${businessName}

Customer experience:
${ratingsSummary}

${commentLine}
${kwLine}

Instruction: ${openingSeed}
Write the review now.`;


    const payload = JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 180,
      temperature: 0.9
    });

    const req = https.request({
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.choices && parsed.choices.length > 0) {
            resolve(parsed.choices[0].message.content.trim());
          } else {
            console.error('OpenAI Error Response:', body);
            resolve(`I recently visited ${businessName} and had a good experience. The service and quality met my expectations.`);
          }
        } catch (e) {
          resolve(`I recently visited ${businessName} and had a positive experience overall.`);
        }
      });
    });

    req.on('error', err => {
      console.error('OpenAI request error:', err);
      resolve(`I recently visited ${businessName} and was pleased with the service.`);
    });

    req.write(payload);
    req.end();
  });
}

// -------------------------------------------------------------
// AUTHENTICATION
// -------------------------------------------------------------
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username.trim()]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = rows[0];
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        username: user.username,
        phone: user.phone || '',
        google_review_url: user.google_review_url || '',
        qr_color: user.qr_color || '#0f172a'
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// -------------------------------------------------------------
// SUPER ADMIN ENDPOINTS
// 1. Create new Client
// 2. Client List (only name, username, phone)
// 3. User password update
// -------------------------------------------------------------
app.get('/api/admin/clients', async (req, res) => {
  try {
    const [clients] = await pool.query(`
      SELECT 
        u.id, 
        u.name, 
        u.username, 
        u.phone,
        (SELECT COUNT(*) FROM scans WHERE client_id = u.id) as scan_count,
        (SELECT COUNT(*) FROM feedbacks WHERE client_id = u.id) as generated_count
      FROM users u
      WHERE u.role = 'client'
      ORDER BY u.id DESC
    `);
    res.json(clients);
  } catch (err) {
    console.error('Error fetching clients:', err);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

app.post('/api/admin/clients', async (req, res) => {
  const { name, username, password, phone } = req.body;
  if (!name || !username || !password) {
    return res.status(400).json({ error: 'Business name, username and password are required' });
  }

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', [username.trim()]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Username already taken, please choose another' });
    }

    const [result] = await pool.query(
      'INSERT INTO users (role, name, username, password, phone) VALUES (?, ?, ?, ?, ?)',
      ['client', name.trim(), username.trim(), password, phone ? phone.trim() : '']
    );

    const clientId = result.insertId;

    const [cat1] = await pool.query('INSERT INTO categories (client_id, name) VALUES (?, ?)', [clientId, 'Staff & Service']);
    const [cat2] = await pool.query('INSERT INTO categories (client_id, name) VALUES (?, ?)', [clientId, 'Quality & Value']);

    await pool.query('INSERT INTO questions (client_id, category_id, question_text) VALUES (?, ?, ?)',
      [clientId, cat1.insertId, 'How friendly and attentive was our team?']);
    await pool.query('INSERT INTO questions (client_id, category_id, question_text) VALUES (?, ?, ?)',
      [clientId, cat2.insertId, 'How would you rate the overall quality of your experience?']);

    res.json({ success: true, clientId });
  } catch (err) {
    console.error('Error creating client:', err);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

app.put('/api/admin/clients/:id/password', async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;
  if (!newPassword) {
    return res.status(400).json({ error: 'New password required' });
  }

  try {
    await pool.query('UPDATE users SET password = ? WHERE id = ? AND role = "client"', [newPassword, id]);
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ error: 'Failed to update password' });
  }
});

app.delete('/api/admin/clients/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = ? AND role = "client"', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting client:', err);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

// -------------------------------------------------------------
// CLIENT BUSINESS ENDPOINTS
// 1. Profile (Business Name, Google Review URL, Choose QR)
// 2. Analytics (No of scan, how many generated, category wise rating & feedback)
// 3. Question & Category (Set questions and categories)
// -------------------------------------------------------------
app.get('/api/client/profile/:clientId', async (req, res) => {
  const { clientId } = req.params;
  try {
    const [rows] = await pool.query('SELECT id, name, username, phone, google_review_url, qr_color, bg_color, logo_url, banner_url, seo_keywords FROM users WHERE id = ?', [clientId]);
    if (rows.length === 0) return res.status(404).json({ error: 'Client not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching client profile:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.put('/api/client/profile/:clientId', async (req, res) => {
  const { clientId } = req.params;
  const { name, google_review_url, qr_color, bg_color, logo_url, banner_url, seo_keywords } = req.body;
  try {
    await pool.query(
      `UPDATE users SET 
        name = COALESCE(?, name), 
        google_review_url = ?, 
        qr_color = COALESCE(?, qr_color),
        bg_color = COALESCE(?, bg_color),
        logo_url = ?,
        banner_url = ?,
        seo_keywords = COALESCE(?, seo_keywords)
       WHERE id = ?`,
      [name, google_review_url || '', qr_color || '#0f172a', bg_color || '#edf4fc', logo_url || null, banner_url || null, seo_keywords !== undefined ? seo_keywords : null, clientId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Category Management
app.get('/api/client/categories/:clientId', async (req, res) => {
  const { clientId } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT c.id, c.name, COUNT(q.id) as question_count
      FROM categories c
      LEFT JOIN questions q ON q.category_id = c.id
      WHERE c.client_id = ?
      GROUP BY c.id
      ORDER BY c.id ASC
    `, [clientId]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.post('/api/client/categories/:clientId', async (req, res) => {
  const { clientId } = req.params;
  const { name } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Category name required' });
  try {
    const [result] = await pool.query('INSERT INTO categories (client_id, name) VALUES (?, ?)', [clientId, name.trim()]);
    res.json({ success: true, id: result.insertId, name: name.trim() });
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

app.delete('/api/client/categories/:categoryId', async (req, res) => {
  const { categoryId } = req.params;
  try {
    await pool.query('DELETE FROM questions WHERE category_id = ?', [categoryId]);
    await pool.query('DELETE FROM categories WHERE id = ?', [categoryId]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Question Bank Management
app.get('/api/client/questions/:clientId', async (req, res) => {
  const { clientId } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT q.id, q.question_text, q.category_id, c.name as category_name
      FROM questions q
      JOIN categories c ON c.id = q.category_id
      WHERE q.client_id = ?
      ORDER BY q.id DESC
    `, [clientId]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

app.post('/api/client/questions/:clientId', async (req, res) => {
  const { clientId } = req.params;
  const { category_id, question_text } = req.body;
  if (!category_id || !question_text || !question_text.trim()) {
    return res.status(400).json({ error: 'Category and question text required' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO questions (client_id, category_id, question_text) VALUES (?, ?, ?)',
      [clientId, category_id, question_text.trim()]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('Error adding question:', err);
    res.status(500).json({ error: 'Failed to add question' });
  }
});

app.delete('/api/client/questions/:questionId', async (req, res) => {
  const { questionId } = req.params;
  try {
    await pool.query('DELETE FROM questions WHERE id = ?', [questionId]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting question:', err);
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

// Clean Analytics with Date Period Filtering (Today, Week, Month, All-Time)
app.get('/api/client/analytics/:clientId', async (req, res) => {
  const { clientId } = req.params;
  const { period = 'today' } = req.query; // 'today' | 'week' | 'month' | 'all'

  let dateFilterScans = '';
  let dateFilterFeedbacks = '';
  let dateFilterFA = '';

  if (period === 'today') {
    dateFilterScans = 'AND DATE(created_at) = CURDATE()';
    dateFilterFeedbacks = 'AND DATE(created_at) = CURDATE()';
    dateFilterFA = 'AND DATE(f.created_at) = CURDATE()';
  } else if (period === 'week') {
    dateFilterScans = 'AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
    dateFilterFeedbacks = 'AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
    dateFilterFA = 'AND f.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
  } else if (period === 'month') {
    dateFilterScans = 'AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
    dateFilterFeedbacks = 'AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
    dateFilterFA = 'AND f.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
  }

  try {
    const [[scanRes]] = await pool.query(
      `SELECT COUNT(*) as total_scans FROM scans WHERE client_id = ? ${dateFilterScans}`,
      [clientId]
    );
    const [[genRes]] = await pool.query(
      `SELECT COUNT(*) as total_generated FROM feedbacks WHERE client_id = ? ${dateFilterFeedbacks}`,
      [clientId]
    );

    const [categoryRatings] = await pool.query(`
      SELECT 
        fa.category_name,
        ROUND(AVG(fa.rating), 1) as avg_rating,
        COUNT(fa.id) as response_count
      FROM feedback_answers fa
      JOIN feedbacks f ON f.id = fa.feedback_id
      WHERE f.client_id = ? ${dateFilterFA}
      GROUP BY fa.category_name
      ORDER BY avg_rating DESC
    `, [clientId]);

    const [recentFeedback] = await pool.query(`
      SELECT 
        f.id,
        f.customer_name,
        f.customer_mobile,
        f.generated_review,
        f.redirected_to_google,
        f.created_at
      FROM feedbacks f
      WHERE f.client_id = ? ${dateFilterFeedbacks}
      ORDER BY f.id DESC
      LIMIT 15
    `, [clientId]);

    // Average rating across all feedback in this period
    const [[avgRatingRes]] = await pool.query(`
      SELECT ROUND(AVG(fa.rating), 1) as overall_avg
      FROM feedback_answers fa
      JOIN feedbacks f ON f.id = fa.feedback_id
      WHERE f.client_id = ? ${dateFilterFA}
    `, [clientId]);

    res.json({
      period,
      total_scans: scanRes.total_scans || 0,
      total_generated: genRes.total_generated || 0,
      overall_avg: avgRatingRes && avgRatingRes.overall_avg ? Number(avgRatingRes.overall_avg) : 5.0,
      category_ratings: categoryRatings,
      recent_feedback: recentFeedback
    });
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Customer Directory for Client Business (Unique by mobile number)
app.get('/api/client/customers/:clientId', async (req, res) => {
  const { clientId } = req.params;
  try {
    const [customers] = await pool.query(`
      SELECT 
        c.id,
        c.name,
        c.mobile,
        c.visit_count,
        c.last_visited,
        c.created_at,
        (SELECT COUNT(*) FROM feedbacks f WHERE f.client_id = c.client_id AND f.customer_mobile = c.mobile) as reviews_count,
        (SELECT MAX(f.generated_review) FROM feedbacks f WHERE f.client_id = c.client_id AND f.customer_mobile = c.mobile) as latest_review
      FROM customers c
      WHERE c.client_id = ?
      ORDER BY c.last_visited DESC
    `, [clientId]);
    res.json(customers);
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Delete customer record
app.delete('/api/client/customers/:customerId', async (req, res) => {
  const { customerId } = req.params;
  try {
    await pool.query('DELETE FROM customers WHERE id = ?', [customerId]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting customer:', err);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

// Record customer info on Step 2 (Ensures visit count and unique mobile are saved)
app.post('/api/customer/record-info', async (req, res) => {
  const { clientId, name, mobile } = req.body;
  if (!clientId || !mobile || !mobile.trim()) {
    return res.json({ success: true, recorded: false });
  }
  try {
    const cleanMobile = mobile.trim();
    const cleanName = (name && name.trim()) ? name.trim() : 'Guest';
    await pool.query(`
      INSERT INTO customers (client_id, name, mobile, visit_count, last_visited)
      VALUES (?, ?, ?, 1, NOW())
      ON DUPLICATE KEY UPDATE 
        name = IF(VALUES(name) != '' AND VALUES(name) != 'Guest' AND VALUES(name) != 'Anonymous', VALUES(name), name),
        visit_count = visit_count + 1,
        last_visited = NOW()
    `, [clientId, cleanName, cleanMobile]);
    res.json({ success: true, recorded: true });
  } catch (err) {
    console.error('Error recording customer info:', err);
    res.json({ success: false });
  }
});


// -------------------------------------------------------------
// CUSTOMER / USER FLOW ENDPOINTS
// 1. Scan -> Record scan & return 3 random questions
// 2. Submit -> Call gpt-4o-mini & return review draft
// 3. Redirect -> Mark redirected
// -------------------------------------------------------------
app.get('/api/customer/session/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const [users] = await pool.query('SELECT id, name, username, google_review_url, qr_color, bg_color, logo_url, banner_url FROM users WHERE username = ? AND role = "client"', [username]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'Business not found or invalid QR link' });
    }

    const business = users[0];

    // Record QR Scan
    await pool.query('INSERT INTO scans (client_id) VALUES (?)', [business.id]);

    // Fetch questions for this client, randomly select 3
    const [questions] = await pool.query(`
      SELECT q.id, q.question_text, c.name as category_name
      FROM questions q
      JOIN categories c ON c.id = q.category_id
      WHERE q.client_id = ?
      ORDER BY RAND()
      LIMIT 3
    `, [business.id]);

    res.json({
      clientId: business.id,
      businessName: business.name,
      googleReviewUrl: business.google_review_url || '',
      qrColor: business.qr_color || '#0f172a',
      bgColor: business.bg_color || '#edf4fc',
      logoUrl: business.logo_url || '',
      bannerUrl: business.banner_url || '',
      questions: questions
    });
  } catch (err) {
    console.error('Error initiating customer session:', err);
    res.status(500).json({ error: 'Failed to load session' });
  }
});

app.post('/api/customer/generate-review', async (req, res) => {
  const { clientId, customerName, customerMobile, answers } = req.body;
  if (!clientId || !answers || answers.length === 0) {
    return res.status(400).json({ error: 'Client ID and answers are required' });
  }

  try {
    const [[biz]] = await pool.query('SELECT name, google_review_url, seo_keywords FROM users WHERE id = ?', [clientId]);
    const businessName = biz ? biz.name : 'this business';
    const seoKeywords = biz ? (biz.seo_keywords || '') : '';

    // Call OpenAI gpt-4o-mini
    const commentsText = (req.body.customerComments || req.body.comment || '').trim() || 'None provided';
    const reviewDraft = await callGpt4oMini(businessName, answers, customerName, commentsText, seoKeywords);

    // Save to database
    const [fbResult] = await pool.query(
      'INSERT INTO feedbacks (client_id, customer_name, customer_mobile, generated_review) VALUES (?, ?, ?, ?)',
      [clientId, customerName || 'Anonymous', customerMobile || '', reviewDraft]
    );

    const feedbackId = fbResult.insertId;

    // Record or update unique customer directory
    if (customerMobile && customerMobile.trim()) {
      const cleanMobile = customerMobile.trim();
      const cleanName = (customerName && customerName.trim() && customerName !== 'Anonymous') ? customerName.trim() : 'Guest';
      await pool.query(`
        INSERT INTO customers (client_id, name, mobile, visit_count, last_visited)
        VALUES (?, ?, ?, 1, NOW())
        ON DUPLICATE KEY UPDATE 
          name = IF(VALUES(name) != '' AND VALUES(name) != 'Guest' AND VALUES(name) != 'Anonymous', VALUES(name), name),
          last_visited = NOW()
      `, [clientId, cleanName, cleanMobile]);
    }

    // Save individual answers
    for (const ans of answers) {
      await pool.query(
        'INSERT INTO feedback_answers (feedback_id, category_id, category_name, question_text, rating) VALUES (?, ?, ?, ?, ?)',
        [feedbackId, ans.category_id || 0, ans.category_name || 'General', ans.question_text || '', ans.rating]
      );
    }

    res.json({
      success: true,
      feedbackId: feedbackId,
      reviewDraft: reviewDraft,
      googleReviewUrl: biz ? biz.google_review_url : ''
    });
  } catch (err) {
    console.error('Error generating review:', err);
    res.status(500).json({ error: 'Failed to generate review' });
  }
});

app.post('/api/customer/redirect', async (req, res) => {
  const { feedbackId } = req.body;
  if (feedbackId) {
    try {
      await pool.query('UPDATE feedbacks SET redirected_to_google = 1 WHERE id = ?', [feedbackId]);
    } catch (e) {
      console.error(e);
    }
  }
  res.json({ success: true });
});

// Fallback for all client-side routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Backend API server running cleanly on http://localhost:${PORT}`);
});
