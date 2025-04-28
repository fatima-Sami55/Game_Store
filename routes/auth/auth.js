const express = require('express');
const router = express.Router();


router.get('/login', (req, res) => {
  res.render("login");
})

router.post('/login', (req, res) => {
  
})

router.get('/register', (req, res) => {
    res.render("register");
})

router.post('/register', (req, res) => {
    const { name, email, phone, password } = req.body;
    console.log('Registering:', name, email, phone, password);

    res.send(`User ${name} registered successfully!`);
})

router.get('/logout', (req, res) => {
  
})

module.exports = router;