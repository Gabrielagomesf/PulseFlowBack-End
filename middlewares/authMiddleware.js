const jwt = require("jsonwebtoken");
const Medico = require("../models/Medico");
const Paciente = require("../models/Paciente");

// Middleware para autenticar médicos ou pacientes
const verifyToken = async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Acesso negado. Token não encontrado.",
        });
    }

    try {
        // Decodificar o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verificar se é médico ou paciente com base no modelo
        const medico = await Medico.findById(decoded.id);
        const paciente = await Paciente.findById(decoded.id);

        if (medico) {
            req.userId = medico._id;
            req.userRole = "medico";
        } else if (paciente) {
            req.userId = paciente._id;
            req.userRole = "paciente";
        } else {
            return res.status(401).json({
                success: false,
                message: "Usuário não encontrado. Token inválido.",
            });
        }

        // Proseguir para o próximo middleware/rota
        next();
    } catch (error) {
        const message =
            error.name === "TokenExpiredError"
                ? "O token expirou. Faça login novamente."
                : "Token inválido.";
        res.status(401).json({ success: false, message });
    }
};

// Middleware para permitir acesso apenas a médicos
const authorizeMedico = (req, res, next) => {
    if (req.userRole !== "medico") {
        return res.status(403).json({
            success: false,
            message: "Acesso negado. Apenas médicos podem acessar esta rota.",
        });
    }
    next();
};

// Middleware para permitir acesso apenas a pacientes
const authorizePaciente = (req, res, next) => {
    if (req.userRole !== "paciente") {
        return res.status(403).json({
            success: false,
            message: "Acesso negado. Apenas pacientes podem acessar esta rota.",
        });
    }
    next();
};

module.exports = { verifyToken, authorizeMedico, authorizePaciente };
