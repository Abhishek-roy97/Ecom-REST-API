import express from 'express';
import UserController from './user.controller.js';

const router = express.Router();

const userController = new UserController();

router.post('/signup',(req, res)=>{
    userController.signUp(req, res)
});

router.post('/signin',(req, res)=>{
    userController.signIn(req, res)
});

router.get('/getall',userController.getAllUsers);

export default router;