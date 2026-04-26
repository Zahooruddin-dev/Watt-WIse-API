import { validationResult } from "express-validator";
import {
  getAppliances,
  getApplianceById,
  getApplianceBySlug,
  createAppliance,
  updateAppliance,
  deleteAppliance,
  slugExists,
} from "../queries/queryAppliance.js";
import { getBrandById } from "../queries/queryBrand.js";
import { getCategoryById } from "../queries/queryCategory.js";

export const listAppliances = async (req, res) => {
  try {
    const {
      category_id, brand_id, is_inverter,
      min_watts, max_watts, min_price, max_price,
      search, page, limit, sort_by, sort_order,
    } = req.query;

    const is_active = req.admin ? (req.query.is_active !== undefined ? req.query.is_active === "true" : undefined) : true;

    const result = await getAppliances({
      category_id: category_id ? parseInt(category_id) : undefined,
      brand_id: brand_id ? parseInt(brand_id) : undefined,
      is_inverter: is_inverter !== undefined ? is_inverter === "true" : undefined,
      min_watts: min_watts ? parseFloat(min_watts) : undefined,
      max_watts: max_watts ? parseFloat(max_watts) : undefined,
      min_price: min_price ? parseFloat(min_price) : undefined,
      max_price: max_price ? parseFloat(max_price) : undefined,
      search,
      is_active,
      page: page ? parseInt(page) : 1,
      limit: limit ? Math.min(parseInt(limit), 100) : 20,
      sort_by,
      sort_order,
    });

    return res.json(result);
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getAppliance = async (req, res) => {
  try {
    const { id } = req.params;
    const appliance = isNaN(id) ? await getApplianceBySlug(id) : await getApplianceById(id);
    if (!appliance) return res.status(404).json({ error: "Appliance not found" });
    return res.json({ data: appliance });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const addAppliance = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { brand_id, category_id, slug } = req.body;

    const brand = await getBrandById(brand_id);
    if (!brand) return res.status(404).json({ error: "Brand not found" });

    const category = await getCategoryById(category_id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    const exists = await slugExists(slug);
    if (exists) return res.status(409).json({ error: "An appliance with this slug already exists" });

    const appliance = await createAppliance(req.body);
    return res.status(201).json({ data: appliance });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const editAppliance = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { id } = req.params;
    const existing = await getApplianceById(id);
    if (!existing) return res.status(404).json({ error: "Appliance not found" });

    if (req.body.brand_id) {
      const brand = await getBrandById(req.body.brand_id);
      if (!brand) return res.status(404).json({ error: "Brand not found" });
    }

    if (req.body.category_id) {
      const category = await getCategoryById(req.body.category_id);
      if (!category) return res.status(404).json({ error: "Category not found" });
    }

    if (req.body.slug && req.body.slug !== existing.slug) {
      const taken = await slugExists(req.body.slug, parseInt(id));
      if (taken) return res.status(409).json({ error: "An appliance with this slug already exists" });
    }

    const appliance = await updateAppliance(id, req.body);
    return res.json({ data: appliance });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const removeAppliance = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await getApplianceById(id);
    if (!existing) return res.status(404).json({ error: "Appliance not found" });

    await deleteAppliance(id);
    return res.json({ message: "Appliance deleted successfully" });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};