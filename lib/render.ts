import type { SKRSContext2D } from "@napi-rs/canvas";
import path from "path";
import { detectTextType } from "./detectTextType";
import { TEMPLATES, type TemplateConfig, type TemplateKey } from "./templates";

const WIDTH = 1080;
const HEIGHT = 1350;

type CanvasBindings = typeof import("@napi-rs/canvas");

export async function renderQuoteImage(text: string, templateKey: TemplateKey): Promise<Buffer> {
  const normalizedText = text?.trim();
  if (!normalizedText) {
    throw new Error("Text is required");
  }

  const template = TEMPLATES[templateKey];
  if (!template) {
    throw new Error("Unknown template");
  }

  const { createCanvas, loadImage, registerFont } = await import("@napi-rs/canvas");
  ensureFonts(registerFont);

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  await paintBackground(ctx, template, loadImage);

  const type = detectTextType(normalizedText);
  let fontSize = type === "quote" ? template.fontSizeQuote : template.fontSizePassage;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = template.textColor;

  applyTextShadow(ctx, template.textShadow);

  const maxWidth = WIDTH - template.padding * 2;
  ctx.font = `${fontSize}px ${template.fontFamily}`;

  let lines = wrapText(ctx, normalizedText, maxWidth);
  let lineHeightPx = fontSize * template.lineHeight;
  let totalHeight = lines.length * lineHeightPx;
  const maxHeight = HEIGHT - template.padding * 2;

  if (totalHeight > maxHeight) {
    const scale = maxHeight / totalHeight;
    fontSize = Math.max(26, Math.floor(fontSize * scale));
    ctx.font = `${fontSize}px ${template.fontFamily}`;
    lineHeightPx = fontSize * template.lineHeight;
    lines = wrapText(ctx, normalizedText, maxWidth);
    totalHeight = lines.length * lineHeightPx;
  }

  const yOffset = template.yOffset ?? 0;
  let y = HEIGHT / 2 - totalHeight / 2 + lineHeightPx / 2 + yOffset;
  for (const line of lines) {
    if (line.length === 0) {
      y += lineHeightPx;
      continue;
    }
    ctx.fillText(line, WIDTH / 2, y, maxWidth);
    y += lineHeightPx;
  }

  if (template.grain) {
    addGrainOverlay(ctx, createCanvas);
  }

  return canvas.toBuffer("image/png");
}

async function paintBackground(ctx: SKRSContext2D, template: TemplateConfig, loadImage: CanvasBindings["loadImage"]) {
  const { background } = template;

  if (isImagePath(background)) {
    const imagePath = resolveImagePath(background);
    const image = await loadImage(imagePath);
    ctx.drawImage(image, 0, 0, WIDTH, HEIGHT);
  } else if (background.startsWith("linear-gradient")) {
    const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    const colors = parseGradientColors(background);
    addGradientStops(gradient, colors);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  } else if (background.startsWith("radial-gradient")) {
    const colors = parseGradientColors(background);
    const gradient = ctx.createRadialGradient(
      WIDTH * 0.4,
      HEIGHT * 0.35,
      WIDTH * 0.05,
      WIDTH / 2,
      HEIGHT / 2,
      WIDTH * 0.9
    );
    addGradientStops(gradient, colors);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  } else {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }
}

function parseGradientColors(input: string): string[] {
  const matches = input.match(/#(?:[0-9a-fA-F]{3,8})|rgba?\([^)]+\)|hsla?\([^)]+\)/g);
  if (matches && matches.length > 0) {
    return matches;
  }
  return [];
}

function addGradientStops(gradient: CanvasGradient, colors: string[]) {
  const safeColors = colors.length > 0 ? colors : ["#e8efff", "#f6f8fd"];
  const step = 1 / Math.max(safeColors.length - 1, 1);
  safeColors.forEach((color, index) => {
    gradient.addColorStop(Math.min(index * step, 1), color);
  });
}

function wrapText(ctx: SKRSContext2D, text: string, maxWidth: number): string[] {
  const result: string[] = [];
  const blocks = text.split(/\r?\n/);

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) {
      result.push("");
      continue;
    }

    const words = trimmed.split(/\s+/);
    let line = "";

    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (ctx.measureText(candidate).width > maxWidth && line) {
        result.push(line);
        line = word;
      } else {
        line = candidate;
      }
    }

    if (line) {
      result.push(line);
    }
  }

  return result;
}

function applyTextShadow(ctx: SKRSContext2D, textShadow?: string) {
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  if (!textShadow) return;

  const match = textShadow.match(/(-?\d+(?:\.\d+)?)px?\s+(-?\d+(?:\.\d+)?)px?\s+(-?\d+(?:\.\d+)?)px?\s+(.+)/);
  if (match) {
    ctx.shadowOffsetX = parseFloat(match[1]);
    ctx.shadowOffsetY = parseFloat(match[2]);
    ctx.shadowBlur = parseFloat(match[3]);
    ctx.shadowColor = match[4];
  } else {
    ctx.shadowColor = textShadow;
  }
}

function addGrainOverlay(ctx: SKRSContext2D, createCanvas: CanvasBindings["createCanvas"]) {
  const grainCanvas = createCanvas(WIDTH, HEIGHT);
  const gctx = grainCanvas.getContext("2d");
  const dots = Math.floor(WIDTH * HEIGHT * 0.012);
  for (let i = 0; i < dots; i++) {
    const gray = 180 + Math.random() * 70;
    gctx.fillStyle = `rgba(${gray}, ${gray}, ${gray}, 0.06)`;
    gctx.fillRect(Math.random() * WIDTH, Math.random() * HEIGHT, 1, 1);
  }
  ctx.drawImage(grainCanvas, 0, 0);
}

function isImagePath(path: string) {
  return /\.(png|jpg|jpeg|webp|svg)$/i.test(path) || path.startsWith("data:image/");
}

function resolveImagePath(imagePath: string) {
  if (imagePath.startsWith("http")) return imagePath;
  if (imagePath.startsWith("data:")) return imagePath;
  if (imagePath.startsWith("/")) {
    return path.join(process.cwd(), "public", imagePath.slice(1));
  }
  return imagePath;
}

let fontsRegistered = false;
function ensureFonts(registerFont: CanvasBindings["registerFont"]) {
  if (fontsRegistered) return;
  const fontCandidates = [
    {
      path: resolveModulePath("@fontsource/inter/files/inter-latin-600-normal.ttf"),
      family: "Inter",
      weight: "600"
    },
    {
      path: resolveModulePath("@fontsource/inter/files/inter-latin-700-normal.ttf"),
      family: "Inter",
      weight: "700"
    },
    {
      path: resolveModulePath("@fontsource/inter/files/inter-latin-500-normal.ttf"),
      family: "Inter",
      weight: "500"
    }
  ];

  for (const font of fontCandidates) {
    if (!font.path) continue;
    try {
      registerFont(font.path, { family: font.family, weight: font.weight });
    } catch {
      // Ignore missing font files; will fall back to system fonts.
    }
  }
  fontsRegistered = true;
}

function resolveModulePath(modulePath: string): string | null {
  try {
    const resolved = require.resolve(modulePath);
    return resolved;
  } catch {
    return null;
  }
}
