import { useState } from "react";
import { useOutletContext,useParams } from "react-router";
import { useAuth } from "./context/AuthContext";
import Modal from "./Modal";
import { useNavigate } from "react-router";
import BackButton from "./BackButton";
export default function SingleMenuItemEdit(){
    const navigate = useNavigate();
    const {id} = useParams();
    const {token} = useAuth();
    const {menuData,categoryData,editMenuItem} = useOutletContext();
    const itemData = menuData.results.find(item=>item.id===Number(id));
    const category = categoryData.results.find(item=>item.id===itemData.category);
    const [item,setItem]= useState({...itemData});
    const[error,setError]= useState(false);
    const [isSubmitted,setIsSubmitted] =useState(false);
    const [isModalOpen,setIsModalOpen] = useState(false);
    const [isChecked,setIsChecked] = useState(itemData.featured);
    const handleChange = (e)=>{
        setItem((prev)=>{return {...prev,[e.target.name]:e.target.name==="category"?Number(e.target.value):e.target.value}});
        console.log(item);
    }
    const handleSubmit = async(e)=>{
        e.preventDefault();
        setIsSubmitted(true);

        try {
            setError(false);
            const response = await fetch("http://127.0.0.1:8000/api/menu-items/"+id,{
                method:'PATCH',
                headers:{
                    'Content-Type': 'application/JSON',
                    'Authorization': `Token ${token}`,
                },
                body : JSON.stringify({...item,featured:isChecked}),
            })
            if (!response.ok){
                throw new Error("Failed to fetch data",response.status)
            }
            editMenuItem(item,isChecked)
        
            closeModal();
            setTimeout(()=>{
                navigate(-1)
            },2000)} catch(err){
            console.error(err);
            setError(true);
        }
    }
    const handleClear=()=>{
        setItem(itemData);
    }
    const openModal=()=>setIsModalOpen(true);
    const closeModal = () =>setIsModalOpen(false);
    
    return <main>
        <div>
        <BackButton />
        <h1>Edit Item</h1>
        </div>
        {isSubmitted && !error ? <div className="alert success">Submitted succesfully</div>:""}
        <form onSubmit={handleSubmit} className="single-item" id='single-menu-item-form'>
        <div>
            <label htmlFor='title'>Title</label>
            <input type="text" name="title" id="title" value={item.title} onChange={handleChange} />
        </div>
        <div>
            <label htmlFor='description'>Description</label>
            <input type="text" id='description' name="description" value={item.description} onChange={handleChange} />
        </div>
        <div>
            <label htmlFor='price'>Price</label>
            <input type="text" name="price" id='price' value={item.price}  onChange={handleChange}/>
        </div>
        <div>
            <label htmlFor='category'>Category</label>
            <select type="text" name="category" id='category' onChange={handleChange} >
                {categoryData.results.map(item=> {return item.id ===category.id ?(<option key={item.id} value={item.id} selected>{item.title}</option>):<option key={item.id} value={item.id} >{item.title}</option>})}
            </select>
        </div>
        <div>
            <label htmlFor='featured'>Featured</label>
            <input type="checkbox" name="featured" id='featured' checked={isChecked} onChange={()=>setIsChecked(prev=>!prev)}/>
        </div>
        <div className="btn-group">
            <button className="clear" onClick={handleClear}>clear</button>
            <button type='button' className="submit" onClick={openModal}>save</button>
        </div>
        
        </form>
        <Modal isOpen={isModalOpen} onClose={closeModal} title="Are you sure you want to save changes ?" className="singl-item-modal">
            <button onClick={closeModal} className="cancle">cancle</button>
            <button type="submit" form="single-menu-item-form" onClick={handleSubmit}>save</button>
        </Modal>

    </main>
    
}