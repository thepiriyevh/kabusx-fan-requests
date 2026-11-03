import { NextResponse } from "next/server";
import { authorized } from "@/lib/cron";
import { admin } from "@/lib/supabase";
import { sendTelegram } from "@/lib/telegram";
export const dynamic="force-dynamic";
const MAX=6;
export async function GET(req:Request){
  if(!authorized(req)) return NextResponse.json({error:"icazə yoxdur"},{status:401});
  const db=admin();
  const {data:jobs}=await db.from("notification_jobs").select("id,request_id,attempts").eq("status","pending").eq("channel","telegram").lte("next_attempt_at",new Date().toISOString()).limit(10);
  let sent=0,failed=0;
  for(const j of jobs??[]){
    const claim=await db.from("notification_jobs").update({status:"processing"}).eq("id",j.id).eq("status","pending").select("id");
    if(!claim.data?.length) continue;
    try{
      const {data:r}=await db.from("requests").select("request_number,created_at,request_items(videos(title,video_url))").eq("id",j.request_id).single();
      const vids=((r as any)?.request_items??[]).map((x:any)=>x.videos);
      const when=new Date(r!.created_at).toLocaleString("az-AZ",{timeZone:"Asia/Baku"});
      const text=`🎵 KABUS X — YENİ FAN SORĞUSU\n\nRequest ID: #${r!.request_number}\n\nSeçilən videolar:\n\n${vids.map((v:any,i:number)=>`${i+1}. ${v.title}\n🔗 ${v.video_url}`).join("\n\n")}\n\nÜmumi seçim: ${vids.length}\nTarix: ${when}`;
      const mid=await sendTelegram(text);
      await db.from("notification_jobs").update({status:"sent",attempts:j.attempts+1,updated_at:new Date().toISOString()}).eq("id",j.id);
      await db.from("notification_logs").insert({request_id:j.request_id,channel:"telegram",status:"sent",attempts:j.attempts+1,provider_message_id:mid,sent_at:new Date().toISOString()});
      sent++;
    }catch(e){
      const n=j.attempts+1,msg=String((e as Error).message).slice(0,500);
      await db.from("notification_jobs").update({status:n>=MAX?"dead":"pending",attempts:n,last_error:msg,next_attempt_at:new Date(Date.now()+Math.pow(2,n)*60000).toISOString(),updated_at:new Date().toISOString()}).eq("id",j.id);
      await db.from("notification_logs").insert({request_id:j.request_id,channel:"telegram",status:"failed",attempts:n,last_error:msg});
      failed++;
    }
  }
  return NextResponse.json({ok:true,sent,failed});
}
