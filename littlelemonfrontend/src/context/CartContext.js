import { useState,useEffect,useContext ,createContext } from "react";
import { useAuth } from "../context/AuthContext";
import {cartApi,ordersApi} from "../services/api";
import placeholder_image from "../assets/images/menuitem-placeholder.png"

const CartContext = createContext(null);

export const  CartProvider=({children})=> {
    const {token,user} = useAuth();
    // Initial state and final state of cart
    const [cart,setCart]=useState([]);
    const [loading,setLoading] = useState(false);
    const [itemCount,setItemCount]= useState(0);
    const [total,setTotal]=useState(0);

    //Getting Cart Details
    useEffect(()=>{
        if(!token && !user){
            setCart([]);
            setLoading(false);
            return ;
        }
        //Getting cart data
        const fetchAndStichCart = async ()=>{
        setLoading(true);
        try{
            const cartsdata = await cartApi.getCart(token);
            if(!cartsdata) {
                setCart([]);
                return ;
            }
    
            setItemCount(cartsdata?cartsdata.count:0);
            const menuItems = await cartApi.getAllCartItems(cartsdata.results);
           
            const fullCartDetails = cartsdata.results.map((item)=>{
                
                const matchedItem = menuItems.results.find(p=>p.id===item.menuitem);
                return {
                    id: item.menuitem,
                    title : matchedItem ? matchedItem.title :"Unknown Product",
                    image : matchedItem ? matchedItem.image : placeholder_image,
                    quantity: item.quantity,
                    price : matchedItem ? matchedItem.price * item.quantity : 0.0,
                    unit_price : matchedItem ? matchedItem.price : 0.0 
                };
                
            })
            setTotal(fullCartDetails.reduce((sum,product)=>{return sum+product.price},0));
            setCart(fullCartDetails);
        } catch (err){
            console.error("Error building stiched cart");
        } finally{
            setLoading(false);
        }
    };
    fetchAndStichCart();
 
    },[token]);
   
    const orderItems = async ()=>{
        setLoading(true);
        try{
            await ordersApi.orderItems(token);
            setLoading(false);
            setCart([]);
            setItemCount(0);
            setTotal(0);
            }catch (err){

                console.log(err);
            }
        
        }
    
    const addToCart = async (productid,price,title,image=placeholder_image)=>{
        let isExisting =false;
        let updatedCart = [];
        let targetQuantity=1;

        const existingItem = cart.find((item)=> item.id===productid); 
        if(existingItem){
            isExisting =true;
            targetQuantity=existingItem.quantity+1;
            updatedCart = cart.map((item)=>(
                    item.id === productid ? {...item,unit_price:price,quantity :item.quantity +1, price : price * targetQuantity} :item));

        }else{
            setItemCount(prev => prev+1);
            updatedCart = [...cart,{id:productid,quantity:1,unit_price:price,title:title,price:price,image:image}];
        }
        setCart(updatedCart);
        setTotal(prev=>total+Number(price));
        try{
           
                await cartApi.updateCart(token,{menuitem:productid,unit_price:price,quantity:targetQuantity})
            
           
        } catch(err){
            console.error("server update failed");
        }
    
    }
    const deleteFromCart =async (productid)=>{
        const existingitem = cart.find(item=>item.id===productid);
        setCart((prevCart)=>{
            return prevCart.filter((item)=>item.id !== productid);
        })
        setItemCount(prev=>prev-1);
        setTotal(prev=>prev - Number(existingitem.price));
        try {
            await cartApi.updateCart(token,{menuitem:productid,unit_price:0,quantity:0})
        }catch(err){
            console.error("Failed to delete from cart");
        ;
    }}

    //Remove from cart
    const removFromCart = async (productid,price,title)=>{
        let newCart = [];
        const existingItem = cart.find((item)=> item.id===productid); 
        let targetQuantity = existingItem.quantity-1;

        newCart = cart.map((item)=> item.id===productid? {...item,unit_price:price,price:price*targetQuantity,title:title,quantity:targetQuantity}:item);
        //Checking if any quantity becomes zero
        setTotal(prev=>prev-Number(price));
        setCart(newCart.filter((item)=>item.quantity>0));
        if(targetQuantity<=0){
            setItemCount(prev=>prev-1);
        }

        try{
            await cartApi.updateCart(token,{menuitem:productid,unit_price:price,quantity:targetQuantity});
            console.log("request sent")
        }catch(err){
            console.error("Failed to delete from cart");
        }
        };
    
        
        
   
    //Detailed cart
   const clearCart = async() => {
    setCart([]);
    setItemCount(0);
    setTotal(0);
    await cartApi.deleteCart(token);
   }

   return <CartContext.Provider value={{cart,itemCount,addToCart,deleteFromCart,clearCart,removFromCart,loading,total,orderItems}} >
    {children}
   </CartContext.Provider>
}

export const useCart = () => useContext(CartContext);