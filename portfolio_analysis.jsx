import { useState } from "react";

const data = {
  portfolio: {
    pluang: { total: 1066317, change: -100089, changePct: -8.58 },
    btc: { value: 839721, qty: 0.00064025, avgCost: 1431336280, pnl: -76692, pnlPct: -8.37 },
    msft: { value: 220033, qty: 0.030447164, avgCost: 7994711, pnl: -23393, pnlPct: -9.61 },
    gold: { value: 2074799, grams: 0.7796, avgCost: 2558682, returnAmt: 63800, returnPct: 3.17 },
  },
  cashflow: {
    balance: 1427734,
    income: 4228279,
    expense: 5134906,
    investAmt: 2378555,
    liquidCash: 1427734,
    emergencyFund: 1000000,
    freeCash: 400000,
  },
  monthly: {
    salary: 1500000,
    parentAllowance: 250000,
    kos: 425000,
    appleMusic: 60000,
    googleOne: 17000,
    livingExpense: 400000,
    totalFixed: 902000,
  },
};

const totalPortfolio = data.portfolio.pluang.total + data.portfolio.gold.value;

const tabs = ["Dashboard", "Epstein & BTC", "Gold Outlook", "Strategi", "Cashflow"];

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div style={{ background: "#0a0e1a", minHeight: "100vh", color: "#e2e8f0", fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "0 16px 40px" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a1f35 0%, #0f1222 100%)", borderBottom: "1px solid #1e2440", padding: "20px 0 0", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: "#5a6382", textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>Portfolio Analysis</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>Darmawan Ken</div>
              <div style={{ fontSize: 12, color: "#5a6382", marginTop: 2 }}>2 Feb 2026 · 01:33 WIB</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "#5a6382", textTransform: "uppercase", letterSpacing: 1 }}>Total Assets</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>Rp {(totalPortfolio / 1e6).toFixed(2)}M</div>
              <span style={{ fontSize: 11, color: "#ef4444", background: "#1f1215", padding: "2px 8px", borderRadius: 10 }}>
                ▼ Bearish Mode
              </span>
            </div>
          </div>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 0 }}>
            {tabs.map((t, i) => (
              <button key={t} onClick={() => setActiveTab(i)} style={{
                background: activeTab === i ? "#3b82f6" : "transparent",
                color: activeTab === i ? "#fff" : "#5a6382",
                border: "none", borderRadius: "8px 8px 0 0", padding: "8px 14px",
                fontSize: 12, fontWeight: activeTab === i ? 600 : 400, cursor: "pointer",
                whiteSpace: "nowrap", transition: "all 0.2s"
              }}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", paddingTop: 20 }}>
        {activeTab === 0 && <Dashboard />}
        {activeTab === 1 && <EpsteinBTC />}
        {activeTab === 2 && <GoldOutlook />}
        {activeTab === 3 && <Strategy />}
        {activeTab === 4 && <Cashflow />}
      </div>
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{ background: "#111827", border: "1px solid #1e2440", borderRadius: 12, padding: 16, marginBottom: 12, ...style }}>
      {children}
    </div>
  );
}

function SectionTitle({ children, icon }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 600, color: "#5a6382", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
      {icon && <span>{icon}</span>} {children}
    </div>
  );
}

function Badge({ color, children }) {
  const colors = {
    red: { bg: "#1f1215", text: "#ef4444" },
    green: { bg: "#0f1f14", text: "#22c55e" },
    yellow: { bg: "#1f1a0f", text: "#eab308" },
    blue: { bg: "#0f1525", text: "#3b82f6" },
    gray: { bg: "#151924", text: "#8892b0" },
  };
  const c = colors[color] || colors.gray;
  return <span style={{ background: c.bg, color: c.text, fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 10, display: "inline-block" }}>{children}</span>;
}

function AssetRow({ name, value, pnl, pnlPct, badge, extra }) {
  const isPos = pnl >= 0;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #1a1f2e" }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: 6 }}>
          {name} {badge}
        </div>
        {extra && <div style={{ fontSize: 10, color: "#5a6382", marginTop: 2 }}>{extra}</div>}
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Rp {value.toLocaleString()}</div>
        <div style={{ fontSize: 10, color: isPos ? "#22c55e" : "#ef4444" }}>
          {isPos ? "+" : ""}Rp {pnl.toLocaleString()} ({isPos ? "+" : ""}{pnlPct.toFixed(2)}%)
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const p = data.portfolio;
  return (
    <>
      <Card>
        <SectionTitle icon="📊">Current Portfolio Status</SectionTitle>
        <AssetRow name="Bitcoin (BTC)" value={p.btc.value} pnl={p.btc.pnl} pnlPct={p.btc.pnlPct} badge={<Badge color="red">-8.37%</Badge>} extra={`${p.btc.qty} BTC · Avg: Rp${(p.btc.avgCost/1e9).toFixed(2)}B/BTC`} />
        <AssetRow name="Microsoft (MSFT)" value={p.msft.value} pnl={p.msft.pnl} pnlPct={p.msft.pnlPct} badge={<Badge color="red">-9.61%</Badge>} extra={`${p.msft.qty} shares`} />
        <AssetRow name="Gold (Antam)" value={p.gold.value} pnl={p.gold.returnAmt} pnlPct={p.gold.returnPct} badge={<Badge color="green">+3.17%</Badge>} extra={`${p.gold.grams}g · Avg: Rp${p.gold.avgCost.toLocaleString()}/g`} />
        <div style={{ borderTop: "1px solid #1e2440", marginTop: 8, paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "#8892b0", fontWeight: 600 }}>NET P&L</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#ef4444" }}>-Rp {(76692 + 23393 - 63800).toLocaleString()} (-2.17%)</span>
        </div>
      </Card>

      <Card style={{ border: "1px solid #2a1a1a", background: "#1a1115" }}>
        <SectionTitle icon="⚡">Real-Time Market (2 Feb 2026)</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { label: "BTC Price", val: "$78,000", change: "-8.22%", neg: true },
            { label: "Gold/oz", val: "$4,745", change: "-11.39%", neg: true },
            { label: "Gold IDR/g", val: "Rp 2,753,908", change: "0.0%", neg: false },
            { label: "Govt Shutdown", val: "PARTIAL", change: "Active", neg: true },
          ].map(i => (
            <div key={i.label} style={{ background: "#111827", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, color: "#5a6382", marginBottom: 3 }}>{i.label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{i.val}</div>
              <div style={{ fontSize: 10, color: i.neg ? "#ef4444" : "#22c55e" }}>{i.change}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle icon="💰">Liquid Cash Situation</SectionTitle>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1, background: "#151924", borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 10, color: "#5a6382" }}>Total Liquid</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Rp 1.43M</div>
          </div>
          <div style={{ flex: 1, background: "#151924", borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 10, color: "#5a6382" }}>Emergency</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#eab308" }}>Rp 1M</div>
          </div>
          <div style={{ flex: 1, background: "#151924", borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 10, color: "#5a6382" }}>Free Cash</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#ef4444" }}>Rp 400K</div>
          </div>
        </div>
        <div style={{ marginTop: 10, fontSize: 11, color: "#ef4444", background: "#1f1215", borderRadius: 6, padding: "6px 10px" }}>
          ⚠️ Free cash SANGAT KETAT. 400K untuk hidup + investasi = NOT feasible.
        </div>
      </Card>
    </>
  );
}

function EpsteinBTC() {
  return (
    <>
      <Card style={{ border: "1px solid #2a1a1a", background: "#1a1115" }}>
        <SectionTitle icon="🔍">BTC di Epstein Files — Apa Sebenarnya?</SectionTitle>
        <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.7 }}>
          <p style={{ marginTop: 0 }}>
            Kamu bilang kamu "terified" — let me be honest: <strong style={{ color: "#eab308" }}>ketakutan kamu TIDAK irasional, tapi jangan sampai bikin keputusan berdasar ini.</strong>
          </p>
          <p><strong style={{ color: "#fff" }}>Facts yang terbukti:</strong></p>
          <ul style={{ paddingLeft: 18, margin: "8px 0" }}>
            <li style={{ marginBottom: 6 }}><strong style={{ color: "#fff" }}>Brock Pierce</strong> (Tether co-founder) diskusi Bitcoin dengan <strong>Larry Summers</strong> (mantan US Treasury Secretary) di rumah Epstein di Manhattan. Ini terjadi setelah 2011.</li>
            <li style={{ marginBottom: 6 }}><strong style={{ color: "#fff" }}>Peter Thiel</strong> (Founders Fund) — firm-nya terima $40M dari Epstein, dan Thiel adalah one of the earliest institutional Bitcoin investors (2014).</li>
            <li style={{ marginBottom: 6 }}><strong style={{ color: "#fff" }}>MIT Media Lab</strong> — Epstein donated $525K, dan lab ini menjadi institutional home untuk Bitcoin core developers setelah Bitcoin Foundation collapsed (2015). Epstein's money <em>helped rescue Bitcoin's governance crisis.</em></li>
            <li style={{ marginBottom: 6 }}><strong style={{ color: "#fff" }}>Epstein claimed</strong> dia pernah bicara dengan "founders of Bitcoin" — tapi ini TIDAK confirmed dan bisa jadi boongong/exaggeration.</li>
          </ul>
        </div>
      </Card>

      <Card>
        <SectionTitle icon="⚖️">Apakah Ini Buat BTC Worthless?</SectionTitle>
        <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.7 }}>
          <p style={{ marginTop: 0 }}><strong style={{ color: "#22c55e" }}>NO. Ini bukan reason untuk sell BTC.</strong> Ini yang perlu kamu pahami:</p>
          <div style={{ background: "#151924", borderRadius: 8, padding: 12, marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#22c55e", marginBottom: 4 }}>✓ Bitcoin is DECENTRALIZED</div>
            <div style={{ fontSize: 11, color: "#8892b0" }}>Satoshi Nakamoto created Bitcoin sebagai system yang <em>tidak bisa dikontrol</em> oleh satu orang. Epstein bisa diskusi BTC sepanjang hari — tapi dia tidak bisa manipulate the code, the miners, atau the network. Bitcoin tetap berjalan karena math dan cryptography, bukan karena satu orang.</div>
          </div>
          <div style={{ background: "#151924", borderRadius: 8, padding: 12, marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#22c55e", marginBottom: 4 }}>✓ Early investors ≠ Bitcoin itself</div>
            <div style={{ fontSize: 11, color: "#8892b0" }}>Sama kayak how Pentagon contractors banyak yang korupsi, tapi US military tetap exists. People yang early invest di BTC banyak yang kontroversial. Ini tentang WHO invested, bukan WHAT they invested in.</div>
          </div>
          <div style={{ background: "#151924", borderRadius: 8, padding: 12, marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#eab308", marginBottom: 4 }}>⚠️ Risk yang REAL</div>
            <div style={{ fontSize: 11, color: "#8892b0" }}>Kalau files reveal bahwa Epstein actually <em>controlled</em> Bitcoin development atau manipulated early supply — THAT would be different. Tapi evidence sekarang cuma menunjukkan dia <strong>discussed</strong> dan <strong>funded infrastructure</strong> — bukan control.</div>
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle icon="📉">Apakah BTC Sekarang Masuk Bear Market?</SectionTitle>
        <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.7 }}>
          <p style={{ marginTop: 0 }}><strong style={{ color: "#ef4444" }}>Brutal truth: YES, indicators menunjukkan early bear market phase.</strong></p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { label: "BTC broke 365-day MA", detail: "Pertama kali sustained close below since early 2022", neg: true },
              { label: "ETF outflows since Nov 2025", detail: "Institutional buyers now net sellers", neg: true },
              { label: "Digital Asset Treasuries stopped buying", detail: "Selain MicroStrategy, semua DATs berhenti", neg: true },
              { label: "BTC sudah turun 38% dari ATH $126K", detail: "Sekarang di $78K — territory bear", neg: true },
              { label: "Tapi: ETF structural base masih ada", detail: "$50B+ inflows, most capital belum keluar", neg: false },
              { label: "CZ predicts supercycle 2026", detail: "Bullish long-term thesis masih intact", neg: false },
            ].map((i, idx) => (
              <div key={idx} style={{ display: "flex", gap: 8, alignItems: "flex-start", background: "#151924", borderRadius: 6, padding: "8px 10px" }}>
                <span style={{ fontSize: 14, marginTop: 1 }}>{i.neg ? "🔴" : "🟢"}</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: i.neg ? "#ef4444" : "#22c55e" }}>{i.label}</div>
                  <div style={{ fontSize: 10, color: "#5a6382" }}>{i.detail}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, background: "#1f1215", borderRadius: 8, padding: 10 }}>
            <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 600 }}>Key Support Levels to Watch:</div>
            <div style={{ fontSize: 11, color: "#8892b0", marginTop: 4 }}>
              $80K → $76K (April 2025 low) → $70K → worst case $56K (realized price / true bottom)
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle icon="🏢">Saylor Margin Call — Terima atau Tolak?</SectionTitle>
        <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.7 }}>
          <p style={{ marginTop: 0 }}><strong style={{ color: "#22c55e" }}>Short answer: Saylor WON'T margin call. Ketakutan ini adalah FUD.</strong></p>
          <ul style={{ paddingLeft: 18, margin: "8px 0" }}>
            <li style={{ marginBottom: 5 }}>Strategy punya <strong>712,647 BTC yang unencumbered</strong> (tidak dijadikan collateral)</li>
            <li style={{ marginBottom: 5 }}>Debt-nya adalah <strong>convertible notes</strong> yang mature 2027–2032 — bukan traditional margin loan</li>
            <li style={{ marginBottom: 5 }}>BTC briefly dipped below average cost ($76,037), tapi <strong>ini cuma paper loss</strong></li>
            <li style={{ marginBottom: 5 }}>Real risk: bukan margin call, tapi <strong>MSCI index exclusion</strong> yang bisa trigger $2.8–$11.6B forced passive selling dari ETFs yang track MSCI</li>
          </ul>
          <div style={{ background: "#0f1f14", borderRadius: 8, padding: 10, marginTop: 8 }}>
            <div style={{ fontSize: 11, color: "#22c55e", fontWeight: 600 }}>Bottom line: Saylor fine. Tapi MSCI exclusion bisa jadi indirect headwind untuk BTC.</div>
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle icon="🚫">CZ Selling BTC?</SectionTitle>
        <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.7 }}>
          <p style={{ marginTop: 0 }}><strong style={{ color: "#22c55e" }}>CZ is NOT selling. Opposite — dia bullish.</strong></p>
          <p>Di Davos (23 Jan 2026), CZ bilang di CNBC: "I have very strong feelings it will probably be a supercycle in 2026 for Bitcoin." Dia confirmed dia <strong>holds BTC long-term</strong> dan doesn't trade actively.</p>
          <p>CZ dipardoned oleh Trump di October 2025 setelah serving 4 months prison. Net worth sekarang ~$88B. Dia advising ~12 governments on crypto regulation.</p>
        </div>
      </Card>
    </>
  );
}

function GoldOutlook() {
  return (
    <>
      <Card>
        <SectionTitle icon="🥇">Gold 2026 — Bear Market atau Rally?</SectionTitle>
        <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.7 }}>
          <p style={{ marginTop: 0 }}><strong style={{ color: "#22c55e" }}>Majority of major institutions: BULLISH untuk gold 2026.</strong> Tapi dengan caveat penting.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 }}>
            {[
              { inst: "J.P. Morgan", target: "$5,055/oz", timeframe: "Q4 2026" },
              { inst: "Goldman Sachs", target: "$4,900/oz", timeframe: "End 2026" },
              { inst: "Morgan Stanley", target: "$4,800/oz", timeframe: "Q4 2026" },
              { inst: "Yardeni Research", target: "$6,000/oz", timeframe: "2026" },
              { inst: "Deutsche Bank", target: "$4,950/oz", timeframe: "High case" },
              { inst: "HSBC", target: "$5,000/oz", timeframe: "H1 2026" },
            ].map((i, idx) => (
              <div key={idx} style={{ background: "#151924", borderRadius: 6, padding: "8px 10px" }}>
                <div style={{ fontSize: 10, color: "#5a6382" }}>{i.inst}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#eab308" }}>{i.target}</div>
                <div style={{ fontSize: 9, color: "#5a6382" }}>{i.timeframe}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle icon="📊">Why Institutions Still Bullish</SectionTitle>
        <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.7 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { title: "Central Bank Buying", detail: "J.P. Morgan expects 585 tonnes/quarter demand in 2026. Structural trend masih intact.", pos: true },
              { title: "Weak Dollar Structural", detail: "Trump deliberately weakening USD. Dollar index down 2%+ YTD. Ini supports gold long-term.", pos: true },
              { title: "Geopolitical Risks", detail: "Iran tensions, tariff wars, govt shutdown — uncertainty = gold safe haven demand.", pos: true },
              { title: "Fed Easing Cycle", detail: "QT ended Dec 2025. Lower real yields = lower opportunity cost of holding gold.", pos: true },
              { title: "But: Parabolic Move Needs Rest", detail: "Gold up 60%+ in 2025. Consolidation $4,000–$4,500 is most likely base case (50% probability).", pos: false },
            ].map((i, idx) => (
              <div key={idx} style={{ display: "flex", gap: 8, alignItems: "flex-start", background: "#151924", borderRadius: 6, padding: "8px 10px" }}>
                <span style={{ fontSize: 12, marginTop: 1 }}>{i.pos ? "🟢" : "🟡"}</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: i.pos ? "#22c55e" : "#eab308" }}>{i.title}</div>
                  <div style={{ fontSize: 10, color: "#5a6382" }}>{i.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle icon="🎯">Gold in IDR — Your Actual Situation</SectionTitle>
        <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.7 }}>
          <div style={{ background: "#151924", borderRadius: 8, padding: 12, marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: "#5a6382" }}>Current gold price (Treasury)</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>Rp 2,753,908/g</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: "#5a6382" }}>Your avg buy price</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>Rp 2,558,682/g</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: "#5a6382" }}>Cushion above avg</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#22c55e" }}>+Rp 195,226/g (+7.6%)</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, color: "#5a6382" }}>Bear case floor (IDR)</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#eab308" }}>~Rp 2,400,000/g</span>
            </div>
          </div>
          <p style={{ fontSize: 11, color: "#8892b0", marginTop: 8 }}>
            Gold turun dari peak Rp 3.147M ke Rp 2.754M = koreksi 12.5%. Ini masih HEALTHY correction setelah 60%+ rally. 
            Prediksi Rp 5M/g = $6,000/oz scenario yang possible tapi <strong>bukan base case.</strong> 
            Base case (J.P. Morgan): Gold end-2026 di $5,055/oz = <strong>~Rp 3.2M–3.5M/g</strong> tergantung kurs USD/IDR.
          </p>
        </div>
      </Card>
    </>
  );
}

function Strategy() {
  return (
    <>
      <Card style={{ border: "1px solid #1a2a1a", background: "#111a15" }}>
        <SectionTitle icon="🎯">HONEST ASSESSMENT: Invest 600K/bulan?</SectionTitle>
        <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.7 }}>
          <p style={{ marginTop: 0, color: "#ef4444", fontWeight: 600 }}>
            ❌ THIS IS NOT FEASIBLE WITH CURRENT CASHFLOW. Here's why:
          </p>
          <div style={{ background: "#1f1215", borderRadius: 8, padding: 12, marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#ef4444", marginBottom: 8 }}>Monthly Math (Brutal):</div>
            {[
              { label: "Gaji", val: "Rp 1,500,000", color: "#22c55e" },
              { label: "Kiriman ortu (est.)", val: "+Rp 250,000", color: "#22c55e" },
              { label: "Total Income", val: "Rp 1,750,000", color: "#22c55e", bold: true },
              { label: "---", val: "", color: "transparent" },
              { label: "Kos", val: "-Rp 425,000", color: "#ef4444" },
              { label: "Apple Music", val: "-Rp 60,000", color: "#ef4444" },
              { label: "Google One", val: "-Rp 17,000", color: "#ef4444" },
              { label: "Living (sabun, telur, gas, makan)", val: "-Rp 400,000", color: "#ef4444" },
              { label: "Total Fixed Expenses", val: "-Rp 902,000", color: "#ef4444", bold: true },
              { label: "---", val: "", color: "transparent" },
              { label: "REMAINING", val: "Rp 848,000", color: "#eab308", bold: true },
            ].map((i, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", borderTop: i.bold ? "1px solid #2a2a2a" : "none" }}>
                <span style={{ fontSize: 10, color: "#8892b0" }}>{i.label}</span>
                <span style={{ fontSize: 10, color: i.color, fontWeight: i.bold ? 600 : 400 }}>{i.val}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "#1f1215", borderRadius: 8, padding: 10 }}>
            <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 600 }}>Rp 848K remaining — tapi:</div>
            <div style={{ fontSize: 10, color: "#8892b0", marginTop: 4 }}>
              • Living estimate Rp 400K itu MINIMUM dan sering tidak cukup<br/>
              • Belum termasuk transport, snacks, unforeseeable expenses<br/>
              • Kalau invest 600K → sisa untuk hidup cuma ~250K = STARVATION territory<br/>
              • Emergency fund kamu Rp 1M — ini SANGAT TIPIS untuk intern
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle icon="✅">Strategi Yang ACTUALLY Feasible</SectionTitle>
        <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.7 }}>
          <div style={{ background: "#0f1525", borderRadius: 8, padding: 12, marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#3b82f6", marginBottom: 6 }}>Phase 1: Stabilize First (Feb–Mar)</div>
            <div style={{ fontSize: 11, color: "#8892b0", lineHeight: 1.6 }}>
              <strong style={{ color: "#fff" }}>STOP investing untuk 1–2 bulan.</strong> Dengan cashflow yang ketat ini, priority pertama adalah:
            </div>
            <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                "Rebuild emergency fund ke minimum Rp 2M (1 bulan living expenses)",
                "Track ACTUAL spending di web tracker kamu — bukan estimate",
                "Cari ways to cut: cancel Google One kalau bisa (Rp 17K/bulan kecil tapi mindset)",
                "Negotiate with parents: minta allowance lebih consistent"
              ].map((t, i) => (
                <div key={i} style={{ fontSize: 10, color: "#8892b0", display: "flex", gap: 6, alignItems: "flex-start" }}>
                  <span style={{ color: "#3b82f6" }}>→</span> {t}
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#0f1f14", borderRadius: 8, padding: 12, marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#22c55e", marginBottom: 6 }}>Phase 2: Smart Small Invest (Apr–Jun)</div>
            <div style={{ fontSize: 11, color: "#8892b0", lineHeight: 1.6 }}>
              Kalau cashflow sudah stable dan emergency fund ≥ Rp 2M:
            </div>
            <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                "Invest MAXIMUM Rp 200–300K/bulan (bukan 600K)",
                "Split: 150K gold (DCA), 50–150K BTC (kalau ada dip ke level bagus)",
                "Ini bukan tentang jumlah besar — ini tentang CONSISTENCY",
                "Rp 200K/bulan × 12 bulan = Rp 2.4M/tahun = meaningful growth"
              ].map((t, i) => (
                <div key={i} style={{ fontSize: 10, color: "#8892b0", display: "flex", gap: 6, alignItems: "flex-start" }}>
                  <span style={{ color: "#22c55e" }}>→</span> {t}
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#151924", borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#eab308", marginBottom: 6 }}>Phase 3: When Salary Grows</div>
            <div style={{ fontSize: 11, color: "#8892b0", lineHeight: 1.6 }}>
              Kamu intern di big data company — kalau kamu bagus, salary AKAN naik. Pada saat itu increase investment allocation.
              Rule of thumb: invest max 20–30% of income.
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle icon="🔄">Asset Allocation Recommendation</SectionTitle>
        <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.7 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { asset: "Gold (Antam)", action: "HOLD", reason: "Satu-satunya aset yang profit. Long-term bullish thesis intact. Don't sell.", color: "#22c55e" },
              { asset: "BTC", action: "HOLD, NO ADD", reason: "Bear market territory. Cashflow ketat. Jangan add sampai: (1) cashflow stable, (2) BTC confim bottom, (3) emergency fund ≥ 2M.", color: "#eab308" },
              { asset: "MSFT", action: "HOLD (PASRAH OK)", reason: "Only Rp 220K — too small untuk stress about. Microsoft fundamentals still strong. This is long-term play.", color: "#3b82f6" },
            ].map((i, idx) => (
              <div key={idx} style={{ background: "#151924", borderRadius: 8, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{i.asset}</span>
                  <Badge color={i.color === "#22c55e" ? "green" : i.color === "#eab308" ? "yellow" : "blue"}>{i.action}</Badge>
                </div>
                <div style={{ fontSize: 10, color: "#8892b0" }}>{i.reason}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card style={{ border: "1px solid #2a1a1a", background: "#1a1115" }}>
        <SectionTitle icon="⚠️">Warsh as Fed Chair — Impact on Your Portfolio</SectionTitle>
        <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.7 }}>
          <p style={{ marginTop: 0 }}>
            Warsh udah confirmed sebagai nominee (95% Polymarket). Ini <strong style={{ color: "#ef4444" }}>bearish short-term</strong> untuk risk assets tapi complex long-term:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { label: "BTC", impact: "Bearish short-term", detail: "Higher real rates = less demand for risk assets. Tapi kalau Warsh's hawkishness breaks financial system foundations, BTC bisa paradoxically benefit sebagai non-correlated asset.", color: "#ef4444" },
              { label: "Gold", impact: "Mixed", detail: "Short-term: higher rates = bearish. Long-term: if Fed independence breaks → inflation risk → mega bullish for gold.", color: "#eab308" },
              { label: "MSFT", impact: "Bearish", detail: "Higher real rates hurt growth stocks paling banyak. Tapi MSFT fundamentals (Azure, AI) tetap strongest di tech.", color: "#ef4444" },
            ].map((i, idx) => (
              <div key={idx} style={{ background: "#151924", borderRadius: 8, padding: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>{i.label}</span>
                  <span style={{ fontSize: 10, color: i.color, fontWeight: 600 }}>{i.impact}</span>
                </div>
                <div style={{ fontSize: 10, color: "#5a6382" }}>{i.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </>
  );
}

function Cashflow() {
  return (
    <>
      <Card>
        <SectionTitle icon="📈">Your Web Tracker — What I See</SectionTitle>
        <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.7 }}>
          <p style={{ marginTop: 0 }}>
            Kamu bilang investasi dikategorikan sebagai "expense" di tracker — itu sebenarnya <strong style={{ color: "#eab308" }}>misleading</strong>. 
            Investasi bukan pengeluaran yang hilang, ini aset yang kamu build. Tapi untuk cashflow management, menghitung sebagai outflow itu fine.
          </p>
          <div style={{ background: "#151924", borderRadius: 8, padding: 12, marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#eab308", marginBottom: 6 }}>Observation dari data kamu:</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { text: "Net cashflow -Rp 906K this period — kamu spending lebih dari yang masuk", color: "#ef4444" },
                { text: "Expense (Rp 5.13M) > Income (Rp 4.23M) — ini sustainable HANYA kalau includes initial investments sebelum tracker", color: "#eab308" },
                { text: "Investasi Rp 2.38M = 46% of total expenses — shows kamu serious about investing", color: "#22c55e" },
                { text: "Cashflow trend chart shows balance declining — ini RED FLAG kalau terus", color: "#ef4444" },
              ].map((i, idx) => (
                <div key={idx} style={{ fontSize: 10, color: i.color, display: "flex", gap: 6, alignItems: "flex-start" }}>
                  <span>•</span> {i.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle icon="🛠️">Improve Your Tracker</SectionTitle>
        <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.7 }}>
          <p style={{ marginTop: 0 }}>
            Kamu udah bikin personal finance tracker — itu great initiative. Ini suggestions untuk bikin lebih useful:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { title: "Pisahkan Investasi dari Expenses", detail: "Buat kategori baru: 'Investment' — track separately. Ini bukan expense, ini asset building. Lihat NET WORTH bukan cuma cashflow." },
              { title: "Add 'Net Worth' Dashboard", detail: "Total liquid cash + portfolio value (Pluang + Gold) = total net worth. Track ini setiap minggu." },
              { title: "Track Emergency Fund %", detail: "Target: emergency fund ≥ 3 bulan living expenses. Sekarang kamu cuma punya ~1 bulan." },
              { title: "Budget Before Spending", detail: "Setiap awal bulan, allocate: Living → Emergency top-up → Investment (if any remaining). Bukan the other way around." },
            ].map((i, idx) => (
              <div key={idx} style={{ background: "#151924", borderRadius: 6, padding: "8px 10px" }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#3b82f6" }}>{i.title}</div>
                <div style={{ fontSize: 10, color: "#5a6382", marginTop: 2 }}>{i.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card style={{ border: "1px solid #1a2a1a", background: "#0d1a14" }}>
        <SectionTitle icon="💡">Final Brutal Advice</SectionTitle>
        <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.7 }}>
          <p style={{ marginTop: 0 }}>
            Kamu baru mulai invest di Oktober — itu <strong style={{ color: "#22c55e" }}>great</strong>. Tapi honestly:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ background: "#111827", borderRadius: 8, padding: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#22c55e" }}>✓ What you're doing RIGHT</div>
              <div style={{ fontSize: 10, color: "#8892b0", marginTop: 4 }}>
                Diversified across BTC, stocks, gold. Built your own finance tracker. Learning fast. Thinking critically about news (Epstein, Warsh, etc.)
              </div>
            </div>
            <div style={{ background: "#111827", borderRadius: 8, padding: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#ef4444" }}>✗ What needs to change IMMEDIATELY</div>
              <div style={{ fontSize: 10, color: "#8892b0", marginTop: 4 }}>
                • Emergency fund too low (Rp 1M as intern = 1 bulan max)<br/>
                • Investing money you might NEED to live on<br/>
                • 600K/bulan investment plan is impossible with current income<br/>
                • Cashflow negative — spending > income
              </div>
            </div>
            <div style={{ background: "#111827", borderRadius: 8, padding: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#3b82f6" }}>→ Priority order RIGHT NOW</div>
              <div style={{ fontSize: 10, color: "#8892b0", marginTop: 4 }}>
                1st: Stabilize cashflow — track EVERYTHING<br/>
                2nd: Rebuild emergency fund to Rp 2M minimum<br/>
                3rd: HOLD all current positions (don't panic sell)<br/>
                4th: Only invest when you have TRUE surplus after all above
              </div>
            </div>
          </div>
          <p style={{ fontSize: 10, color: "#5a6382", fontStyle: "italic", marginTop: 12 }}>
            Remember: The market will always give you another chance to buy. But you can't invest if you can't eat. Protect yourself first.
          </p>
        </div>
      </Card>
    </>
  );
}
