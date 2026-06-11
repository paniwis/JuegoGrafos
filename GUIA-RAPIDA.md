# NECROFORGE - Guía Rápida de Inicio

## 🎮 Cómo Jugar

### 1. Abre el juego

- Abre `index.html` en tu navegador favorito
- O ejecuta: `python -m http.server 8790` y entra a `http://127.0.0.1:8790/`

### 2. Controles Básicos

```
A/D          = Moverse izquierda/derecha
W            = Saltar
S            = Caer rápido
ESPACIO      = Disparar
I            = Inventario
E            = Recoger objeto
P            = Pausar
```

### 3. Progresión de Juego

- **Oleada 1**: Derrota monstruos pequeños
- **Jefe**: Cuando termines la oleada, aparecerá un jefe
- **Diálogos**: Presiona ESPACIO para avanzar en las escenas de historia
- **Recompensa**: Recoge la pieza de jefe (máscara, brazo, etc.)
- **Próximo Nivel**: Continúa a la siguiente zona

## 📖 Narrativa - Los 4 Jefes

### Nivel 1: Bosque Hundido

**Jefe**: Garven, el Guardián de los Brazos de Raíz

- **Primera Verdad**: Descubres que el Consejo te manipuló
- **Recuerdo**: Garven protegía a niños, no atacaba

### Nivel 2: La Mina de Ceniza

**Jefe**: Brakka, la Bestia de Hierro

- **Segunda Verdad**: El Consejo atacó primero a los guardianes
- **Recuerdo**: Brakka cerró la mina para proteger a su gente

### Nivel 3: La Torre del Eco

**Jefe**: Lyra, la Dama del Rostro Fragmentado

- **Tercera Verdad**: Eras un guardián, no un soldado
- **Recuerdo**: Tu promesa de proteger a todos fue rota

### Nivel 4: La Catedral del Núcleo

**Jefe**: Auren, el Guardián del Pecho

- **Verdad Completa**: Todo fue planeado para usarte como arma
- **Elección Final**: Elige tu destino
  - **Redención**: Persigue al Consejo y busca justicia
  - **Juicio**: Destruye tu poder y acepta las consecuencias

## 🎵 Música

### Activar Música

1. Coloca un archivo MP3 en `assets/ambient-loop.mp3`
2. Abre el juego
3. Presiona el botón "Música OFF" en la esquina superior derecha para activarla

### Generar Música de Prueba

```bash
cd tools
python generate_ambient.py
ffmpeg -i assets/ambient-loop.wav -q:a 5 assets/ambient-loop.mp3
```

## 🧪 Probar Diálogos sin Jugar

Abre `test-dialogues.html` para ver todos los diálogos:

- Selecciona un jefe (Garven, Brakka, Lyra, Auren)
- Elige tipo: Pre-combate, Diálogos de combate, Post-derrota
- Presiona ESPACIO para avanzar

## 🎒 Sistema de Construcción

### Equipo

Tu personaje tiene 7 ranuras corporales:

- **Cabeza**: Casco, corona
- **Brazos D/I**: Garras, espadas
- **Manos D/I**: Armas, dagas
- **Pecho**: Corazón del poder
- **Piernas**: Botas, velocidad

### Combos

Conecta piezas de cierto modo para obtener habilidades:

- **Berserker**: Ataque rápido + daño extra
- **Ciclo Ward**: Defensa completa
- **Undying Spine**: Vida extra con cuerpo completo

## 📊 Algoritmos en Juego

### Jugador ve diálogos → Jefe usa:

- **BFS**: Top-down persecución inteligente
- **Dijkstra**: Enemigos encuentran el camino más corto
- **DFS**: Detectar ciclos en tu construcción
- **Kruskal**: Sugerir equipamiento óptimo

## 🔧 Editar Diálogos

### Agregar nueva línea a un jefe

1. Abre `src/game.js`
2. Busca la constante `bossDialogues`
3. Ubica el nivel (1-4)
4. Agregaél tipo (pre, defeat, combat)
5. Inserta: `{speaker: "Nombre", text: "Tu diálogo"}`

**Ejemplo:**

```javascript
bossDialogues[2].combat.push({
  speaker: 'Brakka',
  text: '¡Tu espada brilla como la que destruyó mi hogar!',
});
```

## 🎯 Objetivos de Juego

1. **Derrota los 4 jefes** en orden
2. **Desbloquea la verdad** mediante los recuerdos
3. **Elige tu final** al vencer a Auren
4. **Completa el ciclo** si lo deseas (roba la Reliquia)

## 🐛 Problemas Comunes

**P: Los diálogos no aparecen**

- Asegúrate de que `src/game.js` se cargó correctamente
- Abre la consola (F12) para ver errores

**P: La música no suena**

- Verifica que `assets/ambient-loop.mp3` existe
- Presiona el botón "Música OFF" para activarla
- Algunos navegadores requieren interacción del usuario primero

**P: Los jefes no bajan la vida**

- Dispara directamente (ESPACIO)
- Algunos jefes son más resistentes en ciclos posteriores
- Equipa mejores piezas de tu inventario (I)

## 📱 Navegadores Soportados

- Chrome/Chromium ✓
- Firefox ✓
- Safari ✓
- Edge ✓

## 🎓 Aprende Más

- Ver `README.md` para descripción completa
- Ver `README-NARRATIVE.md` para detalles de la narrativa
- Ver `test-dialogues.html` para explorar todos los diálogos

---

**¡Disfruta la aventura del Guardián Roto!** 🎮✨
