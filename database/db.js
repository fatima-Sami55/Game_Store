require('dotenv').config();
const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};


// Create and export a connection pool
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect((err) => {
    if (err) throw err;
    console.log('✅ Database Connected')
  });

pool.on('error', err => {
  console.error('❌ SQL error:', err);
});

module.exports = {
  sql, pool, poolConnect
};
