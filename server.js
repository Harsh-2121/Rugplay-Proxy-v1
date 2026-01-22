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

    const svg = `
<svg width="420" height="120" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" rx="12" fill="#0f172a"/>
  <text x="20" y="35" fill="white" font-size="20" font-family="monospace">
    ${coin.name} (${coin.symbol})
  </text>
  <text x="20" y="70" fill="#38bdf8" font-size="16" font-family="monospace">
    Price: ${price}
  </text>
  <text x="20" y="95" fill="${color}" font-size="16" font-family="monospace">
    24h: ${change}%
  </text>
</svg>
`;

    res.setHeader("Content-Type", "image/svg+xml");
    res.send(svg);

  } catch (err) {
    res.status(500).send("SVG render failed");
  }
});
