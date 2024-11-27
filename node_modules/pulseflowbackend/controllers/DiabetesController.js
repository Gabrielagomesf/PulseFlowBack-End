const Diabetes = require('../models/Diabetes');
const Paciente = require('../models/Paciente');

// Criar um novo registro de diabetes
exports.criar = async (req, res) => {
    const { data, nivelGlicemia, hora, email } = req.body;

    try {
        const pacienteExistente = await Paciente.findOne({ email });
        if (!pacienteExistente) {
            return res.status(404).json({ success: false, message: "Paciente não encontrado." });
        }

        const novoRegistro = new Diabetes({
            data,
            nivelGlicemia,
            hora,
            email,
        });

        await novoRegistro.save();
        res.status(201).json({ success: true, message: "Registro de diabetes criado com sucesso.", data: novoRegistro });
    } catch (error) {
        console.error("Erro ao criar registro de diabetes:", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};

// Buscar registros de diabetes por email
exports.buscarPorEmail = async (req, res) => {
    const { email } = req.params;

    try {
        const registros = await Diabetes.find({ email });
        if (registros.length === 0) {
            return res.status(404).json({ success: false, message: "Nenhum registro de diabetes encontrado para este email." });
        }

        res.status(200).json({ success: true, data: registros });
    } catch (error) {
        console.error("Erro ao buscar registros de diabetes:", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};

