# Project file manifest

All application files are created automatically by:

| Command | Description |
|---------|-------------|
| `CREATE-PROJECT.bat` | Windows: generate files + `npm install` |
| `.\CREATE-PROJECT.ps1` | Same as above |
| `npm run create-files` | Regenerate source from `scripts/project-sources.mjs` |

## Files (24)

```
app/
  globals.css
  icon.tsx
  layout.tsx
  page.tsx
components/
  CalculatorApp.tsx
  ChildCard.tsx
  FamilySummaryCard.tsx
  StatRow.tsx
  ui/Field.tsx
lib/
  calculations.ts
  defaults.ts
  format.ts
  types.ts
public/
  .gitkeep
scripts/
  create-all-files.mjs
  create-all-files.ps1
  project-sources.mjs
package.json
tsconfig.json
next.config.ts
postcss.config.mjs
tailwind.config.ts
next-env.d.ts
eslint.config.mjs
.gitignore
README.md
```
