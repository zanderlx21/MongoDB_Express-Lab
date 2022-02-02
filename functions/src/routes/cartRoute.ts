import express from 'express';
import Cart from '../models/Cart';
import { getClient } from '../db';
import { ObjectId } from 'mongodb';

const cartRoutes = express.Router();

cartRoutes.get('/cart-items', async (req, res) => {
//add maxPrice query params
//add product query param to search by product name
//add pageSize to limit the amount of objects returned from the list
    const client = await getClient();
    const results = await client.db().collection<Cart>('cartItems')
    .find().toArray();                              // this is where you are displaying the full array of data
    res.status(200).json(results);
});

cartRoutes.get('/cart-items/:id', async (req, res) => {
    const id = req.params.id;
    try{
        const client = await getClient();
        const results = await client.db().collection<Cart>('cartItems')
            .findOne({_id : new ObjectId(id) });  
        if (results) {
            res.status(200).json(results);
        } else {
            res.status(404).json({message: "Can't seem to find that one..."});
    }  
}   catch (error) {
        console.error("Error: ", error);
        res.status(500).json({message: "Internal Server Error, try again!"});
    }                   
        
    });

cartRoutes.post("/cart-items", async (req, res) => {
    const item = req.body as Cart;
    try{                                            
          const client = await getClient();
          await client.db().collection<Cart>("cartItems")
          .insertOne(item);                         // this is where you are adding the post "item"
          res.status(201).json(item);
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({message: "Internal Server Error - Post not created"});
  }  
  });

  cartRoutes.delete("/cart-items/:id", async (req, res) => {
    const id = req.params.id
    try{
          const client = await getClient();
          const result = await client.db().collection<Cart>("cartItems")
            .deleteOne({_id: new ObjectId(id)}); 
          if (result.deletedCount === 0) {
            res.status(404).json({ message: "Strange...nothing here"});
          } else {
              res.status(204).end();
            }
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({message: "Internal Server Error - Post not deleted"});
  }
  });

  cartRoutes.put("/cartItems/:id", async (req, res) => {
    const id = req.params.id;
    const data =  req.body as Cart;
    delete data._id;                                //This removes _id from body so we only have one
    try{
          const client = await getClient();
          const result = await client.db().collection<Cart>("cartItems")
          .replaceOne({_id: new ObjectId(id) }, data);  
          if (result.modifiedCount === 0)                    
          res.status(404).json({ message: "Strange...nothing here"});
    else {
        data._id = new ObjectId(id);
        res.json(data);
        }
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({message: "Internal Server Error - Post not deleted"});
  }
  });

export default cartRoutes;
