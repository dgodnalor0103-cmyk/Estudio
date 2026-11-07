# La carga rápida original no daña tu celular, pero un cable barato sin chip sí

Pedido el 2026-10-31 · Serie **MITOS DE TU CELULAR · EP. 2**

## Lo que cuenta, en una frase

La carga rápida certificada negocia el voltaje con un microchip y frena sola al 80 %, mientras que un cable barato sin chip regulador y con hilos de cobre finos recalienta los pines del puerto y puede quemar el circuito interno de carga de tu celular.

## Los datos, cada uno con su fuente

1. **Lo sorprendente (Carga rápida vs. cable barato):** La carga rápida original (`USB-PD`) no quema el celular porque el cargador, el cable y el teléfono acuerdan digitalmente cuánta potencia enviar; el riesgo real está en los cables económicos no certificados que omiten la electrónica de protección.
   - *Fuente oficial:* USB Implementers Forum (*USB Type-C Cable and Connector Specification* / *USB Power Delivery*).
2. **El microchip dentro del conector (`E-Marker` / resistencia de identificación):** Los cables USB-C certificados para alta corriente integran un chip **E-Marker** (y en cables USB-A a USB-C, una resistencia pull-up de `56 kΩ`) que informa al teléfono cuánta corriente soporta el cable sin sobrecalentarse. Los cables genéricos baratos suelen venir vacíos por dentro sin chip E-Marker y con conductores de calibre muy delgado.
   - *Fuente oficial:* USB-IF Type-C Specification & auditorías técnicas de ingeniería de hardware USB-C (Benson Leung, Google ChromeOS Hardware).
3. **Frenado automático al 80 %:** Tanto Apple como fabricantes Android usan carga en dos etapas: carga rápida hasta el **80 %** y reducción automática a carga lenta de mantenimiento para evitar calor excesivo en la batería.
   - *Fuente oficial:* Apple Support (`HT208137` / *Fast charge your iPhone*).
4. **Cómo falla y daña el celular un cable barato:** Conductores de cobre demasiado finos y pines con holgura elevan la resistencia eléctrica de contacto en los `24` pines del puerto USB-C, generando calor localizado en la punta metálica, carbonizando pines (obligando a «doblar el cable» para que haga contacto) y enviando picos de voltaje al integrado de gestión de carga de la placa madre.
   - *Fuente oficial:* Documentación de seguridad Apple Support (*About Apple USB power adapters and cables*) y especificaciones de protección USB-PD.
5. **Comparación cotidiana de casa:** Meter toda la presión de agua de tu casa por un tubo plástico finito sin válvula reguladora hasta que la unión se hincha y revienta.
6. **Regla práctica para el usuario:** Usar cables certificados (`USB-IF` o `MFi`) y desconectar de inmediato cualquier cable cuya punta metálica se sienta caliente al tacto.
