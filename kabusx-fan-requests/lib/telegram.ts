export async function sendTelegram(text:string){
  const t=process.env.TELEGRAM_BOT_TOKEN,c=process.env.TELEGRAM_CHAT_ID;
  if(!t||!c) throw new Error("Telegram env dəyişənləri təyin edilməyib");
  const r=await fetch(`https://api.telegram.org/bot${t}/sendMessage`,{method:"POST",headers:{"content-type":"application/json"},
    body:JSON.stringify({chat_id:c,text,disable_web_page_preview:true}),signal:AbortSignal.timeout(15000)});
  const j=await r.json().catch(()=>({}));
  if(!r.ok||!j.ok) throw new Error(`Telegram ${r.status}: ${j.description??"naməlum xəta"}`);
  return String(j.result.message_id);
}
