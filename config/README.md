# ⚙️ Configuration Files

This folder contains all project configuration files for build tools, linting, and styling.

## 📁 Files

### Build & TypeScript
- **`vite.config.ts`** - Vite bundler configuration
- **`tsconfig.app.json`** - TypeScript config for app source code
- **`tsconfig.node.json`** - TypeScript config for Node.js tools

### Styling
- **`tailwind.config.js`** - Tailwind CSS utility classes configuration
- **`postcss.config.js`** - PostCSS plugins and processing

### Linting
- **`eslint.config.js`** - ESLint code quality rules

## 🔧 How It Works

All these configs are referenced from the root directory but stored here for organization:

- `package.json` scripts point to these configs
- Root `postcss.config.js` is a proxy that references the actual config here
- `tsconfig.json` in root references the TypeScript configs here

## ⚠️ Important

Don't move these files elsewhere - the paths are configured specifically for this structure.
If you need to modify configurations, edit the files in this folder directly.
