import type { Config } from "@netlify/functions";
export default async () => {
  const r = await fetch(`${process.env.URL}/api/cron/notify`, { headers: { authorization: `Bearer ${process.env.CRON_SECRET}` } });
  console.log("cron notify", r.status);
};
export const config: Config = { schedule: "* * * * *" };
