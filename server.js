const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const port = 3000;

app.get("/currency/:from/:to", async (req, res) => {
    const { from, to } = req.params;

    try {
        const url = `https://finance.yahoo.com/quote/${from}${to}=X`;
        const { data } = await axios.get(url);

        const $ = cheerio.load(data);
        const price = $('div[data-test="qsp-price"] span').first().text();

        if (price) {
            res.json({
                from,
                to,
                price,
                message: "Cotação obtida com sucesso!"
            });
        } else {
            res.status(404).json({
                error: "Não foi possível encontrar a cotação. Verifique o código da moeda."
            });
        }
    } catch (error) {
        res.status(500).json({
            error: "Erro ao obter os dados. Tente novamente mais tarde."
        });
    }
});

app.listen(port, () => {
    console.log(`API de cotação rodando na http://localhost:${port}`);
});
