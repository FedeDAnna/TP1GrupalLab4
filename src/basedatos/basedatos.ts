import mysql from "mysql2/promise";

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "tp1_grupal_lab4",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default connection;
