import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";
import { ApplicationError } from "../../error-handler/applicationError.js";



export default class ProductController{
    constructor(){
        this.productRepository = new ProductRepository();
    }
    async getAllProducts(req, res){
        try {
            const products = await this.productRepository.getAll();
            res.status(200).send(products);  
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with db",500) 
        }
        
    }
    async addProduct(req, res){
        try {
            const {name, price,desc, sizes, categories } = req.body;
        
        const newProduct = new ProductModel(
            name,
            desc,
             parseFloat(price),
             req?.file?.filename,
             categories,
             sizes?.split(','),
        );
        const createdRecord = await this.productRepository.add(newProduct);
        res.status(201).send(createdRecord);
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with db",500)
        }
        
    }
    async rateProduct(req, res){
        try {
            const userID = req.userID;
        const productID = req.body.productID;
        const rating = req.body.rating;
        
        const rateProduct = await this.productRepository.rate(userID, productID, rating);
       
        return res.status(200).send('Rating has been added');
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with db",500) 
        }
        
    }
    async getOneProduct(req, res){
        try {
            const id = req.params.id;
            const product = await this.productRepository.get(id);
            if(!product){
                res.status(404).send('Product not found ');
            }else{
                return res.status(200).send(product);
            }  
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with db",500) 
        }
        
    }
    async filterProducts(req, res){
       try {
        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;
        const category = req.query.category;
        const result = await this.productRepository.filter(minPrice, maxPrice, category);
        // console.log(result)
        res.status(200).send(result);
       } catch (err) {
        console.log(err);
            throw new ApplicationError("Something went wrong with db",500) 
       }
    }
    async averagePrice(req, res, next){
        try {
            const result = await this.productRepository.averageProductPricePerCategory();
            res.status(200).send(result);
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with db",500)   
        }
    }
};