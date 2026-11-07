import type { SceneMap } from "../../../src/engine/Stage";
import { Hook } from "./Hook";
import { Usda } from "./Usda";
import { Aerosol } from "./Aerosol";
import { Biofilm } from "./Biofilm";
import { Heat } from "./Heat";
import { Rule } from "./Rule";
import { Cta } from "./Cta";

export const scenes: SceneMap = {
  hook: Hook,
  usda: Usda,
  aerosol: Aerosol,
  biofilm: Biofilm,
  heat: Heat,
  rule: Rule,
  cta: Cta,
};
