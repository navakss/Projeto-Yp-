const prisma = require("../data/prisma");

const gerarCodigo = () => {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let codigo = "";

    for (let i = 0; i < 8; i++) {
        codigo += caracteres.charAt(
            Math.floor(Math.random() * caracteres.length)
        );
    }

    return codigo;
};

const cadastrar = async (req, res) => {
    const {
        nome,
        categoria
    } = req.body;

    if (
        !nome ||
        !categoria
    ) {
        return res.status(400).json({
            erro: "Todos os campos são obrigatórios"
        });
    }

    let codigoGerado = gerarCodigo();

    while (
        await prisma.produto.findUnique({
            where: {
                codigo: codigoGerado
            }
        })
    ) {
        codigoGerado = gerarCodigo();
    }

    const item = await prisma.produto.create({
        data: {
            codigo: codigoGerado,
            nome,
            categoria
        }
    });

    res.status(201).json(item);
};

const listar = async (req, res) => {
    const lista = await prisma.produto.findMany({
        include: {
            processos: true
        }
    });

    res.status(200).json(lista);
};

const buscar = async (req, res) => {
    const { id } = req.params;

    const item = await prisma.produto.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            processos: true
        }
    });

    res.status(200).json(item);
};

const atualizar = async (req, res) => {
    const { id } = req.params;

    const {
        nome,
        categoria
    } = req.body;

    if (
        !nome ||
        !categoria
    ) {
        return res.status(400).json({
            erro: "Todos os campos são obrigatórios"
        });
    }

    const item = await prisma.produto.update({
        where: {
            id: Number(id)
        },
        data: {
            nome,
            categoria
        }
    });

    res.status(200).json(item);
};

const excluir = async (req, res) => {
    const { id } = req.params;

    const item = await prisma.produto.delete({
        where: {
            id: Number(id)
        }
    });

    res.status(200).json(item);
};

const analisar = async (req, res) => {
    const { id } = req.params;

    const processos = await prisma.processo.findMany({
        where: {
            produtoId: Number(id)
        }
    });

    let status = "Seguro";

    for (const processo of processos) {
        if (
            processo.temperatura > 25 &&
            processo.nivelMicrobiologico > 80
        ) {
            status = "Recolhido";
            break;
        }
    }

    const produtoAtualizado = await prisma.produto.update({
        where: {
            id: Number(id)
        },
        data: {
            status
        }
    });

    res.status(200).json(produtoAtualizado);
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir,
    analisar
};