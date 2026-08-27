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
  
    
    return (<main className="single-item-page">
    <BackButton />
    <Heading>{itemData.title}</Heading>
    <Section sectionclass="single-item-details">
        <div className="single-image-cover"><img src={itemData? itemData.image_url:placeholder_image} alt={itemData.title} loading="lazy"/></div>
        <div>
            <Heading>Description</Heading>
            <p>{itemData.description?itemData.description:"Some Description"}</p>
            <p><span className="fw-500">Price:</span> <span>{itemData.price}</span></p>
            <p><span className="fw-500">Category:</span> <span>{category?category.title:""}</span></p>
        </div>
    </Section>
     <div className='btn-group'>
        {!isLoggedIn?<span className='lemon msg'>Login to add to cart</span>:isAdded?<NavLink className='btn gotocart'to='/cart'>Go to Cart</NavLink>:""}
                <button className="btn addtocart"onClick={handleClick} disabled = {isAdded||!isLoggedIn}>{isAdded?"Added to Cart":"Add to Cart"}</button>
    </div>

    
    </main>)
}