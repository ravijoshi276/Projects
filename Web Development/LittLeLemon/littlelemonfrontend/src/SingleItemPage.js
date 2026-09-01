import { useState } from "react";
import { useParams } from "react-router";
import Heading from "./Heading";
import Section from "./Section";
import placeholder_image from "./assets/images/menuitem-placeholder.png"
import { useCart } from "./context/CartContext";
import { useAuth } from './context/AuthContext';
import { NavLink,useOutletContext } from "react-router";
import BackButton from "./BackButton";
export default function SingleItemPage (){
    const {id} = useParams();
    const {isLoggedIn} = useAuth();
    const [isAdded,setIsAdded] = useState(false);
    const {menuData,categoryData} = useOutletContext();
    const itemData = menuData.results.find(item=>item.id===Number(id));
    console.log("itemdata",itemData);
    const category = categoryData.results.find(item=>item.id===itemData.category);
    const {addToCart} = useCart();
    
    
    const handleClick = () =>{
    setIsAdded(!isAdded);
    addToCart(itemData.id,itemData.price,itemData.title);
    }
  
    
    return (<main className="max-w-3xl mx-auto px-4">
    <BackButton />
    <Heading className="text-3xl font-extrabold text-[var(--text-main)] my-5 ">{itemData.title}</Heading>
    <Section sectionclass="w-full my-5">
        <div className="image-cover bg-[var(--bg-container)] relative flex-shrink-0 overflow-hidden  rounded">
            
            <img src={itemData? itemData.image_url:placeholder_image} alt={itemData.title} loading="lazy" className="w-full h-full object-cover"/></div>
        <div className="w-full">
            <Heading className='my-3 mx-auto'>Description</Heading>
            <div className="text-[var(--text-muted)]">
            <p>{itemData.description?itemData.description:"Some Description"}</p>
            <p><span className="font-bold mr-3">Price:</span> <span>${itemData.price}</span></p>
            <p><span className="font-bold mr-3">Category:</span> <span>{category?category.title:""}</span></p>
            </div>
        </div>
    </Section>
     <div className='flex w-full justify-end  gap-[5%]'>
        <div className="flex items-center max-w-[40%] ">
              {!isLoggedIn ? (
                <span className='lemon msg text-[11px] font-medium text-[var(--text-muted)] bg-[var(--bg-container)] px-2.5 py-1 rounded-lg border border-[var(--border-color)]/50'>
                  🔒 Login to order
                </span>
              ) : isAdded ? (
                <NavLink 
                  className='max-w-[40%] bg-[var(--color-secondary)] hover:bg-[#D4B10B] text-[var(text-main)] px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm text-center' 
                  to='/cart'
                >
                  ✓ Go to Cart
                </NavLink>
              ) : null}
            </div>   
            <button className="w-[40%] lg:w-auto bg-[var(--text-link-hover)] hover:bg-[var(--color-primary-hover)] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"onClick={handleClick} disabled = {isAdded||!isLoggedIn}>{isAdded?"Added to Cart":"Add to Cart"}</button>
    </div>

    
    </main>)
}