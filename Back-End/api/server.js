require('dotenv').config();
const express = require('express');
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const processoRoutes = require('./src/routes/processo.routes');

app.use('/processo', processoRoutes);


const produtoRoutes = require('./src/routes/produto.routes');

app.use('/produto', produtoRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
