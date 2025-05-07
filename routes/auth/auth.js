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
  const user = req.user || { name: 'Admin' };
  const now = new Date();
  const currentDate = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
  });
  const currentTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
  });

  const stats = {
      totalUsers: 1250,
      activeSessions: 35,
      newRegistrations: 10,
      totalRevenue: 12450
  };

  const activities = [
      {
          type: "user-plus",
          title: "New User Registration",
          message: "John Doe registered a new account",
          time: "10 minutes ago"
      },
      {
          type: "shopping-cart",
          title: "New Purchase",
          message: "Sarah Smith purchased Premium Plan",
          time: "45 minutes ago"
      },
      {
          type: "exclamation-triangle",
          title: "System Alert",
          message: "Server load reached 85%",
          time: "2 hours ago"
      }
  ];

  res.render('adminDashboard', {
      user,
      stats,
      activities,
      currentDate,
      currentTime
  });
})

// post requests
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
    if (!user) {
      return res.status(401).send('❌ Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send('❌ Invalid email or password');
    }

    req.session.user = {
      uuid: user.uuid,
      name: user.name,
      email: user.email,
      role: user.role 
    };

    console.log(`✅ Logged in: ${user.email}`);
    res.redirect('/');
  } catch (err) {
    console.error('❌ Login Error:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/register', async(req, res) => {
  const { name, email, password, phone_number } = req.body;

  if (!name?.trim() || !email?.trim() || !password || !phone_number?.trim()) {
    return res.status(400).send('❌ All fields are required.');
  }

  const userId = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);
  try{
    await poolConnect;
    const request = pool.request();
    request.input('uuid', sql.UniqueIdentifier, userid)
    request.input('name', sql.VarChar(100), name);
    request.input('email', sql.VarChar(100), email);
    request.input('password', sql.VarChar(100), hashedPassword);
    request.input('phone_number', sql.VarChar(15), phone_number);

    await request.query(`
      INSERT INTO users (uuid, name, email, password, phone_number)
      VALUES (@uuid, @name, @email, @password, @phone_number)
    `);

    console.log(`Registered: ${name}, successfully`);
    res.redirect('/');
  } catch (err) {
    if (err.originalError?.info?.number === 2627) {
      return res.status(409).send('⚠️ Email already exists.');
    }
    console.error('❌ Registration Error:', err);
    res.status(500).send('Error registering user.');
  }
}
)

module.exports = router;