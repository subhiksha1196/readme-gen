#!/usr/bin/env node

'use strict';

const minimist = require('minimist');
const { generate } = require('./src/commands/generate');

const args = minimist(process.argv.slice(2), {
  boolean: ['overwrite', 'mono', 'help'],
  string: ['output'],
  alias: {
    o: 'output',
    m: 'mono',
    h: 'help',
  },
  default: {
    overwrite: false,
    mono: false,
    output: 'README.md',
  },
});

if (args.help) {
  console.log(`
\x1b[36mreadme-gen\x1b[0m — Auto-generate README.md for any project

\x1b[1mUsage:\x1b[0m
  readme-gen                          Generate README.md in current folder
  readme-gen --overwrite              Overwrite existing README.md
  readme-gen --output docs/README.md  Write to a custom output path
  readme-gen --mono                   Scan sub-folders for package.json (monorepos)

\x1b[1mOptions:\x1b[0m
  --overwrite, -w   Overwrite if README already exists
  --output,    -o   Custom output file path
  --mono,      -m   Merge deps from sub-package.json files (client/, server/, etc.)
  --help,      -h   Show this help message

\x1b[1mExamples:\x1b[0m
  readme-gen --mono                        Fullstack / monorepo project
  readme-gen --mono --overwrite            Re-generate for a monorepo
  readme-gen --mono -o docs/README.md      Custom path + monorepo
`);
  process.exit(0);
}

generate({
  targetDir: process.cwd(),
  overwrite: args.overwrite,
  output: args.output,
  mono: args.mono,
});
