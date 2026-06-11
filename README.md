# NECROFORGE

Juego roguelike/pixel-art sobre grafos. Una narrativa oscura donde cada jefe es un guardián con historias entrelazadas.

## Ejecutar

Abre `index.html` en un navegador, o sirve la carpeta:

```bash
python -m http.server 8790
```

Luego entra a:

```text
http://127.0.0.1:8790/
```

## Características

### Juego

- Roguelike basado en grafos (Dijkstra, BFS, DFS, Kruskal)
- Combate top-down contra jefes narrativos
- Sistema de construcción de personaje modular
- 4 niveles con progresión desafiante

### Narrativa

- **Diálogos cinemáticos** antes, durante y después de cada combate
- **Jefes con Historia**: Garven, Brakka, Lyra, Auren (guardianes del mundo)
- **Recuerdos Inyectados**: Desbloquea la verdad sobre quién eres realmente
- **Dos Finales**: Redención (justicia) o Juicio (aceptación)

### Música

- **Música ambiental** configurable
- Botón ON/OFF en la esquina superior derecha
- Lee archivos MP3 desde `assets/ambient-loop.mp3`

## Archivos Importantes

- **`index.html`** - Interfaz principal
- **`src/game.js`** - Lógica del juego, diálogos, narrativa
- **`src/styles.css`** - Estilos (incluyendo panel de diálogos)
- **`assets/`** - Sprites, escenarios, música
- **`tools/generate_ambient.py`** - Generador de música de prueba

## Configurar Música

1. Coloca tu archivo de música ambiental en `assets/ambient-loop.mp3`
2. Abre el juego y alterna la música con el botón en la esquina superior derecha
3. O genera una pista de prueba:
   ```bash
   cd tools
   python generate_ambient.py
   ffmpeg -i assets/ambient-loop.wav -q:a 5 assets/ambient-loop.mp3
   ```

## Narrativa - Estructura de Diálogos

Los diálogos están en `src/game.js` en la constante `bossDialogues`:

```javascript
bossDialogues = {
  1: {pre: [...], defeat: [...], combat: [...]},  // Garven
  2: {pre: [...], defeat: [...], combat: [...]},  // Brakka
  3: {pre: [...], defeat: [...], combat: [...]},  // Lyra
  4: {pre: [...], defeat: [...], combat: [...]}   // Auren
}
```

Ver `README-NARRATIVE.md` para detalles completos.

## Build

Para regenerar el HTML autocontenido:

```bash
python tools/build_single_html.py
```

## Controles

- **A/D**: Moverse
- **W**: Saltar
- **S**: Caer
- **ESPACIO**: Disparar
- **I**: Inventario
- **E**: Recoger
- **P**: Pausar
- **ESPACIO/ENTER**: Avanzar diálogos
