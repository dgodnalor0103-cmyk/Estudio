# Análisis Exhaustivo de Estilo Viral: `@speedy_devv`

## 1. Resumen del Perfil y Métricas de Viralidad
- **Cuenta:** [`@speedy_devv`](https://www.instagram.com/speedy_devv/) (Hugues · creador de `getkeyframes.com`)
- **Seguidores:** 195.000+ seguidores con solo 292 publicaciones.
- **Reels más virales analizados:**
  1. **Touchscreen Under the Hood (`DeW3kuNM2v5`):** **18,2 millones de vistas** — *«How does the touchscreen really works?»* (Corte transversal del vidrio, electrodos ITO, arcos de campo eléctrico dorados, iones `Na+` / `Cl-` y comparación dedo vs. bolígrafo de plástico vs. guante de lana).
  2. **iPhone Keyboard Invisible Touch Zones (`DeZ-ddqMWFE`):** **10,6 millones de vistas** (`26.5K VPH`, `>100x outlier`, `10.8K` comentarios, `8.087` compartidos) — *«How does your phone's keyboard really work under the hood?»* (Comparación dividida *«what you see»* vs. *«what you touch»* mostrando cómo iOS agranda en secreto las zonas táctiles invisibles según la probabilidad de la siguiente letra).
  3. **MacBook Battery / Charging (`DecOLvTsuFH`):** **3,2 millones de vistas** — *«you're [destroying]»* (Chasis de MacBook agrietándose con líneas de energía ámbar/doradas).
  4. **Stripe Architecture Under the Hood (`DfR1QFwMZhD`):** **260.000+ vistas** — *«How does Stripe really work under the hood?»* (Arquitectura isométrica en 6 capas: `aws Card vault AES-256`, `Idempotency keys`, `Radar`, `Ledger`, `Redis`, `DocDB MongoDB` + línea de tiempo interactiva en modo claro).
  5. **The Viral System (`DeyusrQMOmi`):** **35 millones de vistas acumuladas** — Muestra por dentro su línea de tiempo a **60 FPS** sincronizando `FRAMES`, `VOICE` (onda de audio dorada) y `WORDS` (timestamps exactos al centésimo de segundo).

---

## 2. Capturas de Referencia Extraídas (`analisis/`)
1. `01_perfil_speedy_devv.png` — Perfil general y cuadrícula de publicaciones recientes.
2. `02_reels_speedy_devv.png` — Pestaña de Reels con los 3 fijados multimillonarios (`3.2M`, `10.6M`, `18.2M`).
3. `03_reel_18M_f1.png` — Reel 18.2M (`0.5 s`): Dedo 3D acercándose al cristal, arcos capacitivos dorados, subpíxeles RGB y fila de lecturas `100 100 100`.
4. `04_reel_18M_f2.png` — Reel 18.2M (`5.5 s`): Comparación física entre el dedo (que curva el campo eléctrico) y un bolígrafo translúcido (aislante).
5. `05_reel_18M_f3.png` — Reel 18.2M (`14.0 s`): Mano con guante de lana tejido intentando tocar el iPhone en el frío.
6. `06_reel_stripe_f1.png` — Reel Stripe (`2.5 s`): Pila isométrica 3D de arquitectura de software con conectores ortogonales y logos reales.
7. `07_reel_stripe_f2.png` — Reel Stripe (`14.0 s`): Transición a **Modo Claro** con barra de progreso horizontal, mockup de iPhone y el avatar de `@speedy_devv` abajo.
8. `08_reel_10M_keyboard.png` — Reel 10.6M (`4.5 s`): Teclado de iOS con retícula táctil (`+`) y el personaje de `@speedy_devv` en la esquina inferior derecha.
9. `09_reel_10M_keyboard_f2.png` — Reel 10.6M (`12.0 s`): Revelación visual *«what you see»* vs. *«what you touch»* con zonas ámbar dinámicas y el avatar mirando hacia arriba.
10. `10_reel_system_f1.png` — Reel Sistema (`3.0 s`): Mockup de iPhone con contador odómetro `35M` y cronómetro analógico `20 days`.
11. `11_reel_system_f2.png` — Reel Sistema (`16.0 s`): El motor interno a `60 FRAMES PER SECOND` con pistas `FRAMES`, `VOICE` y `WORDS`.

---

## 3. Anatomía del Estilo Visual y Animación a 60 FPS

### A. Estructura del Gancho (Hook · 0 a 4 segundos)
- **Fórmula verbal:** Empieza sin saludos ni rodeos con una paradoja cotidiana o una pregunta directa sobre algo que el espectador usa todos los días pero no sabe cómo funciona por dentro (*«When your finger touches your phone...»*, *«On your iPhone keyboard, you're not pressing the keys you see...»*).
- **Fórmula visual desde el fotograma 0:** Nunca inicia con una pantalla vacía ni con un avatar hablando solo. Desde el frame `0` ya está en pantalla el objeto protagonista a gran escala (media pantalla o más), en corte transversal (*cutaway*) o perspectiva 3D isométrica, moviéndose en sincronía con la primera palabra.

### B. Paleta de Colores y Temas Duales
1. **Modo Oscuro de Ingeniería (Predominante, ~80% del tiempo):**
   - **Fondo:** Carbón azulado profundo (`#0A0D14` → `#111622`) con **rejilla técnica ortogonal** muy sutil (`rgba(255, 255, 255, 0.035)`, paso de `48–60 px`) y viñeta radial suave.
   - **Ámbar / Oro Eléctrico (`#F5B83D` / `#FFD460`):** Reservado para lo invisible que cobra vida (campos eléctricos, zonas táctiles ocultas, impulsos de datos, ondas de voz).
   - **Azul Selección (`#2F7CF6`):** Caja de selección de la palabra clave en los subtítulos y elementos activos de UI.
   - **Verde Señal (`#22E39B`) y Rojo Alerta (`#FF4D4D`):** Para aciertos/conductividad vs. fallos/bloqueos.
2. **Modo Claro Editorial (~20% del tiempo, para contrastar cambios de contexto o UI):**
   - **Fondo:** Blanco cálido (`#FBFAF7` a `#EAECEF`) con rejilla fina gris (`rgba(0,0,0,0.04)`) y sombras suaves multiplicadas (`multiply`).

### C. Tipografía y Jerarquía de Texto
- **Subtítulos y Rótulos Principales (`Figtree`):**
  - Tamaño `72–76 px` en el tercio superior (`y ≈ 318–450`).
  - **Palabra actual:** Blanco puro (`#FFFFFF`), `Bold (700)`.
  - **Palabras ya dichas:** Gris medio (`#7B818A`), `Medium (500)`.
  - **Palabras futuras del bloque:** Ocultas; entran una a una con un anticipo de `80 ms` y un desenfoque que se aclara (`blur(8px) → blur(0px)` en `70 ms`).
  - **Palabra Clave (`clave`):** Enmarcada por el icónico **recuadro azul de selección vectorial** (`fill: rgba(47,124,246,0.22)`, `stroke: #2F7CF6` de `4 px`, más **dos tiradores circulares blanco/azul** en las esquinas superior-izquierda e inferior-derecha que se abren con rebote `back.out`).
- **Datos Técnicos, Registros y Contadores (`JetBrains Mono`):**
  - Usada para valores numéricos en vivo (`100  100  84  62  100`), direcciones o claves (`AES-256`, `Na+`, `Cl-`) y notas al pie técnicas (*«Magnified illustration»*, *«Zones drawn visible. On a real iPhone they are invisible.»*).

### D. Elementos Gráficos y el Personaje (`@speedy_devv` Avatar)
1. **Líneas Indicadoras Ortogonales (`Callout Pointers`):**
   - Líneas blancas finas (`2–3 px`) que hacen un quiebre en ángulo recto (horizontal → vertical) y terminan en un **punto blanco sólido (`•`)** sobre la pieza exacta que nombra la voz, acompañadas de texto limpio en `Figtree Bold`.
2. **Comparación Dividida (*«What you see»* vs. *«What you touch / What really happens»*):**
   - Arriba el objeto en su apariencia normal para el usuario; abajo el mismo objeto en vista de rayos X / zonas invisibles / flujo eléctrico en color ámbar brillante.
3. **El Personaje Ilustrado (Avatar 2.5D):**
   - Joven de piel clara, cabello castaño peinado con volumen hacia arriba/lado, **gafas deportivas espejadas con degradado arcoíris (verde-cian-naranja)** y **camiseta roja**.
   - Aparece en el tercio inferior (`y ≈ 1380–1920`), ligeramente desplazado a la derecha o centrado, girando la cabeza hacia arriba para mirar el diagrama, señalando con la mano abierta o reaccionando mientras las capas técnicas flotan sobre él.

### E. Ritmo de Edición y Diseño Sonoro
- **Sincronización palabra a palabra:** Cada etiqueta, destello, cambio de número o expansión de zona ocurre exactamente en el segundo `t` de la palabra correspondiente (`ADELANTO = 0.04 s`).
- **Continuidad espacial:** En vez de cortar a otra escena cada 2 segundos, una misma escena evoluciona en pantalla (el dedo baja → el campo eléctrico se deforma → los números caen de `100` a `62` → entra el anuncio de llamada o la comparación dividida).
- **Diseño sonoro (SFX):** Toques secos de interfaz (`tic`, `clic`), barridos suaves de transición (`desliza`, `aire`), pulsos graves cuando se revela la capa oculta (`late`, `golpe-hondo`) y timbres sutiles en los datos clave (`cristal`, `timbre`), siempre entre `-10 dB` y `-16 dB` por debajo de la voz para mantener la claridad vocal.
