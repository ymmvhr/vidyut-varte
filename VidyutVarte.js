import { useState } from "react";

const CATEGORIES = [
  { id: "gescom", label: "GESCOM/KPTCL", labelKn: "ಗೆಸ್ಕಾಮ್/ಕೆಪಿಟಿಸಿಎಲ್", icon: "⚡", color: "#f59e0b", query: "GESCOM KPTCL Karnataka electricity power outage tariff news March 2026" },
  { id: "energy", label: "Energy & Power", labelKn: "ವಿದ್ಯುತ್ & ಶಕ್ತಿ", icon: "🔋", color: "#34d399", query: "India solar wind power energy electricity grid news March 2026" },
  { id: "policy", label: "National Policy", labelKn: "ರಾಷ್ಟ್ರೀಯ ನೀತಿ", icon: "📋", color: "#60a5fa", query: "India national electricity policy ministry power sector reform news 2026" },
];

export default function VidyutVarte() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCat, setActiveCat] = useState("all");
  const [activeLang, setActiveLang] = useState("both");
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [status, setStatus] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [mode, setMode] = useState("");

  // ವಾಟ್ಸಾಪ್ ಶೇರ್ ಫಂಕ್ಷನ್
  const shareOnWhatsApp = (item) => {
    const text = `⚡ *${item.titleKn}*\n\n${item.summaryKn}\n\nಇನ್ನಷ್ಟು ಮಾಹಿತಿಗಾಗಿ ನೋಡಿ: PowerSolveIndia.com`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const makePrompt = (query, useSearch) => ({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 1500,
    system: `You are a bilingual electricity news journalist for Karnataka. Provide 3 recent news stories. Return ONLY raw JSON array.`,
    messages: [{ role: "user", content: `News topic: ${query}` }],
  });

  const callAPI = async (payload, useSearch) => {
    // ಸುರಕ್ಷಿತ ಮಾರ್ಗ: ನಿಮ್ಮ ಸ್ವಂತ API ಎಂಡ್‌ಪಾಯಿಂಟ್ ಬಳಸಿ (Vercel Functions)
    // ಇಲ್ಲಿ '/api/get-news' ಎಂಬುದು ನಿಮ್ಮ ಬ್ಯಾಕೆಂಡ್ ಲಿಂಕ್ ಆಗಿರುತ್ತದೆ
    const res = await fetch("/api/get-news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload, useSearch }),
    });

    if (!res.ok) throw new Error(`ಸರ್ವರ್ ಸಂಪರ್ಕ ವಿಫಲವಾಗಿದೆ.`);
    const data = await res.json();
    
    // JSON ಡೇಟಾ ಹೊರತೆಗೆಯುವುದು
    const allText = data.content[0].text;
    const s = allText.indexOf("["), e = allText.lastIndexOf("]");
    return JSON.parse(allText.slice(s, e + 1));
  };

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    setNews([]);
    setMode("");

    const allNews = [];
    try {
      for (const cat of CATEGORIES) {
        setStatus(`${cat.icon} ${cat.labelKn} ಸುದ್ದಿ ಹುಡುಕುತ್ತಿದ್ದೇನೆ...`);
        const items = await callAPI(makePrompt(cat.query, true), true);
        if (Array.isArray(items)) {
          allNews.push(...items.map(n => ({ ...n, category: cat.id })));
        }
      }
      setNews(allNews);
      setMode("live");
      setLastUpdated(new Date());
    } catch (err) {
      setError("ಸುದ್ದಿ ತರುವಲ್ಲಿ ತಾಂತ್ರಿಕ ತೊಂದರೆಯಾಗಿದೆ. ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಪ್ರಯತ್ನಿಸಿ.");
    }
    setLoading(false);
    setStatus("");
  };

  const filtered = activeCat === "all" ? news : news.filter(n => n.category === activeCat);

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#e2e8f0", fontFamily: "sans-serif", padding: "20px" }}>
      {/* Header */}
      <header style={{ textAlign: "center", marginBottom: "30px", borderBottom: "1px solid #30363d", paddingBottom: "20px" }}>
        <h1 style={{ color: "#f59e0b", fontSize: "24px" }}>⚡ ವಿದ್ಯುತ್ ವಾರ್ತೆ</h1>
        <p style={{ fontSize: "12px", color: "#8b949e" }}>POWERSOLVEINDIA.COM · AI NEWS</p>
        
        {/* Controls */}
        <div style={{ marginTop: "15px", display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={fetchNews} disabled={loading} style={{ background: "#f59e0b", border: "none", padding: "8px 15px", borderRadius: "5px", fontWeight: "bold", cursor: "pointer" }}>
            {loading ? "ಲೋಡ್ ಆಗುತ್ತಿದೆ..." : "📡 ಸುದ್ದಿ ತನ್ನಿ"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: "600px", margin: "0 auto" }}>
        {error && <div style={{ color: "#f87171", textAlign: "center" }}>{error}</div>}
        
        {filtered.map((item, idx) => (
          <div key={idx} onClick={() => setExpanded(expanded === idx ? null : idx)} style={{ background: "#161b22", padding: "15px", borderRadius: "8px", marginBottom: "12px", border: "1px solid #30363d", cursor: "pointer" }}>
            <span style={{ fontSize: "10px", color: "#f59e0b", border: "1px solid #f59e0b", padding: "2px 5px", borderRadius: "4px" }}>{item.date}</span>
            <h3 style={{ fontSize: "16px", marginTop: "10px" }}>{item.titleKn}</h3>
            
            {expanded === idx && (
              <div style={{ marginTop: "10px", borderTop: "1px solid #30363d", paddingTop: "10px" }}>
                <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#c9d1d9" }}>{item.summaryKn}</p>
                <button 
                  onClick={(e) => { e.stopPropagation(); shareOnWhatsApp(item); }}
                  style={{ background: "#25D366", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", fontSize: "12px", marginTop: "10px", cursor: "pointer" }}
                >
                  🟢 ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ
                </button>
              </div>
            )}
          </div>
        ))}
      </main>

      <footer style={{ textAlign: "center", marginTop: "40px", fontSize: "10px", color: "#8b949e" }}>
        © 2026 PowerSolveIndia | Tippanna Manglure
      </footer>
    </div>
  );
}

