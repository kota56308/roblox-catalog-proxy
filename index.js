import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

// --------------------
// Simple in-memory cache
// --------------------
const cache = {};

// Allowed limits for Roblox Catalog API
const ALLOWED_LIMITS = [10, 28, 30, 50, 60, 100, 120];

// --------------------
// Root route (friendly)
// --------------------
app.get("/", (req, res) => {
  res.send("Roblox Catalog Proxy is running ✅ Use /search?q=keyword&limit=10");
});

// --------------------
// Search route
// --------------------
app.get("/search", async (req, res) => {
  const query = req.query.q || "";
  let limit = parseInt(req.query.limit) || 10;

  // Clamp limit to allowed values
  if (!ALLOWED_LIMITS.includes(limit)) {
    limit = 10;
  }

  const cacheKey = `${query}-${limit}`;

  // Return cached result if fresh
  if (cache[cacheKey] && (Date.now() - cache[cacheKey].time < 30000)) {
    return res.json(cache[cacheKey].data);
  }

  const url = `https://catalog.roblox.com/v1/search/items?category=All&keyword=${encodeURIComponent(query)}&limit=${limit}&includeNotForSale=true`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Save to cache
    cache[cacheKey] = {
      data,
      time: Date.now()
    };

    res.json(data);
  } catch (err) {
    console.error("Error fetching from Roblox catalog:", err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------
// Start server
// --------------------
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Proxy running on port ${port}`));
