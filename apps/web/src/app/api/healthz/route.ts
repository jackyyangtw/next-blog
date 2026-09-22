import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    commitSha:
      process.env.NEXT_PUBLIC_DEPLOYMENT_SHA ??
      process.env.VERCEL_GIT_COMMIT_SHA ??
      "local",
  });
}
