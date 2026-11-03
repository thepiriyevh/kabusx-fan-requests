import Link from "next/link";
export default function Success({searchParams}:{searchParams:{n?:string}}){
  const n=(searchParams.n??"").replace(/[^A-Za-z0-9-]/g,"").slice(0,20);
  return(<div className="mx-auto max-w-2xl px-5 py-20"><h1 className="font-display font-bold text-3xl">Sorğun qəbul edildi</h1>
  {n&&<p className="mt-4 text-lg">Sorğu nömrən: <strong>#{n}</strong></p>}
  <p className="mt-4 text-muted">Seçdiyin mahnılar KABUS X-ə çatdırılacaq. Təşəkkür edirik!</p>
  <Link href="/songs" className="mt-8 inline-block rounded-lg bg-accent px-6 py-3 text-white">Daha mahnı seç</Link></div>);}
