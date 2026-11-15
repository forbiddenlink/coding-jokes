const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

test('punchline control exposes its expanded state and current action', () => {
    const context = { window: {}, document: { addEventListener() {} } };
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../js/jokes.js'), 'utf8'), context);
    const manager = context.window.jokesManager;
    manager.announceToScreenReader = () => {};
    manager.trackMetric = () => {};
    const classes = new Set();
    const attrs = {};
    const icon = {};
    const label = {};
    const button = {
        setAttribute(name, value) { attrs[name] = value; },
        querySelector(selector) { return selector === 'i' ? icon : label; }
    };
    const punchline = {
        setAttribute() {},
        classList: {
            toggle(name) { if (classes.has(name)) { classes.delete(name); return false; } classes.add(name); return true; },
            add(...names) { names.forEach(name => classes.add(name)); },
            remove(...names) { names.forEach(name => classes.delete(name)); }
        }
    };
    const joke = {
        dataset: { id: '1', category: 'general' },
        querySelector(selector) { return selector === '.punchline' ? punchline : button; }
    };
    manager.togglePunchline(joke);
    assert.equal(attrs['aria-expanded'], 'true');
    assert.equal(attrs['aria-label'], 'Hide punchline');
    assert.equal(label.textContent, 'Hide');
    manager.togglePunchline(joke);
    assert.equal(attrs['aria-expanded'], 'false');
    assert.equal(attrs['aria-label'], 'Reveal punchline');
    assert.equal(label.textContent, 'Reveal');
});
