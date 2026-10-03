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
app.use(express.json());

// Serve static frontend from dist
app.use(express.static(path.join(__dirname, 'dist')));

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
 * Call OpenAI gpt-4o-mini to generate an authentic customer review draft
 */
async function callGpt4oMini(businessName, answers, customerName) {
  return new Promise((resolve, reject) => {
    const ratingsSummary = answers.map(a => `- ${a.category_name}: ${a.rating}/5 stars (Question: "${a.question_text}")`).join('\n');
    const avgRating = answers.reduce((sum, a) => sum + Number(a.rating), 0) / (answers.length || 1);

    const prompt = `You are the review-writing assistant for a customer feedback system.

Your task is to transform the customer's own feedback into a short, natural first-person review for the business.

BUSINESS:
${businessName}

CUSTOMER FEEDBACK:
${ratingsSummary}

AVERAGE CUSTOMER RATING:
${avgRating.toFixed(1)}/5

IMPORTANT PRINCIPLE:
The review must represent the customer's genuine experience. You are rewriting and organizing information the customer actually provided, not creating a new experience for them.

GOOGLE REVIEW SAFETY & AUTHENTICITY RULES:

1. ONLY use information explicitly provided in the customer's ratings, answers, and optional comment.

2. NEVER invent:
   - Products or services the customer did not mention
   - Staff names
   - Specific employees
   - Prices
   - Discounts
   - Waiting times
   - Locations
   - Facilities
   - Events
   - Dates
   - Personal experiences
   - Specific claims about quality
   - Any other unsupported facts

3. Do not exaggerate the customer's experience.

4. Do not turn a neutral or negative rating into positive feedback.

5. Preserve mixed feedback honestly.
   Example:
   Food = 5/5
   Service = 2/5
   The review should communicate that the food was good while acknowledging that service could have been better.

6. Do not automatically make every review sound like a 5-star review.

7. Do not use promotional or advertising language such as:
   - "Best in town"
   - "Highly recommended" unless the customer actually expressed this sentiment
   - "Must visit"
   - "Number one"
   - "Amazing service" when the rating does not support it
   - "Perfect in every way"

8. Do not include:
   - Phone numbers
   - Email addresses
   - Website links
   - Promotional offers
   - Discount codes
   - Marketing CTAs

9. Do not mention this AI system, AI generation, prompts, ratings-processing, or the review-generation process.

10. Do not copy a fixed review template repeatedly. Each review should be naturally composed from the customer's actual feedback.

11. Do not deliberately insert spelling mistakes, grammatical errors, random punctuation, or unnatural wording to disguise AI generation.

12. Natural writing is more important than artificial "humanization."
    Vary sentence structure, vocabulary, length, and transitions naturally based on the customer's feedback.

13. If the customer provided very little information, keep the review short rather than inventing additional details.

14. If the customer's feedback is negative or mixed, write it respectfully and honestly. Do not suppress legitimate criticism.

15. Never manipulate the customer's rating or encourage a particular star rating.

WRITING STYLE:

- First person.
- Conversational.
- Concise.
- Friendly.
- Natural.
- Specific only when the customer provided specific information.
- Avoid corporate/marketing language.
- Avoid excessive adjectives.
- Avoid sounding like an advertisement.
- Avoid overly sophisticated vocabulary.
- Use contractions naturally where appropriate, such as "wasn't", "I've", or "didn't".
- Use normal punctuation and sentence structure.
- Do not make every review follow the exact same structure.

LENGTH:

Write 2–4 sentences.

Prefer approximately 30–70 words.

Do not artificially increase the length.

RATING INTERPRETATION:

5/5:
Express strong satisfaction with the specific areas the customer rated highly.

4/5:
Express positive satisfaction without making the experience sound perfect.

3/5:
Use balanced, neutral language and reflect the customer's experience without forcing positivity.

2/5:
Clearly but respectfully communicate the areas that were disappointing.

1/5:
Reflect the negative experience honestly and respectfully.

MIXED RATINGS:

When ratings differ significantly between categories, preserve that contrast.

Example input:

Food: 5/5
Service: 2/5
Ambience: 5/5
Comment: "The biryani was really good."

Good output style:

"I really enjoyed the food, especially the biryani, and the ambience was nice. The service could have been better, though."

Do NOT produce:

"Absolutely amazing restaurant! Everything was perfect and the staff were fantastic."

because those claims were not provided by the customer.

NATURALNESS:

The review should sound like something a real customer could reasonably write after visiting the business.

Do not make every review begin with:
"I recently visited..."

Avoid repetitive structures such as:

"I had a great experience..."
"The food was great..."
"The service was great..."

Instead, naturally organize the information available in the customer's responses.

For example, depending on the input, the review could naturally begin with:

"I really enjoyed..."
"The food was..."
"Overall, I was..."
"Had a good experience..."
"What I liked most was..."
"The ambience was..."
"The main highlight for me was..."

Only use a statement when it is supported by the customer's actual feedback.

FINAL CHECK BEFORE OUTPUT:

Before returning the review, verify:

- Is every factual claim supported by customer input?
- Does the wording accurately reflect the ratings?
- Is negative or mixed feedback preserved?
- Is anything fabricated?
- Does it sound like a customer rather than a business advertisement?
- Is it concise?
- Is it original rather than a repeated template?
- Does it avoid promotional content?
- Does it avoid personal information about other people?
- Does it avoid manipulation of the customer's rating?

OUTPUT RULE:

Return ONLY the final review text.

Do not return:
- Quotes
- Bullet points
- Explanations
- Labels
- Ratings
- Analysis
- Warnings
- Preamble
- Markdown`;

    const payload = JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an authentic review drafting assistant.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 200,
      temperature: 0.7
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
    const [rows] = await pool.query('SELECT id, name, username, phone, google_review_url, qr_color, bg_color, logo_url, banner_url FROM users WHERE id = ?', [clientId]);
    if (rows.length === 0) return res.status(404).json({ error: 'Client not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching client profile:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.put('/api/client/profile/:clientId', async (req, res) => {
  const { clientId } = req.params;
  const { name, google_review_url, qr_color, bg_color, logo_url, banner_url } = req.body;
  try {
    await pool.query(
      `UPDATE users SET 
        name = COALESCE(?, name), 
        google_review_url = ?, 
        qr_color = COALESCE(?, qr_color),
        bg_color = COALESCE(?, bg_color),
        logo_url = ?,
        banner_url = ?
       WHERE id = ?`,
      [name, google_review_url || '', qr_color || '#0f172a', bg_color || '#edf4fc', logo_url || null, banner_url || null, clientId]
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

// Clean Analytics
app.get('/api/client/analytics/:clientId', async (req, res) => {
  const { clientId } = req.params;
  try {
    const [[scanRes]] = await pool.query('SELECT COUNT(*) as total_scans FROM scans WHERE client_id = ?', [clientId]);
    const [[genRes]] = await pool.query('SELECT COUNT(*) as total_generated FROM feedbacks WHERE client_id = ?', [clientId]);

    const [categoryRatings] = await pool.query(`
      SELECT 
        fa.category_name,
        ROUND(AVG(fa.rating), 1) as avg_rating,
        COUNT(fa.id) as response_count
      FROM feedback_answers fa
      JOIN feedbacks f ON f.id = fa.feedback_id
      WHERE f.client_id = ?
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
      WHERE f.client_id = ?
      ORDER BY f.id DESC
      LIMIT 10
    `, [clientId]);

    res.json({
      total_scans: scanRes.total_scans || 0,
      total_generated: genRes.total_generated || 0,
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
    const [[biz]] = await pool.query('SELECT name, google_review_url FROM users WHERE id = ?', [clientId]);
    const businessName = biz ? biz.name : 'this business';

    // Call OpenAI gpt-4o-mini
    const reviewDraft = await callGpt4oMini(businessName, answers, customerName);

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
