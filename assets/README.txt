Coloca aqui el spritesheet del jugador con este nombre:

player-spritesheet.png

El juego lo interpreta como una grilla de 8 columnas x 8 filas,
con frames de 64x64 px. Si tu spritesheet usa otro tamano de frame,
ajusta frameW, frameH, cols y rows en src/game.js.

Mientras el archivo no exista, el juego usa el sprite procedural
de la rana ronin como fallback.
