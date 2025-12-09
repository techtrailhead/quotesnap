import "./globals.css";
import { ReactNode } from "react";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"]
});

export default function RootLayout({ children }: { children: ReactNode }) {
  const floatingQuotes = [
    { text: "Simplicity is the keynote of all true elegance.", top: "18%", left: "12%", delay: "0s" },
    { text: "Creativity takes courage.", top: "32%", left: "78%", delay: "4s" },
    { text: "Art washes away from the soul the dust of everyday life.", top: "66%", left: "20%", delay: "8s" },
    { text: "We are what we repeatedly do. Excellence, then, is a habit.", top: "72%", left: "68%", delay: "12s" }
  ];

  return (
    <html lang="en" className={playfair.variable}>
      <head>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body>
        <header
          style={{
            padding: "18px 28px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(255, 255, 255, 0.82)",
            position: "sticky",
            top: 0,
            backdropFilter: "blur(14px)",
            boxShadow: "0 14px 40px rgba(212, 107, 166, 0.12)"
          }}
        >
          <Link
            href="/"
            style={{
              fontWeight: 700,
              letterSpacing: 0.5,
              color: "var(--text)",
              display: "flex",
              alignItems: "center",
              gap: 8
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "radial-gradient(circle at 30% 30%, #ffd3e1, #f3a4c2)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 22px rgba(212,107,166,0.3)"
              }}
            />
            QuoteSnap
          </Link>
          <nav style={{ display: "flex", gap: 16 }}>
            <Link href="/quote" style={{ color: "var(--muted)", fontWeight: 600 }}>
              Quote to Image
            </Link>
          </nav>
        </header>
        <main style={{ minHeight: "calc(100vh - 60px)", position: "relative", overflow: "hidden" }}>
          <div className="floating-quotes" aria-hidden>
            {floatingQuotes.map((quote, idx) => (
              <div
                key={idx}
                className="floating-quote"
                style={{ top: quote.top, left: quote.left, animationDelay: quote.delay }}
              >
                {quote.text}
              </div>
            ))}
          </div>
          {children}
        </main>
      </body>
    </html>
  );
}
