# Othello Minimax Web

Version moderna y web del juego clasico de Othello/Reversi, con reglas completas, modo jugador vs jugador y jugador vs IA usando minimax con poda alfa-beta.

## Ejecutar localmente

```bash
npm run dev
```

Luego abre:

```text
http://127.0.0.1:5174
```

No requiere instalar dependencias para funcionar.

## Desplegar en Vercel gratis

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

## Caracteristicas

- Tablero responsive de 8x8.
- Jugadas validas resaltadas.
- Animaciones al colocar y voltear fichas.
- Interfaz alternable entre espanol e ingles.
- Modo Jugador vs IA y Jugador vs jugador.
- Dificultad configurable por profundidad de busqueda.
- Minimax con poda alfa-beta y heuristica de movilidad, esquinas, posicion y cantidad de fichas.
- Proyecto estatico, ideal para hosting gratuito.
