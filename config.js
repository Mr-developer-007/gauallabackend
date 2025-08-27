import mysql from "mysql2/promise";
import dotenv from "dotenv"
dotenv.config()


const pool = mysql.createPool({
    host:"localhost",
      user: process.env.USER,       
  // password: "",
  password: process.env.password,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0, 
})

export default pool;
