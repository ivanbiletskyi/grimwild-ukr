# Grimwild Website

Website for the Ukrainian fan adaptation and translation of the **Grimwild** tabletop RPG system.

## About the Project

This site was created for convenient viewing of game rules, character creation, paths (classes), exploration system, and other Grimwild materials in Ukrainian.

**Live site:** https://ivanbiletskyi.github.io/grimwild-ukr/

## Structure

- **Player** - game rules, character creation, paths (classes), exploration system
- **Game Master** - tools for running games, monsters, story lines
- **Glossary** - terminology and definitions

## Technologies

- **React** + **TypeScript** - main framework
- **Vite** - build tool and dev server
- **React Router** - routing
- **React Markdown** - markdown file rendering
- **GitHub Pages** - hosting

## Development

### Install dependencies

```bash
yarn install
```

### Run dev server

```bash
yarn dev
```

The site will be available at `http://localhost:5174`

### Automatic markdown file copying

When running `yarn dev`, the `copy-markdown.js` script automatically:
- Copies all `.md` files from root directories `player/`, `GM/` and `glossary.md` to `public/`
- Copies images (`.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`)
- Watches for changes in these files and automatically updates copies

### Build for production

```bash
yarn build
```

Built files will be in the `dist/` directory

### Preview production build

```bash
yarn preview
```

## Deployment

The project is configured for automatic deployment to GitHub Pages via GitHub Actions.

On every push to the `main` branch, it automatically:
1. Builds the production version
2. Publishes to GitHub Pages

More details about deployment setup: [../.github/DEPLOYMENT.md](../.github/DEPLOYMENT.md)

## Adding New Content

1. Add or edit `.md` files in root directories (`player/`, `GM/`, etc.)
2. Place images in subdirectories (e.g., `player/exploration/_images/`)
3. With the dev server running, files will automatically copy to `public/`
4. Add routes in `src/App.tsx` if needed

## License

This project is a fan adaptation of the original Grimwild game.
