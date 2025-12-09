/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useMemo, useState } from "react";
import { TEMPLATES, type TemplateKey } from "@/lib/templates";

const fallbackText =
  "We are what we repeatedly do. Excellence, then, is not an act, but a habit.\n— Aristotle";

export default function QuotePage() {
  const [text, setText] = useState(fallbackText);
  const [template, setTemplate] = useState<TemplateKey>("typewriter");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const templateOptions = useMemo(() => Object.entries(TEMPLATES) as [TemplateKey, typeof TEMPLATES[TemplateKey]][], []);

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, template })
      });

      if (!response.ok) {
        const message = await response.json().catch(() => ({}));
        throw new Error(message?.error ?? "Failed to render image");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImageUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "32px 16px 48px",
        maxWidth: 1200,
        margin: "0 auto",
        position: "relative"
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(35% 35% at 20% 10%, rgba(212,107,166,0.16), transparent)," +
            "radial-gradient(30% 40% at 80% 18%, rgba(255,196,166,0.18), transparent)"
        }}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 24, position: "relative" }}>
        <section
          style={{
            background: "var(--panel)",
            border: "1px solid var(--border)",
            borderRadius: 18,
            padding: 22,
            boxShadow: "0 18px 50px rgba(212,107,166,0.16)",
            backdropFilter: "blur(6px)"
          }}
        >
          <header style={{ marginBottom: 12 }}>
            <p style={{ color: "var(--muted)", margin: 0, fontSize: 12, letterSpacing: 1.1 }}>INPUT</p>
            <h2 style={{ margin: "4px 0 0 0" }}>Paste your text</h2>
          </header>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder="Drop a quote or passage..."
            style={{
              width: "100%",
              background:
                "radial-gradient(120% 120% at 20% 20%, rgba(212,107,166,0.08), transparent), #fffaf7",
              color: "var(--text)",
              borderRadius: 12,
              border: "1px solid var(--border)",
              padding: 14,
              fontSize: 15,
              resize: "vertical",
              minHeight: 160,
              lineHeight: 1.6,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)"
            }}
          />

          <div style={{ marginTop: 16 }}>
            <p style={{ color: "var(--muted)", marginBottom: 8, fontSize: 13 }}>Template</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {templateOptions.map(([key, config]) => (
                <label
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "11px 12px",
                    borderRadius: 12,
                    border: key === template ? "1px solid var(--accent)" : "1px solid var(--border)",
                    background: key === template ? "rgba(212,107,166,0.08)" : "rgba(255,255,255,0.6)",
                    cursor: "pointer",
                    boxShadow: key === template ? "0 8px 18px rgba(212,107,166,0.14)" : "none"
                  }}
                >
                  <input
                    type="radio"
                    name="template"
                    value={key}
                    checked={template === key}
                    onChange={() => setTemplate(key)}
                  />
                  <span style={{ fontWeight: 600 }}>{config.label}</span>
                  <span style={{ color: "var(--muted)", fontSize: 12, marginLeft: "auto" }}>{key}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={handleGenerate}
              disabled={loading || !text.trim()}
              style={{
                background: loading
                  ? "rgba(212,107,166,0.16)"
                  : "linear-gradient(135deg, #fbc2d4, #f7a1c0, #fcd4b3)",
                color: loading ? "var(--muted)" : "#3b1a29",
                border: "1px solid rgba(212,107,166,0.4)",
                padding: "12px 16px",
                borderRadius: 12,
                fontWeight: 700,
                minWidth: 170,
                boxShadow: loading ? "none" : "0 12px 28px rgba(212,107,166,0.25)"
              }}
            >
              {loading ? "Rendering..." : "Generate Image"}
            </button>
            {error ? <span style={{ color: "#ff9a9a" }}>{error}</span> : null}
          </div>
        </section>

        <section
          style={{
            background: "var(--panel)",
            border: "1px solid var(--border)",
            borderRadius: 18,
            padding: 22,
            minHeight: 320,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            boxShadow: "0 18px 50px rgba(212,107,166,0.16)",
            backdropFilter: "blur(6px)"
          }}
        >
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ color: "var(--muted)", margin: 0, fontSize: 12, letterSpacing: 1.1 }}>OUTPUT</p>
              <h2 style={{ margin: 4 }}>Preview</h2>
            </div>
            <a
              href={imageUrl ?? "#"}
              download="quote.png"
              style={{
                pointerEvents: imageUrl ? "auto" : "none",
                opacity: imageUrl ? 1 : 0.5,
                border: "1px solid rgba(212,107,166,0.4)",
                padding: "10px 12px",
                borderRadius: 12,
                color: "var(--text)",
                background: "rgba(255,255,255,0.6)"
              }}
            >
              Download PNG
            </a>
          </header>

          <div
            style={{
              flex: 1,
              borderRadius: 12,
              background:
                "radial-gradient(90% 70% at 15% 20%, rgba(212,107,166,0.08), transparent)," +
                "rgba(255,255,255,0.8)",
              border: "1px dashed var(--border)",
              display: "grid",
              placeItems: "center",
              overflow: "hidden",
              minHeight: 360
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Rendered quote preview"
                style={{ maxWidth: "100%", maxHeight: 520, objectFit: "contain" }}
              />
            ) : (
              <p style={{ color: "var(--muted)" }}>Generate to see a preview</p>
            )}
          </div>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>
            The image is rendered server-side with @napi-rs/canvas at 1080 × 1350 and returned as a downloadable PNG.
          </p>
        </section>
      </div>
    </div>
  );
}
