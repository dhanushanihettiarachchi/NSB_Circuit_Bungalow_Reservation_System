require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql, getPool } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => res.send('NSB Demo API is running'));


// Health
app.get('/health', (req, res) => res.json({ ok: true }));

// SIGN UP  (hash password, then call your stored proc)
app.post('/auth/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password)
      return res.status(400).json({ message: 'Missing fields' });

    const hash = await bcrypt.hash(password, 10);
    const pool = await getPool();
    await pool.request()
      .input('FirstName', sql.NVarChar(50), firstName)
      .input('LastName',  sql.NVarChar(50), lastName)
      .input('Email',     sql.NVarChar(255), email)
      .input('PasswordHash', sql.NVarChar(255), hash)
      .execute('dbo.usp_User_Signup');

    return res.json({ ok: true });
  } catch (e) {
    // When your proc RAISERROR('Email already registered', 16, 1)
    // mssql surfaces it as an error; handle it nicely:
    const msg = (e && e.originalError && e.originalError.info && e.originalError.info.message) || e.message;
    if (msg && msg.includes('Email already registered')) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

// LOGIN (simple example)
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const pool = await getPool();
    const r = await pool.request()
      .input('Email', sql.NVarChar(255), email)
      .query(`
        SELECT UserId, FirstName, LastName, Email, PasswordHash
        FROM dbo.Users
        WHERE Email = @Email
      `);
    if (!r.recordset.length) return res.status(401).json({ message: 'Invalid credentials' });

    const u = r.recordset[0];
    const ok = await bcrypt.compare(password, u.PasswordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ sub: u.UserId, email: u.Email }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: u.UserId, firstName: u.FirstName, lastName: u.LastName, email: u.Email } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(process.env.PORT, () =>
  console.log(`API running at http://localhost:${process.env.PORT}`)
);
