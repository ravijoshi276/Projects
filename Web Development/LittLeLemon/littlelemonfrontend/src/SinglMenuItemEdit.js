import { useState } from "react";
import { useOutletContext,useParams } from "react-router";
import { useAuth } from "./context/AuthContext";
import Modal from "./Modal";
import { useNavigate } from "react-router";
import BackButton from "./BackButton";
import axios from 'axios';
import imageCompression from 'browser-image-compression';
const BASE_URL = process.env.REACT_APP_API_URL;


export default function SingleMenuItemEdit(){
    const navigate = useNavigate();
    const {id} = useParams();
    const {token} = useAuth();
    const [isCompressing,setIsCompressing] = useState(false);
    const [compressedFile,setCompressedFile] = useState(null);
    const {menuData,categoryData,editMenuItem} = useOutletContext();
    const itemData = menuData.results.find(item=>item.id===Number(id));
    const category = categoryData.results.find(item=>item.id===itemData.category);

    const image_url = itemData.image_url;
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

            const data = new FormData();
            data.append('title', item.title);
            data.append('price', String(item.price));
            data.append('category', item.category);
            data.append('featured', isChecked);
            data.append("image_url",item.image_url);
            data.append('description',item.description)

            if (compressedFile) {
               
                data.append('compressed_image', compressedFile); 
            }

            const response = await fetch(`${BASE_URL}/api/menu-items/${id}`,{
                method:'PATCH',
                headers:{
                    
                    'Authorization': `Token ${token}`,
                },
                body : data,
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
 const handleImageUrlBlur = async () => {
        if (!item.image_url || item.image_url===image_url) return;
        
        setIsCompressing(true);
        try {
            // 1. Fetch image securely as a blob
            const response = await axios.get(item.image_url, { responseType: 'blob' });
            const imageBlob = response.data;

            // 2. Compress payload safely
            const options = {
                maxSizeMB: 0.01, //10 kb images
                useWebWorker: true,
                maxWidthOrHeight: 400,    // Force-resize dimensions down (Crucial for <10KB)
                initialQuality: 0.5    
            };
            const compressedBlob = await imageCompression(imageBlob, options);//Compressed Image 
            
            // 3. Create file structure matching native inputs
            const file = new File([compressedBlob], `${item.title || 'menu_item'}.jpg`, { type: "image/jpeg" });
            setCompressedFile(file);
        } catch (err) {
            console.error("Failed to fetch or compress image from URL:", err);
        } finally {
            setIsCompressing(false);
        }
    };

    const openModal=()=>setIsModalOpen(true);
    const closeModal = () =>setIsModalOpen(false);
    
    return <main>
        <div>
        <BackButton />
        <h1>Edit Item</h1>
        </div>
        {isSubmitted && !error ? <div className="alert success">Submitted succesfully</div>:""}
        <form onSubmit={handleSubmit} className="single-item-form" id='single-menu-item-form'>
        <div className="form-details">
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
                    <label htmlFor='image_url'>Image URL</label>
                    <input 
                        id="image_url"
                        name="image_url" 
                        type='url' 
                        value={item.image_url} 
                        onChange={handleChange} 
                        onBlur={handleImageUrlBlur} 
                        required 
                    />
                    {isCompressing && <small style={{ display: 'block', color: 'orange' }}>Downloading and optimizing image asset...</small>}
                    {compressedFile && <small style={{ display: 'block', color: 'green' }}>✓ Image compressed successfully ({(compressedFile.size / 1024).toFixed(1)} KB)</small>}
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
            <button className="clear-btn" onClick={handleClear}>clear</button>
            <button type='button' className="submit-btn" onClick={openModal}>save</button>
        </div>
        </div>
        <div className="image-preview">
                    <div className="image-wrapper">
                        <img src={item.image_url?item.image_url:""} alt="Preview" loading="lazy"/>
                    </div>

                </div>
        
        </form>
        <Modal isOpen={isModalOpen} onClose={closeModal} title="Are you sure you want to save changes ?" className="singl-item-modal">
            <button onClick={closeModal} className="cancle">cancle</button>
            <button type="submit" form="single-menu-item-form" onClick={handleSubmit}>save</button>
        </Modal>

    </main>
    
}