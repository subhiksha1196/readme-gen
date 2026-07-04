# Readme Gen

A zero-config CLI that auto-generates a complete `README.md` for any Node.js project by scanning its `package.json`, folder structure, and environment variables.

---

## What It Does

- Reads `package.json` to detect project name, description, version, scripts, dependencies, and devDependencies
- Scans the folder structure and renders it as a directory tree (ignores `node_modules`, `.git`, `dist`, `build`, etc.)
- Detects environment variable keys from `.env.example`
- Auto-detects tech stack from dependencies (Express, MongoDB, JWT, bcrypt, React, Prisma, Vite, TypeScript, and 30+ more)
- Supports monorepos by merging dependencies from sub-package.json files (`client/`, `server/`, etc.)
- Writes a clean, structured README.md — no manual formatting needed

---

## Tech Stack

- Node.js (built-ins only: `fs`, `path`, `events`, `process`)
- [minimist](https://github.com/minimistjs/minimist) — CLI argument parsing
- EventEmitter — generator pipeline events

---

## Installation

```bash
git clone https://github.com/subhiksha1196/readme-gen.git
cd readme-gen
npm install

# Link globally so `readme-gen` is available anywhere
npm link
```

---

## Usage

```bash
readme-gen                          # Generate README.md in current folder
readme-gen --overwrite              # Overwrite existing README.md
readme-gen --output docs/README.md  # Write to a custom output path
readme-gen --mono                   # Scan sub-folders for package.json (monorepos)
readme-gen --help                   # Show help message
```

### Options

| Flag | Alias | Description |
|------|-------|--------------|
| `--overwrite` | `-w` | Overwrite if README already exists |
| `--output`    | `-o` | Custom output file path |
| `--mono`      | `-m` | Merge deps from sub-package.json files |
| `--help`      | `-h` | Show help message |

### Examples

```bash
readme-gen --mono                    # Fullstack / monorepo project
readme-gen --mono --overwrite        # Re-generate for a monorepo
readme-gen --mono -o docs/README.md  # Custom path + monorepo
```

---

## What It Reads

| Source | Data Extracted |
|--------|-----------------|
| `package.json` | Name, description, version, scripts, dependencies, devDependencies |
| `.env.example` | All environment variable keys and example values |
| Folder tree | Full recursive structure |
| Dependencies | Auto-detected tech stack (frameworks, databases, tooling) |

---

## Terminal Output

Color-coded with ANSI codes — no external color packages:

- Cyan — scanning / detecting / generating steps
- Green — success message with output path
- Yellow — warnings (e.g. missing package.json)
- Red — errors (e.g. README exists without `--overwrite`)

---

## Edge Cases Handled

- No `package.json` found → warns and continues (structure + env vars still generated)
- README already exists → exits with error unless `--overwrite` is passed
- Empty folder → generates a minimal README with empty structure
- Output directory doesn't exist → created automatically (e.g. `docs/`)

---

## Project Structure

```
readme-cli/
├── src/
│   ├── commands/
│   │   └── generate.js        # Wires CLI args → Generator, handles events
│   ├── utils/
│   │   ├── readPackageJson.js # Reads and parses package.json
│   │   ├── scanStructure.js   # Recursive folder tree builder
│   │   ├── detectStack.js     # Dependency → tech stack mapper
│   │   └── formatReadme.js    # Assembles the final markdown string
│   └── generator.js           # EventEmitter class orchestrating the pipeline
├── index.js                   # CLI entry point (reads minimist args)
└── package.json
```

---

## Dependencies

| Package | Version |
|---------|---------|
| `minimist` | ^1.2.8 |

---

## Author

**Subhiksha**
[GitHub](https://github.com/subhiksha1196)
