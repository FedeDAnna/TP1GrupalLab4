import path from "path";
import express from "express";
import bodyParser from "body-parser";
import EmpresaRuta from "./rutas/EmpresaRuta";
import NoticiaRuta from "./rutas/NoticiaRuta";

const app = express();
const PORT = 3000;

// Middleware para servir archivos estáticos desde 'public'
app.use(express.static(path.join(__dirname, "public")));

// Middleware específico para scripts (asegura que los archivos .js tengan el MIME correcto)
app.use(
  "/scripts",
  express.static(path.join(__dirname, "public", "scripts"), {
    setHeaders: (res, path) => {
      if (path.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      }
    },
  })
);

// Middleware para parsear JSON
app.use(bodyParser.json());

// Ruta principal para servir el archivo index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/api", EmpresaRuta);
app.use("/api", NoticiaRuta);


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
