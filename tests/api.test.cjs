const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const data = require('../js/jokes-data.json');
const { pickRandom, pickToday, formatJoke } = require('../api/_lib/jokes.js');
const randomHandler = require('../api/random.js');
const todayHandler = require('../api/today.js');

function call(handler, { query = {}, headers = {} } = {}) {
    const res = {
        statusCode: 200,
        headers: {},
        body: undefined,
        setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
        status(code) { this.statusCode = code; return this; },
        send(b) { this.body = b; return this; },
        json(b) { this.headers['content-type'] = 'application/json; charset=utf-8'; this.body = JSON.stringify(b); return this; },
    };
    handler({ query, headers }, res);
    return res;
}

test('joke data is one JSON file shared by the UI and the API', () => {
    assert.ok(data.length > 300);
    const ids = new Set(data.map((j) => j.id));
    assert.equal(ids.size, data.length, 'ids are unique');
    for (const j of data) {
        assert.equal(typeof j.question, 'string');
        assert.equal(typeof j.answer, 'string');
        assert.equal(typeof j.category, 'string');
    }
    const ui = fs.readFileSync(path.join(rootDir, 'js/jokes.js'), 'utf8');
    assert.match(ui, /from '\.\/jokes-data\.json'/);
    assert.doesNotMatch(ui, /question: "Why did the JavaScript developer feel sad\?"/);
});

test('pickToday is stable within a UTC day and changes across days', () => {
    const a = pickToday(data, new Date('2026-11-15T01:00:00Z'));
    const b = pickToday(data, new Date('2026-11-15T23:59:00Z'));
    const c = pickToday(data, new Date('2026-11-16T00:01:00Z'));
    assert.equal(a.id, b.id);
    assert.notEqual(a.id, c.id);
});

test('pickRandom filters by category and returns null for unknown ones', () => {
    for (let i = 0; i < 20; i++) assert.equal(pickRandom(data, 'python').category, 'python');
    assert.equal(pickRandom(data, 'cobol-2000'), null);
});

test('formatJoke text output is plain and has the punchline', () => {
    const text = formatJoke({ question: 'Q?', answer: 'A!', category: 'python' });
    assert.equal(text, 'Q?\nA!\n');
});

test('/api/random returns plain text by default and json on request', () => {
    const text = call(randomHandler, { query: { lang: 'python' } });
    assert.equal(text.statusCode, 200);
    assert.match(text.headers['content-type'], /^text\/plain/);
    assert.ok(text.body.trim().includes('\n'));

    const viaQuery = call(randomHandler, { query: { lang: 'python', format: 'json' } });
    assert.equal(JSON.parse(viaQuery.body).category, 'python');

    const viaAccept = call(randomHandler, { headers: { accept: 'application/json' } });
    assert.ok(JSON.parse(viaAccept.body).question);
});

test('/api/random: unknown lang is a 404 that lists valid categories', () => {
    const res = call(randomHandler, { query: { lang: 'nope' } });
    assert.equal(res.statusCode, 404);
    assert.match(res.body, /python/);
});

test('/api/random is never cached, /api/today is cached for the day', () => {
    assert.match(call(randomHandler).headers['cache-control'], /no-store/);
    assert.match(call(todayHandler).headers['cache-control'], /s-maxage=/);
});

test('/api/today returns the same joke as pickToday', () => {
    const res = call(todayHandler, { query: { format: 'json' } });
    assert.equal(JSON.parse(res.body).id, pickToday(data, new Date()).id);
});
