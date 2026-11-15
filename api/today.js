const { jokes, pickToday, respond } = require('./_lib/jokes.js');

// GET /api/today?format=json
// One joke per UTC day, the same for everyone.
module.exports = function handler(req, res) {
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    respond(req, res, pickToday(jokes));
};
