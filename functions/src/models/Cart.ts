import { ObjectId } from "mongodb";

interface Cart {
    _id?: ObjectId;
    product: string;
    price: number;
    quantity: number
};

export default Cart;