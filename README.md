# Othello Minimax Web

## Demo

https://othello-web-min-max.vercel.app/

## Español

Version moderna y web del juego clasico de Othello/Reversi, con reglas completas, modo jugador vs jugador y jugador vs IA usando minimax con poda alfa-beta.

### Ejecutar localmente

```bash
npm run dev
```

Luego abre:

```text
http://127.0.0.1:5174
```

No requiere instalar dependencias para funcionar.

### Desplegar en Vercel gratis

1. Sube esta carpeta como repositorio nuevo a GitHub, GitLab o Bitbucket.
2. En Vercel, crea un proyecto nuevo desde ese repo.
3. Usa estos valores:

```text
Framework Preset: Other
Build Command: vacio
Output Directory: .
Install Command: vacio
```

Tambien puedes arrastrar la carpeta al panel de Vercel si prefieres un despliegue manual.

### Caracteristicas

- Tablero responsive de 8x8.
- Jugadas validas resaltadas.
- Animaciones al colocar y voltear fichas.
- Animacion final con resultado de victoria, derrota o empate.
- Interfaz alternable entre espanol e ingles.
- Modo Jugador vs IA y Jugador vs jugador.
- Dificultad configurable por profundidad de busqueda.
- Minimax con poda alfa-beta y heuristica de movilidad, esquinas, posicion y cantidad de fichas.
- Proyecto estatico, ideal para hosting gratuito.

## English

A modern web version of the classic Othello/Reversi game, with complete rules, player vs player mode, and player vs AI mode powered by minimax with alpha-beta pruning.

### Run Locally

```bash
npm run dev
```

Then open:

```text
http://127.0.0.1:5174
```

No dependency installation is required to run the project.

### Deploy Free On Vercel

1. Push this folder as a new repository to GitHub, GitLab, or Bitbucket.
2. In Vercel, create a new project from that repo.
3. Use these settings:

```text
Framework Preset: Other
Build Command: empty
Output Directory: .
Install Command: empty
```

You can also drag and drop the folder into the Vercel dashboard for a manual deployment.

### Features

- Responsive 8x8 board.
- Highlighted valid moves.
- Animated piece placement and flipping.
- Endgame animation for win, loss, or tie results.
- Interface switchable between Spanish and English.
- Player vs AI and player vs player modes.
- Configurable AI difficulty by search depth.
- Minimax with alpha-beta pruning and a heuristic based on mobility, corners, positioning, and piece count.
- Static project, ideal for free hosting.
