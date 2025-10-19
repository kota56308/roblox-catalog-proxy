import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/search", async (req, res) => {
  const query = req.query.q || "";
  const limit = req.query.limit || 10;

  const url = `https://catalog.roblox.com/v1/search/items?category=All&keyword=${encodeURIComponent(query)}&limit=${limit}&includeNotForSale=true`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Proxy running on port ${port}`));
