const express = require('express');
const router = express.Router();
const { pool, sql, poolConnect } = require('../../database/db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');


router.get('/login', (req, res) => {
  res.render("login");
})

router.post('/login', (req, res) => {
  
})

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
      res.send(`User ${name} registered successfully!`);
    } catch (err) {
      console.error('❌ Registration Error:', err);
      res.status(500).send('Error registering user');
    }
  });  

router.get('/logout', (req, res) => {
  
})

module.exports = router;