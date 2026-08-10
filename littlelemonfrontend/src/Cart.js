import { useCart } from "./context/CartContext";
import { useState } from "react";
import placeholder_image from "./assets/images/menuitem-placeholder.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrashCan}  from '@fortawesome/free-solid-svg-icons'
import Section from "./Section";
import Heading from "./Heading";

const Cart= ()=>{
    const {cart,addToCart,removeFromCart,total,deleteFromCart,orderItems} = useCart();
    const [isSubmitted,setIsSubmitted]= useState(false);
    const handleOrders =()=>{
        try {
            orderItems();
            setIsSubmitted(true)
            setTimeout(()=>{
                setIsSubmitted(false);
            },5000);
        }catch(err){
            isSubmitted(false);
        }
        
    }
    return(<main className="cart-page">
    <Heading>Cart</Heading>
    {isSubmitted?<div className={isSubmitted?`alert success submitted`:""}>Order Sucessful</div>:""}
    {cart.length?(<>{cart.map((item)=>(<Card id={item.id} title= {item.title} price={item.price} quantity={item.quantity} unit_price={item.unit_price} key={item.id} addfunc={addToCart} deletefunc={deleteFromCart} removefunc={removeFromCart} image={item.image_url}/>))}
    <div className='total'>Grand Total: {parseFloat(total).toFixed(2)}</div>
    <div className="btn-cover"><button className="order-btn" onClick={handleOrders}>Order Now</button></div></>):<div className="empty-result">No items in cart</div>}
    </main>);
}

const Card = ({id,title,image,price,unit_price,quantity,addfunc,deletefunc,removefunc})=>{
    const handleRemove = ()=>{
        removefunc(id,unit_price,title);
    }
    return (<Section sectionclass="cart-card">
        <div className='trash-btn-cover'>
        <button className='trash' onClick={()=>deletefunc(id)}><FontAwesomeIcon icon={faTrashCan} size='lg' className="trashcan" /></button> 
        </div>
        <div className="item-details">
            <Heading> {title}</Heading>
            <div><span>Item Price :</span> <span>{unit_price}</span></div>
            <div><span>Quantity:</span> <div className="quantity-group"><button className="sub-cart" onClick={handleRemove}>-</button><span className="quantity">{quantity}</span><button className="add-cart" onClick={()=>addfunc(id,unit_price,title)}>+</button></div></div>
            <div><span>Total :</span> <span>{price}</span></div>
        </div>
       
        <div className="image-cover">
            <img src={image?image:placeholder_image} alt={title} loading="lazy"/>
        </div>
    </Section>);
}

export default Cart;