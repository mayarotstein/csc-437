// src/model.ts
import { Guest } from "server/models";

export interface Model {
  profile?: Guest ;
}

export const init: Model = {};