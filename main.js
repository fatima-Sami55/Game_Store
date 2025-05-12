  const express = require('express');
  const path = require('path');
  const bodyParser = require('body-parser');
  const session = require('express-session');
  const app = express();
  global.db = require('./database/db');
  require('dotenv').config();
  const helmet = require('helmet'); 
  const cors = require('cors');
  const multer = require('multer');

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

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // make sure this folder exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file
    }
});

  const upload = multer({ storage: storage });
  module.exports = { upload };

  app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

  // Routes
app.get('/home', (req, res) => {
const games = [
  {
    title: 'GTA 6',
    genre: 'Action / Adventure',
    price: '$59.99',
    image: '/images/gta6.png',
    description: 'Dive into a sprawling, chaotic open-world adventure across Vice City with high-speed chases, criminal empires, and next-gen storytelling.'
  },
  {
    title: 'Starforge Chronicles',
    genre: 'RPG / Sci-Fi',
    price: '$49.99',
    image: '/images/Starforge.png',
    description: 'Forge alliances, battle alien civilizations, and uncover ancient secrets in this epic intergalactic RPG saga.'
  },
  {
    title: 'BattleForge: Arena',
    genre: 'Multiplayer / Strategy',
    price: '$39.99',
    image: '/images/BattleForge.png',
    description: 'Command your army in real-time battles and outwit global opponents in this high-stakes multiplayer strategy arena.'
  },
  {
    title: 'Doom: The Dark Ages',
    genre: 'First-person Shooter',
    price: '$59.99',
    image: '/images/Doom.png',
    description: 'Rip and tear through demonic hordes in a medieval hellscape with brutal weapons and relentless combat.'
  },
  {
    title: 'Elden Ring: Nightreign',
    genre: 'Action RPG / Roguelike',
    price: '$69.99',
    image: '/images/Elden.png',
    description: 'Enter a haunting new realm of Elden Ring, where each death teaches you, and every victory reshapes fate.'
  },
  {
    title: 'Ghost of Yōtei',
    genre: 'Action-Adventure',
    price: '$69.99',
    image: '/images/Ghost.png',
    description: 'Become a lone samurai in feudal Japan and uncover hidden truths beneath the snowy peaks of Mount Yōtei.'
  },
  {
    title: 'Monster Hunter Wilds',
    genre: 'Action / RPG',
    price: '$59.99',
    image: '/images/Monster.png',
    description: 'Track, hunt, and battle colossal beasts in wild, untamed lands with immersive environments and dynamic ecosystems.'
  },
  {
    title: 'Borderlands 4',
    genre: 'First-person Shooter / RPG',
    price: '$59.99',
    image: '/images/Borderlands.png',
    description: 'Return to Pandora with new Vault Hunters, outrageous loot, and explosive mayhem in this wild FPS-RPG hybrid.'
  },
  {
    title: 'Mafia: The Old Country',
    genre: 'Action-Adventure',
    price: '$59.99',
    image: '/images/Mafia.png',
    description: 'Step into the shoes of a rising mobster in 1920s Italy, where loyalty is power and betrayal is fatal.'
  },
  {
    title: 'Assassin’s Creed Shadows',
    genre: 'Action / Adventure',
    price: '$69.99',
    image: '/images/Assassin’s.png',
    description: 'Sneak through the shadows of feudal Japan as a shinobi assassin, uncovering a hidden war of empires and fate.'
  }
];

  res.render('home', { user: req.session.user || null, games });
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
