const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const failures = [];

const read = (relativePath) => fs.readFileSync(path.join(rootDir, relativePath), 'utf8');

const themeSource = read('js/theme.js');
if (themeSource.includes('console.log(')) {
    failures.push('Remove debug console.log statements from js/theme.js');
}

const statsSource = read('js/stats.js');
if (/condition:\s*\(\)\s*=>/.test(statsSource)) {
    failures.push('Achievement conditions in js/stats.js should use method syntax, not arrow functions.');
}

const jokesSource = read('js/jokes.js');
const bootstrapBlock = jokesSource.match(
    /document\.addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*\{[\s\S]*?\}\);/
);
if (!bootstrapBlock) {
    failures.push('Missing DOMContentLoaded bootstrap block in js/jokes.js');
} else if (/searchManager\.init\(\)|filterManager\.init\(\)|theme\.init\(\)/.test(bootstrapBlock[0])) {
    failures.push('Bootstrap block in js/jokes.js should only initialize jokesManager.');
}

if (failures.length > 0) {
    console.error('Lint checks failed:');
    for (const failure of failures) {
        console.error(`- ${failure}`);
    }
    process.exit(1);
}

console.log('Lint checks passed.');
