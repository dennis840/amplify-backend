require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

console.log('Intentando conectar con:');
console.log('Host:', process.env.DB_HOST);
console.log('Port:', process.env.DB_PORT);
console.log('User:', process.env.DB_USER);
console.log('Password:', process.env.DB_PASSWORD);
console.log('Database:', process.env.DB_NAME);
console.log('---');

client.connect()
  .then(() => {
    console.log('✅ CONEXIÓN EXITOSA');
    return client.query('SELECT NOW()');
  })
  .then(result => {
    console.log('Timestamp:', result.rows[0].now);
    client.end();
  })
  .catch(err => {
    console.error('❌ ERROR COMPLETO:');
    console.error(err);
    client.end();
  });