export type TemplateKey = "typewriter" | "cosmic" | "nebula" | "cloudy";

export interface TemplateConfig {
  fontFamily: string;
  fontSizeQuote: number;
  fontSizePassage: number;
  textColor: string;
  background: string;
  textShadow?: string;
  padding: number;
  lineHeight: number;
  label: string;
  grain?: boolean;
  yOffset?: number;
}

export const TEMPLATES: Record<TemplateKey, TemplateConfig> = {
  typewriter: {
    label: "Typewriter",
    fontFamily: "'Special Elite', 'Courier New', monospace, 'Inter', sans-serif",
    fontSizeQuote: 64,
    fontSizePassage: 48,
    textColor: "#2d1a0f",
    background: "/textures/old-paper.png",
    textShadow: "0px 1px 0px rgba(0, 0, 0, 0.25)",
    padding: 150,
    lineHeight: 1.5,
    grain: true
  },
  cosmic: {
    label: "Cosmic Night",
    fontFamily: "'Inter', 'Noto Sans', 'Helvetica Neue', Arial, sans-serif",
    fontSizeQuote: 70,
    fontSizePassage: 54,
    textColor: "#f5f6f8",
    background: "/textures/space-field.svg",
    textShadow: "0px 14px 36px rgba(8, 9, 15, 0.6)",
    padding: 170,
    lineHeight: 1.42,
    grain: false
  },
  nebula: {
    label: "Golden Roost",
    fontFamily: "'Playfair Display', 'Times New Roman', serif, 'Inter', sans-serif",
    fontSizeQuote: 72,
    fontSizePassage: 56,
    textColor: "#1e140a",
    background: "/textures/pigeon-branch.svg",
    textShadow: "0px 10px 22px rgba(90, 70, 40, 0.3)",
    padding: 170,
    lineHeight: 1.5,
    grain: false,
    yOffset: -60
  },
  cloudy: {
    label: "Dried Leaves",
    fontFamily: "'Playfair Display', 'Times New Roman', serif, 'Inter', sans-serif",
    fontSizeQuote: 68,
    fontSizePassage: 52,
    textColor: "#2e241c",
    background: "/textures/dried-leaves.svg",
    textShadow: "0px 10px 24px rgba(80, 65, 50, 0.35)",
    padding: 170,
    lineHeight: 1.46,
    grain: true
  }
};
