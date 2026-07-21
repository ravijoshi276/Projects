import { useCart } from "./context/CartContext";
import { useState,useEffect } from "react";
import placeholder_image from "./assets/images/menuitem-placeholder.png"
import Section from "./Section";
import Heading from "./Heading";

const Cart= ()=>{
    const {cart,addToCart,removFromCart} = useCart();
   
    return(<div className="cart-page">
    <Heading>Cart</Heading>
    {cart.map((item)=>(<Card id={item.id} title= {item.title} price={item.price} quantity={item.quantity} unit_price={item.unit_price} key={item.id} addfunc={addToCart} deletefunc={removFromCart} />))}
    </div>);
}

const Card = ({id,title,image,price,unit_price,quantity,addfunc,deletefunc})=>{
    return (<Section sectionclass="cart-card">
        <div className="item-detils">
            <Heading> {title}</Heading>
            <p><span>Item price :</span> <span>{unit_price}</span></p>
            <p><span>quantity:</span> <button className="sub-cart" onClick={()=>deletefunc(id,unit_price,title)}>-</button><span>{quantity}</span><button className="add-cart" onClick={()=>addfunc(id,unit_price,title)}>+</button></p>
            <p><span>Total price :</span> <span>{price}</span></p>
            
            
        </div>
        <div className="image-cover">
            <img src={image?image:placeholder_image} alt={title} />
        </div>
    </Section>);
}

export default Cart;