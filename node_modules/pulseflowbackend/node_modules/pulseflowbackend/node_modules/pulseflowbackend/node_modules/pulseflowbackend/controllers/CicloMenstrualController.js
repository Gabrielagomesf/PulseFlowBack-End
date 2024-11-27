const CicloMenstrual = require('../models/CicloMenstrual');
const Paciente = require('../models/Paciente');

// Criar Ciclo Menstrual
exports.criar = async (req, res) => {
    const { dataInicial, dataFinal, email } = req.body;

    try {
        const pacienteExistente = await Paciente.findOne({ email });

        if (!pacienteExistente) {
            return res.status(404).json({ success: false, message: "Paciente não encontrado." });
        }

        const novoCiclo = new CicloMenstrual({
            dataInicial,
            dataFinal,
            email,
        });

        await novoCiclo.save();
        res.status(201).json({ success: true, message: "Ciclo menstrual criado com sucesso.", data: novoCiclo });
    } catch (error) {
        console.error("Erro ao criar ciclo menstrual:", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};

// Buscar Ciclos Menstruais por Email
exports.buscarPorEmail = async (req, res) => {
    const { email } = req.params;

    try {
        const ciclosMenstruais = await CicloMenstrual.find({ email });
        if (ciclosMenstruais.length === 0) {
            return res.status(404).json({ success: false, message: "Nenhum ciclo menstrual encontrado para este email." });
        }

        res.status(200).json({ success: true, data: ciclosMenstruais });
    } catch (error) {
        console.error("Erro ao buscar ciclos menstruais:", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};


