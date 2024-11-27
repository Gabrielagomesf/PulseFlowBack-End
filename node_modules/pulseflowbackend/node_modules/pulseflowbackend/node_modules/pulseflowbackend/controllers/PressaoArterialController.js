const PressaoArterial = require('../models/PressaoArterial');
const Paciente = require('../models/Paciente');

// Criar registro de pressão arterial
exports.criar = async (req, res) => {
    const { data, pressao, email } = req.body;

    try {
        const pacienteExistente = await Paciente.findOne({ email });
        if (!pacienteExistente) {
            return res.status(404).json({ success: false, message: "Paciente não encontrado." });
        }

        const novaPressao = new PressaoArterial({
            data,
            pressao,
            email,
        });

        await novaPressao.save();
        res.status(201).json({ success: true, message: "Registro de pressão arterial criado com sucesso.", data: novaPressao });
    } catch (error) {
        console.error("Erro ao criar registro de pressão arterial:", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};

// Buscar registros de pressão arterial por email
exports.buscarPorEmail = async (req, res) => {
    const { email } = req.params;

    try {
        const registros = await PressaoArterial.find({ email });
        if (registros.length === 0) {
            return res.status(404).json({ success: false, message: "Nenhum registro de pressão arterial encontrado para este email." });
        }

        res.status(200).json({ success: true, data: registros });
    } catch (error) {
        console.error("Erro ao buscar registros de pressão arterial:", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};
