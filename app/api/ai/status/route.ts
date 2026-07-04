import { NextResponse } from "next/server";
import { getPublicAiStatus, getServerAiConfig } from "@/modules/ai/aiConfig";

export async function GET() {
  const config = getServerAiConfig();
  return NextResponse.json(getPublicAiStatus(config));
}
