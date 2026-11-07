# Notas de producción · MITOS DE TU CELULAR · EP. 2 (`2026-10-31-ep2-cable-barato`)

- **Qué se hizo:** Animación procedural completa estilo `ATOM` (`60 fps`, `1080×1920`, `55.20 s`, 9 planos alternando ambientes oscuros y mesas técnicas luminosas con frenado `C¹` antes de cada corte) + 58 efectos de sonido sincronizados a cada acción física (`pico -11.7 dB`, 0 huecos > 2 s, 0 efectos en cortes).
- **Qué se arregló en revisión (`revisar.mjs`):**
  1. Se reemplazaron pictogramas Unicode no presentes en `Figtree` por trazos vectoriales limpios en los conectores USB-C y sellos de estado.
  2. Se ajustó la altura de cámara en `03-chip-ochenta.js` para mantener la lectura de batería 100 % debajo de la franja de subtítulos superiores.
  3. Se añadió un viaje continuo de cámara (`1.32 → 1.0`) y fase periódica entera (`1 baldosa = 270 px`, `14 ciclos` de pulsos) en `09-cierre-loop.js`, pasando `revisar.mjs` con **«Nada que avisar»** y loop exacto al Fotograma 0 sin saltos.
- **Entrega:** `2026-10-31-ep2-cable-barato.mp4`, `flyer.jpg` (con zonas seguras verificadas) y `descripciones.md` para las 4 redes.
