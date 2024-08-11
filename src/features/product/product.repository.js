import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import { categorySchema } from "./category.schema.js"

const ProductModel = mongoose.model('Product', productSchema);
const ReviewModel = mongoose.model('Review', reviewSchema);
const CategoryModel = mongoose.model('Category', categorySchema);

export default class ProductRepository{

    constructor(){
        this.collection = "products"
    }

    async add(productData){
        try {
            //Add the product
            productData.categories=productData.category.split(',').map(e=> e.trim());
            console.log(productData);
            const newProduct = new ProductModel(productData);
            const saveProduct = await newProduct.save();

            //Update the categories
            await CategoryModel.updateMany(
                {_id: {$in: productData.categories}},
                {$push: {products: new ObjectId(saveProduct._id)}}
            );
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with db",500)
        }
    }

    async getAll(){
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            const products = await collection.find().toArray();
            console.log(products);
            return products;
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with db",500)
        }

    }

    async get(id) {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            return await collection.findOne({_id: new ObjectId(id)});
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with db",500)
        }
    }
    async filter(minPrice, maxPrice, category){
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            let filterExpression={};
            if(minPrice){
                filterExpression.price = {$gte: parseFloat(minPrice)}
            }
            if(maxPrice){
                filterExpression.price = {...filterExpression.price, $lte: parseFloat(maxPrice)}
            }
            if(category){
                filterExpression.category = category
            }
            return collection.find(filterExpression).toArray();
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with db",500)
        
        }
    }
    // async rate(userID, productID, rating){
    //     try {
    //         const db = getDB();
    //         const collection = db.collection(this.collection);
    //         //Find the product
    //         const product = await collection.findOne({_id:new ObjectId(productID)});
    //         //Find the rating
    //         const userRating = product?.ratings?.find(r=> r.userID==userID);
    //         if(userRating){
    //             //Update the rating
    //             await collection.updateOne({
    //                 _id:new ObjectId(productID), "ratings.userID": new ObjectId(userID)
    //             },{
    //                 $set:{
    //                     "ratings.$.rating":rating
    //                 }
    //             })
    //         }else{

    //             await collection.updateOne({
    //                 _id: new ObjectId(productID)
    //             },{
    //                 $push:{ratings:{userID:new ObjectId(userID), rating}}
    //             }) 
    //         }
    //     } catch (err) {
    //         console.log(err);
    //         throw new ApplicationError("Something went wrong with db",500) 
    //     }
    // }
    async rate(userID, productID, rating){
        try {
            // Check if Product exist
            const product = await ProductModel.findById(productID);
            if(!product){
                throw new Error("Product not found");
            }
            // Get the existing review
            const userReview = await ReviewModel.findOne({product: new ObjectId(productID), user: new ObjectId(userID)});
            if(userReview){
                userReview.rating=rating;
                await userReview.save();
            }else{
                const newReview = new ReviewModel({
                    product: new ObjectId(productID), 
                    user: new ObjectId(userID),
                    rating: rating  
                })
                newReview.save();
            }
            
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with db",500) 
        }
    }
    async averageProductPricePerCategory(){
        try {
           const db = getDB();
           return await db.collection(this.collection).aggregate([
            {
                $group:{
                    _id:"$category",
                    averagePrice:{$avg:"$price"}
                }
            }
           ]).toArray();
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with db",500)   
        }
    }
}