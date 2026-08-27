import { useState,useEffect } from "react";
import { Outlet } from "react-router";

export default function MenuLayout() {
  const [menuData, setmenuData  ] = useState(null);
  const [categoryData,setcategoryData] = useState(null)
  const [loading, setLoading] = useState(true);
  const [menuTrigger,setMenuTrigger] =useState(0);
  const [categoryTrigger,setCategoryTrigger] =useState(0);
  const refreshMenu = ()=>{
    setMenuTrigger(prev=>prev+1)
  }

  const refreshCategory =()=>{
    setCategoryTrigger(prev=>prev+1)
  }
  const deleteMenuItem = (id)=>{
    setmenuData(prev=> {return {...prev,results :prev.results.filter(item=>item.id!==id)}})
  }
  const editMenuItem = (item,isChecked)=>{
    setmenuData(prev=>{
            return{...prev,results: prev.results.map(menuitem=>{
                
                    return menuitem.id===item.id ?{...menuitem,...item,price:String(parseFloat(item.price).toFixed(2)),featured:isChecked}:menuitem;
                
            })}
            
        })
  }

useEffect(()=>{
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/categories").then((response)=>{
          if (!response.ok){
      throw new Error(`Failed to fetch data : ${response.status}` );
    }
   return response.json();
  }
  ).then((data)=>{
    setcategoryData(data);
  setLoading(false);}
).catch((err)=>{
console.error(err);
  })
},[categoryTrigger])

   //Fetching Menu data
  useEffect(()=>{
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/menu-items").then((response)=>{
          if (!response.ok){
      throw new Error(`Failed to fetch data : ${response.status}` );
    }
   return response.json();
  }
  ).then((data)=>{
    console.log("data fetched",data);
    setmenuData(data);
  setLoading(false);}
).catch((err)=>{
console.error(err);
  })
},[menuTrigger])
if (loading ||!menuData || !categoryData) return <p>Loading menu items...</p>;
//Fetching Category Data
  
  // Shares the 'menu' array down to any nested route components
  return <Outlet context={{menuData,categoryData,editMenuItem,refreshMenu,deleteMenuItem,refreshCategory}} />;
}
