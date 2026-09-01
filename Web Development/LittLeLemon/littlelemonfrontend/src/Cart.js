import { useCart } from "./context/CartContext";
import { useState,useRef } from "react";
import placeholder_image from "./assets/images/menuitem-placeholder.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrashCan}  from '@fortawesome/free-solid-svg-icons'
import Section from "./Section";
import Heading from "./Heading";
import Alert from "./Alert";
import { useNavigate } from "react-router";

const Cart= ()=>{
    const navigate = useNavigate();
    const {cart,addToCart,removeFromCart,total,deleteFromCart,orderItems} = useCart();
    const [isSubmitted,setIsSubmitted]= useState(false);
    const [hasError,setHasErroor] = useState(false);
    const handleOrders =async ()=>{
        try {
            setHasErroor(false);
             setIsSubmitted(true);
            orderItems();
            setTimeout(()=>{
                setIsSubmitted(false);
            },5000);
        }catch(err){
            setHasErroor(true)
        }
        
    }
    return(<main className="max-w-4xl mx-auto px-4 py-8 select-none">
  
  {/* Notification Alert Banner Layer */}
  {isSubmitted && (
      <Alert 
        type={!hasError ? 'success' : 'failure'} 
        message={!hasError ? '✅ Successfully Placed Order' : '❌ Some Error Occured'}
      />
  )}
   

  <Heading className="pb-6 font-bold text-3xl text-gray-900 tracking-tight">Cart</Heading>
    
  {cart.length ? (
    <>
      
      <div className="flex flex-col gap-4">
        {cart.map((item) => (
          <Card 
            id={item.id} 
            title={item.title} 
            price={item.price} 
            quantity={item.quantity} 
            unit_price={item.unit_price} 
            key={item.id} 
            addfunc={addToCart} 
            deletefunc={deleteFromCart} 
            removefunc={removeFromCart} 
            image={item.image_url}
          />
        ))}
      </div>

      
      <div className="mt-8 border-t border-gray-200 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gray-50 rounded-2xl p-5 border border-gray-100 shadow-sm">
          
          {/* Grand Total Display */}
          <div className="flex items-baseline justify-between sm:justify-start gap-3">
            <span className="text-gray-600 text-sm font-medium">Grand Total:</span>
            <span className="text-2xl font-bold text-gray-900 tabular-nums">
              ${parseFloat(total).toFixed(2)}
            </span>
          </div>
          
       
          <div className="w-full sm:w-auto">
            <button 
              type="button"
              className=" w-full sm:w-auto inline-flex justify-center items-center px-8 py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold text-base rounded-xl transition-all shadow-sm hover:shadow active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2" 
              onClick={handleOrders}
            >
              Order Now
            </button>
          </div>
        </div>
      </div>
    </>
  ) : (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl select-none">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Your cart is empty</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">
        Looks like you haven't added anything to your cart yet. Explore our products to find something you like!
      </p>
      
      <button 
        type="button" 
        className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-[var(--color-primary)] bg-[var(--color-primary)]hover:bg-[var(--color-primary-hover)] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        onClick={() =>navigate('..  /menu-items') }
      >
        Continue Shopping
      </button>
    </div>
  )}
</main>
);
}
    
const Card = ({id,title,image,price,unit_price,quantity,addfunc,deletefunc,removefunc,backgroundImage})=>{
    const handleRemove = ()=>{
        removefunc(id,unit_price,title);

    }

    const imageurl = backgroundImage && backgroundImage.includes("/media/") 
        ? "./assets/images/" + backgroundImage.split("/media/", 2)[1] 
        : backgroundImage || "";
    
      const imgRef = useRef(null);
    
      const handleLoad = (e) => {
        const imgElement = e.target; 
        const coverElement = imgElement.parentElement; 
        
        imgElement.classList.remove('not-loaded');
        imgElement.classList.add('loaded');
        
        coverElement.classList.remove('not-loaded');
        coverElement.classList.add('loaded');
        coverElement.style.backgroundImage = 'none';
      }
    return (<Section sectionclass="card flex flex-wrap justify-between gap-4 bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md transition-shadow relative select-none min-h-[140px] w-full max-w-2xl mx-auto">
  
        <div className="flex items-start justify-between gap-2 w-full">
      <Heading className="text-xl font-semibold text-gray-900 line-clamp-2 flex-1">
        {title}
      </Heading>
      
      <button 
        type="button"
        className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 flex-shrink-0" 
        onClick={() => deletefunc(id)}
        aria-label={`Delete ${title}`}
      >
        <FontAwesomeIcon icon={faTrashCan} size="lg" />
      </button> 
    </div>
  <div className="text-[#394B45] flex flex-col justify-between flex-1 min-w-0">
    
   
    
    
    
    <div className="flex flex-col gap-2 mt-4">
      {/* Item Price */}
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <span>Item Price:</span> 
        <span className="font-medium text-gray-900 tabular-nums">{unit_price}</span>
      </div>
      
      {/* Item Quantity */}
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <span id="quantity-label">Quantity:</span> 
        <div className="flex items-center justify-between border border-gray-300 rounded-lg p-0.5 bg-gray-50 min-w-[100px]">
          <button 
            type="button"
            disabled={quantity <= 1}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 font-bold transition-all hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed" 
            onClick={handleRemove}
            aria-label="Decrease quantity"
          >
            <span className="text-base leading-none" aria-hidden="true">&minus;</span>
          </button>
          
          <span className="w-8 text-center text-xs font-semibold text-gray-900 tabular-nums" aria-live="polite" aria-labelledby="quantity-label">
            {quantity}
          </span>
          
          <button 
            type="button"
            className="add-cart flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 font-bold transition-all hover:bg-gray-100" 
            onClick={() => addfunc(id, unit_price, title)}
            aria-label="Increase quantity"
          >
            <span className="text-base leading-none" aria-hidden="true">+</span>
          </button>
        </div>
      </div>

      
      <div className="flex items-center gap-3 text-sm font-semibold text-gray-900 border-t border-gray-100 pt-2 mt-1">
        <span>Total:</span> 
        <span className="text-base text-[var(--color-primary)] tabular-nums">{price}</span>
      </div>
    </div>
  </div>
 
  
  <div className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 relative group self-center">
    <img 
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
      ref={imgRef} 
      src={imageurl || image || placeholder_image} 
      alt={image || imageurl ? title : 'Product placeholder'} 
      onLoad={handleLoad} 
      loading="lazy"
    />
  </div>
</Section>

);
}

export default Cart;