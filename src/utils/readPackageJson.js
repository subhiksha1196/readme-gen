'use strict';

const fs   = require('fs');
const path = require('path');

/**
 * Reads and parses package.json from the target directory.
 * Returns null if the file is absent or unparseable.
 */
function readPackageJson(targetDir) {
  const pkgPath = path.join(targetDir, 'package.json');

  if (!fs.existsSync(pkgPath)) {
    return null;
  }

  try {
    const raw = fs.readFileSync(pkgPath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

module.exports = { readPackageJson };
