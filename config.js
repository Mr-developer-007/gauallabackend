import mysql from "mysql2/promise";
const pool = mysql.createPool({
    host:"localhost",
      user: process.env.user,       
  password: process.env.password,
  database: process.env.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export default pool;
