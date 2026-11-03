export function authorized(req: Request) {
  const s = process.env.CRON_SECRET;
  if (!s) return false;
  const key = new URL(req.url).searchParams.get("key");
  return req.headers.get("authorization") === `Bearer ${s}` || key === s;
}
