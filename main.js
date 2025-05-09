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

  // Configure Helmet with CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://cdnjs.cloudflare.com"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://cdnjs.cloudflare.com" // 👈 Add this too for fonts if needed
      ],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  }
}));

  const corsOptions = {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  };
  
  app.use(cors(corsOptions));

  // Routes
  app.get('/home', (req, res) => {
    res.render('home', { user: req.session.user || null });
  });

  // // Example route files (you'll modularize later)
  const authRoutes = require('./routes/auth/auth');
  const gameRoutes = require('./routes/game/game');
  const cartRoutes = require('./routes/cart/cart');
  const supportRoute = require('./routes/support/support');

  // // Use routes
  app.use('/', authRoutes);
  app.use('/games', gameRoutes);
  app.use('/cart', cartRoutes);
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
