export type TextType = "quote" | "passage";

export function detectTextType(text: string): TextType {
  const normalized = text.trim();
  if (!normalized) {
    return "quote";
  }

  const lineCount = normalized.split(/\r?\n/).length;
  if (normalized.length <= 200 || lineCount <= 4) {
    return "quote";
  }

  return "passage";
}
