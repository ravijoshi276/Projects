import {useState,useTransition,useRef} from 'react';
import Section from './Section';
import Heading from './Heading';
import placeholder_image from "./assets/images/menuitem-placeholder.png"
import backgroundImage from "./assets/images/Compressed-images/Paav-Bhaji.jpg"
import { useCart } from './context/CartContext';
import { NavLink,useOutletContext } from 'react-router';
import { useAuth } from './context/AuthContext';


function MenuPage(){
const {group,user,isLoggedIn}= useAuth();
const {menuData,categoryData} = useOutletContext();
const {addToCart} = useCart();
const [query,setQuery]= useState(""); 
const [isPending,startTransition]= useTransition();
const itemData = menuData?menuData.results.filter(item=>{
    if(query.trim().length===0){
        return item
    }else if(item.title.toLowerCase().includes(query.trim().toLowerCase())){
        return item;
    }}
):null;

const handleChange= (e)=>{
    const value= e.target.value;
    startTransition(()=> {   
    setQuery(value);
    }
)
}
const MenuCards = categoryData ? categoryData.results.map( category=>{
    return(
    <Section sectionclass={'menuitems'} key={category.id}>
        <div  className='menu-item-heading'><Heading>{category.title}</Heading></div> 
        <div className= "cards">
        {itemData.filter(item => item.category === category.id?true:false).map(item=><Menucard title={item.title} price={item.price} image={item.image_url} description={item.description} addfunc={addToCart} id ={item.id} loggedin ={isLoggedIn} featured={item.featured?true:false} backgroundImage={item.compressed_image}/>)}
        </div>
    </Section>
    )
}

): "<div>No data</div>";
return (
    <main>
    <div className='heading-with-search'>
        <Heading>Menu Items</Heading>
        <div className='search-bar-cover'><span>Search </span><input className='search-bar' type='text' onChange={handleChange} value={query} placeholder='Search menu items'/></div>
    </div>
    {isPending?<div>Loading......</div>:""}
    {itemData.length===0?<div className='empty-result'>No Matching Values</div>:(MenuCards.length <0)?"Loading...":MenuCards}   
    </main>
)
}

const Menucard = ({id, title, image, description, price, addfunc, loggedin, featured, backgroundImage}) => {
  const [isAdded, setIsAdded] = useState(false);  
  const imageurl = "./assets/images/"+ backgroundImage.split("/media/",2)[1]
  // Keep your ref purely for referencing the actual image DOM node
  const imgRef = useRef(null);

  const handleLoad = (e) => {
    const imgElement = e.target; // The <img> tag that just loaded
    const coverElement = imgElement.parentElement; // The .image-cover div container

    
    imgElement.classList.remove('not-loaded');
    imgElement.classList.add('loaded');
    
    coverElement.classList.remove('not-loaded');
    coverElement.classList.add('loaded');
    coverElement.style.backgroundImage = 'none';
  }

  const handleClick = () => {
    setIsAdded(!isAdded);
    addfunc(id, price, title, image);
  }

  return (
        <article className='card'>
            <div className='featured'>
              {featured ? (
                <svg className="featured-badge-icon" viewBox="0 0 24 24">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              ) : ""}
            </div>
            <div className='item'>
            {/* Initialize the elements with 'not-loaded' safely */}
            <div className='image-cover not-loaded' style={{ backgroundImage: `url(${imageurl})` }}>
                <img 
                  className='not-loaded' 
                  ref={imgRef} 
                  src={image ? image : placeholder_image} 
                  alt={image ? title : 'placeholder'} 
                  onLoad={handleLoad} 
                  loading='lazy'
                />
            </div>
            <div className='item-details'>
                <h3>{title}</h3>
                <p className='description'>{description ? (description.slice(0, 20) + ".......") : "......."}</p>
                <div><NavLink to={"../menu-items/" + id}>View details</NavLink></div>
                <p className='item-price'><span className='price bold'>Price</span><span>${price}</span></p>
            </div>
            </div>
            <div className='btn-group'>
                {!loggedin ? <span className='lemon msg'>Login to add to cart</span> : isAdded ? <NavLink className='btn gotocart' to='/cart'>Go to Cart</NavLink> : ""}
                <button className="btn addtocart" onClick={handleClick} disabled={isAdded || !loggedin}>{isAdded ? "Added to Cart" : "Add to Cart"}</button>
            </div>
        </article>
    )
}


export {Menucard,MenuPage};