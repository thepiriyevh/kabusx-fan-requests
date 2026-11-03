import "./globals.css";
import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { Header, Footer } from "@/components/Shell";
const display=Bricolage_Grotesque({subsets:["latin","latin-ext"],variable:"--font-display",display:"swap"});
export const metadata:Metadata={title:"KABUS X — Fan Requests",description:"Növbəti Lyrics Video hansı mahnı olsun? Sevdiyin mahnıları seç."};
export default function RootLayout({children}:{children:React.ReactNode}){return(<html lang="az" className={display.variable}><body className="font-sans"><Header/><main>{children}</main><Footer/></body></html>);}
