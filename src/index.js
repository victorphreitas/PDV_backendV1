const express = require('express');
require('dotenv').config();

const app  = express();

app.use(express.json());

app.get('/', (req, res) => {
     return res.json('Testando')
});

app.listen(3000)