const Hormonal = require('../models/Hormonal');
const Paciente = require('../models/Paciente');

// Criar registro hormonal
exports.criar = async (req, res) => {
    const { data, hormonio, dosagem, email } = req.body;

    try {
        const pacienteExistente = await Paciente.findOne({ email });
        if (!pacienteExistente) {
            return res.status(404).json({ success: false, message: "Paciente não encontrado." });
        }

        const novoRegistro = new Hormonal({
            data,
            hormonio,
            dosagem,
            email,
        });

        await novoRegistro.save();
        res.status(201).json({ success: true, message: "Registro hormonal criado com sucesso.", data: novoRegistro });
    } catch (error) {
        console.error("Erro ao criar registro hormonal:", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};

// Buscar registros hormonais por email
exports.buscarPorEmail = async (req, res) => {
    const { email } = req.params;

    try {
        const registros = await Hormonal.find({ email });
        if (registros.length === 0) {
            return res.status(404).json({ success: false, message: "Nenhum registro hormonal encontrado para este email." });
        }

        res.status(200).json({ success: true, data: registros });
    } catch (error) {
        console.error("Erro ao buscar registros hormonais:", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};
