import mysql from "mysql2/promise";

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
<<<<<<< HEAD
  password: "314159",
=======
  password: "41991966",
>>>>>>> feature/agregando-buscador
  database: "tp1_grupal_lab4",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default connection;
