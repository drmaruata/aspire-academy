import { NextResponse } from "next/server";
import { signOutAction } from "@/lib/actions/auth";

export async function POST() {
  await signOutAction();
  // signOutAction always redirects — this is unreachable but satisfies TS.
  return NextResponse.redirect(new URL("/", "http://localhost"));
}
