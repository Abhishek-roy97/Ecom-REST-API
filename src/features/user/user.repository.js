import { ApplicationError } from "../../error-handler/applicationError.js";
import { getDB } from "../../config/mongodb.js";
export default class UserRepository{

    constructor(){
        this.collection = "users"
    }

    async signUp(newUser){
        try {
            // Get the database
        const db = getDB();
        // Get the collection
        const collection = db.collection(this.collection);
        
        // Insert the document.
        await collection.insertOne(newUser);
        return newUser;
        } catch (err) {
            throw new ApplicationError("Something went wrong with database", 500);
        }
        
        
    }
    async signIn(email, password){
        try {
            // Get the database
        const db = getDB();
        // Get the collection
        const collection = db.collection(this.collection);
        
        // Find the document.
        return await collection.findOne({email, password});
        
        } catch (err) {
            throw new ApplicationError("Something went wrong with database", 500);
        }
        
        
    }
    async findByEmail(email){
        try {
            // Get the database
        const db = getDB();
        // Get the collection
        const collection = db.collection("users");
        
        // Find the document.
        return await collection.findOne({email});
        
        } catch (err) {
            throw new ApplicationError("Something went wrong with database", 500);
        }
        
        
    }
}

