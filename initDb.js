const mysql = require('mysql2/promise');

const DB_CONFIG = {
  host: '93.127.206.52',
  user: 'root',
  password: 'mypass',
  database: 'revly',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function initDatabase() {
  console.log('Connecting to MySQL database "revly"...');
  const pool = mysql.createPool(DB_CONFIG);

  try {
    // 1. users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        role ENUM('admin', 'client') NOT NULL DEFAULT 'client',
        name VARCHAR(255) NOT NULL,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(50) DEFAULT '',
        google_review_url TEXT DEFAULT NULL,
        qr_color VARCHAR(20) DEFAULT '#0f172a',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('✔ users table verified');

    // 2. categories table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX(client_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('✔ categories table verified');

    // 3. questions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_id INT NOT NULL,
        category_id INT NOT NULL,
        question_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX(client_id),
        INDEX(category_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('✔ questions table verified');

    // 4. scans table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS scans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX(client_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('✔ scans table verified');

    // 5. feedbacks table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS feedbacks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_id INT NOT NULL,
        customer_name VARCHAR(150) DEFAULT '',
        customer_mobile VARCHAR(50) DEFAULT '',
        generated_review TEXT DEFAULT NULL,
        redirected_to_google TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX(client_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('✔ feedbacks table verified');

    // 6. feedback_answers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS feedback_answers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        feedback_id INT NOT NULL,
        category_id INT NOT NULL,
        category_name VARCHAR(100) NOT NULL,
        question_text TEXT NOT NULL,
        rating INT NOT NULL,
        INDEX(feedback_id),
        INDEX(category_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('✔ feedback_answers table verified');

    // Ensure default super admin exists: admin / admin123
    const [admins] = await pool.query('SELECT id FROM users WHERE username = ?', ['admin']);
    if (admins.length === 0) {
      await pool.query(
        'INSERT INTO users (role, name, username, password, phone) VALUES (?, ?, ?, ?, ?)',
        ['admin', 'Super Admin', 'admin', 'admin123', '']
      );
      console.log('✔ Default Super Admin created: admin / admin123');
    } else {
      console.log('✔ Super Admin account exists');
    }

    console.log('🎉 Database initialization complete!');
  } catch (err) {
    console.error('Database initialization error:', err);
  } finally {
    await pool.end();
  }
}

initDatabase();
