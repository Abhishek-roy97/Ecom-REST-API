import express from 'express';

import  CartItemsController  from './cartItem.controller.js';

const router = express.Router();

const cartItemController = new CartItemsController();

router.get('/',(req, res)=>{
    cartItemController.get(req, res)
});
router.post('/', (req, res)=>{
    cartItemController.add(req, res)
});
router.delete('/:id',(req, res)=>{
    cartItemController.delete(req, res)
});
// router.put('/',(req, res)=>{
//     cartItemController.update(req, res)
// });

export default router;