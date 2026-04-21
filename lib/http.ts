import { NextResponse } from "next/server";

export function json(data: unknown, init?: ResponseInit) {
  const response = NextResponse.json(data, init);
  response.headers.set("Access-Control-Allow-Origin", process.env.NEXT_PUBLIC_APP_URL ?? "*");
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}

export function optionsResponse() {
  return json({}, { status: 200 });
}
