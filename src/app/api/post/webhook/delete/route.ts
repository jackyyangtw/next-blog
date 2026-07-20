// src/app/api/webhooks/sanity-delete/route.ts
import { client } from "@/sanity/lib/client";
import { parseBody } from "next-sanity/webhook";
import { NextRequest, NextResponse } from "next/server";

type DeleteWebhookPayload = {
  _id?: string;
  _type?: string;
};

export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { message: "Webhook secret is not configured" },
      { status: 500 },
    );
  }

  try {
    const { body, isValidSignature } = await parseBody<DeleteWebhookPayload>(
      req,
      secret,
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 },
      );
    }

    if (!body) {
      return NextResponse.json({ message: "Missing payload" }, { status: 400 });
    }

    const { _id, _type } = body;
    if (_type !== "post" || !_id) {
      return NextResponse.json({ message: "Ignored" });
    }

    const bookmarkIds = await client.fetch<string[]>(
      `*[_type == "bookmark" && post._ref == $id]._id`,
      { id: _id },
    );

    if (bookmarkIds.length > 0) {
      const transaction = client.transaction();
      bookmarkIds.forEach((id) => transaction.delete(id));
      await transaction.commit();
    }

    return NextResponse.json({ message: "OK" });
  } catch (err) {
    console.error("Webhook Error:", err);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
