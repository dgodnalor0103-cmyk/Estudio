import type { SceneMap } from "../../../src/engine/Stage";
import { Hook } from "./Hook";
import { Sensors } from "./Sensors";
import { Dilution } from "./Dilution";
import { Kidneys } from "./Kidneys";
import { Cells } from "./Cells";
import { Rule } from "./Rule";
import { Cta } from "./Cta";

export const scenes: SceneMap = {
  hook: Hook,
  sensors: Sensors,
  dilution: Dilution,
  kidneys: Kidneys,
  cells: Cells,
  rule: Rule,
  cta: Cta,
};
