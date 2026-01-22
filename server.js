import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
const PORT = 3000;

const RUGPLAY_KEY = process.env.RUGPLAY_KEY;

app.get("/api/coin/:symbol", async (req, res) => {
  const { symbol } = req.params;
  const timeframe = req.query.timeframe || "1m";

  try {
    const response = await fetch(
      `https://rugplay.com/api/v1/coin/${symbol}?timeframe=${timeframe}`,
      {
        headers: {
          "Authorization": `Bearer ${RUGPLAY_KEY}`
        }
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Rugplay fetch failed" });
  }
});

app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});

app.get("/api/coin-image/:symbol", async (req, res) => {
  const { symbol } = req.params;
  const timeframe = req.query.timeframe || "1m";

  try {
    const response = await fetch(
      `https://rugplay.com/api/v1/coin/${symbol}?timeframe=${timeframe}`,
      {
        headers: {
          "Authorization": `Bearer ${RUGPLAY_KEY}`
        }
      }
    );

    const data = await response.json();
    const coin = data.coin;

    const price = coin.currentPrice;
    const change = coin.change24h.toFixed(2);
    const color = change >= 0 ? "#22c55e" : "#ef4444";

    // 🟣 Rugplay logo
    const rugplayLogoUrl = "https://rugplay.com/rugplay.svg";
    const rugplayLogo = await fetch(rugplayLogoUrl).then(r => r.text());

    // 🪙 Coin logo
    const coinLogoUrl = `https://rugplay.com/${coin.icon}`;
    const coinLogoBuffer = await fetch(coinLogoUrl).then(r => r.arrayBuffer());
    const coinLogoBase64 = Buffer.from(coinLogoBuffer).toString("base64");

    const svg = `
<svg width="520" height="140" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="coinClip">
      <circle cx="70" cy="70" r="22"/>
    </clipPath>
  </defs>

  <rect width="100%" height="100%" rx="14" fill="#0b1220"/>

  <!-- Rugplay logo -->
  <g transform="translate(20,20) scale(0.6)">
    ${rugplayLogo}
  </g>

  <!-- Coin logo -->
  <image 
    href="data:image/webp;base64,${coinLogoBase64}" 
    x="40" y="50" width="44" height="44" 
    clip-path="url(#coinClip)"
  />

  <!-- Text -->
  <text x="120" y="45" fill="white" font-size="20" font-family="monospace">
    ${coin.name} (${coin.symbol})
  </text>

  <text x="120" y="75" fill="#38bdf8" font-size="16" font-family="monospace">
    Price: ${price}
  </text>

  <text x="120" y="100" fill="${color}" font-size="16" font-family="monospace">
    24h: ${change}%
  </text>

  <!-- Rugplay badge -->
  <rect x="400" y="20" rx="6" ry="6" width="90" height="28" fill="#1f2937"/>
  <text x="415" y="40" fill="#facc15" font-size="14" font-family="monospace">
    RUGPLAY
  </text>
</svg>
`;

    res.setHeader("Content-Type", "image/svg+xml");
    res.send(svg);

  } catch (err) {
    console.error(err);
    res.status(500).send("SVG render failed");
  }
});
