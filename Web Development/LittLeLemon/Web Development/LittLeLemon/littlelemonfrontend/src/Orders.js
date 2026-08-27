import Heading from "./Heading";
import { ordersApi } from "./services/api";
import { useState,useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import placeholder_image from "./assets/images/menuitem-placeholder.png"

export default function Orders(){
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(false);
    const [orders,setOrders] = useState([]);
    const [count,setCount] = useState(0);
    const {token} = useAuth();
    
    useEffect(()=>{
        setLoading(true);
            const fetandStichOrders = async()=>{
            const cartData =  await ordersApi.getOrders(token);
            if(cartData && cartData.count>0){
                setCount(cartData.count);
            const itemsData =   await ordersApi.getAllOrders(cartData);
            console.log("itemsdata: ",itemsData);
            const fullOrderdetails = cartData.results.map((order)=>{
                return{...order,
                    orderitem : order.orderitem.map((item)=>{
                        const matchedItem = itemsData.results.find(p=>p.id===item.menuitem);
                        return {
                            ...item,
                            image : matchedItem ? matchedItem.image :placeholder_image,
                            title : matchedItem ? matchedItem.title : "Unknown"
                        }
                    })
                }

            }).toReversed();
        
            setOrders(fullOrderdetails);
            
            }else if(cartData.count===0){
                setOrders(cartData);
            }else{
                setError(true);
            }
            setLoading(false);
            };
            fetandStichOrders();

    },[])
    

    return <main className="orders">
        <Heading>Orders</Heading>
        
        {loading?<div className="loading">Loading!!!!</div>: error?<div className="error">Some Error Accured</div>:(
            (orders.length && count) ?(orders.map(item=><Card key={item.id} id={item.id} count={item.orderitem.length} date={item.date} total={item.total} orderitems ={item.orderitem} status={item.status}/>)):(<div className="no-items">There are no orders to show</div>)
    )} 

    </main>
}

const Card =({id,count,status,date,total,orderitems})=>{
    const [year, month, day] = date.split('-');
    const newdate = new Date(year,month-1,day);
    return<article className="order-card">
        <div className="card-header">
            <div><div className="bold">Ordered On</div><div>{newdate.toDateString()}</div></div> 
            <div><div className="bold">Items</div><div>{count}</div></div>
            <div><div className="bold">Total</div><div>{total}</div></div>
        </div>
        <div className="order-items">
        <div className="status">{status?"Delivered":"Not Delivered"}</div>
        
            {orderitems.map(item=>{
                return(<div className="order-item">
            <div className="image-cover"><img src={item.image?item.image:placeholder_image} alt={item.title}/></div>
            <div className="orderitem-details">
                <div className="order-title"><span>{item.title}</span></div>
                <div className="order-quantity"><span>Quantity: </span>{item.quantity}</div>
                <div className="order-price"><span>Price: </span><span>{item.price}</span></div>
            </div>
        </div>)

            })}
        
        </div>
    </article>
}