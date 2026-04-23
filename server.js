const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const CACHE_TTL_MS = 5 * 60 * 1000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const marketplaces = JSON.parse(
  fs.readFileSync(path.join(__dirname, "marketplaces.json"), "utf-8")
);

const cache = {
  nearby: new Map(),
  livePrices: new Map()
};

function isCacheValid(entry) {
  return entry && Date.now() - entry.cachedAt < CACHE_TTL_MS;
}

function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

app.get("/api/config", (req, res) => {
  res.json({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "",
    cacheTtlMinutes: 5
  });
});

app.get("/nearby-markets", (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const radiusKm = Math.max(50, Math.min(100, Number(req.query.radiusKm) || 100));

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return res.status(400).json({
      status: "error",
      message: "lat and lng query params are required"
    });
  }

  const cacheKey = `${lat.toFixed(4)}:${lng.toFixed(4)}:${radiusKm}`;
  const cached = cache.nearby.get(cacheKey);
  if (isCacheValid(cached)) {
    return res.json({ ...cached.payload, source: "cache" });
  }

  const ranked = marketplaces
    .map((market) => ({
      ...market,
      distanceKm: Number(
        haversineDistanceKm(lat, lng, market.lat, market.lng).toFixed(2)
      )
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);

  const nearby = ranked.filter((item) => item.distanceKm <= radiusKm);
  const payload = {
    status: "ok",
    radiusKm,
    total: nearby.length,
    markets: nearby,
    generatedAt: new Date().toISOString()
  };

  cache.nearby.set(cacheKey, {
    cachedAt: Date.now(),
    payload
  });

  return res.json({ ...payload, source: "fresh" });
});

const fallbackPriceData = [
  { crop: "Wheat", minPrice: 2200, maxPrice: 2480, modalPrice: 2360 },
  { crop: "Rice", minPrice: 2050, maxPrice: 2450, modalPrice: 2285 },
  { crop: "Maize", minPrice: 1980, maxPrice: 2310, modalPrice: 2140 },
  { crop: "Onion", minPrice: 1600, maxPrice: 2600, modalPrice: 2100 },
  { crop: "Potato", minPrice: 1100, maxPrice: 1800, modalPrice: 1450 },
  { crop: "Cotton", minPrice: 6200, maxPrice: 7100, modalPrice: 6650 },
  { crop: "Soybean", minPrice: 4300, maxPrice: 4900, modalPrice: 4620 },
  { crop: "Turmeric", minPrice: 13500, maxPrice: 16500, modalPrice: 14900 }
];

async function fetchAgmarknetData(marketName, crops) {
  const apiKey = process.env.AGMARKNET_API_KEY;
  if (!apiKey) {
    throw new Error("AGMARKNET_API_KEY missing");
  }

  // data.gov.in Agmarknet resource (typical public dataset endpoint pattern)
  const resourceId = "9ef84268-d588-465a-a308-a864a43d0070";
  const response = await axios.get("https://api.data.gov.in/resource/" + resourceId, {
    params: {
      "api-key": apiKey,
      format: "json",
      limit: 50
    },
    timeout: 10000
  });

  const records = Array.isArray(response.data?.records) ? response.data.records : [];
  const lowerMarket = marketName.toLowerCase();
  const cropSet = new Set(crops.map((c) => c.toLowerCase()));

  const mapped = records
    .filter((r) => {
      const market = String(r.market || "").toLowerCase();
      const commodity = String(r.commodity || "").toLowerCase();
      return market.includes(lowerMarket) || cropSet.has(commodity);
    })
    .slice(0, 10)
    .map((r) => ({
      crop: r.commodity || "Unknown",
      price: Number(r.modal_price || r.max_price || r.min_price || 0),
      updatedAt: r.arrival_date || new Date().toISOString()
    }));

  if (mapped.length === 0) {
    throw new Error("No matching Agmarknet records");
  }
  return mapped;
}

app.get("/live-prices", async (req, res) => {
  const marketId = req.query.marketId;
  if (!marketId) {
    return res.status(400).json({ status: "error", message: "marketId is required" });
  }

  const market = marketplaces.find((m) => m.id === marketId);
  if (!market) {
    return res.status(404).json({ status: "error", message: "Market not found" });
  }

  const cached = cache.livePrices.get(marketId);
  if (isCacheValid(cached)) {
    return res.json({ ...cached.payload, source: "cache" });
  }

  const fallbackPayload = {
    status: "ok",
    marketId: market.id,
    marketName: market.name,
    prices: fallbackPriceData
      .filter((p) =>
        market.cropsTraded.some((crop) =>
          crop.toLowerCase().includes(p.crop.toLowerCase()) ||
          p.crop.toLowerCase().includes(crop.toLowerCase())
        )
      )
      .slice(0, 6)
      .map((item) => ({
        crop: item.crop,
        price: item.modalPrice,
        updatedAt: new Date().toISOString()
      })),
    generatedAt: new Date().toISOString()
  };

  try {
    const agmarknet = await fetchAgmarknetData(market.name, market.cropsTraded);
    const payload = {
      status: "ok",
      marketId: market.id,
      marketName: market.name,
      prices: agmarknet,
      generatedAt: new Date().toISOString()
    };
    cache.livePrices.set(marketId, { cachedAt: Date.now(), payload });
    return res.json({ ...payload, source: "fresh" });
  } catch (error) {
    if (cached) {
      return res.json({
        ...cached.payload,
        source: "stale-cache",
        warning: "Agmarknet fetch failed; serving last cached data."
      });
    }
    cache.livePrices.set(marketId, { cachedAt: Date.now(), payload: fallbackPayload });
    return res.json({
      ...fallbackPayload,
      source: "fallback",
      warning: "Agmarknet fetch unavailable; serving fallback dataset."
    });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Farm AI server running at http://localhost:${PORT}`);
});
