const Enxaqueca = require('../models/Enxaqueca');
const Paciente = require('../models/Paciente');

// Criar registro de enxaqueca
exports.criar = async (req, res) => {
    const { data, hora, tempoDuracao, intensidadeDor, email } = req.body;

    try {
        const pacienteExistente = await Paciente.findOne({ email });
        if (!pacienteExistente) {
            return res.status(404).json({ success: false, message: "Paciente não encontrado." });
        }

        const novoRegistro = new Enxaqueca({
            data,
            hora,
            tempoDuracao,
            intensidadeDor,
            email,
        });

        await novoRegistro.save();
        res.status(201).json({ success: true, message: "Registro de enxaqueca criado com sucesso.", data: novoRegistro });
    } catch (error) {
        console.error("Erro ao criar registro de enxaqueca:", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};

// Buscar registros de enxaqueca por email
exports.buscarPorEmail = async (req, res) => {
    const { email } = req.params;

    try {
        const registros = await Enxaqueca.find({ email });
        if (registros.length === 0) {
            return res.status(404).json({ success: false, message: "Nenhum registro de enxaqueca encontrado para este email." });
        }

        res.status(200).json({ success: true, data: registros });
    } catch (error) {
        console.error("Erro ao buscar registros de enxaqueca:", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};

