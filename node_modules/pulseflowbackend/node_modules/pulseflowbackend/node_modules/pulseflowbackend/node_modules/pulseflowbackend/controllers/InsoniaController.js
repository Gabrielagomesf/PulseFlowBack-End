const Insonia = require('../models/Insonia');
const Paciente = require('../models/Paciente');

// Criar registro de insônia
exports.criar = async (req, res) => {
    const { data, horaDormir, horaAcordar, quantQueAcordou, qualidadeSono, email } = req.body;

    console.log("Body recebido no criar:", req.body); // Adiciona log para depuração

    try {
        const pacienteExistente = await Paciente.findOne({ email });
        if (!pacienteExistente) {
            return res.status(404).json({ success: false, message: "Paciente não encontrado." });
        }

        const novaInsonia = new Insonia({
            data,
            horaDormir,
            horaAcordar,
            quantQueAcordou,
            qualidadeSono,
            email,
        });

        await novaInsonia.save();
        res.status(201).json({ success: true, message: "Registro de insônia criado com sucesso.", data: novaInsonia });
    } catch (error) {
        console.error("Erro ao criar registro de insônia:", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};


// Buscar registros de insônia por email
exports.buscarPorEmail = async (req, res) => {
    const { email } = req.params;

    console.log("Email recebido no buscarPorEmail:", email); // Adiciona log para depuração

    try {
        const registros = await Insonia.find({ email });
        if (registros.length === 0) {
            return res.status(404).json({ success: false, message: "Nenhum registro de insônia encontrado para este email." });
        }

        res.status(200).json({ success: true, data: registros });
    } catch (error) {
        console.error("Erro ao buscar registros de insônia:", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};

