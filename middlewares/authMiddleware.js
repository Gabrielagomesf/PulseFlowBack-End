const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ success: false, message: "Acesso negado, token não encontrado." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.medicoId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Token inválido ou expirado." });
    }
};

module.exports = { verifyToken };
