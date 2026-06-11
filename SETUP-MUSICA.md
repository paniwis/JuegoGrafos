# 🎵 Configuración de Música para NECROFORGE

## Estructura de Archivos Requerida

Descarga o crea 4 archivos MP3 y colócalos en la carpeta `assets/`:

```
JuegoGrafos/
├── assets/
│   ├── level1-music.mp3    (Bosque Hundido - Garven)
│   ├── level2-music.mp3    (Templo de Niebla - Brakka)
│   ├── level3-music.mp3    (Forja Sangrienta - Lyra)
│   └── level4-music.mp3    (Trono del Vacío - Auren)
├── src/
├── index.html
└── ...
```

## 🎶 Dónde Obtener Música Libre de Derechos

### Opción 1: **Freepik/Pixabay Music** (Recomendado)
- **Sitio**: https://pixabay.com/music/
- **Características**:
  - Completamente gratis
  - Sin necesidad de registrarse (opcional)
  - Licencia libre para proyectos comerciales y personales
  - Búsqueda por género: "dark", "ambient", "boss", "dungeon"

**Ejemplo de búsqueda**:
- **Level 1**: Busca "forest ambient" o "dark forest"
- **Level 2**: Busca "industrial", "temple", o "mysterious"
- **Level 3**: Busca "dark", "fire", o "intense"
- **Level 4**: Busca "void", "epic boss", o "final battle"

### Opción 2: **Incompetech** (Kevin MacLeod)
- **Sitio**: https://incompetech.com/music/
- **Características**:
  - Música original de calidad
  - Todos los géneros
  - Completamente gratis con atribución
  - Ideal para juegos

**Búsqueda recomendada**:
- "Dark Ambience" para atmosféricos
- "Boss Battle" para enfrentamientos
- "Medieval" para dungeons

### Opción 3: **OpenGameArt.org**
- **Sitio**: https://opengameart.org/
- **Características**:
  - Música diseñada específicamente para juegos
  - Múltiples géneros y estilos
  - Comunidad activa

### Opción 4: **YouTube Audio Library** (Si tienes cuenta Google)
- Ve a YouTube Studio → Biblioteca de Audio
- Descarga música libre de derechos
- Perfecta para juegos

---

## 📝 Pasos para Configurar

### 1. **Descargar la Música**
   - Ve a uno de los sitios recomendados
   - Busca música atmosférica/épica
   - Descarga en formato **MP3**
   - Asegúrate de que sean archivos **cortos** (~2-5 minutos máximo)
   
   **Nota**: Si el archivo es muy largo, úsalo de todas formas. Se repetirá automáticamente.

### 2. **Nombrar Correctamente**
   ```
   level1-music.mp3
   level2-music.mp3
   level3-music.mp3
   level4-music.mp3
   ```

### 3. **Colocar en Assets**
   - Abre la carpeta `JuegoGrafos/assets/`
   - Pega los 4 archivos MP3 aquí
   - Verifica que los nombres sean exactos

### 4. **Probar en el Juego**
   - Abre `index.html` en el navegador
   - Haz clic en el botón "Música ON"
   - La música debe sonar automáticamente
   - Al entrar a cada nivel, debe cambiar la canción

---

## 🎚️ Si Quieres Personalizar Más

### Cambiar URLs de Música (Alternativa)
Si prefieres hostear música en línea o usar URLs externas, edita [src/game.js](src/game.js) línea 86:

```javascript
const levels = [
  {
    name:"Bosque Hundido", 
    bossName:"Garven", 
    // ... otras propiedades ...
    music:"https://tuservidor.com/bosque.mp3"
  },
  {
    name:"Templo de Niebla", 
    bossName:"Brakka", 
    // ... otras propiedades ...
    music:"https://tuservidor.com/templo.mp3"
  },
  // ... más niveles ...
];
```

### Volumen
El volumen está configurado en **22%** (`bgMusic.volume = .22`). Para cambiarlo:

En [src/game.js](src/game.js) busca:
```javascript
bgMusic.volume = .22;
```

Cambia `0.22` a un valor entre `0` (silencio) y `1` (máximo).

### Loop Automático
La música se repite automáticamente. Si no quieres que se repita:

En [src/game.js](src/game.js) busca:
```javascript
bgMusic.loop = true;
```

Cambia a:
```javascript
bgMusic.loop = false;
```

---

## ✅ Checklist Final

- [ ] Descargaste 4 archivos MP3
- [ ] Los renombraste correctamente (level1/2/3/4-music.mp3)
- [ ] Los colocaste en `assets/`
- [ ] Probaste en el navegador
- [ ] El botón "Música ON/OFF" funciona
- [ ] La música cambia al entrar a cada nivel

---

## 🐛 Solución de Problemas

### **No suena la música**
1. Verifica que el nombre del archivo sea exacto: `level1-music.mp3`
2. Comprueba que esté en `assets/` (no en `assets/música/` u otra subcarpeta)
3. Abre la consola del navegador (F12) y busca errores
4. Intenta descargar un archivo MP3 diferente

### **La música suena pero no cambia entre niveles**
- Verifica que cada archivo tenga un nombre diferente
- Recarga la página (Ctrl+F5)

### **El archivo es muy grande**
- Los MP3 pueden ser grandes
- Si el juego tarda en cargar, usa música más corta o en bitrate menor
- Puedes comprimir con herramientas como [Freemake Audio Converter](https://www.freemake.com/es/free_audio_converter/)

---

## 📚 Recomendaciones de Música por Nivel

### **Level 1: Bosque Hundido (Garven)**
- Género: Ambient oscuro, naturaleza corrupta
- Palabras clave: "dark forest", "haunted woods", "nature decay"
- Tempo: Lento a medio

### **Level 2: Templo de Niebla (Brakka)**
- Género: Industrial, metálico, misterioso
- Palabras clave: "industrial ambient", "temple", "ruins"
- Tempo: Medio a rápido

### **Level 3: Forja Sangrienta (Lyra)**
- Género: Dark, intenso, energético
- Palabras clave: "dark ambient", "intense", "fire", "forge"
- Tempo: Rápido, agresivo

### **Level 4: Trono del Vacío (Auren)**
- Género: Epic, final boss, cósmico
- Palabras clave: "epic boss", "final battle", "void", "cosmic"
- Tempo: Muy intenso, épico

---

¡Listo! Una vez descargues y coloques los archivos, la música funcionará automáticamente.
