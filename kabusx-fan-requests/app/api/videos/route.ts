import { NextResponse } from "next/server";
import { admin } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export async function GET() {
  const { data, error } = await admin()
    .from("videos")
    .select("id,title,thumbnail_url,video_url,duration,published_at")
    .eq("is_available", true)
    .order("published_at", { ascending: false })
    .limit(1000);
  if (error) return NextResponse.json({ error: "Kataloq yüklənmədi" }, { status: 500 });
  return NextResponse.json(
    { items: data ?? [], total: data?.length ?? 0 },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
  );
}
