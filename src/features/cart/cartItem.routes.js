import express from 'express';

import  CartItemsController  from './cartItem.controller.js';

const router = express.Router();

const cartItemController = new CartItemsController();

router.get('/',cartItemController.get);
router.post('/', cartItemController.add);
router.delete('/:id',cartItemController.delete);
router.put('/',cartItemController.update);

export default router;