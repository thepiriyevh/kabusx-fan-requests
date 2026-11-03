import { admin } from "./supabase";
type J=Record<string,any>;
async function yt(path:string,params:Record<string,string|number>):Promise<J>{
  const u=new URL("https://www.googleapis.com/youtube/v3/"+path);
  for(const [k,v] of Object.entries({...params,key:process.env.YOUTUBE_API_KEY??""})) u.searchParams.set(k,String(v));
  const r=await fetch(u,{signal:AbortSignal.timeout(15000)});
  if(!r.ok) throw new Error(`YouTube ${r.status}: ${(await r.text()).slice(0,300)}`);
  return r.json();
}
export async function syncChannel(){
  const id=process.env.YOUTUBE_CHANNEL_ID, handle=process.env.YOUTUBE_CHANNEL_HANDLE;
  const ch=await yt("channels",id?{part:"contentDetails",id}:{part:"contentDetails",forHandle:handle??""});
  const uploads=ch.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if(!uploads) throw new Error("Kanal və ya yüklənmələr playlisti tapılmadı");
  const ids:string[]=[]; let token:string|undefined;
  do{
    const p=await yt("playlistItems",{part:"contentDetails",playlistId:uploads,maxResults:50,...(token?{pageToken:token}:{})});
    for(const it of p.items??[]) ids.push(it.contentDetails.videoId);
    token=p.nextPageToken;
  }while(token);
  const now=new Date().toISOString(); const rows:J[]=[];
  for(let i=0;i<ids.length;i+=50){
    const v=await yt("videos",{part:"snippet,contentDetails,status",id:ids.slice(i,i+50).join(",")});
    for(const it of v.items??[]) rows.push({
      youtube_video_id:it.id,title:it.snippet.title,description:it.snippet.description??null,
      thumbnail_url:(it.snippet.thumbnails?.medium??it.snippet.thumbnails?.high??it.snippet.thumbnails?.default)?.url??null,
      video_url:`https://www.youtube.com/watch?v=${it.id}`,duration:it.contentDetails?.duration??null,
      published_at:it.snippet.publishedAt,is_available:it.status?.privacyStatus==="public",last_synced_at:now,updated_at:now});
  }
  const db=admin();
  for(let i=0;i<rows.length;i+=200){
    const {error}=await db.from("videos").upsert(rows.slice(i,i+200),{onConflict:"youtube_video_id"});
    if(error) throw new Error(error.message);
  }
  const seen=new Set(rows.map(r=>r.youtube_video_id));
  const {data:existing}=await db.from("videos").select("youtube_video_id").eq("is_available",true);
  const gone=(existing??[]).map(r=>r.youtube_video_id).filter(x=>!seen.has(x));
  if(gone.length) await db.from("videos").update({is_available:false,updated_at:now}).in("youtube_video_id",gone);
  return {total:rows.length,markedUnavailable:gone.length};
}
