const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Paciente = require("../models/Paciente");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const registroPaciente = async (req, res) => {
    const { cpf, nome, telefone, email, senha } = req.body;

    try {
        // Verificar se o paciente já existe
        const pacienteExistente = await Paciente.findOne({ $or: [{ cpf }, { email }] });
        if (pacienteExistente) {
            return res.status(400).json({ message: "Paciente já cadastrado com esse CPF ou e-mail." });
        }

        // Criptografar a senha
        const hashedPassword = await bcrypt.hash(senha, 10);

        // Criar um novo paciente
        const novoPaciente = new Paciente({
            nome,
            email,
            telefone,
            senha: hashedPassword,
            cpf,
        });

        // Salvar o paciente no banco de dados
        await novoPaciente.save();
        res.status(201).json({ message: "Cadastro realizado com sucesso!" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao registrar paciente." });
        console.error(error);
    }
};

module.exports = { registroPaciente };
  
// Login de pacientes
const loginPaciente = async (req, res) => {
    const { cpf, senha } = req.body;

    try {
        // Procurar paciente pelo CPF
        const paciente = await Paciente.findOne({ cpf });
        if (!paciente) return res.status(404).json({ success: false, message: "CPF não encontrado" });

        // Comparar a senha com a armazenada
        const senhaCorreta = await bcrypt.compare(senha, paciente.senha);
        if (!senhaCorreta) return res.status(401).json({ success: false, message: "Senha incorreta" });

        // Gerar token de autenticação
        const token = jwt.sign({ id: paciente._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ success: true, token });  // Enviar o token no corpo da resposta
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

// Atualizar perfil
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

// Atualizar foto
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

module.exports = { registroPaciente, loginPaciente, perfilPaciente, atualizarPerfil, atualizarFoto };
