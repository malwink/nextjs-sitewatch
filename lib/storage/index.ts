import * as memory from "./memory";

let adapter = memory;

// Use Upstash adapter when configured via env
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const upstash = require("./upstash");
    adapter = upstash;
  } catch (e) {
    // fall back to memory if adapter missing
    console.warn("Upstash adapter not available, using memory adapter");
  }
}

export const saveCheck = adapter.saveCheck;
export const listChecks = adapter.listChecks;
export const getCheck = adapter.getCheck;
export const addSite = adapter.addSite;
export const listSites = adapter.listSites;

export default {
  saveCheck,
  listChecks,
  getCheck,
  addSite,
  listSites,
};
