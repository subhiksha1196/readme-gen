'use strict';

/**
 * Maps dependency names → human-readable tech stack labels.
 * detectStack accepts one or more package.json objects and merges them.
 */

const STACK_MAP = [
  // Frameworks & runtimes
  { deps: ['express'],               name: 'Express.js',          badge: 'Express' },
  { deps: ['fastify'],               name: 'Fastify',             badge: 'Fastify' },
  { deps: ['koa'],                   name: 'Koa.js',              badge: 'Koa' },
  { deps: ['hapi', '@hapi/hapi'],    name: 'Hapi.js',             badge: 'Hapi' },
  { deps: ['nestjs', '@nestjs/core'],name: 'NestJS',              badge: 'NestJS' },
  { deps: ['react', 'react-dom'],    name: 'React',               badge: 'React' },
  { deps: ['next'],                  name: 'Next.js',             badge: 'Next.js' },
  { deps: ['vue'],                   name: 'Vue.js',              badge: 'Vue' },
  { deps: ['nuxt'],                  name: 'Nuxt.js',             badge: 'Nuxt' },
  { deps: ['svelte'],                name: 'Svelte',              badge: 'Svelte' },
  { deps: ['@angular/core'],         name: 'Angular',             badge: 'Angular' },
  { deps: ['remix'],                 name: 'Remix',               badge: 'Remix' },
  { deps: ['astro'],                 name: 'Astro',               badge: 'Astro' },

  // Databases & ODM/ORM
  { deps: ['mongoose'],              name: 'MongoDB (Mongoose)',   badge: 'MongoDB' },
  { deps: ['mongodb'],               name: 'MongoDB',             badge: 'MongoDB' },
  { deps: ['sequelize'],             name: 'Sequelize (SQL ORM)', badge: 'Sequelize' },
  { deps: ['typeorm'],               name: 'TypeORM',             badge: 'TypeORM' },
  { deps: ['prisma', '@prisma/client'], name: 'Prisma',           badge: 'Prisma' },
  { deps: ['pg'],                    name: 'PostgreSQL (pg)',      badge: 'PostgreSQL' },
  { deps: ['mysql2', 'mysql'],       name: 'MySQL',               badge: 'MySQL' },
  { deps: ['redis', 'ioredis'],      name: 'Redis',               badge: 'Redis' },
  { deps: ['sqlite3', 'better-sqlite3'], name: 'SQLite',          badge: 'SQLite' },

  // Auth & Security
  { deps: ['jsonwebtoken'],          name: 'JWT (jsonwebtoken)',   badge: 'JWT' },
  { deps: ['bcrypt', 'bcryptjs'],    name: 'bcrypt',              badge: 'bcrypt' },
  { deps: ['passport'],              name: 'Passport.js',         badge: 'Passport' },
  { deps: ['express-session'],       name: 'express-session',     badge: 'Sessions' },

  // Utilities
  { deps: ['axios'],                 name: 'Axios',               badge: 'Axios' },
  { deps: ['dotenv'],                name: 'dotenv',              badge: 'dotenv' },
  { deps: ['cors'],                  name: 'CORS middleware',     badge: 'CORS' },
  { deps: ['multer'],                name: 'Multer (file uploads)', badge: 'Multer' },
  { deps: ['socket.io'],             name: 'Socket.IO',           badge: 'Socket.IO' },
  { deps: ['graphql', 'apollo-server'], name: 'GraphQL / Apollo', badge: 'GraphQL' },
  { deps: ['zod'],                   name: 'Zod (validation)',    badge: 'Zod' },
  { deps: ['joi'],                   name: 'Joi (validation)',    badge: 'Joi' },
  { deps: ['stripe'],                name: 'Stripe Payments',     badge: 'Stripe' },
  { deps: ['nodemailer'],            name: 'Nodemailer',          badge: 'Nodemailer' },
  { deps: ['winston', 'pino'],       name: 'Logging (Winston/Pino)', badge: 'Logging' },

  // DevTools
  { deps: ['typescript'],            name: 'TypeScript',          badge: 'TypeScript' },
  { deps: ['jest'],                  name: 'Jest (testing)',       badge: 'Jest' },
  { deps: ['mocha'],                 name: 'Mocha (testing)',      badge: 'Mocha' },
  { deps: ['eslint'],                name: 'ESLint',              badge: 'ESLint' },
  { deps: ['nodemon'],               name: 'Nodemon',             badge: 'Nodemon' },
  { deps: ['webpack'],               name: 'Webpack',             badge: 'Webpack' },
  { deps: ['vite'],                  name: 'Vite',                badge: 'Vite' },
  { deps: ['tailwindcss'],           name: 'Tailwind CSS',        badge: 'Tailwind' },
];

/**
 * Accepts an array of package.json objects (root + any sub-packages).
 * Merges all dependencies before detecting the stack.
 * Also accepts a single pkg object for backwards compatibility.
 */
function detectStack(pkgs) {
  if (!pkgs) return [];

  // Normalise: always work with an array
  const pkgList = Array.isArray(pkgs) ? pkgs : [pkgs];

  // Merge all deps from every package.json found
  const allDeps = {};
  for (const pkg of pkgList) {
    if (!pkg) continue;
    Object.assign(allDeps, pkg.dependencies    || {});
    Object.assign(allDeps, pkg.devDependencies || {});
  }

  const detected = [];
  const seen     = new Set();

  for (const entry of STACK_MAP) {
    const matched = entry.deps.some((dep) => dep in allDeps);
    if (matched && !seen.has(entry.name)) {
      seen.add(entry.name);
      detected.push({ name: entry.name, badge: entry.badge });
    }
  }

  return detected;
}

module.exports = { detectStack };
