const Paciente = require('../models/Paciente');
const bcrypt = require('bcryptjs');

// Função para registrar um paciente
const registerPaciente = async (req, res) => {
    const { nomeCompleto, dataNascimento, cpf, telefone, endereco, email, senha } = req.body;

    try {
        // Validar se todos os campos estão preenchidos
        if (!nomeCompleto || !dataNascimento || !cpf || !telefone || !endereco || !email || !senha) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
        }

        // Verificar se a data de nascimento é válida
        const dataNascimentoValida = new Date(dataNascimento);
        if (isNaN(dataNascimentoValida.getTime())) {
            return res.status(400).json({ message: 'Data de nascimento inválida. Use o formato YYYY-MM-DD.' });
        }

        // Verificar se já existe um paciente com o mesmo CPF ou email
        const pacienteExistente = await Paciente.findOne({ $or: [{ cpf }, { email }] });
        if (pacienteExistente) {
            return res.status(400).json({ message: 'Paciente já cadastrado com esse CPF ou email.' });
        }

        // Criptografar a senha antes de salvar
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senha, salt);

        // Criar o novo paciente
        const novoPaciente = new Paciente({
            nome: nomeCompleto,
            dataNascimento: dataNascimentoValida, // Salvar a data válida
            cpf,
            telefone,
            endereco,
            email,
            senha: senhaCriptografada, // Salvar a senha criptografada
        });

        // Salvar o paciente no banco de dados
        await novoPaciente.save();

        res.status(201).json({
            message: 'Paciente registrado com sucesso',
            paciente: {
                nome: novoPaciente.nome,
                cpf: novoPaciente.cpf,
                telefone: novoPaciente.telefone,
                endereco: novoPaciente.endereco,
                email: novoPaciente.email,
            },
        });
    } catch (err) {
        console.error('Erro no registro do paciente:', err);
        res.status(500).json({ message: 'Erro ao registrar paciente' });
    }
};

module.exports = {
    registerPaciente,
};
