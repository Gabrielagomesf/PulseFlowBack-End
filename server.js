require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const medicoRoutes = require("./routes/medicoRoutes");
const pacienteRoutes = require('./routes/pacienteRoutes'); // Verifique o caminho correto aqui

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use("/api/pacientes", pacienteRoutes);  // Rota do paciente definida aqui
app.use("/api", medicoRoutes);

// Conexão com MongoDB e inicialização do servidor
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Conectado ao MongoDB");
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Erro ao conectar ao MongoDB:", err);
    });

