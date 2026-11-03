import Link from "next/link";
import Image from "next/image";
export default function Home(){return(
<section className="relative overflow-hidden">
<div className="absolute inset-0 -z-10" aria-hidden><Image src="/banner.jpg" alt="" fill priority className="object-cover opacity-[.14]"/><div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg"/></div>
<div className="mx-auto max-w-6xl px-5 py-16 md:py-24 grid md:grid-cols-[1.2fr_.8fr] gap-10 items-center">
<div><h1 className="font-display font-bold tracking-tight text-4xl md:text-5xl leading-[1.1] max-w-[18ch]">Növbəti Lyrics Video hansı mahnı olsun?</h1>
<p className="mt-5 text-lg text-muted max-w-[40ch]">Sevdiyin mahnıları seç, səsini bizə çatdır.</p>
<Link href="/songs" className="mt-8 inline-flex items-center rounded-lg bg-accent px-6 py-3 font-medium text-white hover:bg-secondary transition-colors">Mahnıları seç</Link></div>
<div className="relative aspect-square w-full max-w-sm md:ml-auto rounded-2xl overflow-hidden shadow-[0_20px_50px_-20px_rgba(107,58,34,.5)]"><Image src="/profile.jpg" alt="KABUS X" fill sizes="(min-width:768px) 380px, 90vw" className="object-cover"/></div>
</div></section>);}
