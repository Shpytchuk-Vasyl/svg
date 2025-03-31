import { NextRequest, NextResponse } from "next/server";
import { Translator } from "deepl-node";

const authKey = process.env.DEEPL_API_KEY || "";
const translator = new Translator(authKey);

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (!authKey) {
      console.warn("DeepL API key not found, using original text");
      return NextResponse.json({ text });
    }

    const result = await translator.translateText(text, "uk", "en-GB");
    return NextResponse.json({
      text: Array.isArray(result) ? result[0].text : result.text,
    });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
