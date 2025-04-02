export async function translateToEnglish(text: string): Promise<string> {
  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Translation failed");
    }

    return data.text;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Повертаємо оригінальний текст у випадку помилки
  }
}
