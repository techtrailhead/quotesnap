import { NextResponse } from "next/server";
import { renderQuoteImage } from "@/lib/render";
import { TEMPLATES, type TemplateKey } from "@/lib/templates";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const requestJson = await req.json();
    const text: unknown = requestJson?.text;
    const template: unknown = requestJson?.template;

    if (typeof text !== "string" || typeof template !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    if (!TEMPLATES[template as TemplateKey]) {
      return NextResponse.json({ error: "Unknown template" }, { status: 400 });
    }

    const imageBuffer = await renderQuoteImage(text, template as TemplateKey);
    const imageBody = new Uint8Array(imageBuffer);

    return new NextResponse(imageBody, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'attachment; filename="quote.png"'
      }
    });
  } catch (error) {
    console.error("Render error", error);
    return NextResponse.json({ error: "Failed to render image" }, { status: 500 });
  }
}
