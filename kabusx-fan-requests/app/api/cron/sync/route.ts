import { NextResponse } from "next/server";
import { authorized } from "@/lib/cron";
import { syncChannel } from "@/lib/youtube";
export const dynamic="force-dynamic";
export async function GET(req:Request){
  if(!authorized(req)) return NextResponse.json({error:"icazə yoxdur"},{status:401});
  try{return NextResponse.json({ok:true,...await syncChannel()});}
  catch(e){console.error("sync failed",e);return NextResponse.json({ok:false,error:String((e as Error).message)},{status:500});}
}
