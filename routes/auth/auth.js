const express = require('express');
const { pool, sql , poolConnect } = require('../../database/db');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const bcrypt = require('bcrypt');
const { isAuthenticated, isAdmin, redirectIfAuthenticated } = require('../../middleware/authChecks');

//get requests
router.get('/login',redirectIfAuthenticated, (req, res) => {
  res.render('login')
})

router.get('/register',redirectIfAuthenticated, (req, res) => {
  res.render('register')
}
)

router.get('/logout', isAuthenticated, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('❌ Logout Error:', err);
      return res.status(500).send('Error logging out');
    }
    res.redirect('/');  // Redirect after logout
    console.log('✅ Logged out');
  });
});


router.get( '/admin-dashboard', isAuthenticated, isAdmin, (req, res)  => {
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

router.get('/admin-user', isAuthenticated, isAdmin, async (req, res) => {
    try {
        await poolConnect; // Ensures DB connection is ready

        const result = await pool.request().query(`
            SELECT uuid, name, email, role, phone_number
            FROM Users
        `);

        const users = result.recordset; // This will contain your users

        res.render('admin-user', {
            users,
            user: req.session.user
        });

    } catch (err) {
        console.error('❌ Error fetching users:', err);
        res.status(500).send('Internal Server Error');
    }
});


// post requests

// ================== LOGIN ==================
router.post('/login',redirectIfAuthenticated, async (req, res) => {
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

// ================== REGISTER ==================
router.post('/register',redirectIfAuthenticated, async (req, res) => {
  const { name, email, password, phone_number } = req.body;

  if (!name?.trim() || !email?.trim() || !password || !phone_number?.trim()) {
    return res.status(400).send('❌ All fields are required.');
  }

  const userId = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);
  try{
    await poolConnect;
    const request = pool.request();
    request.input('uuid', sql.UniqueIdentifier, userId)
    request.input('name', sql.VarChar(100), name);
    request.input('email', sql.VarChar(100), email);
    request.input('password', sql.VarChar(100), hashedPassword);
    request.input('phone_number', sql.VarChar(15), phone_number.trim());
    request.input('role', sql.VarChar(20), 'user'); // 👈 default role

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