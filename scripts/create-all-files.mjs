#!/usr/bin/env node
/**
 * Writes the full childcare-fee-calculator project to the repository root.
 * Run: node scripts/create-all-files.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** @type {Record<string, string>} */
const files = {
  "package.json": `{
  "name": "childcare-fee-calculator",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "create-files": "node scripts/create-all-files.mjs"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "^15.1.0",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
`,
  "tsconfig.json": `{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
`,
  "next.config.ts": `import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
`,
  "postcss.config.mjs": `/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
`,
  "tailwind.config.ts": `import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#b9dffd",
          300: "#7cc4fb",
          400: "#36a5f6",
          500: "#0c87e8",
          600: "#0069c6",
          700: "#0154a1",
          800: "#064785",
          900: "#0b3c6e",
          950: "#072649",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
`,
  "next-env.d.ts": `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
`,
  "eslint.config.mjs": `import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [...compat.extends("next/core-web-vitals", "next/typescript")];

export default eslintConfig;
`,
  ".gitignore": `# dependencies
/node_modules
/.pnp
.pnp.*

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store

# debug
npm-debug.log*

# env files
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
`,
  "README.md": `# Childcare Fee Calculator

Next.js 15 app for estimating Irish childcare fees, ECCE funding, NCS funding, and parent contributions.

## Quick start

\`\`\`bash
npm install
npm run dev
\`\`\`

Or regenerate all source files:

\`\`\`bash
npm run create-files
\`\`\`

## Auto-setup (Windows)

Double-click \`CREATE-PROJECT.bat\` or run:

\`\`\`powershell
.\\CREATE-PROJECT.ps1
\`\`\`
`,
};

// Import remaining files from sibling module to keep this file maintainable
const { appFiles, componentFiles, libFiles } = await import("./project-sources.mjs");
Object.assign(files, appFiles, componentFiles, libFiles);

async function writeAll() {
  let count = 0;
  for (const [rel, content] of Object.entries(files)) {
    const filePath = join(root, rel);
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, content.replace(/\r?\n/g, "\n"), "utf8");
    count++;
  }
  return count;
}

const count = await writeAll();
console.log(`Created/updated ${count} project files in ${root}`);
