import { Redis } from "@upstash/redis";
import { CheckResult } from "../checker";

const url = process.env.UPSTASH_REDIS_REST_URL as string;
const token = process.env.UPSTASH_REDIS_REST_TOKEN as string;

const client = new Redis({ url, token });

// Keys:
// checks -> list of serialized checks (LPUSH)
// check:{id} -> hash/json of a single check
// sites -> list of site objects

export async function saveCheck(siteId: string | undefined, result: CheckResult) {
  const key = `check:${result.id}`;
  if (siteId) result.siteId = siteId;
  await client.set(key, JSON.stringify(result));
  await client.lpush("checks", key);
  await client.ltrim("checks", 0, 999); // cap
  return result;
}

export async function listChecks(siteId?: string, limit = 50) {
  const keys = await client.lrange("checks", 0, limit - 1);
  const items = [] as CheckResult[];
  for (const k of keys) {
    const raw = await client.get(k);
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw) as CheckResult;
      if (!siteId || parsed.siteId === siteId) items.push(parsed);
    } catch (e) {
      continue;
    }
  }
  return items;
}

export async function getCheck(id: string) {
  const raw = await client.get(`check:${id}`);
  if (!raw) return null;
  return JSON.parse(raw) as CheckResult;
}

export async function addSite(site: { id: string; url: string; name?: string }) {
  await client.lpush("sites", JSON.stringify(site));
  return site;
}

export async function listSites() {
  const raw = await client.lrange("sites", 0, 999);
  return raw.map((r) => JSON.parse(r));
}

export default { saveCheck, listChecks, getCheck, addSite, listSites };
