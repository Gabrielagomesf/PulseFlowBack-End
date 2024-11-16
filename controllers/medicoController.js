const Medico = require("../models/Medico");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;  // Para upload de imagens (caso você queira usar o Cloudinary)

// Configuração do Cloudinary (certifique-se de definir as credenciais no .env)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Função para registro de médico
exports.register = async (req, res) => {
    const { 
        nomeCompleto, 
        cpf, 
        telefonePessoal, 
        email, 
        senha, 
        crm, 
        areaAtuacao, 
        enderecoConsultorio1, 
        enderecoConsultorio2, 
        telefoneConsultorio 
    } = req.body;

    try {
        // Verificar se já existe um médico com o CPF
        const medicoExistente = await Medico.findOne({ cpf });
        if (medicoExistente) {
            return res.status(400).json({ success: false, message: "CPF já registrado." });
        }

        // Criptografando a senha
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        // Criando novo médico
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

        // Salvando no banco de dados
        await novoMedico.save();
        res.status(201).json({ success: true, message: "Cadastro realizado com sucesso." });
    } catch (error) {
        console.error("Erro ao registrar médico:", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};

// Função para login do médico
exports.login = async (req, res) => {
    const { cpf, senha } = req.body;

    try {
        // Verificando se o médico existe pelo CPF
        const medico = await Medico.findOne({ cpf });
        if (!medico) {
            return res.status(400).json({ success: false, message: "CPF não encontrado." });
        }

        // Comparando a senha fornecida com a criptografada
        const senhaValida = await bcrypt.compare(senha, medico.senha);
        if (!senhaValida) {
            return res.status(400).json({ success: false, message: "Senha incorreta." });
        }

        // Gerando token JWT
        const token = jwt.sign({ id: medico._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ success: true, token });
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};

// Função para obter o perfil do médico
exports.perfil = async (req, res) => {
    const medicoId = req.medicoId;  // O ID do médico vem do middleware de verificação de token

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

// Função para atualizar o perfil do médico
exports.atualizarPerfil = async (req, res) => {
    const medicoId = req.medicoId;  // O ID do médico vem do middleware de verificação de token
    const { nomeCompleto, telefonePessoal, email, crm, areaAtuacao, enderecoConsultorio1, enderecoConsultorio2, telefoneConsultorio } = req.body;

    try {
        const medico = await Medico.findById(medicoId);
        if (!medico) {
            return res.status(404).json({ success: false, message: "Médico não encontrado." });
        }

        // Atualizando os dados do médico
        medico.nomeCompleto = nomeCompleto || medico.nomeCompleto;
        medico.telefonePessoal = telefonePessoal || medico.telefonePessoal;
        medico.email = email || medico.email;
        medico.crm = crm || medico.crm;
        medico.areaAtuacao = areaAtuacao || medico.areaAtuacao;
        medico.enderecoConsultorio1 = enderecoConsultorio1 || medico.enderecoConsultorio1;
        medico.enderecoConsultorio2 = enderecoConsultorio2 || medico.enderecoConsultorio2;
        medico.telefoneConsultorio = telefoneConsultorio || medico.telefoneConsultorio;

        // Salvando as alterações no banco de dados
        await medico.save();
        res.status(200).json({ success: true, message: "Perfil atualizado com sucesso." });
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};

// Função para atualizar a foto de perfil
exports.atualizarFoto = async (req, res) => {
    const medicoId = req.medicoId;  // O ID do médico vem do middleware de verificação de token

    try {
        const medico = await Medico.findById(medicoId);
        if (!medico) {
            return res.status(404).json({ success: false, message: "Médico não encontrado." });
        }

        // Verifica se a imagem foi enviada
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Nenhuma imagem foi enviada." });
        }

        // Fazendo o upload da imagem para o Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "fotos_perfil_medicos",
            transformation: [
                { width: 200, height: 200, crop: "fill" },
            ]
        });

        // Atualizando a URL da foto no banco de dados
        medico.fotoUrl = result.secure_url;
        await medico.save();

        res.status(200).json({ success: true, message: "Foto de perfil atualizada com sucesso.", fotoUrl: result.secure_url });
    } catch (error) {
        console.error("Erro ao atualizar foto:", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};
