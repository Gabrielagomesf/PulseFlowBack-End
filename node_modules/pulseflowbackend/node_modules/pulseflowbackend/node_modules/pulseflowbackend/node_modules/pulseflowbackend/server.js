require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Rotas
const medicoRoutes = require("./routes/medicoRoutes");
const pacienteRoutes = require("./routes/pacienteRoutes");
const asmaRoutes = require("./routes/AsmaRoutes");
const diabetesRoutes = require("./routes/diabetesRoutes");
const cicloMenstrualRoutes = require("./routes/cicloMenstrualRoutes");
const hormonalRoutes = require("./routes/hormonalRoutes");
const enxaquecaRoutes = require("./routes/enxaquecaRoutes");
const insoniaRoutes = require("./routes/insoniaRoutes");
const pressaoRoutes = require("./routes/pressaoArterialRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta "Médico"
app.use('/Médico', express.static(path.join(__dirname, 'Médico')));

// Rotas
app.use("/api/pacientes", pacienteRoutes);
app.use("/api", medicoRoutes);
app.use("/api/asma", asmaRoutes);
app.use("/api/diabetes", diabetesRoutes);
app.use("/api/ciclo-menstrual", cicloMenstrualRoutes);
app.use("/api/hormonal", hormonalRoutes);
app.use("/api/enxaqueca", enxaquecaRoutes);
app.use("/api/insonia", insoniaRoutes);
app.use("/api/pressaoArterial", pressaoRoutes);

// Conexão com MongoDB e inicialização do servidor
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Conectado ao MongoDB");
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Erro ao conectar ao MongoDB:", err);
    });
