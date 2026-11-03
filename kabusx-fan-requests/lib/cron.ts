export function authorized(req:Request){const s=process.env.CRON_SECRET;return !!s&&req.headers.get("authorization")===`Bearer ${s}`;}
