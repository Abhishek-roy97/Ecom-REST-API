import express from 'express';
import ProductController from './product.controller.js';
import { upload } from '../../middlewares/fileUpload.middleware.js';

const router = express.Router();

const productController = new ProductController();

router.get('/filter',productController.filterProducts);
router.get('/',productController.getAllProducts);
router.post('/',upload.single('imageUrl'),productController.addProduct);
router.get('/:id',productController.getOneProduct);
router.post('/rate',productController.rateProduct);


export default router;