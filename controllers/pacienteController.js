const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Paciente = require("../models/Paciente");
const cloudinary = require("cloudinary").v2;
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Função para enviar email
const enviarEmail = async (destinatario, assunto, mensagem) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: destinatario,
        subject: assunto,
        html: mensagem,
    });
};

// Solicitar redefinição de senha
const solicitarRedefinicaoSenha = async (req, res) => {
    const { email } = req.body;

    try {
        const paciente = await Paciente.findOne({ email });
        if (!paciente) return res.status(404).json({ success: false, message: "Paciente não encontrado." });

        const token = crypto.randomBytes(32).toString("hex");
        const expiraEm = Date.now() + 3600000; // 1 hora de expiração

        paciente.resetToken = token;
        paciente.tokenExpiracao = expiraEm;
        await paciente.save();

        const link = `${process.env.CLIENT_URL}/Paciente/redefinirsenhapaciente.html?token=${token}`;

        const mensagem = `
            <h3>Redefinição de Senha</h3>
            <p>Olá ${paciente.nome},</p>
            <p>Você solicitou a redefinição de sua senha. Clique no link abaixo para prosseguir:</p>
            <a href="${link}" target="_blank">Redefinir Senha</a>
            <p>Este link expira em 1 hora.</p>
        `;
        await enviarEmail(email, "Redefinição de Senha - PulseFlow", mensagem);

        res.status(200).json({ success: true, message: "Link de redefinição enviado ao e-mail." });
    } catch (error) {
        console.error("Erro ao solicitar redefinição de senha:", error);
        res.status(500).json({ success: false, message: "Erro ao solicitar redefinição de senha." });
    }
};

// Redefinir senha
const redefinirSenha = async (req, res) => {
    const { token, novaSenha } = req.body;

    try {
        console.log("Token recebido no backend:", token);
        console.log("Nova senha recebida no backend:", novaSenha);

        const paciente = await Paciente.findOne({
            resetToken: token,
            tokenExpiracao: { $gt: Date.now() }, // Verifica se o token não expirou
        });

        if (!paciente) {
            console.error("Token inválido ou expirado.");
            return res.status(400).json({ success: false, message: "Token inválido ou expirado." });
        }

        // Atualiza a senha e remove o token
        const novaSenhaCriptografada = await bcrypt.hash(novaSenha, 10);
        paciente.senha = novaSenhaCriptografada;
        paciente.resetToken = undefined;
        paciente.tokenExpiracao = undefined;

        await paciente.save();
        console.log("Senha redefinida com sucesso no banco:", paciente.senha);

        res.status(200).json({ success: true, message: "Senha redefinida com sucesso." });
    } catch (error) {
        console.error("Erro ao redefinir senha:", error);
        res.status(500).json({ success: false, message: "Erro ao redefinir senha." });
    }
};


// Registrar paciente
const registroPaciente = async (req, res) => {
    const { cpf, nome, telefone, email, senha } = req.body;

    try {
        const pacienteExistente = await Paciente.findOne({ $or: [{ cpf }, { email }] });
        if (pacienteExistente) {
            return res.status(400).json({ message: "Paciente já cadastrado com esse CPF ou e-mail." });
        }

        const hashedPassword = await bcrypt.hash(senha, 10);

        const novoPaciente = new Paciente({
            nome,
            email,
            telefone,
            senha: hashedPassword,
            cpf,
        });

        await novoPaciente.save();
        res.status(201).json({ message: "Cadastro realizado com sucesso!" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao registrar paciente." });
    }
};

// Login do paciente
const loginPaciente = async (req, res) => {
    const { cpf, senha } = req.body;

    try {
        const paciente = await Paciente.findOne({ cpf });
        if (!paciente) return res.status(404).json({ success: false, message: "CPF não encontrado" });

        const senhaCorreta = await bcrypt.compare(senha, paciente.senha);
        if (!senhaCorreta) return res.status(401).json({ success: false, message: "Senha incorreta" });

        const token = jwt.sign({ id: paciente._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ success: true, token, email: paciente.email, nome: paciente.nome });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao fazer login" });
    }
};

// Perfil do paciente
const perfilPaciente = async (req, res) => {
    try {
        const paciente = await Paciente.findById(req.userId);
        if (!paciente) return res.status(404).json({ success: false, message: "Paciente não encontrado" });

        res.status(200).json({
            success: true,
            paciente: {
                nome: paciente.nome,
                email: paciente.email,
                telefone: paciente.telefone,
                cpf: paciente.cpf,
                fotoUrl: paciente.fotoUrl || null,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao carregar perfil" });
    }
};

// Atualizar perfil do paciente
const atualizarPerfil = async (req, res) => {
    try {
        const paciente = await Paciente.findByIdAndUpdate(
            req.userId,
            { ...req.body },
            { new: true, runValidators: true }
        );

        if (!paciente) {
            return res.status(404).json({ success: false, message: "Paciente não encontrado." });
        }

        res.json({ success: true, paciente });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao atualizar perfil." });
    }
};

// Atualizar foto do paciente
const atualizarFoto = async (req, res) => {
    try {
        const paciente = await Paciente.findById(req.userId);
        if (!paciente) return res.status(404).json({ success: false, message: "Paciente não encontrado" });

        const file = req.files.foto.tempFilePath;
        const uploadResponse = await cloudinary.uploader.upload(file, { folder: "PulseFlow" });

        paciente.fotoUrl = uploadResponse.secure_url;
        await paciente.save();

        res.status(200).json({ success: true, fotoUrl: paciente.fotoUrl });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao atualizar foto" });
    }
};

module.exports = {
    registroPaciente,
    loginPaciente,
    perfilPaciente,
    atualizarPerfil,
    atualizarFoto,
    solicitarRedefinicaoSenha,
    redefinirSenha,
};
