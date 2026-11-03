import Link from "next/link";
const nav=[["/","Ana səhifə"],["/songs","Bütün mahnılar"],["/how-it-works","Necə işləyir?"],["/about","Haqqımızda"]];
export function Header(){return(<header className="border-b border-line bg-bg/90 backdrop-blur sticky top-0 z-20"><div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between gap-4">
<Link href="/" className="font-display font-bold tracking-tight text-lg">KABUS X</Link>
<nav aria-label="Əsas naviqasiya" className="flex gap-1 overflow-x-auto text-sm">{nav.map(([h,l])=>(<Link key={h} href={h} className="px-3 py-2 rounded-md text-muted hover:text-ink whitespace-nowrap">{l}</Link>))}</nav></div></header>);}
export function Footer(){return(<footer className="border-t border-line mt-24"><div className="mx-auto max-w-6xl px-5 py-10 text-sm text-muted space-y-1">
<p className="font-display font-bold text-ink">KABUS X</p><p>Official Fan Requests</p>
<p>Bu platforma KABUS X dinləyicilərinin istəklərini toplamaq üçün yaradılıb.</p>
<p><Link href="/privacy" className="underline">Məxfilik siyasəti</Link></p></div></footer>);}
