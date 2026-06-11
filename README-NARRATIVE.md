# NECROFORGE: Sistema de Narrativa y Diálogos

## Resumen de Cambios

Se han integrado los diálogos de los jefes narrativos del juego, estructurado en 4 niveles con conversaciones antes, durante y después del combate.

### Sistema de Diálogos

#### Cómo Funciona

1. **Pre-combate**: Se muestra un diálogo antes de que inicie el combate del jefe.
2. **Durante combate**: Líneas aleatorias de diálogo se muestran durante el combate a través del HUD.
3. **Post-combate (Derrota)**: Diálogo dramático tras derrotar al jefe, con recuerdos inyectados.
4. **Decisión Final**: Tras el último jefe (Auren), el jugador elige entre dos finales.

#### Estilos de Diálogo

Los diálogos están estructurados como pares `{speaker, text}`:

```javascript
{speaker: "Garven", text: "Así que por fin enviaron a su perro."}
```

**Ejemplos de Hablantes:**

- `Garven`, `Brakka`, `Lyra`, `Auren` (jefes)
- `Kael` (protagonista)
- `Voz de [Nombre]` (recuerdos)
- `Memoria de [Nombre]` (secuencias de recuerdo)
- `Voz desconocida`, `Voz del Consejo` (narradores)

### Niveles Narrativos

**Nivel 1: El Bosque Hundido**

- Jefe: Garven, el Guardián de los Brazos de Raíz
- Recompensa: Máscara de Raíz
- Tema: Primera verdad sobre la manipulación

**Nivel 2: La Mina de Ceniza**

- Jefe: Brakka, la Bestia de Hierro
- Recompensa: Botas de Niebla
- Tema: Descubrimiento de que el Consejo atacó primero

**Nivel 3: La Torre del Eco**

- Jefe: Lyra, la Dama del Rostro Fragmentado
- Recompensa: Sello de Sangre
- Tema: Identidad perdida y propósito original

**Nivel 4: La Catedral del Núcleo**

- Jefe: Auren, el Guardián del Pecho
- Recompensa: Corona del Vacío
- Tema: Decisión final y libertad de elección

### Finales Disponibles

**Opción 1: Redención**

- Kael conserva la pechera como carga
- Va tras el Consejo para buscar justicia
- Mensaje: "El mal no terminó cuando recordó la verdad. Terminó cuando decidió desobedecerla."

**Opción 2: Juicio**

- Kael destruye la pechera y renuncia al poder
- Acepta ser juzgado por sus acciones
- Mensaje: "No todos los monstruos piden perdón. Algunos empiezan por dejar de obedecer."

## Música de Fondo

### Cómo Usarla

1. **Ruta esperada**: `assets/ambient-loop.mp3`
2. **Botón de música**: "Música OFF" en la esquina superior derecha
3. **Control**: Presiona el botón para alternar música ON/OFF

### Especificaciones de Audio

- **Formato recomendado**: MP3 (comprimido, menor tamaño)
- **Duración**: 2-4 minutos (se repite en bucle)
- **Volumen**: Configurado a 22% (no invasivo)
- **Loop**: Habilitado automáticamente

### Preparar tu Propia Música

1. Obtén un archivo de música ambiental (libre de derechos de autor)
2. Conviértelo a MP3 (usa VLC, Audacity o ffmpeg)
3. Colócalo en la carpeta `assets/` con el nombre `ambient-loop.mp3`
4. El juego lo detectará automáticamente

**Comando ffmpeg para convertir WAV a MP3:**

```bash
ffmpeg -i input.wav -q:a 5 ambient-loop.mp3
```

## Archivo de Diálogos - Estructura

La constante `bossDialogues` en `src/game.js` contiene:

```javascript
{
  1: {
    pre: [...],      // Antes del combate
    defeat: [...],   // Después de derrotar al jefe
    combat: [...]    // Líneas aleatorias durante combate
  },
  // ... repetir para waves 2, 3, 4
}
```

### Agregar Nuevos Diálogos

1. Edita `src/game.js`
2. Ubica la constante `bossDialogues`
3. Añade líneas al array correspondiente (ej: `pre`, `defeat`)
4. Formato: `{speaker: "Nombre", text: "Texto aquí"}`

Ejemplo:

```javascript
bossDialogues[1].pre.push({
  speaker: 'Garven',
  text: 'Esta es una nueva línea de diálogo.',
});
```

## Controles de Diálogo

- **Avanzar diálogo**: Presiona ESPACIO o ENTER
- **Durante diálogo**: El juego se pausa
- **Después de diálogo**: HUD vuelve al mensaje predeterminado

## HUD y Mensajes

El HUD muestra mensajes dinámicos:

- Duración configurable (en segundos)
- Se restaura automáticamente al mensaje predeterminado
- Visible en la esquina inferior izquierda

### Establecer Mensaje Personalizado

```javascript
setHudMessage('Tu mensaje aquí', 4); // 4 segundos
```

## Integración del Sistema

### Variables Clave

- `dialogVisible`: Booleano que indica si un diálogo está en pantalla
- `dialogQueue`: Array de líneas de diálogo actuales
- `dialogIndex`: Índice actual en la cola de diálogos
- `hudMessage`: Texto visible en el HUD
- `hudMessageTimer`: Cuenta regresiva del mensaje

### Funciones Principales

- `showDialog(lines, title, callback)`: Muestra un diálogo
- `advanceDialog()`: Avanza a la siguiente línea
- `setHudMessage(text, duration)`: Establece un mensaje temporal
- `toggleMusic()`: Alterna la música ON/OFF
- `finalizeBossDefeat()`: Finaliza la derrota de jefe con diálogos

## Notas Técnicas

- Los diálogos pausan automáticamente el juego
- Los recuerdos tienen estilo visual especial (speaker: "Memoria de X")
- Durante diálogos, se previene entrada de movimiento
- La música se inicia con volumen bajo para no interferir
- Todos los diálogos son completamente modificables en `src/game.js`

## Próximos Pasos

1. Coloca `ambient-loop.mp3` en la carpeta `assets/`
2. Abre el juego en el navegador
3. Los diálogos aparecerán automáticamente en cada jefe
4. Presiona ESPACIO para avanzar a través de ellos
5. Alterna la música con el botón "Música OFF" (o ON si está activada)

¡Disfruta la narrativa mejorada!
