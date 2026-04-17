import crypto from "crypto";

export type CheckResult = {
  id: string;
  siteId?: string;
  url: string;
  status: number | null;
  statusText?: string;
  ok: boolean;
  latencyMs: number;
  headers: Record<string, string>;
  bodyHash?: string;
  checkedAt: string;
  error?: string;
};

export async function runCheck(url: string, options?: { timeoutMs?: number }): Promise<CheckResult> {
  const timeoutMs = options?.timeoutMs ?? 10000;
  const controller = new AbortController();
  const id = crypto.randomUUID();
  const start = Date.now();

  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });
    const latencyMs = Date.now() - start;

    // read body (bounded)
    let text = "";
    try {
      text = await res.text();
    } catch (e) {
      // ignore body read errors
    }

    clearTimeout(timeout);

    const hash = text ? crypto.createHash("sha256").update(text).digest("hex") : undefined;

    const headers: Record<string, string> = {};
    res.headers.forEach((v, k) => (headers[k] = v));

    return {
      id,
      url,
      status: res.status,
      statusText: res.statusText,
      ok: res.ok,
      latencyMs,
      headers,
      bodyHash: hash,
      checkedAt: new Date().toISOString(),
    };
  } catch (err: any) {
    clearTimeout(timeout);
    const latencyMs = Date.now() - start;
    return {
      id,
      url,
      status: null,
      ok: false,
      latencyMs,
      headers: {},
      checkedAt: new Date().toISOString(),
      error: err?.message ?? String(err),
    };
  }
}

export default runCheck;
