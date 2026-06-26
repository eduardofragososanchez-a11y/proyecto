const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de conexión a Supabase/PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Ruta para mostrar registros
app.get("/tinacos", async (req, res) => {
    const result = await pool.query("SELECT * FROM tinacos ORDER BY idllenado ASC");
    res.json(result.rows);
});

// Ruta para insertar registro
app.post("/tinacos", async (req, res) => {
    const { fecha, tiempo, tinaco, capacidad } = req.body;
    const result = await pool.query(
        "INSERT INTO tinacos (fecha, tiempo, tinaco, capacidad) VALUES ($1,$2,$3,$4) RETURNING *",
        [fecha, tiempo, tinaco, capacidad]
    );
    res.json(result.rows[0]);
});

// Ruta para borrar registro
app.delete("/tinacos/:id", async (req, res) => {
    const { id } = req.params;
    await pool.query("DELETE FROM tinacos WHERE idllenado=$1", [id]);
    res.json({ message: "Registro eliminado" });
});

// Iniciar servidor
app.listen(3000, () => console.log("Servidor corriendo en puerto 3000"));
