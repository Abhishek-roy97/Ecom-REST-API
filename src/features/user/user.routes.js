import express from 'express';
import UserController from './user.controller.js';
import jwtAuth from '../../middlewares/jwt.middleware.js'

const router = express.Router();

const userController = new UserController();

router.post('/signup',(req, res, next)=>{
    userController.signUp(req, res, next)
});

router.post('/signin',(req, res)=>{
    userController.signIn(req, res)
});
router.put('/resetPassword',jwtAuth ,(req, res)=>{
    userController.resetPassword(req, res)
});

router.get('/getall',userController.getAllUsers);

export default router;