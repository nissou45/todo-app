# Déploiement — TodoApp Summer Vibes

## Option 1 : Vercel (recommandé) ⚡

1. Va sur [vercel.com](https://vercel.com) et connecte-toi avec GitHub
2. Clique **"Add New Project"** → importe `nissou45/todo-app`
3. **Ne change rien** — Vercel détectera automatiquement la config (`vercel.json`)
4. Clique **"Deploy"**
5. ✅ Ton app est en ligne en 30 secondes

## Option 2 : Netlify

1. Va sur [netlify.com](https://netlify.com)
2. **Add new site** → Import from GitHub
3. Build command: `npx expo export --platform web`
4. Publish directory: `dist`
5. Déployer

## Option 3 : GitHub Pages

```bash
npx expo export --platform web
npx gh-pages -d dist
```

## Build local

```bash
npx expo export --platform web
# Résultat dans dist/
```

## Build Android (APK)

```bash
npx eas build --platform android --profile preview
```

## Build iOS

```bash
npx eas build --platform ios
```
