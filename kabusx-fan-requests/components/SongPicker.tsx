"use client";
import { useEffect, useRef, useState } from "react";
type V={id:string;title:string;thumbnail_url:string|null;video_url:string;duration:string|null;published_at:string};
const dur=(d:string|null)=>{const m=d?.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);if(!m)return "";const h=+(m[1]??0),mi=+(m[2]??0),s=+(m[3]??0);return (h?`${h}:${String(mi).padStart(2,"0")}`:`${mi}`)+`:${String(s).padStart(2,"0")}`;};
export default function SongPicker(){
  const [items,setItems]=useState<V[]>([]);const [total,setTotal]=useState(0);const [page,setPage]=useState(1);
  const [q,setQ]=useState("");const [dq,setDq]=useState("");const [sort,setSort]=useState("newest");
  const [loading,setLoading]=useState(true);const [err,setErr]=useState("");
  const [sel,setSel]=useState<Map<string,V>>(new Map());const [name,setName]=useState("");const [busy,setBusy]=useState(false);
  const key=useRef(crypto.randomUUID());
  useEffect(()=>{const t=setTimeout(()=>{setDq(q);setPage(1);},350);return()=>clearTimeout(t);},[q]);
  useEffect(()=>{setPage(1);},[sort]);
  useEffect(()=>{let off=false;setLoading(true);setErr("");
    fetch(`/api/videos?q=${encodeURIComponent(dq)}&sort=${sort}&page=${page}`).then(r=>r.ok?r.json():Promise.reject()).then(d=>{if(off)return;setItems(p=>page===1?d.items:[...p,...d.items]);setTotal(d.total);}).catch(()=>!off&&setErr("Mahnılar yüklənmədi. Səhifəni yenilə.")).finally(()=>!off&&setLoading(false));
    return()=>{off=true;};},[dq,sort,page]);
  const toggle=(v:V)=>setSel(s=>{const n=new Map(s);n.has(v.id)?n.delete(v.id):n.set(v.id,v);return n;});
  async function submit(){setBusy(true);setErr("");
    try{const r=await fetch("/api/requests",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({videoIds:[...sel.keys()],displayName:name||undefined,idempotencyKey:key.current})});
      const d=await r.json();if(!r.ok)throw new Error(d.error);location.href=`/request/success?n=${encodeURIComponent(d.requestNumber)}`;}
    catch(e){setErr((e as Error).message||"Göndərilmədi. Yenidən cəhd et.");setBusy(false);}}
  return(<div className="mx-auto max-w-6xl px-5 py-10 pb-40">
    <h1 className="font-display font-bold text-3xl">Bütün mahnılar</h1>
    <div className="mt-6 flex flex-col sm:flex-row gap-3">
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Mahnı adı ilə axtar" aria-label="Axtarış" className="flex-1 rounded-lg border border-line bg-surface px-4 py-3"/>
      <select value={sort} onChange={e=>setSort(e.target.value)} aria-label="Sıralama" className="rounded-lg border border-line bg-surface px-4 py-3"><option value="newest">Ən yenilər</option><option value="oldest">Ən köhnələr</option></select></div>
    {err&&<p role="alert" className="mt-4 text-accent">{err}</p>}
    <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(v=>{const on=sel.has(v.id);return(<li key={v.id} className={`rounded-xl border bg-surface overflow-hidden ${on?"border-accent":"border-line"}`}>
        {v.thumbnail_url&&<img src={v.thumbnail_url} alt="" loading="lazy" className="aspect-video w-full object-cover"/>}
        <div className="p-4"><h2 className="font-medium leading-snug">{v.title}</h2>
          <p className="mt-1 text-sm text-muted">{new Date(v.published_at).toLocaleDateString("az-AZ")} {dur(v.duration)&&`· ${dur(v.duration)}`}</p>
          <div className="mt-3 flex items-center justify-between text-sm"><a href={v.video_url} target="_blank" rel="noopener noreferrer" className="underline text-muted">YouTube-da aç</a>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={on} onChange={()=>toggle(v)} className="h-5 w-5 accent-[#B5521A]"/>Seç</label></div></div></li>);})}
      {loading&&Array.from({length:6}).map((_,i)=><li key={i} className="h-64 rounded-xl bg-line/50 animate-pulse"/>)}</ul>
    {!loading&&!err&&items.length===0&&<p className="mt-8 text-muted">Mahnı tapılmadı.</p>}
    {items.length<total&&!loading&&<button onClick={()=>setPage(p=>p+1)} className="mt-8 rounded-lg border border-line px-5 py-3">Daha çox göstər</button>}
    {sel.size>0&&(<div className="fixed bottom-0 inset-x-0 border-t border-line bg-surface shadow-lg"><div className="mx-auto max-w-6xl px-5 py-4 space-y-3">
      <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">{[...sel.values()].map(v=>(<button key={v.id} onClick={()=>toggle(v)} className="rounded-full border border-line px-3 py-1 text-sm" aria-label={`${v.title} seçimini ləğv et`}>{v.title} ✕</button>))}</div>
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <input value={name} onChange={e=>setName(e.target.value)} maxLength={60} placeholder="Adın (istəyə bağlı)" className="rounded-lg border border-line px-4 py-3 sm:w-64"/>
        <span className="text-sm text-muted sm:ml-auto">Seçilən: {sel.size}</span>
        <button onClick={()=>setSel(new Map())} className="text-sm underline text-muted">Hamısını təmizlə</button>
        <button onClick={submit} disabled={busy} className="rounded-lg bg-accent px-6 py-3 font-medium text-white disabled:opacity-60">{busy?"Göndərilir…":"Sorğunu göndər"}</button></div></div></div>)}
  </div>);}
