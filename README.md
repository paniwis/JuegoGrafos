# NECROFORGE

Juego roguelike/pixel-art sobre grafos.

## Ejecutar

Abre `index.html` en un navegador, o sirve la carpeta:

```bash
python -m http.server 8790
```

Luego entra a:

```text
http://127.0.0.1:8790/
```

## Build

El proyecto usa `index.html`, `src/`, `assets/` y `tools/`.
Para regenerar el HTML autocontenido:

```bash
python tools/build_single_html.py
```
