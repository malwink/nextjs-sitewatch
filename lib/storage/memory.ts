import { CheckResult } from "../checker";

type Site = { id: string; url: string; name?: string };

const checks: CheckResult[] = [];
const sites: Site[] = [];

export async function saveCheck(siteId: string | undefined, result: CheckResult) {
  if (siteId) result.siteId = siteId;
  checks.unshift(result);
  // cap history to 1000
  if (checks.length > 1000) checks.splice(1000);
  return result;
}

export async function listChecks(siteId?: string, limit = 50) {
  const filtered = siteId ? checks.filter((c) => c.siteId === siteId) : checks;
  return filtered.slice(0, limit);
}

export async function getCheck(id: string) {
  return checks.find((c) => c.id === id) || null;
}

export async function addSite(site: Site) {
  sites.push(site);
  return site;
}

export async function listSites() {
  return sites.slice();
}

export default {
  saveCheck,
  listChecks,
  getCheck,
  addSite,
  listSites,
};
