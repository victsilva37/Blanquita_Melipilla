const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_PUBLIC_URL, // Railway te da esta variable lista
  ssl: {
    rejectUnauthorized: false, // Necesario para conexiones externas seguras
  },

});

module.exports = pool;

// const { Pool } = require("pg");
// require("dotenv").config();

// const pool = new Pool({
//   user: process.env.DB_USER, // Cambia "postgres" al usuario de tu base de datos
//   host: process.env.DB_HOST, // Usa localhost para la base de datos local
//   database: process.env.DB_NAME, // Cambia "tu_base_de_datos" al nombre de tu BD
//   password: process.env.DB_PASSWORD, // Cambia "tu_password" por tu contraseña
//   port: process.env.DB_PORT, // Puerto predeterminado de PostgreSQL
// });

// module.exports = pool;


  