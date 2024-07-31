import CartItemModel from "./cartItem.model.js";
import CartItemRepository from "./cartItem.repository.js";
export default class CartItemsController {

    constructor(){
        this.cartItemRepository = new CartItemRepository();
    }

    async add(req, res){
        try {
            const { productID, quantity } = req.body;
            const userID = req.userID;
            await this.cartItemRepository.add(productID, userID, quantity);
            res.status(201).send('Cart is updated');   
        } catch (error) {
            console.log(err);
            throw new ApplicationError("Something went wrong with db",500)
        }
        
    }
    async get(req, res){
        try{

            const userID = req.userID;
            const items = await this.cartItemRepository.get(userID);
            return res.status(200).send(items);
        }catch (error) {
            console.log(err);
            throw new ApplicationError("Something went wrong with db",500)
        }
    }
    async delete(req, res){
        const userID = req.userID;
        const cartItemID = req.params.id;
        const isDeleted = await this.cartItemRepository.delete(userID, cartItemID);
        if(!isDeleted){
            return res.status(404).send("Item not found");
        }else{
            return res.status(200).send('Item has been deleted');
        }
    }
    // update(req, res){
    //     const userID = req.userID;
    //     // const cartItemID = req.params.id;
    //     const quantity = req.query.quantity;
    //     const productID = req.query.productID;
    //     const error = CartItemModel.update(productID, userID, quantity);
    //     if(error){
    //         return res.status(404).send(error);
    //     }
    //     else{
    //         return res.status(200).send('Item has been updated');
    //     }
    // }
}