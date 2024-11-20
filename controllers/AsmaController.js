const Asma = require('../models/Asma');
const Paciente = require('../models/Paciente');

// Criar um novo registro de asma
exports.criar = async (req, res) => {
    const { dataCrise, horaCrise, tempoDuracaoCrise, intensidadeCrise, horarioMedicao, email } = req.body;

    try {
        const pacienteExistente = await Paciente.findOne({ email });
        if (!pacienteExistente) {
            return res.status(404).json({ success: false, message: "Paciente não encontrado." });
        }

        const novoRegistro = new Asma({
            dataCrise,
            horaCrise,
            tempoDuracaoCrise,
            intensidadeCrise,
            horarioMedicao,
            email,
        });

        await novoRegistro.save();
        res.status(201).json({ success: true, message: "Registro de crise de asma criado com sucesso.", data: novoRegistro });
    } catch (error) {
        console.error("Erro ao criar registro de asma:", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};

// Buscar registros de asma por email
exports.buscarPorEmail = async (req, res) => {
    const { email } = req.params;

    try {
        const registros = await Asma.find({ email });
        if (registros.length === 0) {
            return res.status(404).json({ success: false, message: "Nenhum registro de asma encontrado para este email." });
        }

        res.status(200).json({ success: true, data: registros });
    } catch (error) {
        console.error("Erro ao buscar registros de asma:", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};


