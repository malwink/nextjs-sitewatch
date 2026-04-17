import * as memory from "./memory";

// For PoC we use the memory adapter. Swap this export to a Vercel KV or Postgres adapter later.
export const saveCheck = memory.saveCheck;
export const listChecks = memory.listChecks;
export const getCheck = memory.getCheck;
export const addSite = memory.addSite;
export const listSites = memory.listSites;

export default {
  saveCheck,
  listChecks,
  getCheck,
  addSite,
  listSites,
};
