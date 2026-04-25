import { validationResult } from "express-validator";
import {
  getAllBrands,
  getBrandById,
  getBrandBySlug,
  createBrand,
  updateBrand,
  deleteBrand,
  brandHasAppliances,
} from "../queries/brandQueries.js";

export const listBrands = async (req, res) => {
  try {
    const includeInactive = req.admin ? req.query.include_inactive === "true" : false;
    const brands = await getAllBrands(includeInactive);
    return res.json({ data: brands, total: brands.length });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = isNaN(id) ? await getBrandBySlug(id) : await getBrandById(id);
    if (!brand) return res.status(404).json({ error: "Brand not found" });
    return res.json({ data: brand });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const addBrand = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const existing = await getBrandBySlug(req.body.slug);
    if (existing) return res.status(409).json({ error: "A brand with this slug already exists" });

    const brand = await createBrand(req.body);
    return res.status(201).json({ data: brand });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const editBrand = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { id } = req.params;
    const existing = await getBrandById(id);
    if (!existing) return res.status(404).json({ error: "Brand not found" });

    if (req.body.slug && req.body.slug !== existing.slug) {
      const slugTaken = await getBrandBySlug(req.body.slug);
      if (slugTaken) return res.status(409).json({ error: "A brand with this slug already exists" });
    }

    const brand = await updateBrand(id, req.body);
    return res.json({ data: brand });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const removeBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await getBrandById(id);
    if (!existing) return res.status(404).json({ error: "Brand not found" });

    const hasAppliances = await brandHasAppliances(id);
    if (hasAppliances) return res.status(409).json({ error: "Cannot delete a brand that has appliances. Remove or reassign them first." });

    await deleteBrand(id);
    return res.json({ message: "Brand deleted successfully" });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};