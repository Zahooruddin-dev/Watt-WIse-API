import { validationResult } from "express-validator";
import {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  categoryHasAppliances,
} from "../queries/queryCategory.js";

export const listCategories = async (req, res) => {
  try {
    const includeInactive = req.admin ? req.query.include_inactive === "true" : false;
    const categories = await getAllCategories(includeInactive);
    return res.json({ data: categories, total: categories.length });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = isNaN(id) ? await getCategoryBySlug(id) : await getCategoryById(id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    return res.json({ data: category });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const addCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const existing = await getCategoryBySlug(req.body.slug);
    if (existing) return res.status(409).json({ error: "A category with this slug already exists" });

    const category = await createCategory(req.body);
    return res.status(201).json({ data: category });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const editCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { id } = req.params;
    const existing = await getCategoryById(id);
    if (!existing) return res.status(404).json({ error: "Category not found" });

    if (req.body.slug && req.body.slug !== existing.slug) {
      const slugTaken = await getCategoryBySlug(req.body.slug);
      if (slugTaken) return res.status(409).json({ error: "A category with this slug already exists" });
    }

    const category = await updateCategory(id, req.body);
    return res.json({ data: category });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const removeCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await getCategoryById(id);
    if (!existing) return res.status(404).json({ error: "Category not found" });

    const hasAppliances = await categoryHasAppliances(id);
    if (hasAppliances) return res.status(409).json({ error: "Cannot delete a category that has appliances. Remove or reassign them first." });

    await deleteCategory(id);
    return res.json({ message: "Category deleted successfully" });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};