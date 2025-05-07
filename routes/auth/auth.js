const express = require('express');
const { pool, sql , poolConnect } = require('../../database/db');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const bcrypt = require('bcrypt');

//get requests
router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/register', (req, res) => {
  res.render('register')
}
)

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('❌ Logout Error:', err);
      return res.status(500).send('Error logging out');
    }
    res.redirect('/');
    console.log('✅ Logged out');
  }
  );
})

router.get( '/admin-dashboard', (req, res)  => {
    res.render('adminDashboard');
})

// post requests

// ================== LOGIN ==================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password) {
    return res.status(400).send('❌ Email and password are required.');
  }

  try {
    await poolConnect;
    const request = pool.request();
    request.input('email', sql.VarChar(100), email.trim());

    const result = await request.query(`SELECT * FROM users WHERE email = @email`);
    const user = result.recordset[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send('❌ Invalid email or password');
    }

    req.session.user = {
      uuid: user.uuid,
      name: user.name,
      email: user.email,
      role: user.role 
    };

    console.log(`✅ Logged in as: ${user.email}`);
    
    // Redirect to Admin Dashboard if user is an admin
    if (user.role === 'admin') {
      return res.redirect('/admin-dashboard'); 
    }

    // Redirect to the home page for other users
    res.redirect('/home');
  } catch (err) {
    console.error('❌ Login Error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// ================== REGISTER ==================
router.post('/register', async (req, res) => {
  const { name, email, password, phone_number } = req.body;

  if (!name?.trim() || !email?.trim() || !password || !phone_number?.trim()) {
    return res.status(400).send('❌ All fields are required.');
  }

  const userId = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await poolConnect;

    const request = pool.request();
    request.input('uuid', sql.UniqueIdentifier, userId);
    request.input('name', sql.VarChar(100), name.trim());
    request.input('email', sql.VarChar(100), email.trim());
    request.input('password', sql.VarChar(100), hashedPassword);
    request.input('phone_number', sql.VarChar(15), phone_number.trim());
    request.input('role', sql.VarChar(10), 'user'); // 👈 default role

    await request.query(`
      INSERT INTO users (uuid, name, email, password, phone_number, role)
      VALUES (@uuid, @name, @email, @password, @phone_number, @role)
    `);

    // Auto login
    req.session.user = {
      uuid: userId,
      name: name.trim(),
      email: email.trim(),
      role: 'user'
    };

    console.log(`✅ Registered & auto-logged in: ${email}`);
    res.redirect('/');
  } catch (err) {
    if (err.originalError?.info?.number === 2627) {
      return res.status(409).send('⚠️ Email already exists.');
    }
    console.error('❌ Registration Error:', err);
    res.status(500).send('Error registering user.');
  }
});

module.exports = router;