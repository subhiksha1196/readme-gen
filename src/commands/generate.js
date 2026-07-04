'use strict';

const { Generator, c } = require('../generator');

function generate({ targetDir, overwrite, output, mono }) {
  const gen = new Generator({ targetDir, overwrite, output, mono });

  gen.on('scanning', (msg) => {
    console.log(c.cyan('  →') + ' ' + msg);
  });

  gen.on('detecting', (msg) => {
    console.log(c.cyan('  →') + ' ' + msg);
  });

  gen.on('generating', (msg) => {
    console.log(c.cyan('  →') + ' ' + msg);
  });

  gen.on('warn', (msg) => {
    console.warn(c.yellow('  ⚠  ' + msg));
  });

  gen.on('error', (msg) => {
    console.error(c.red('\n  ✖  Error: ' + msg + '\n'));
    process.exit(1);
  });

  gen.on('done', (filePath) => {
    console.log(c.green('\n  ✔  README generated: ') + c.bold(filePath) + '\n');
  });

  const modeLabel = mono ? c.cyan('mono') : c.dim('standard');
  console.log(c.bold('\n  readme-gen') + c.dim(' — auto README generator') + '  [' + modeLabel + ' mode]');
  console.log(c.dim('  ─────────────────────────────────'));

  gen.run();
}

module.exports = { generate };
