'use strict';

const fs   = require('fs');
const path = require('path');

const IGNORE_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', '.next', '.nuxt',
  'coverage', '.nyc_output', '.cache', '.vscode', '.idea',
]);

/**
 * Recursively scans a directory and returns a tree string.
 * Ignores common noise folders.
 */
function scanStructure(targetDir) {
  const lines = [];

  function walk(dir, prefix) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    // Dirs first, then files — both sorted alphabetically
    const dirs  = entries.filter((e) => e.isDirectory() && !IGNORE_DIRS.has(e.name)).sort((a, b) => a.name.localeCompare(b.name));
    const files = entries.filter((e) => e.isFile()).sort((a, b) => a.name.localeCompare(b.name));
    const sorted = [...dirs, ...files];

    sorted.forEach((entry, idx) => {
      const isLast      = idx === sorted.length - 1;
      const connector   = isLast ? '└── ' : '├── ';
      const childPrefix = isLast ? prefix + '    ' : prefix + '│   ';

      lines.push(prefix + connector + entry.name + (entry.isDirectory() ? '/' : ''));

      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), childPrefix);
      }
    });
  }

  const rootName = path.basename(targetDir);
  lines.push(rootName + '/');
  walk(targetDir, '');

  return lines.join('\n');
}

module.exports = { scanStructure, IGNORE_DIRS };
