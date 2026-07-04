'use strict';

const EventEmitter = require('events');
const path = require('path');
const fs   = require('fs');

const { readPackageJson } = require('./utils/readPackageJson');
const { scanStructure }   = require('./utils/scanStructure');
const { detectStack }     = require('./utils/detectStack');
const { formatReadme }    = require('./utils/formatReadme');

// ANSI color helpers
const c = {
  green:  (s) => `\x1b[32m${s}\x1b[0m`,
  red:    (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan:   (s) => `\x1b[36m${s}\x1b[0m`,
  bold:   (s) => `\x1b[1m${s}\x1b[0m`,
  dim:    (s) => `\x1b[2m${s}\x1b[0m`,
};

/**
 * Finds all package.json files one level deep (direct sub-folders only).
 * Skips node_modules, .git, dist, build.
 * Returns an array of parsed pkg objects (nulls filtered out).
 */
function findSubPackages(targetDir) {
  const IGNORE = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.nuxt', 'coverage']);
  const results = [];

  let entries;
  try {
    entries = fs.readdirSync(targetDir, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    if (!entry.isDirectory() || IGNORE.has(entry.name)) continue;

    const pkgPath = path.join(targetDir, entry.name, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        results.push({ pkg: parsed, dir: entry.name });
      } catch {
        // skip unparseable sub-package
      }
    }
  }

  return results;
}

class Generator extends EventEmitter {
  constructor(options = {}) {
    super();
    this.targetDir = options.targetDir || process.cwd();
    this.overwrite  = options.overwrite  || false;
    this.output     = options.output     || 'README.md';
    this.mono       = options.mono       || false;
  }

  async run() {
    const outputPath = path.resolve(this.targetDir, this.output);

    // --- Guard: README already exists ---
    if (fs.existsSync(outputPath) && !this.overwrite) {
      this.emit('error', `README already exists at ${this.output}. Use --overwrite to replace it.`);
      return;
    }

    // --- Guard: ensure output directory exists ---
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      try {
        fs.mkdirSync(outputDir, { recursive: true });
      } catch (err) {
        this.emit('error', `Could not create output directory: ${outputDir}\n${err.message}`);
        return;
      }
    }

    // 1. Read root package.json
    this.emit('scanning', 'Reading package.json…');
    const rootPkg = readPackageJson(this.targetDir);
    if (!rootPkg) {
      this.emit('warn', 'No package.json found. Some sections will be skipped.');
    }

    // 2. Scan folder structure
    this.emit('scanning', 'Scanning project structure…');
    const structure = scanStructure(this.targetDir);

    // 3. Read .env.example
    this.emit('scanning', 'Checking for .env.example…');
    const envExamplePath = path.join(this.targetDir, '.env.example');
    let envVars = [];
    if (fs.existsSync(envExamplePath)) {
      const raw = fs.readFileSync(envExamplePath, 'utf8');
      envVars = raw
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith('#'));
    }

    // 4. Collect all package.json files for stack detection
    let allPkgs = [rootPkg];

    if (this.mono) {
      this.emit('scanning', 'Scanning sub-packages (mono mode)…');
      const subPkgs = findSubPackages(this.targetDir);

      if (subPkgs.length > 0) {
        const names = subPkgs.map((s) => s.dir).join(', ');
        this.emit('scanning', `Found sub-packages: ${names}`);
        allPkgs = [rootPkg, ...subPkgs.map((s) => s.pkg)];
      } else {
        this.emit('warn', 'No sub-package.json files found. Running in standard mode.');
      }
    }

    // 5. Detect stack (merged across all packages)
    this.emit('detecting', 'Detecting tech stack…');
    const stack = detectStack(allPkgs);

    // 6. Format README
    this.emit('generating', 'Generating README.md…');
    const content = formatReadme({ pkg: rootPkg, structure, envVars, stack, outputFile: this.output });

    // 7. Write output
    try {
      fs.writeFileSync(outputPath, content, 'utf8');
    } catch (err) {
      this.emit('error', `Failed to write file: ${err.message}`);
      return;
    }

    this.emit('done', outputPath);
  }
}

module.exports = { Generator, c };
