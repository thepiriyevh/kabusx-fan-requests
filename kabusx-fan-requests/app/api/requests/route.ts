import { NextResponse } from "next/server";
import { z } from "zod";
import { admin } from "@/lib/supabase";
export const dynamic="force-dynamic";
const schema=z.object({videoIds:z.array(z.string().uuid()).min(1).max(50),displayName:z.string().trim().max(60).optional(),idempotencyKey:z.string().min(8).max(100)});
export async function POST(req:Request){
  const p=schema.safeParse(await req.json().catch(()=>null));
  if(!p.success) return NextResponse.json({error:"Seçim düzgün deyil. Ən azı bir mahnı seç."},{status:400});
  const {displayName,idempotencyKey}=p.data, ids=[...new Set(p.data.videoIds)], db=admin();
  const dup=await db.from("requests").select("request_number").eq("idempotency_key",idempotencyKey).maybeSingle();
  if(dup.data) return NextResponse.json({requestNumber:dup.data.request_number});
  const v=await db.from("videos").select("id").in("id",ids).eq("is_available",true);
  if(v.error||(v.data?.length??0)!==ids.length) return NextResponse.json({error:"Seçilmiş videolardan biri artıq mövcud deyil."},{status:400});
  const r=await db.from("requests").insert({display_name:displayName||null,idempotency_key:idempotencyKey}).select("id,request_number").single();
  if(r.error||!r.data) return NextResponse.json({error:"Sorğu saxlanmadı. Bir az sonra yenidən cəhd et."},{status:500});
  const it=await db.from("request_items").insert(ids.map(video_id=>({request_id:r.data.id,video_id})));
  if(it.error){await db.from("requests").delete().eq("id",r.data.id);return NextResponse.json({error:"Sorğu saxlanmadı. Bir az sonra yenidən cəhd et."},{status:500});}
  // bildiriş uğursuz olsa belə sorğu itmir: iş növbədə qalır
  await db.from("notification_jobs").insert({request_id:r.data.id,channel:"telegram",idempotency_key:`tg-${r.data.id}`});
  return NextResponse.json({requestNumber:r.data.request_number});
}
