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
