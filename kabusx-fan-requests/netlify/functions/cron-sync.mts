import type { Config } from "@netlify/functions";
export default async () => {
  const r = await fetch(`${process.env.URL}/api/cron/sync`, { headers: { authorization: `Bearer ${process.env.CRON_SECRET}` } });
  console.log("cron sync", r.status);
};
export const config: Config = { schedule: "0 */6 * * *" };
