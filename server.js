import "./env.js"
import express from 'express';
import swagger from 'swagger-ui-express';
import cors from 'cors';

import bodyParser from 'body-parser';
import OrderRouter from './src/features/order/order.routes.js'
import ProductRouter from './src/features/product/product.routes.js';
import UserRouter from './src/features/user/user.routes.js';
import CartRouter from './src/features/cart/cartItem.routes.js';
import likeRouter from "./src/features/like/like.routes.js";
import basicAuthorizer from './src/middlewares/basicAuth.middleware.js';
import jwtAuth from './src/middlewares/jwt.middleware.js';

import apiDocs from './swagger.json' assert {type:'json'};
import loggerMiddleware from './src/middlewares/logger.middleware.js';
import { logger } from './src/middlewares/logger.middleware.js';
import { ApplicationError } from './src/error-handler/applicationError.js';
import { connectToMongoDB } from './src/config/mongodb.js';
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";
import mongoose from "mongoose";

const server = express();

// load all the enviroment variables in application


//CORS policy configuration
var corsOptions = {
    origin:'http://localhost:5500'
}
server.use(cors(corsOptions));
// server.use((req, res, next)=>{
//     res.header('Access-Control-Allow-Origin','*') //" * "means give access to all web browser clients.If not " * " then it would be like 'localhost:5500'
//     res.header('Access-Control-Allow-Headers','*');
//     res.header('Access-Control-Allow-Methods','*');
//     //return ok for preflight request.
//     if(req.method=="OPTIONS"){
//         return res.sendStatus(200);
//     }
//     next();
// })

server.use(bodyParser.json())

server.use('/api-docs', swagger.serve, swagger.setup(apiDocs));

server.use(loggerMiddleware);

server.use("/api/orders",jwtAuth, OrderRouter)
server.use("/api/products",jwtAuth, ProductRouter);
server.use('/api/user', UserRouter);
server.use('/api/cartItems',jwtAuth, CartRouter);
server.use('/api/likes', jwtAuth, likeRouter);

server.get('/', (req, res)=>{
    res.send('Welcom to Ecom API');
})
// Error handler middleware
server.use((err, req, res, next)=>{
    console.log(err);
    if(err instanceof mongoose.Error.ValidationError){
        res.status(400).send(err.message);
    }
    if(err instanceof ApplicationError){
        res.status(err.code).send(err.message);
    }
    const logData = `${err} - ${req.url} - ${JSON.stringify(req.body)}`
    logger.info(logData)
    res.status(500).send('Something went wrong, please try later');
});
// Middleware to handle 404 request.
server.use((req, res)=>{
    res.status(404).send('API not found.Please check our documentation for more information at localhost:3200/api-docs ')
})

server.listen(3200, ()=>{
    console.log('Server is running at 3200');
    // connectToMongoDB();
    connectUsingMongoose();
})