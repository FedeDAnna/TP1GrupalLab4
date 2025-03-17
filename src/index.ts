import mysql from "mysql2/promise";

const coneccion = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "314159",
  database: "tp1_grupal_lab4",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default coneccion;