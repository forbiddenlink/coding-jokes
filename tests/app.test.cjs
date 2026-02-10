const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(rootDir, relativePath), 'utf8');

test('jokes rendering escapes user-controlled fields', () => {
    const jokesSource = read('js/jokes.js');
    assert.match(jokesSource, /escapeHtml\(value\)/);
    assert.match(jokesSource, /const safeQuestion = this\.escapeHtml\(joke\.question\)/);
    assert.match(jokesSource, /const safeAnswer = this\.escapeHtml\(joke\.answer\)/);
    assert.match(jokesSource, /const safeCategory = this\.escapeHtml\(joke\.category\)/);
});

test('punchline aria-controls target exists', () => {
    const jokesSource = read('js/jokes.js');
    assert.match(jokesSource, /id="joke-\$\{safeId\}-punchline"/);
    assert.match(jokesSource, /aria-controls="joke-\$\{safeId\}-punchline"/);
});

test('stats conditions use method syntax (no lexical this bug)', () => {
    const statsSource = read('js/stats.js');
    assert.doesNotMatch(statsSource, /condition:\s*\(\)\s*=>/);
    assert.match(statsSource, /condition\(\)\s*\{/);
});

test('jokes bootstrap does not reinitialize other managers', () => {
    const jokesSource = read('js/jokes.js');
    const bootstrapBlock = jokesSource.match(
        /document\.addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*\{[\s\S]*?\}\);/
    );
    assert.ok(bootstrapBlock, 'bootstrap block not found');
    assert.doesNotMatch(bootstrapBlock[0], /searchManager\.init\(\)/);
    assert.doesNotMatch(bootstrapBlock[0], /filterManager\.init\(\)/);
    assert.doesNotMatch(bootstrapBlock[0], /theme\.init\(\)/);
});

test('user jokes persistence uses versioned schema key', () => {
    const jokesSource = read('js/jokes.js');
    assert.match(jokesSource, /userJokesStorageKey:\s*'codingJokes\.userJokes\.v1'/);
    assert.match(jokesSource, /version:\s*1/);
    assert.match(jokesSource, /saveUserJokes\(\)/);
    assert.match(jokesSource, /mergeUserJokes\(\)/);
});
