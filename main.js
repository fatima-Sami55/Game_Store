  const express = require('express');
  const path = require('path');
  const bodyParser = require('body-parser');
  const session = require('express-session');
  const app = express();
  global.db = require('./database/db');
  require('dotenv').config();
  const helmet = require('helmet'); 
  const cors = require('cors');

  // Set the port
  const PORT = process.env.PORT || 3000;

  // Set the view engine
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  // Middleware
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Session setup
  app.use(session({
    secret: 'supersecretkey123', // change this in production
    resave: false,
    saveUninitialized: false
  }));

  app.use(helmet());
  

  
  // Routes
  app.get('/home', (req, res) => {
    res.render('home', { user: req.session.user || null });
  });

  // // Example route files (you'll modularize later)
  const authRoutes = require('./routes/auth/auth');
  const gameRoutes = require('./routes/game/game');
  const cartRoutes = require('./routes/cart/cart');
  const orderRoutes = require('./routes/order/order.js');
  const paymentRoutes = require('./routes/payment/payment.js');

  const supportRoute = require('./routes/support/support');

  // // Use routes
  app.use('/', authRoutes);
  app.use('/games', gameRoutes);
  app.use('/cart', cartRoutes);
  app.use('/order', orderRoutes);
  app.use('/payment', paymentRoutes);
  app.use('/support', supportRoute);

  app.get('/', (req, res) => {
    res.redirect('/home'); // or directly render the homepage
    // res.render('home', { user: req.session.user || null });
  });
  

  // 404 fallback
  app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
  });
