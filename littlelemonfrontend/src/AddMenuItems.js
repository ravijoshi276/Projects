import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useOutletContext } from "react-router";

export default function AddMenuItems(){
    const [isAdded,setIsAdded] = useState(false);
    const [error,setError] = useState(false);
    const [formData,setFormData] = useState({title:"",price:"",category:"",featured:false})
    const {token} = useAuth();
    const [isChecked,setIsChecked] = useState(false);
    const {menuData,refreshMenu,categoryData} = useOutletContext();
    console.log(menuData);
    const handleChange =(e)=>{
       setFormData(prev=>{
        return {...prev,[e.target.name]:e.target.name==="category"?Number(e.target.value):e.target.value}
       })
    }
    
    const handleBlur =(e)=>{
        setFormData(prev =>{
            return {...prev,[e.target.name] : e.target.name==="price"?parseFloat(prev.price).toFixed(2):e.target.name==="title"?prev.title.charAt(0).toUpperCase() +prev.title.slice(1).toLowerCase():e.target.value}})
    }
    const handleClear=()=>{
        setFormData(prev=>{return{...prev,title:"",price:"",featured:false}});
        setIsChecked(false);
    }
    const handleSubmit = async(e)=>{
        e.preventDefault();
        setError(false);
        
        try {
            const ids= menuData.results.map(item=>item.id);
            const maxId = Math.max(...ids);
            const response = await fetch("http://127.0.0.1:8000/api/menu-items",{
                method:"POST",
                headers:{
                    'Content-Type': 'application/JSON',
                    'Authorization': `Token ${token}`,
                },
                body : JSON.stringify({...formData,price:String(formData.price),featured:isChecked})
            })
            if (!response.ok){
                throw new Error('Failed to add data',response.status);
            }
            
            setIsAdded(true);
            setTimeout(()=>{
                handleClear();
                setIsAdded(false);
                refreshMenu();
    
            },3000)
        }catch(err){
            setError(true);
        }
    }
    return <main>
    
        <h1>Add Item</h1>
        <div className={isAdded?'alert success':"hidden"}>{error?"Some Error occured":"Item Added succesfully"}</div>
        <form onSubmit={handleSubmit}>
            <div>
                <label for ='title'>Name</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} maxLength="255" onBlur={handleBlur}></input>
            </div>
            <div>
                <label for ='price'>Price</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} onBlur={handleBlur}></input>
            </div>
            <div>
                <label for='category'>Category</label>
                <select id='category' name="category" onChange={handleChange}>
                    <option value="0" selected>Select An Option</option>
                    {categoryData.results.map(item=><option value={item.id}>{item.title}</option>)}
                </select>
            </div>
            <div>
                <label for="featured">
                    Featured
                </label>
                <input type="checkbox" id="featured" name="featured" checked ={isChecked} onChange={()=>setIsChecked(prev=>!prev)} />
            </div>
            <button type="button" onClick={handleClear} className="clear-btn">clear</button>
            <button type="submit" className="submit-btn" disabled={!(formData.title.length>=5 && formData.price>0 && formData.category>0)}>Submit</button>
        </form>
    </main>
}