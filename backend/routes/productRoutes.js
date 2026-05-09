const express = require('express');
const { body } = require('express-validator');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const productValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be 10-1000 characters'),
  body('imageUrl').optional().isURL().withMessage('Please provide a valid image URL'),
];

router.route('/')
  .get(getProducts)
  .post(protect, productValidation, createProduct);

router.route('/:id')
  .get(getProduct)
  .put(protect, productValidation, updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;
