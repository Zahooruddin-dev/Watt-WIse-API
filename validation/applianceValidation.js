import { body } from "express-validator";

export const createApplianceValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Appliance name is required")
    .isLength({ max: 200 })
    .withMessage("Name must be at most 200 characters"),
  body("slug")
    .trim()
    .notEmpty()
    .withMessage("Slug is required")
    .matches(/^[a-z0-9-]+$/)
    .withMessage("Slug must contain only lowercase letters, numbers, and hyphens"),
  body("brand_id")
    .notEmpty()
    .withMessage("Brand ID is required")
    .isInt({ min: 1 })
    .withMessage("Brand ID must be a positive integer"),
  body("category_id")
    .notEmpty()
    .withMessage("Category ID is required")
    .isInt({ min: 1 })
    .withMessage("Category ID must be a positive integer"),
  body("watts")
    .notEmpty()
    .withMessage("Watts is required")
    .isFloat({ min: 0.01 })
    .withMessage("Watts must be a positive number"),
  body("model")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Model must be at most 200 characters"),
  body("price_pkr")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),
  body("voltage")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Voltage must be a positive integer"),
  body("frequency_hz")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Frequency must be a positive integer"),
  body("is_inverter")
    .optional()
    .isBoolean()
    .withMessage("is_inverter must be a boolean"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must be at most 1000 characters"),
];

export const updateApplianceValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Appliance name cannot be empty")
    .isLength({ max: 200 })
    .withMessage("Name must be at most 200 characters"),
  body("slug")
    .optional()
    .trim()
    .matches(/^[a-z0-9-]+$/)
    .withMessage("Slug must contain only lowercase letters, numbers, and hyphens"),
  body("brand_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Brand ID must be a positive integer"),
  body("category_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Category ID must be a positive integer"),
  body("watts")
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage("Watts must be a positive number"),
  body("model")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Model must be at most 200 characters"),
  body("price_pkr")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),
  body("voltage")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Voltage must be a positive integer"),
  body("frequency_hz")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Frequency must be a positive integer"),
  body("is_inverter")
    .optional()
    .isBoolean()
    .withMessage("is_inverter must be a boolean"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must be at most 1000 characters"),
  body("is_active")
    .optional()
    .isBoolean()
    .withMessage("is_active must be a boolean"),
];