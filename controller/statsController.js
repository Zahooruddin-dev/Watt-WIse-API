import {
  getOverviewStats,
  getStatsByCategory,
  getStatsByBrand,
  getMostEfficientAppliances,
} from "../queries/queryStats.js";

export const overview = async (req, res) => {
  try {
    const stats = await getOverviewStats();
    return res.json({ data: stats });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const byCategory = async (req, res) => {
  try {
    const stats = await getStatsByCategory();
    return res.json({ data: stats });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const byBrand = async (req, res) => {
  try {
    const stats = await getStatsByBrand();
    return res.json({ data: stats });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const mostEfficient = async (req, res) => {
  try {
    const limit = req.query.limit ? Math.min(parseInt(req.query.limit), 50) : 10;
    const data = await getMostEfficientAppliances(limit);
    return res.json({ data });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};