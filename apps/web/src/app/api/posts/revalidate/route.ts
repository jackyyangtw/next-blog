import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import {
  getRevalidateTags,
  type RevalidateWebhookPayload,
} from "./revalidateTags";

export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { message: "Webhook secret is not configured" },
      { status: 500 },
    );
  }

  try {
    const { body, isValidSignature } =
      await parseBody<RevalidateWebhookPayload>(req, secret);

    if (!isValidSignature) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 },
      );
    }

    if (!body) {
      return NextResponse.json({ message: "Missing payload" }, { status: 400 });
    }

    const tags = getRevalidateTags(body);
    for (const tag of tags) {
      revalidateTag(tag, { expire: 0 });
    }
    return NextResponse.json({ revalidated: true, tags, now: Date.now() });
  } catch (error) {
    console.error("Revalidate webhook failed", error);
    return NextResponse.json(
      { message: "Failed to revalidate" },
      { status: 500 },
    );
  }
}
