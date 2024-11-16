require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const medicoRoutes = require("./routes/medicoRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Logando a URL do MongoDB
console.log(`MongoDB URL: ${process.env.MONGO_URI}`);

// Configuração de middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use("/api", medicoRoutes);

// Conexão ao MongoDB e inicialização do servidor
mongoose
    .connect(process.env.MONGO_URI) // Removendo os parâmetros desnecessários
    .then(() => {
        console.log("Conectado ao MongoDB");
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Erro ao conectar ao MongoDB:", err);
    });
