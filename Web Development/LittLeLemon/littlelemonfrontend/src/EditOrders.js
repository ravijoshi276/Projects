import { memo,useState ,useEffect,useCallback} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCaretDown}  from '@fortawesome/free-solid-svg-icons'
import { useAuth } from "./context/AuthContext";
import placeholder_image from "./assets/images/menuitem-placeholder.png"


export default function EditOrders(){
    const [deliveryCrew,setDeliveryCrew] = useState(null);
    const [orders,setOrders]=useState(null);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(false);
    const [itemData,setItemData]= useState([])
    const {token,group} = useAuth();
    const [isSubmitted,setIsSubmitted] = useState(false);
    const [query,setQuery]= useState({id:"",delivery_crew:null,status:false});
    
    const BASE_URL = process.env.REACT_APP_API_URL;

    useEffect(()=>{
        const fetchAndStichData = async()=>{
            setLoading(true);
            setError(false)
            try{const response = await fetch(`${BASE_URL}/api/groups/delivery-crew/users`,{
                method:"GET",
                headers:{
                    'Content-Type': 'application/JSON',
                    'Authorization': `Token ${token}`,
                }
        })
        if(!response.ok){
            throw new Error("Failed to fetch manager data",response.status);
        }
        const data = await response.json()
        
        setDeliveryCrew(data);
           setLoading(false);
        }catch(err){
            setError(true);
        }finally{
            setLoading(false);
        }
    }
    fetchAndStichData()
},[token])

useEffect(()=>{
        const fetchAndStichData = async()=>{
            setLoading(true);
            setError(false)
            try{const response = await fetch(`${BASE_URL}/api/orders`,{
                method:"GET",
                headers:{
                    'Content-Type': 'application/JSON',
                    'Authorization': `Token ${token}`,
                }
        })
        if(!response.ok){
            throw new Error("Failed to fetch manager data",response.status);
        }
        const data = await response.json();
        const sortedData = data.results.toSorted((a,b)=>b.id-a.id);
        const sortedata = {...data,results:sortedData}
        setOrders(sortedata);
        setItemData(sortedData.filter(item=>item.status===false));
           setLoading(false);
        }catch(err){
            setError(true);
        }finally{
            setLoading(false);
        }
    }
    fetchAndStichData()
},[token])
const handleSubmit = useCallback(async(id,deliveryCrew,status)=>{
    try {
        setError(false);
        const response = await fetch(`${BASE_URL}/api/orders/${id}`,{
            method:"PATCH",
            headers:{
                    'Content-Type': 'application/JSON',
                    'Authorization': `Token ${token}`,
            },
            body:JSON.stringify({id:id,delivery_crew:deliveryCrew?Number(deliveryCrew):null,status:status})
            
        })
        console.log("Patch Request",JSON.stringify({id:id,delivery_crew:deliveryCrew?Number(deliveryCrew):null,status:status===true?true:false}))
        if(!response.ok){
            throw new Error("Error Submitting data ",response.status)
        }
        setIsSubmitted(true);
        setOrders(prev=>{
                return{...prev,results:prev.results.map(order=>order.id===id?{...order,delivery_crew:deliveryCrew?Number(deliveryCrew):null,status:status==="true"?true:false}:order)}
            })
            setTimeout(()=>{
                setIsSubmitted(false);
            },3000)
    }catch(err){
        setError(true);
    }
},[token])


const itemCards = !loading &&orders && deliveryCrew?itemData.map(item=><Card key = {item.id} id={item.id} count={item.orderitem.length} status={item.status?true:false} date={item.date} deliverycrewid={item.delivery_crew} submitFunction = {handleSubmit} deliveryCrewlist={deliveryCrew} orderitems={item.orderitem} group={group} total={item.total}/>):<div>loading....</div>
const handleQuery = (e)=>{
    setQuery(prev=>{
        return{...prev,[e.target.name]: e.target.name==="status"?!prev.status:e.target.value};
    })
}
const handleClear =()=>{
    setQuery({id:"",delivery_crew:null,status:false});
    setItemData(orders.results.filter(item=>item.status===false))
}
const handleSearch = ()=>{
    setItemData(orders.results.filter(item=>{
    const searchid = query.id?query.id.trim().toLowerCase():"";
    const item_status = Boolean(query.status);
    const item_delivery_crew = Number(query.delivery_crew);
    const search_name = deliveryCrew.filter(item=> {
        if(item.username.toLowerCase().includes(searchid)){
            return item;
        }
    })
    const delivery_crew_id = search_name.map(item=>item.id);
    if(!searchid.length){
        if(!item_delivery_crew ){
            if(item_status ===item.status){
                return item;
            }
        }else{
            if(item.delivery_crew===item_delivery_crew && item.status===item_status){
                return item;
            } 
        }
    }else{
        if(item.id==searchid || delivery_crew_id.includes(item.delivery_crew)){
           if(!item_delivery_crew ){
            if(item_status ===item.status){
                return item;
            }
        }else{
            if(item.delivery_crew===item_delivery_crew && item.status===item_status){
                return item;
            } 
        }
            
        }
    }
    
}))
}

    return <main>
        <h1>Orders</h1>
        {isSubmitted?<div className="alert submitted success">Saved Successfully</div>:""}
        <div>
            <div className="search-filter">
                <label for='id'>Search</label>
                <input name='id' type="text" id='id' value={query.id} className='search-bar' placeholder="Search Order ID or DeliveyCrew Name" onChange={handleQuery}/>
            </div>
            <div>
                <label for='delivery_crew'>Deivery Crew</label>
                <select name="delivery_crew" defaultValue={null} id="delivery_crew" value={query.delivery_crew} onChange={handleQuery}>
                    <option value={null}>No Delivery Crew</option>
                    {deliveryCrew?deliveryCrew.map(item=><option value={item.id}>{item.username}</option>):""}
                </select>
            </div>
            <div>
                <label for='status'>Delivered</label>
                <input name='status' id='status' value={query.status} type='checkbox'  onChange={handleQuery}/>
            </div>
            <div><button type="button" onClick={handleClear}>clear</button> <button type="button" onClick={handleSearch}>Search</button></div>
        </div>
        <div className="order-cards">
        {itemCards}
        </div>
    </main>
}


const Card =memo(({id,count,status,date,total,orderitems ,deliverycrewid,deliveryCrewlist,submitFunction,group})=>{
    const [year, month, day] = date.split('-');
    const newdate = new Date(year,month-1,day);
    const [isHidden,setIsHidden]= useState(true);
    const [isChecked,setIsChecked] =useState(status);
    const [deliveryCrew,setDeliveryCrew] = useState(deliverycrewid);
    const [hasChanged,setHasChanged] =useState(false);
    const handleClick =()=>{
        setIsHidden(prev => !prev);
    }
    const handleChange = (e)=>{
        setHasChanged(true);
        e.target.name==="status" ? setIsChecked(prev=>!prev):setDeliveryCrew(Number(e.target.value));
    }
    const handleClear = ()=>{
        setHasChanged(false);
        setIsChecked(status);
        setDeliveryCrew(deliverycrewid);
    }
    const handleSubmit = ()=> {
        submitFunction(id,deliveryCrew,isChecked);
        setHasChanged(false);
    }
    
    return<article className="order-card" >
        <div className="card-header">
            <div><div className="bold">Order ID</div><div>{id}</div></div>
            <div><div className="bold">Ordered On</div><div>{newdate.toDateString()}</div></div> 
            <div><div className="bold">Items</div><div>{count}</div></div>
            <div><div className="bold">Total</div><div>{total}</div></div>
            <div className="status"><label htmlFor="status">Status</label>{group==="manager"?<input id='status' type="checkbox" name='status' checked={isChecked} onChange={handleChange} />:(
                <button type='button' onClick ={()=>{setIsChecked(true); setHasChanged(true)}} disabled={isChecked}>{isChecked?"Delivered":"Mark Delivered"}</button>)}</div>
            
            <div className="delivery-crew-dropdown">
                <div>
          {group==='manager'?<label htmlFor='delivery-crew'>Delivery Crew</label>:""}  
           </div>

           <div>
           {group==='manager'?(<select id='delivery-crew' name='delivery_crew' defaultValue={deliveryCrew} onChange={handleChange}>
                <option key="default-null" value={null} >Select An option</option>
                {deliveryCrewlist.map((item)=> <option key={item.id}value={item.id} >{item.username}</option>)}
            </select>):""} 
            </div>
            </div>
           
        </div>
        {hasChanged?<div className="btn-group"><button type="button" className="clear-btn" onClick={handleClear}>Clear</button> <button type="button"  className="save-btn" onClick={handleSubmit}>Save</button></div>:""}
        <div className="order-details" onClick={handleClick}>show details <FontAwesomeIcon icon={faCaretDown} size="lg"></FontAwesomeIcon></div>
        <div className={isHidden?"hidden":"order-items"}>
        
        
            {orderitems.map(item=>{
                return(<div className="order-item" key={item.id}>
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
});