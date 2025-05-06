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

// post requests
  res.render("login");
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!name || !password) {
    return res.status(400).send('⚠️ Please enter both username and password.');
  }

  try {
    await poolConnect;

    const request = pool.request();
    request.input('email', sql.VarChar(100), email);

    const result = await request.query(`
      SELECT * FROM users WHERE email = @email
    `);

    const user = result.recordset[0];
    if (!user) {
      return res.status(401).send('❌ Invalid useremail');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send('❌ Invalid email or password');
      return res.status(401).send('❌ Invalid password');
    }

    req.session.user = {
      uuid: user.uuid,
      username: user.username,
      email: user.email,
    };

    console.log(`✅ Logged in: ${user.email}`);
    res.redirect('/');
    console.log(`✅ Logged in: ${user.name}`);
    res.redirect('/home');
  } catch (err) {
    console.error('❌ Login Error:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('❌ Logout Error:', err);
      return res.status(500).send('Error logging out');
    }
    res.redirect('/home');
    console.log('✅ Logged out');
    
  }
  );
})

router.post('/register', async(req, res) => {
  const { name, email, password, phone_number } = req.body;
  const userid = uuidv4();
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
    console.error('❌ Registration Error:', err);
    res.status(500).send('Error registering user');
  }
}
)
router.get('/register', (req, res) => {
    res.render("register");
})

router.post('/register', async (req, res) => {
    const { name, email, phone_number, password } = req.body;
    const userId = uuidv4(); 
    const hashedPassword = await bcrypt.hash(password, 10);

  
    try {
      await poolConnect;
  
      const request = pool.request();
      request.input('uuid', sql.UniqueIdentifier, userId);
      request.input('name', sql.VarChar(100), name);
      request.input('email', sql.VarChar(100), email);
      request.input('password', sql.VarChar(100), hashedPassword);
      request.input('phone_number', sql.VarChar(100), phone_number);
  
      await request.query(`
        INSERT INTO users (uuid, name, email, password, phone_number)
        VALUES (@uuid, @name, @email, @password, @phone_number)
      `); 
  
      console.log(`✅ Registered: ${name}`);
      //res.send(`User ${name} registered successfully!`);
      res.redirect('/home')
    } catch (err) {
      console.error('❌ Registration Error:', err);
      res.status(500).send('Error registering user');
    }
});  

module.exports = router;