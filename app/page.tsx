import Link from "next/link";

export default function HomePage() {
  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        minHeight: "calc(100vh - 60px)",
        padding: "48px 16px",
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
            "radial-gradient(60% 45% at 20% 30%, rgba(212,107,166,0.15), rgba(212,107,166,0))," +
            "radial-gradient(50% 40% at 80% 60%, rgba(255,201,166,0.15), rgba(255,201,166,0))"
        }}
      />
      <div
        style={{
          maxWidth: 780,
          width: "100%",
          background: "var(--panel)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          padding: 40,
          boxShadow: "0 20px 60px rgba(212,107,166,0.15)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(35% 40% at 15% 10%, rgba(212,107,166,0.15), transparent)," +
              "radial-gradient(45% 50% at 85% 15%, rgba(255,190,147,0.18), transparent)"
          }}
        />
        <p style={{ textTransform: "uppercase", letterSpacing: 1.2, color: "var(--muted)", fontSize: 12 }}>
          QuoteSnap
        </p>
        <h1 style={{ marginTop: 8, marginBottom: 12 }}>Turn text into shareable art</h1>
        <p style={{ color: "var(--muted)", marginBottom: 24 }}>
          Paste a quote or passage, pick a template, and render a polished PNG for social sharing. Built with Next.js
          App Router and server-side canvas rendering.
        </p>
        <Link
          href="/quote"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 16px",
            borderRadius: 12,
            background: "linear-gradient(135deg, #f9c5d1, #f7a1c0, #f9d8c5)",
            color: "#3b1a29",
            fontWeight: 700,
            boxShadow: "0 12px 30px rgba(212,107,166,0.2)"
          }}
        >
          Get started →
        </Link>
      </div>
    </div>
  );
}
