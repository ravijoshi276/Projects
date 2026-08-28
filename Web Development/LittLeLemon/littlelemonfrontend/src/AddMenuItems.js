import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useOutletContext } from "react-router";
import axios from 'axios';
import imageCompression from 'browser-image-compression';
const BASE_URL = process.env.REACT_APP_API_URL;

export default function AddMenuItems(){
    const [isAdded, setIsAdded] = useState(false);
    const [error, setError] = useState(false);
    // Track file state explicitly for the multipart upload
    const [compressedFile, setCompressedFile] = useState(null);
    const [isCompressing, setIsCompressing] = useState(false);
    
    const [formData, setFormData] = useState({title: "", price: "", category: "", featured: false, image_url: ""});
    const { token } = useAuth();
    const [isChecked, setIsChecked] = useState(false);
    const { menuData, refreshMenu, categoryData } = useOutletContext();
    
    const handleChange = (e) => {
       setFormData(prev => {
        return { ...prev, [e.target.name]: e.target.name === "category" ? Number(e.target.value) : e.target.value };
       });
    };
    
    const handleBlur = (e) => {
        setFormData(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.name === "price" ? parseFloat(prev.price).toFixed(2) : 
                                 e.target.name === "title" ? prev.title.charAt(0).toUpperCase() + prev.title.slice(1).toLowerCase() : 
                                 e.target.value
            };
        });
    };

    // Handle background image fetching and compression when the input field loses focus
    const handleImageUrlBlur = async () => {
        if (!formData.image_url) return;
        
        setIsCompressing(true);
        try {
            // 1. Fetch image securely as a blob
            const response = await axios.get(formData.image_url, { responseType: 'blob' });
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
            const file = new File([compressedBlob], `${formData.title || 'menu_item'}.jpg`, { type: "image/jpeg" });
            setCompressedFile(file);
        } catch (err) {
            console.error("Failed to fetch or compress image from URL:", err);
        } finally {
            setIsCompressing(false);
        }
    };

    const handleClear = () => {
        setFormData({ title: "", price: "", category: "", featured: false, image_url: "" });
        setIsChecked(false);
        setCompressedFile(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(false);
        
        try {
            // Build native FormData multipart envelope instead of standard JSON
            const data = new FormData();
            data.append('title', formData.title);
            data.append('price', String(formData.price));
            data.append('category', formData.category);
            data.append('featured', isChecked);
            data.append("image_url",formData.image_url);
            data.append('description',formData.description)
            
            // Append binary payload for DRF parser / Pillow processing engine
            if (compressedFile) {
               
                data.append('compressed_image', compressedFile); 
            }

            const response = await fetch(`${BASE_URL}/api/menu-items`, {
                method: "POST",
                headers: {
                    // Do NOT manually define Content-Type here; the browser needs to auto-inject the boundary token
                    'Authorization': `Token ${token}`,
                },
                body: data
            });

            if (!response.ok) {
                throw new Error('Failed to add data');
            }
            
            setIsAdded(true);
            setTimeout(() => {
                handleClear();
                setIsAdded(false);
                refreshMenu();
            }, 3000);
        } catch (err) {
            setError(true);
        }
    };

    return (
        <main>
            <h1>Add Item</h1>
            
            <div className={isAdded ? 'alert success' : "hidden"}>
                {error ? "Some Error occurred" : "Item Added successfully"}
            </div>
            <form onSubmit={handleSubmit} className="single-item-form">
                <div className="form-details">
                <div>
                    <label htmlFor='title'>Name</label>
                    <input type="text" id='title' name="title" value={formData.title} onChange={handleChange} maxLength="255" onBlur={handleBlur} />
                </div>
                <div>
                    <label htmlFor='price'>Price</label>
                    <input type="number" id='price' name="price" value={formData.price} onChange={handleChange} onBlur={handleBlur} />
                </div>
                <div>
                    <label htmlFor='image_url'>Image URL</label>
                    <input 
                        id ='image_url'
                        name="image_url" 
                        type='url' 
                        value={formData.image_url} 
                        onChange={handleChange} 
                        onBlur={handleImageUrlBlur} 
                        required 
                    />
                    {isCompressing && <small style={{ display: 'block', color: 'orange' }}>Downloading and optimizing image asset...</small>}
                    {compressedFile && <small style={{ display: 'block', color: 'green' }}>✓ Image compressed successfully ({(compressedFile.size / 1024).toFixed(1)} KB)</small>}
                </div>
                <div>
                    <label htmlFor='category'>Category</label>
                    <select id='category' name="category" value={formData.category} onChange={handleChange}>
                        <option value="0">Select An Option</option>
                        {categoryData?.results?.map(item => (
                            <option key={item.id} value={item.id}>{item.title}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="featured">Featured</label>
                    <input type="checkbox" id="featured" name="featured" checked={isChecked} onChange={() => setIsChecked(prev => !prev)} />
                </div>
                <div>
                    <label htmlFor='description'>Description</label>
                    <textarea type="text" id ='description' name="description" value={formData.description} onChange={handleChange} maxLength="3000" onBlur={handleBlur} />
                </div>
                <div className="btn-group">
                    <button type="button" onClick={handleClear} className="clear-btn">clear</button>
                    <button type="submit" className="submit-btn" disabled={!(formData.title.length >= 5 && formData.price > 0 && formData.category > 0) || isCompressing}>
                        Submit
                    </button>
                </div>
                </div>
                <div className="image-preview">
                    <div className="image-wrapper">
                        <img src={formData.image_url?formData.image_url:""} alt="Preview" loading="lazy"/>
                    </div>

                </div>
            </form>
        </main>
    );
}
