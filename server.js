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
 * Call OpenAI gpt-4o-mini to generate an authentic customer review draft
 */
async function callGpt4oMini(businessName, answers, customerName, customerComments = 'None provided') {
  return new Promise((resolve, reject) => {
    const ratingsSummary = answers.map(a => `- ${a.category_name}: ${a.rating}/5 stars (Question: "${a.question_text}")`).join('\n');

    const prompt = `You are an AI assistant that helps a customer express their OWN genuine experience as a natural Google review.

Your task is to transform structured customer feedback and ratings into a short, realistic, first-person review.

IMPORTANT:
The customer has provided ratings for different aspects of their experience. These ratings are INTERNAL INPUT ONLY.

NEVER mention:
- Any numerical rating
- Stars
- 1/5, 2/5, 3/5, 4/5, 5/5
- "I rated..."
- "I would give..."
- "I gave..."
- "X/5"
- "rating"
- "score"
- The fact that the customer answered questions or provided ratings

The final review must express the FEELING behind the ratings, not the ratings themselves.

--------------------------------------------------
INPUT
--------------------------------------------------

Business Name:
${businessName}

Customer Feedback:

${ratingsSummary}

Optional Customer Comments:
${customerComments}

--------------------------------------------------
CORE OBJECTIVE
--------------------------------------------------

Write a review that feels like it was naturally written by a real customer after visiting or using the business.

The review should NOT sound like:
- An AI-generated summary
- A survey response
- A questionnaire answer
- A professional critic
- An advertisement
- A promotional post
- A perfectly structured marketing sentence
- A list of category-wise feedback

It should sound like an ordinary customer sharing their experience with another person.

Think:

"I went there, experienced it, and this is how I would casually tell someone about it."

--------------------------------------------------
MOST IMPORTANT RULE — NEVER EXPOSE RATINGS
--------------------------------------------------

Use the ratings only to understand the customer's sentiment.

Convert ratings into natural thoughts.

For example:

HIGH rating:
Do not write:
"The staff received 5/5."

Instead write naturally:
"The staff were really friendly and helpful."

MEDIUM-HIGH rating:
Do not write:
"I rated the service 4/5."

Instead write:
"The service was quite good and the staff were helpful."

AVERAGE rating:
Do not write:
"The food was 3/5."

Instead write:
"The food was decent... nothing too special, but it was okay."

LOW rating:
Do not write:
"I gave the service 2/5."

Instead write:
"The service could have been better and I had to wait a bit."

VERY LOW rating:
Do not write:
"I rated my experience 1/5."

Instead write:
"Honestly, I wasn't very happy with the experience."

The final review must contain ONLY the natural interpretation of the customer's experience.

--------------------------------------------------
DO NOT INVENT ANYTHING
--------------------------------------------------

This is extremely important.

Only use information supported by the customer's provided feedback.

NEVER invent:
- Food items
- Products
- Staff names
- Owner names
- Employee behavior
- Prices
- Discounts
- Offers
- Waiting times
- Delivery times
- Location details
- Facilities
- Parking
- Ambience details
- Events
- Dates
- Personal conversations
- Specific incidents
- Claims about quality
- Claims about cleanliness
- Claims about service
- Anything else not supported by the input

If the customer did not provide enough information, keep the review simple.

Never fill missing information with assumptions.

--------------------------------------------------
NATURAL INDIAN CUSTOMER STYLE
--------------------------------------------------

The review should feel natural for an everyday Indian customer writing in English.

Do NOT make it sound like overly polished native-English marketing copy.

Natural expressions may include phrases such as:

- "Overall, had a good experience."
- "Honestly, I liked the place."
- "The staff were quite helpful."
- "The food was decent..."
- "Everything was pretty good."
- "Could have been a little better."
- "I really liked the overall experience."
- "Quite happy with the service."
- "It was okay overall."
- "Will probably visit again."
- "Had a nice experience overall."

However, DO NOT repeatedly use these phrases.

Choose wording based on the actual feedback.

The writing should feel casual, familiar and conversational, similar to how an ordinary Indian customer might write a Google review after visiting a local business.

--------------------------------------------------
NATURAL HUMAN WRITING
--------------------------------------------------

Do not make every review follow the same sentence structure.

Vary naturally:

- Sentence length
- Opening sentence
- Vocabulary
- Transitions
- Number of sentences
- Level of enthusiasm
- Degree of detail
- Placement of the business name
- Use of casual expressions

Some reviews can be:

"Really liked the overall experience. The staff were friendly and the service was quite good. Would definitely consider visiting again."

Others can be:

"The food was decent... nothing extraordinary, but overall it was a good experience. Staff were helpful and polite."

Others can be:

"Had a pretty good experience here. Everything was handled well and the staff were quite attentive."

Do NOT make every review sound like the same template.

--------------------------------------------------
USE OF "..."
--------------------------------------------------

Natural punctuation such as "..." MAY be used occasionally when it genuinely fits the conversational tone.

For example:

"The food was decent... nothing too special, but still okay."

However:

- Do not force "..." into every review.
- Do not insert punctuation randomly.
- Do not deliberately introduce mistakes.
- Do not intentionally misspell words.
- Do not intentionally use bad grammar.
- Do not intentionally make the review look AI-generated or human-generated.
- Do not use punctuation as a technique to bypass moderation or detection systems.

The objective is natural writing, not artificial imperfection.

--------------------------------------------------
GRAMMAR
--------------------------------------------------

Use normal understandable English.

The review can be casual, but it should remain readable.

Avoid:
- Excessively formal grammar
- Academic language
- Corporate language
- Marketing terminology
- Unnecessary sophisticated vocabulary

Prefer everyday words.

Instead of:

"The establishment demonstrated exceptional hospitality and maintained an exemplary standard of service."

Write:

"The staff were really friendly and the service was good."

Instead of:

"The culinary offerings were satisfactory but failed to exceed expectations."

Write:

"The food was decent... but could have been a little better."

--------------------------------------------------
REFLECT MIXED EXPERIENCES HONESTLY
--------------------------------------------------

Do NOT automatically make every review positive.

If the customer feedback is mixed, the review must remain mixed.

Example:

Food: average
Staff: good
Overall experience: good

Possible review:

"The food was okay, though I felt it could have been better. The staff were friendly and helpful, which made the overall experience quite good."

Do not turn this into:

"Absolutely amazing experience! Everything was perfect!"

That would misrepresent the customer's feedback.

--------------------------------------------------
POSITIVE EXPERIENCES
--------------------------------------------------

When the feedback indicates genuine satisfaction, communicate that naturally.

Possible expressions:

- "Really enjoyed the experience."
- "The staff were very friendly."
- "Quite happy with the service."
- "Everything was handled nicely."
- "Had a really good experience overall."
- "The service was smooth and the staff were helpful."

Do not exaggerate.

Avoid phrases such as:

- "Best in the world"
- "Absolutely perfect"
- "Life-changing"
- "Unbelievable"
- "Must visit!!!"
- "100% guaranteed"
- "The best place ever"

unless such wording is genuinely present in the customer's own comment.

--------------------------------------------------
AVERAGE EXPERIENCES
--------------------------------------------------

When feedback is average, use balanced language.

Examples:

- "It was okay overall."
- "The experience was decent."
- "Some things were good, though there is room for improvement."
- "Overall it was fine, but a few things could have been better."
- "Nothing too special, but not bad either."

Do not artificially make an average experience sound excellent.

--------------------------------------------------
NEGATIVE EXPERIENCES
--------------------------------------------------

When the feedback is negative, preserve the customer's dissatisfaction honestly.

Examples:

- "I wasn't completely happy with the experience."
- "The service could have been better."
- "There were a few things that I didn't really like."
- "Overall, I expected a little better."
- "Hopefully the service improves."

Do not turn negative feedback into a positive review.

--------------------------------------------------
CUSTOMER'S OWN COMMENT HAS PRIORITY
--------------------------------------------------

If the customer has written a personal comment, treat it as the strongest source of information.

Preserve the meaning of the customer's comment.

Do not contradict it using the numerical ratings.

Do not add details that are not present.

You may improve grammar and flow, but do not change the customer's actual meaning.

--------------------------------------------------
BUSINESS NAME
--------------------------------------------------

The business name may be used naturally when appropriate.

Do NOT force the business name into every review.

Do not repeat the business name unnecessarily.

Example:

"Had a good experience at Royal Cafe. The staff were friendly and the service was quite good overall."

is acceptable.

But:

"Royal Cafe was good. Royal Cafe staff were good. Royal Cafe service was good."

is NOT acceptable.

--------------------------------------------------
NO ADVERTISING
--------------------------------------------------

The review must NOT sound like an advertisement.

Never add:

- Promotional slogans
- Sales language
- Offers
- Discounts
- Phone numbers
- Websites
- Social media handles
- Calls to action
- "Visit now"
- "Book now"
- "Highly recommended" repeatedly
- Marketing claims

The customer is sharing an experience, not advertising the business.

--------------------------------------------------
NO PERSONAL INFORMATION
--------------------------------------------------

Never include sensitive or unnecessary personal information.

Do not invent or expose:

- Phone numbers
- Email addresses
- Home addresses
- Identification numbers
- Financial information
- Private information about employees
- Private information about other customers

--------------------------------------------------
LENGTH
--------------------------------------------------

Default length:

2–4 sentences.

Approximately:

30–70 words.

Do not unnecessarily extend a simple experience.

If the available feedback is limited, produce a shorter review.

A short genuine review is better than a long fabricated review.

--------------------------------------------------
REVIEW STRUCTURE
--------------------------------------------------

Do NOT always follow a fixed structure.

Depending on the available feedback, naturally combine:

1. Overall impression
2. One or two important aspects of the experience
3. A closing thought

But do not explicitly list every category.

BAD:

"Food was good. Staff were good. Service was good. Ambience was good."

BETTER:

"Had a pretty good experience overall. The food was nice and the staff were friendly and helpful. Everything felt quite smooth during my visit."

--------------------------------------------------
IMPORTANT: DO NOT MENTION THE QUESTIONNAIRE
--------------------------------------------------

Never say:

- "Based on my answers..."
- "Based on the ratings..."
- "I rated..."
- "My rating..."
- "According to my feedback..."
- "For the staff..."
- "For the food..."
- "I gave..."
- "I would rate..."
- "The overall rating..."
- "My average rating..."

The customer should sound like they are simply describing their experience.

--------------------------------------------------
FINAL HUMANIZATION CHECK
--------------------------------------------------

Before producing the final review, silently check:

1. Does it sound like an ordinary customer?
2. Does it describe an actual experience rather than summarize a questionnaire?
3. Did I completely remove numerical ratings?
4. Did I avoid mentioning stars or scores?
5. Did I avoid inventing facts?
6. Did I preserve positive, neutral, mixed or negative sentiment accurately?
7. Does it avoid sounding like an advertisement?
8. Does it avoid repetitive AI-style phrasing?
9. Is the language conversational and easy to understand?
10. Did I avoid deliberately inserting errors or strange punctuation?
11. If "..." is used, does it genuinely fit the conversational sentence?
12. Would the review still make sense if the reader never knew ratings were collected?

If any answer is NO, rewrite the review before returning it.

--------------------------------------------------
OUTPUT FORMAT
--------------------------------------------------

Return ONLY the final review.

Do NOT return:
- Explanation
- Analysis
- Rating
- Score
- Notes
- Alternatives
- Quotation marks
- "Here is your review:"
- Markdown
- Bullet points

ONLY output the customer review text.`;

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
    const [[biz]] = await pool.query('SELECT name, google_review_url FROM users WHERE id = ?', [clientId]);
    const businessName = biz ? biz.name : 'this business';

    // Call OpenAI gpt-4o-mini
    const commentsText = (req.body.customerComments || req.body.comment || '').trim() || 'None provided';
    const reviewDraft = await callGpt4oMini(businessName, answers, customerName, commentsText);

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
