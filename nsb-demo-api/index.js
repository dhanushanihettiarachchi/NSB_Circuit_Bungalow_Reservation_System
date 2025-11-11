require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql, getPool } = require('./db');

const app = express();

/* ---------- Middleware ---------- */
app.use(cors());                 // you can restrict origin later for prod
app.use(express.json());

/* ---------- Utilities ---------- */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(e) {
  return (e || '').trim().toLowerCase();
}

function assertEnv() {
  const missing = [];
  ['PORT', 'SQL_SERVER', 'SQL_DB', 'SQL_USER', 'SQL_PASSWORD'].forEach((k) => {
    if (!process.env[k]) missing.push(k);
  });
  if (!process.env.JWT_SECRET) {
    console.warn('[WARN] JWT_SECRET is not set. Please set it in .env for production.');
  }
  if (missing.length) {
    console.warn('[WARN] Missing env keys:', missing.join(', '));
  }
}
assertEnv();

/* ---------- Basic routes ---------- */
app.get('/', (_req, res) => res.send('NSB Demo API is running'));
app.get('/health', (_req, res) => res.json({ ok: true }));

/* ---------- Auth: Signup ---------- */
/**
 * Body: { firstName, lastName, email, password }
 * Success: { ok: true }
 * Duplicate: 409 { message: 'Email already registered' }
 */
app.post('/auth/signup', async (req, res) => {
  try {
    let { firstName, lastName, email, password } = req.body || {};

    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    email = normalizeEmail(email);
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const pool = await getPool();

    // Pre-check for duplicate (fast user feedback)
    const dupCheck = await pool.request()
      .input('Email', sql.NVarChar(255), email)
      .query('SELECT 1 AS x FROM dbo.Users WHERE Email = @Email');
    if (dupCheck.recordset.length) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hash = await bcrypt.hash(password, 10);

    // Use your stored procedure (also guards against race-condition duplicates)
    await pool.request()
      .input('FirstName', sql.NVarChar(50), firstName)
      .input('LastName',  sql.NVarChar(50), lastName)
      .input('Email',     sql.NVarChar(255), email)
      .input('PasswordHash', sql.NVarChar(255), hash)
      .execute('dbo.usp_User_Signup');

    return res.json({ ok: true });
  } catch (e) {
    // If SP raised the duplicate email error, map to 409
    const msg =
      (e && e.originalError && e.originalError.info && e.originalError.info.message) ||
      e.message ||
      '';
    if (msg.includes('Email already registered')) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    console.error('[SIGNUP ERROR]', e);
    return res.status(500).json({ message: 'Server error' });
  }
});

/* ---------- Auth: Login ---------- */
/**
 * Body: { email, password }
 * Success: { token, user: { id, firstName, lastName, email } }
 */
app.post('/auth/login', async (req, res) => {
  try {
    let { email, password } = req.body || {};
    email = normalizeEmail(email);

    if (!email || !password) {
      return res.status(400).json({ message: 'Missing email or password' });
    }

    const pool = await getPool();
    const r = await pool.request()
      .input('Email', sql.NVarChar(255), email)
      .query(`
        SELECT UserId, FirstName, LastName, Email, PasswordHash
        FROM dbo.Users
        WHERE Email = @Email
      `);

    if (!r.recordset.length) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const u = r.recordset[0];
    const ok = await bcrypt.compare(password, u.PasswordHash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { sub: u.UserId, email: u.Email },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '8h' }
    );

    return res.json({
      token,
      user: {
        id: u.UserId,
        firstName: u.FirstName,
        lastName: u.LastName,
        email: u.Email,
      },
    });
  } catch (e) {
    console.error('[LOGIN ERROR]', e);
    return res.status(500).json({ message: 'Server error' });
  }
});

/* ---------- Optional: Check Email (for live validation on UI) ---------- */
/** GET /auth/check-email?email=foo@bar.com  -> { exists: true/false } */
app.get('/auth/check-email', async (req, res) => {
  try {
    const email = normalizeEmail(req.query.email);
    if (!email || !EMAIL_RE.test(email)) {
      return res.status(400).json({ message: 'Invalid or missing email' });
    }
    const pool = await getPool();
    const r = await pool.request()
      .input('Email', sql.NVarChar(255), email)
      .query('SELECT 1 AS x FROM dbo.Users WHERE Email = @Email');
    return res.json({ exists: !!r.recordset.length });
  } catch (e) {
    console.error('[CHECK-EMAIL ERROR]', e);
    return res.status(500).json({ message: 'Server error' });
  }
  
});

/* ---------- Dev helper (remove in prod) ---------- */
if (process.env.NODE_ENV !== 'production') {
  app.get('/debug/users', async (_req, res) => {
    try {
      const pool = await getPool();
      const r = await pool.request().query(`
        SELECT TOP 10 UserId, FirstName, LastName, Email, CreatedAt
        FROM dbo.Users
        ORDER BY UserId DESC
      `);
      res.json(r.recordset);
    } catch (e) {
      console.error('[DEBUG USERS ERROR]', e);
      res.status(500).json({ message: 'Server error' });
    }
  });
}

/* ---------- Start server ---------- */
const port = parseInt(process.env.PORT || '3001', 10);
app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
