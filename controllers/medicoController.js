const Medico = require("../models/Medico");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const nodemailer = require("nodemailer");

// Configuração do Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Enviar link de redefinição de senha
exports.enviarLinkRedefinicao = async (req, res) => {
    const { email } = req.body;

    try {
        const medico = await Medico.findOne({ email });
        if (!medico) {
            return res.status(404).json({ success: false, message: "E-mail não encontrado." });
        }

        const token = jwt.sign({ id: medico._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const link = `${process.env.CLIENT_URL}/Médico/redefinirsenhamedico.html?token=${token}`;
        console.log("Link gerado:", link);


        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Redefinição de Senha - Sistema Médico",
            html: `
                <p>Olá,</p>
                <p>Você solicitou a redefinição de sua senha. Clique no link abaixo para redefinir sua senha:</p>
                <a href="${link}">${link}</a>
                <p>Este link é válido por 1 hora.</p>
            `,
        });

        res.status(200).json({ success: true, message: "Link de redefinição enviado para o e-mail." });
    } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
        res.status(500).json({ success: false, message: "Erro ao enviar o e-mail." });
    }
};

// Redefinir senha
exports.redefinirSenha = async (req, res) => {
    const { senha, token } = req.body; // O token agora vem do corpo da requisição

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const medico = await Medico.findById(decoded.id);

        if (!medico) {
            return res.status(404).json({ success: false, message: "Usuário não encontrado." });
        }

        medico.senha = await bcrypt.hash(senha, 10);
        await medico.save();

        res.status(200).json({ success: true, message: "Senha redefinida com sucesso." });
    } catch (error) {
        console.error("Erro ao redefinir senha:", error);
        if (error.name === "TokenExpiredError") {
            return res.status(400).json({ success: false, message: "Link expirado. Solicite um novo." });
        }
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};

// Registro do médico
exports.register = async (req, res) => {
    const { nomeCompleto, cpf, telefonePessoal, email, senha, crm, areaAtuacao, enderecoConsultorio1, enderecoConsultorio2, telefoneConsultorio } = req.body;

    try {
        const medicoExistente = await Medico.findOne({ $or: [{ cpf }, { email }] });
        if (medicoExistente) {
            return res.status(400).json({ success: false, message: "CPF ou e-mail já registrado." });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const novoMedico = new Medico({
            nomeCompleto,
            cpf,
            telefonePessoal,
            email,
            senha: senhaCriptografada,
            crm,
            areaAtuacao,
            enderecoConsultorio1,
            enderecoConsultorio2,
            telefoneConsultorio,
        });

        await novoMedico.save();
        res.status(201).json({ success: true, message: "Cadastro realizado com sucesso." });
    } catch (error) {
        console.error("Erro ao registrar médico:", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};

// Login do médico
exports.login = async (req, res) => {
    const { cpf, senha } = req.body;

    try {
        const medico = await Medico.findOne({ cpf });
        if (!medico) {
            return res.status(400).json({ success: false, message: "CPF não encontrado." });
        }

        const senhaValida = await bcrypt.compare(senha, medico.senha);
        if (!senhaValida) {
            return res.status(400).json({ success: false, message: "Senha incorreta." });
        }

        const token = jwt.sign({ id: medico._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ success: true, token });
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};

// Obter perfil do médico
exports.perfil = async (req, res) => {
    const medicoId = req.userId;

    try {
        const medico = await Medico.findById(medicoId);
        if (!medico) {
            return res.status(404).json({ success: false, message: "Médico não encontrado." });
        }

        res.status(200).json({ success: true, medico });
    } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};

// Atualizar perfil do médico
exports.atualizarPerfil = async (req, res) => {
    const medicoId = req.userId;
    const { nomeCompleto, telefonePessoal, email, crm, areaAtuacao, enderecoConsultorio1, enderecoConsultorio2, telefoneConsultorio } = req.body;

    try {
        const medico = await Medico.findById(medicoId);
        if (!medico) {
            return res.status(404).json({ success: false, message: "Médico não encontrado." });
        }

        medico.nomeCompleto = nomeCompleto || medico.nomeCompleto;
        medico.telefonePessoal = telefonePessoal || medico.telefonePessoal;
        medico.email = email || medico.email;
        medico.crm = crm || medico.crm;
        medico.areaAtuacao = areaAtuacao || medico.areaAtuacao;
        medico.enderecoConsultorio1 = enderecoConsultorio1 || medico.enderecoConsultorio1;
        medico.enderecoConsultorio2 = enderecoConsultorio2 || medico.enderecoConsultorio2;
        medico.telefoneConsultorio = telefoneConsultorio || medico.telefoneConsultorio;

        await medico.save();
        res.status(200).json({ success: true, message: "Perfil atualizado com sucesso." });
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};

// Atualizar foto de perfil
exports.atualizarFoto = async (req, res) => {
    const medicoId = req.userId;

    try {
        const medico = await Medico.findById(medicoId);
        if (!medico) {
            return res.status(404).json({ success: false, message: "Médico não encontrado." });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Nenhuma imagem foi enviada." });
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "fotos_perfil_medicos",
            transformation: [{ width: 200, height: 200, crop: "fill" }]
        });

        medico.fotoUrl = result.secure_url;
        await medico.save();

        res.status(200).json({ success: true, message: "Foto de perfil atualizada com sucesso.", fotoUrl: result.secure_url });
    } catch (error) {
        console.error("Erro ao atualizar foto:", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};
