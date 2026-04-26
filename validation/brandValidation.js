import { body } from 'express-validator';

export const createBrandValidation = [
	body('name')
		.trim()
		.notEmpty()
		.withMessage('Brand name is required')
		.isLength({ max: 100 })
		.withMessage('Brand name must be at most 100 characters'),
	body('slug')
		.trim()
		.notEmpty()
		.withMessage('Slug is required')
		.matches(/^[a-z0-9-]+$/)
		.withMessage(
			'Slug must contain only lowercase letters, numbers, and hyphens',
		),
	body('origin_country')
		.optional()
		.trim()
		.isLength({ max: 100 })
		.withMessage('Country name must be at most 100 characters'),
	body('website')
		.optional()
		.trim()
		.isURL()
		.withMessage('Website must be a valid URL'),
];

export const updateBrandValidation = [
	body('name')
		.optional()
		.trim()
		.notEmpty()
		.withMessage('Brand name cannot be empty')
		.isLength({ max: 100 })
		.withMessage('Brand name must be at most 100 characters'),
	body('slug')
		.optional()
		.trim()
		.matches(/^[a-z0-9-]+$/)
		.withMessage(
			'Slug must contain only lowercase letters, numbers, and hyphens',
		),
	body('origin_country')
		.optional()
		.trim()
		.isLength({ max: 100 })
		.withMessage('Country name must be at most 100 characters'),
	body('website')
		.optional()
		.trim()
		.isURL()
		.withMessage('Website must be a valid URL'),
	body('is_active')
		.optional()
		.isBoolean()
		.withMessage('is_active must be a boolean'),
];
