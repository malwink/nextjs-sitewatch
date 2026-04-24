import * as memory from "./memory";
import * as upstash from "./upstash";

const useUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;

const adapter = useUpstash ? upstash : memory;

export const saveCheck = adapter.saveCheck;
export const listChecks = adapter.listChecks;
export const getCheck = adapter.getCheck;
export const addSite = adapter.addSite;
export const listSites = adapter.listSites;

export default adapter;
