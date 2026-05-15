const prisma = require("../data/prisma");

const cadastrar = async (req, res) => {
    const {
        temperatura,
        nivelMicrobiologico,
        produtoId
    } = req.body;

    if (
        temperatura == null ||
        nivelMicrobiologico == null ||
        !produtoId
    ) {
        return res.status(400).json({
            erro: "Todos os campos são obrigatórios"
        });
    }

    if (
        nivelMicrobiologico < 0 ||
        nivelMicrobiologico > 100
    ) {
        return res.status(400).json({
            erro: "O nível microbiológico deve estar entre 0 e 100%"
        });
    }

    const item = await prisma.processo.create({
        data: {
            temperatura,
            nivelMicrobiologico,
            produtoId
        }
    });

    res.status(201).json(item);
};

const listar = async (req, res) => {
    const lista = await prisma.processo.findMany({
        include: {
            produto: true
        }
    });

    res.status(200).json(lista);
};

const buscar = async (req, res) => {
    const { id } = req.params;

    const item = await prisma.processo.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            produto: true
        }
    });

    res.status(200).json(item);
};

const atualizar = async (req, res) => {
    const { id } = req.params;

    const {
        temperatura,
        nivelMicrobiologico,
        produtoId
    } = req.body;

    if (
        temperatura == null ||
        nivelMicrobiologico == null ||
        !produtoId
    ) {
        return res.status(400).json({
            erro: "Todos os campos são obrigatórios"
        });
    }

    if (
        nivelMicrobiologico < 0 ||
        nivelMicrobiologico > 100
    ) {
        return res.status(400).json({
            erro: "O nível microbiológico deve estar entre 0 e 100%"
        });
    }

    const item = await prisma.processo.update({
        where: {
            id: Number(id)
        },
        data: {
            temperatura,
            nivelMicrobiologico,
            produtoId
        }
    });

    res.status(200).json(item);
};

const excluir = async (req, res) => {
    const { id } = req.params;

    const item = await prisma.processo.delete({
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