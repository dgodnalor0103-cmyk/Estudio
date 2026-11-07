#!/usr/bin/env node
import { spawnSync } from "node:child_process";

spawnSync("/usr/bin/open", ["http://127.0.0.1:8900/"]);
spawnSync("/usr/bin/open", ["/Users/rol.travel/.gemini/antigravity/scratch/pruebas-cuentas-instagram/salida"]);
console.log("Navegador y carpeta abiertos.");
