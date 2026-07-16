import { useCart } from "./context/CartContext";
import { useState,useEffect } from "react";

const Cart= ()=>{
    const {cart,addToCart,removFromCart} = useCart();
   
    return(<>
    {cart.map((item)=>(<Card id={item.id} title= {item.title} price={item.price} quantity={item.quantity} unit_price={item.unit_price} key={item.id} addfunc={addToCart} deletefunc={removFromCart} />))}
    </>);
}

const Card = ({id,title,image,price,unit_price,quantity,addfunc,deletefunc})=>{
    return (<div>
        <h3>title : {title}</h3>
        <p>Item price : {unit_price}</p>
        <p>quantity: {quantity}</p>
        <p>price : {price}</p>
        <button className="add-cart" onClick={()=>addfunc(id,unit_price,title)}>+</button>
        <button className="sub-cart" onClick={()=>deletefunc(id,unit_price,title)}>-</button>
    </div>);
}

export default Cart;