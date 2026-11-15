const { jokes, categories, pickRandom, respond } = require('./_lib/jokes.js');

// GET /api/random?lang=python&format=json
// Plain text by default so `curl` output is readable; JSON with ?format=json or Accept: application/json.
module.exports = function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    const lang = req.query?.lang;
    const joke = pickRandom(jokes, lang);
    if (!joke) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.status(404).send(`No jokes for "${lang}". Try one of: ${categories().join(', ')}\n`);
        return;
    }
    respond(req, res, joke);
};
