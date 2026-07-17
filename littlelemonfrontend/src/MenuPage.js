import {useState,useEffect} from 'react';
import Section from './Section';
import Heading from './Heading';
import placeholder_image from "./assets/images/menuitem-placeholder.png"
import { useCart } from './context/CartContext';
import { NavLink } from 'react-router';
import { useAuth } from './context/AuthContext';


export default function MenuPage(){
const {group,user}= useAuth();
const [menuData,setmenuData]  = useState(null);
const [categoryData,setcategoryData]  = useState(null);
const [loading,setloading] = useState(true);
const {addToCart} = useCart();

  //Fetching Menu data
  useEffect(()=>{
    setloading(true);
    fetch("http://127.0.0.1:8000/api/menu-items").then((response)=>{
          if (!response.ok){
      throw new Error(`Failed to fetch data : ${response.status}` );
    }
   return response.json();
  }
  ).then((data)=>{
    setmenuData(data);
  setloading(false);}
).catch((err)=>{
console.error(err);
  })
},[])

//Fetching Category Data
  useEffect(()=>{
    setloading(true);
    fetch("http://127.0.0.1:8000/api/categories").then((response)=>{
          if (!response.ok){
      throw new Error(`Failed to fetch data : ${response.status}` );
    }
   return response.json();
  }
  ).then((data)=>{
    setcategoryData(data);
  setloading(false);}
).catch((err)=>{
console.error(err);
  })
},[])
if(!menuData || loading){
    return <Heading>Loading menu......</Heading>
}

const cards = categoryData ? categoryData.results.map( category=>{
    return(
    <Section sectionclass={'menuitems'} key={category.id}>
        <div  className='menu-item-heading'><Heading>{category.title}</Heading></div> 
        <div className= "cards">
        {menuData.results.filter(item => item.category === category.id?true:false).map(item=><Card title={item.title} price={item.price} image={item.image ||null} description={item.image ||null} addfunc={addToCart} id ={item.id}/>)}
        </div>
    </Section>
    )
}

): "<div>No data</div>";
return (
    <>
    <Heading>Menu Items</Heading>
    {loading||(cards.length <0)?"Loading...":cards}   
    </>
)
}

let Card =({id,title,image,description,price,addfunc})=>{
  const [isAdded,setIsAdded] = useState(false);  
  const handleClick = () =>{
    setIsAdded(!isAdded);
    addfunc(id,price,title,image);
  }
  return(
        <article className='card item-card'>
            <div className='image-cover'>
                <img src={image?image:placeholder_image} alt={image?title:'placeholder'}/>
            </div>
            <div>
                <h3>{title}</h3>
                <p className='description'>{description}</p>
                <p className='price'>${price}</p>
                <div className='btn-group'>
                {isAdded?<NavLink className='btn gotocart'to='/cart'>Go to Cart</NavLink>:""}
                <button className="btn addtocart"onClick={handleClick} disabled = {isAdded}>{isAdded?"Added to Cart":"Add to Cart"}</button>
                </div>
            </div>

        </article>
    )
}

