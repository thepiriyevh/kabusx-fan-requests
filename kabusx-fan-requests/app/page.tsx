import Link from "next/link";
import Image from "next/image";
import { admin } from "@/lib/supabase";
export const revalidate = 3600;
async function count(){
  try{const {count}=await admin().from("videos").select("id",{count:"exact",head:true}).eq("is_available",true);return count??null;}
  catch{return null;}
}
const steps=[["Mahnıları seç","KABUS X-in YouTube kanalındakı videoları gözdən keçir və istədiyin qədərini işarələ."],["Sorğunu göndər","İstəsən adını yaz. Qeydiyyat və telefon nömrəsi tələb olunmur."],["İstək çatır","Seçimlərin tam adı və linki ilə birbaşa sənətçiyə göndərilir."]];
export default async function Home(){
  const n=await count();
  return(<>
  <section className="relative overflow-hidden">
    <Image src="/banner.jpg" alt="" fill priority className="object-cover opacity-70 -z-10"/>
    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-bg via-bg/60 to-transparent"/>
    <div className="absolute inset-x-0 bottom-0 h-40 -z-10 bg-gradient-to-t from-bg to-transparent"/>
    <div className="mx-auto max-w-6xl px-5 py-20 md:py-32 grid md:grid-cols-[1.25fr_.75fr] gap-12 items-center">
      <div>
        <h1 className="font-display font-extrabold tracking-tight text-5xl md:text-7xl leading-[1.02] max-w-[14ch]">Növbəti Lyrics Video hansı mahnı olsun?</h1>
        <p className="mt-6 text-lg md:text-xl text-muted max-w-[38ch]">Sevdiyin mahnıları seç, səsini bizə çatdır.</p>
        <div className="mt-10 flex flex-wrap items-center gap-5">
          <Link href="/songs" className="btn-glow inline-flex rounded-xl px-8 py-4 font-semibold text-white">Mahnıları seç</Link>
          {n&&<p className="text-sm text-muted">{n} mahnı səni gözləyir</p>}
        </div>
      </div>
      <div className="relative mx-auto w-full max-w-sm">
        <div className="absolute -inset-6 rounded-[2rem] bg-accent/30 blur-3xl" aria-hidden/>
        <div className="relative aspect-square overflow-hidden rounded-3xl ring-1 ring-white/15 shadow-[0_30px_80px_-20px_rgba(217,90,24,.6)]">
          <Image src="/profile.jpg" alt="KABUS X" fill sizes="(min-width:768px) 380px, 90vw" className="object-cover"/>
        </div>
      </div>
    </div>
  </section>
  <section className="mx-auto max-w-6xl px-5 pt-6">
    <ol className="grid gap-5 md:grid-cols-3">
      {steps.map(([t,d],i)=>(<li key={t} className="rounded-2xl border border-line bg-surface/70 p-6 backdrop-blur">
        <span className="font-display text-3xl font-extrabold text-accent">{i+1}</span>
        <h2 className="mt-3 font-display text-lg font-bold">{t}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p></li>))}
    </ol>
  </section></>);
}
