import ProductModel from "../product/product.model.js";
import UserModel from "../user/user.model.js";

export default class CartItemModel{
    constructor(productID, userID, quantity, id){
        this.productID = productID;
        this.userID = userID;
        this.quantity = quantity;
        this.id = id;
    }
    static add(productID, userID, quantity){
        const product = ProductModel.getAll().find((p)=> p.id == productID);
        if(!product){
            return 'Product not found';
        }
        const user = UserModel.allUser().find((u)=> u.id == userID);
      if(!user){
        return 'User not found';
      }
        const cartItem = new CartItemModel(productID, userID, quantity);
        cartItem.id = cartItems.length + 1;
        cartItems.push(cartItem);
        return cartItem;
      // let newCartItem = new CartItemModel(userID, productID, quantity);
      // let newItemFlag = true;
      // for (let i = 0; i < cartItems.length; i++) {
      //   if (cartItems[i].userID == userID && cartItems[i].productID == productID) {
      //     cartItems[i].quantity += Number(quantity);
      //     newItemFlag = false;`
      //   }
      // }
      // if (newItemFlag) {
      //   cartItems.push(newCartItem);
      // }
      // return newCartItem;
    
    }
    static get(userID){
      return cartItems.filter((i)=>i.userID == userID);
    }
    static delete(cartItemID, userID){
      const cartItemIndex = cartItems.findIndex((i)=>i.id == cartItemID && i.userID == userID);
      if(cartItemIndex==-1){
        return 'Item not found';
      }else{
        cartItems.splice(cartItemIndex, 1);
      }
    }
    static update(productID, userID, quantity){
      
      const cartItemIndex = cartItems.findIndex((i)=>i.productID == productID && i.userID == userID);
      console.log(userID)
      if(cartItemIndex==-1){
        return 'Item not found';
      }else{
        cartItems[cartItemIndex]={...cartItems[cartItemIndex],
          quantity
        }
        console.log(cartItems[cartItemIndex]);
      }
      
    }
}

var cartItems = [
  new CartItemModel(1, 2, 1, 1),
  new CartItemModel(3, 1, 1, 1)
];