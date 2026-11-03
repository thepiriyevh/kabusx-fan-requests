import { NextResponse } from "next/server";
import { admin } from "@/lib/supabase";
export const dynamic="force-dynamic";
export async function GET(req:Request){
  const sp=new URL(req.url).searchParams;
  const q=(sp.get("q")??"").trim().slice(0,100).replace(/[%_,()]/g," ");
  const page=Math.max(1,Number(sp.get("page"))||1), size=24, asc=sp.get("sort")==="oldest";
  let query=admin().from("videos").select("id,title,thumbnail_url,video_url,duration,published_at",{count:"exact"}).eq("is_available",true);
  if(q) query=query.ilike("title",`%${q}%`);
  const {data,count,error}=await query.order("published_at",{ascending:asc}).range((page-1)*size,page*size-1);
  if(error) return NextResponse.json({error:"Kataloq yüklənmədi"},{status:500});
  return NextResponse.json({items:data,total:count??0,page,size});
}
