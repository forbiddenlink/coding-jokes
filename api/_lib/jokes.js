const jokes = require('../../js/jokes-data.json');

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function categories(list = jokes) {
    return [...new Set(list.map((j) => j.category))].sort();
}

function pickRandom(list, category, rand = Math.random) {
    const pool = category ? list.filter((j) => j.category === category) : list;
    if (pool.length === 0) return null;
    return pool[Math.floor(rand() * pool.length)];
}

// Same joke for everyone for a whole UTC day.
function pickToday(list, now = new Date()) {
    const day = Math.floor(now.getTime() / MS_PER_DAY);
    return list[day % list.length];
}

function formatJoke(joke) {
    return `${joke.question}\n${joke.answer}\n`;
}

function wantsJson(req) {
    const format = req.query?.format;
    if (format === 'json') return true;
    if (format === 'text') return false;
    const accept = req.headers?.accept || '';
    return accept.includes('application/json');
}

function respond(req, res, joke) {
    if (wantsJson(req)) {
        res.json({
            id: joke.id,
            category: joke.category,
            question: joke.question,
            answer: joke.answer,
        });
        return;
    }
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(200).send(formatJoke(joke));
}

module.exports = { jokes, categories, pickRandom, pickToday, formatJoke, respond };
