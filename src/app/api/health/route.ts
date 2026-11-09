import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  let dbStatus = "healthy";

  try {
    // Quick, light probe to verify DB connection
    await prisma.$queryRaw`SELECT 1`;
  } catch (err: unknown) {
    dbStatus = "unreachable";
  }

  const responseBody = {
    status: dbStatus === "healthy" ? "healthy" : "degraded",
    database: dbStatus,
    timestamp: new Date().toISOString(),
    service: "organichy-ecommerce",
  };

  // Render expects a 200 OK to consider the web process alive
  return NextResponse.json(responseBody, {
    status: 200,
  });
}
