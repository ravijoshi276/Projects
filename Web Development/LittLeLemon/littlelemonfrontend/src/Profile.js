import Heading from "./Heading";
import { useState } from "react";
import { useAuth } from "./context/AuthContext";
const BASE_URL = process.env.REACT_APP_API_URL;


export default function Profile  (){
    const {user,setUser,token} = useAuth();
    const [formdata,setFrormdata]= useState({...user});
    const [isSubmitted,setIsSubmitted] = useState(false);
    const [error,setError] = useState(false);
    
    const handleChange = (e)=>{
        setFrormdata((prev)=>{
            return {...prev,[e.target.name]:e.target.value}
        })
    }
    const clearForm =(e)=>{
        e.preventDefault();
        setFrormdata({...user});
    }
    const handleSubmit = async(e)=>{
        e.preventDefault();
        const response = await fetch(`${BASE_URL}/auth/users/me/`,{
            method: "PATCH",
            headers:{
                'Content-Type' : 'application/json',
                'Authorization': `Token ${token}`,
            },
            body :[JSON.stringify(formdata)]
        })
        if(response.ok){
            setIsSubmitted(true);
            setUser(formdata);
        } else{
            clearForm();
            setError(true);
        }
    }
    return(<main>
        <Heading>Profile</Heading>
        {isSubmitted?<div className={isSubmitted?`alert success submitted`:""}>Profile updated Sucessfully</div>:error?(<div className={error?`alert error`:""}>Some Error Occured</div>):""}
        <form onSubmit={handleSubmit}>
            <div>
                <label for='username'>Username</label>
                <input  type="text" name='usernname' id='username' value={formdata.username} disabled/>
            </div>
            <div>
                <label for='email'>Email</label>
                <input  type="email" name='email' id='email' value={formdata.email} onChange={handleChange} />
            </div>
            <div>
                <label for='firstname'>First Name</label>
                <input  type="text" name='first_name' id='firstname' value={formdata.first_name} onChange={handleChange}/>
            </div>
            <div>
                <label for='lastname'>Last Name</label>
                <input  type="text" name='last_name' id='lastname' value={formdata.last_name} onChange={handleChange}/>
            </div>
            <div>
                <button onClick={clearForm}>Clear</button>
                <button type="submit">Save</button>
            </div>
        </form>

    </main>)
}