require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");  // Importando o pacote cors
const medicoRoutes = require("./routes/medicoRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Imprimir a URL do MongoDB no console
console.log(`MongoDB URL: ${process.env.MONGO_URI}`);

// Configuração do CORS (permite requisições de qualquer origem)
app.use(cors());  // Permite que qualquer origem acesse a API

// Caso você queira permitir apenas o seu front-end (exemplo: localhost:5500)
// app.use(cors({
//     origin: 'http://127.0.0.1:5500'  // Substitua com o URL do seu front-end
// }));

app.use(express.json());
app.use("/api", medicoRoutes);

mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Conectado ao MongoDB");
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Erro ao conectar ao MongoDB:", err);
    });
