import { body } from 'express-validator';

export const createCategoryValidation = [
	body('name')
		.trim()
		.notEmpty()
		.withMessage('Category name is required')
		.isLength({ max: 100 })
		.withMessage('Category name must be at most 100 characters'),
	body('slug')
		.trim()
		.notEmpty()
		.withMessage('Slug is required')
		.matches(/^[a-z0-9-]+$/)
		.withMessage(
			'Slug must contain only lowercase letters, numbers, and hyphens',
		),
	body('description')
		.optional()
		.trim()
		.isLength({ max: 500 })
		.withMessage('Description must be at most 500 characters'),
];

export const updateCategoryValidation = [
	body('name')
		.optional()
		.trim()
		.notEmpty()
		.withMessage('Category name cannot be empty')
		.isLength({ max: 100 })
		.withMessage('Category name must be at most 100 characters'),
	body('slug')
		.optional()
		.trim()
		.matches(/^[a-z0-9-]+$/)
		.withMessage(
			'Slug must contain only lowercase letters, numbers, and hyphens',
		),
	body('description')
		.optional()
		.trim()
		.isLength({ max: 500 })
		.withMessage('Description must be at most 500 characters'),
	body('is_active')
		.optional()
		.isBoolean()
		.withMessage('is_active must be a boolean'),
];
