const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Sivo los arch estaticos 
app.use(express.static(path.join(__dirname, "../frontend")));

// ruta q me devuleve el html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// capturo los geners
app.get("/generos", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM generos");
    res.json(rows);
  } catch (error) {
    console.error("Error en /generos:", error);
    res.status(500).json({ error: "Error interno en /generos" });
  }
});

// tengo las bandas por genero
app.get("/bandas", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM bandas WHERE genero_id = (SELECT id FROM generos WHERE nombre = ?)",
      [req.query.genero]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error en /bandas:", error);
    res.status(500).json({ error: "Error interno en /bandas" });
  }
});

// Oobtengo los vinilos x banda nom
app.get("/vinilos", async (req, res) => {
  try {
    let query = `
      SELECT vinilos.*, bandas.nombre AS banda
      FROM vinilos
      JOIN bandas ON vinilos.banda_id = bandas.id
    `;
    let params = [];

    if (req.query.banda) {
      query += " WHERE bandas.nombre = ?";
      params.push(req.query.banda);
    } else if (req.query.search) {
      query += " WHERE vinilos.nombre LIKE ?";
      params.push(`%${req.query.search}%`);
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error("Error en /vinilos:", error);
    res.status(500).json({ error: "Error interno en /vinilos" });
  }
});

app.listen(3000, () => console.log(" Servidor corriendo en http://localhost:3000"));
