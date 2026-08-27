import {startTransition, useState,useTransition} from 'react';
import Section from './Section';
import Heading from './Heading';
import placeholder_image from "./assets/images/menuitem-placeholder.png"
import { NavLink,useOutletContext } from 'react-router';
import { useAuth } from './context/AuthContext';


export default function ListMenuItems(){
const {token}= useAuth();
const {menuData,deleteMenuItem} = useOutletContext();
const [query,setQuery]= useState(""); 
const [isDeleted,setIsDeleted] = useState(false);
const [error,setError]= useState(false);
const [isPending,startTransition] = useTransition();
const itemData = menuData?menuData.results.filter(item=>{
    if(query.trim().length===0){
        return item
    }else if(item.title.toLowerCase().includes(query.trim().toLowerCase())){
        return item;
    }}
):null;
const deleteItem= async (id)=>{
    console.log("clicked");
    setError(false);
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/menu-items/${id}`,{
            method:'DELETE',
            headers:{
                    'Content-Type': 'application/JSON',
                    'Authorization': `Token ${token}`,
                }
        })
        if(!response.ok){
            throw new Error(`Failed to fetch data `,response.status);
        }
        setIsDeleted(true);
        setTimeout(()=>{
            deleteMenuItem(id);
            setIsDeleted(false);
        },3000)
        

    }catch(err){
   setError(true);
}

}

let MenuCards = itemData.length ? itemData.map(item=><Menucard key ={item.id} id={item.id} image = {item.image_url} title={item.title} price={item.price}  description={item.description ||null} deleteFunc={deleteItem} id ={item.id} featured={item.featured?true:false}/>) : <div className='empty-result'>No Matching Values</div>;

const handleChange= (e)=>{
const value =e.target.value;
startTransition(()=>{
setQuery(value);
})
    
}


return (
    <main className='menu-dashboard'>
    <div className='heading-with-search'>
        <Heading>Menu Items</Heading>
        <div className='search-bar-cover'><span>Search </span><input className='search-bar' type='text' placeholder="Search Item" onChange={handleChange} value={query}/></div>
        <div className={isDeleted?'alert success':"hidden"}>{error?"Some Error occured":"Item Deleted succesfully"}</div>
    </div>
    {isPending?<div>Loading........</div>:""}
   <div className='menu-dashboard-cards'>
        {(MenuCards.length <0)?"Loading...":MenuCards}
    </div>
    </main>);
}

const Menucard =({id,title,image,description,price,deleteFunc,featured})=>{
 
  const handleClick = () =>{ 
    deleteFunc(id);
  }
  return(
        <article className='card item-card manager'>
            <div className='image-wrapper'>
                <img src={image ?image:placeholder_image} alt={image?title:'placeholder' } loading='lazy'/>
            </div>
            <div className='item-details'>
                {featured? <svg class="featured-badge-icon" viewBox="0 0 24 24" >
  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
</svg>:""}
                <h3>{title}</h3>
                <p className='description'>{description?description.slice(0,10)+ ".......":"Some Description......."}</p>
                <p className='item-price'><span className='price bold'>Price</span><span>${price}</span></p>
                <div className='btn-group'>
                <NavLink to={"../menu-items/"+id}>Edit</NavLink>   
                <button className="btn addtocart delete"onClick={handleClick}>Delete</button>
                </div>
            </div>

        </article>
    )
}

