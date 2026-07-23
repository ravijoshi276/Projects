import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "./context/AuthContext";
import Heading from "./Heading";
const LoginForm =()=>{
    const [credentials,setCredentials]= useState({
        username:'',password:''
    });
    const {login,group} = useAuth();
    const [error,setError]=useState(false);
    const [isSubmitted,setIsSubmitted]=useState(false);
    const navigate = useNavigate();
    const resetCredentials = ()=>{
        setCredentials((prev)=>({...prev,username:'',password:''
    }))
    }
    const handleChange=(e)=>{
        const {name,value}=e.target;
        setCredentials((prev)=>({...prev,[name]:value}))
    }
    
    const handleSubmit = async (e)=>{
        e.preventDefault();
        try{
            const response = await fetch('http://localhost:8000/auth/token/login',{
                method:'POST',
                headers :{
                    'Content-Type': 'application/JSON',
                },
                body : JSON.stringify(credentials),
            });
            if(!response.ok){
                
                throw new Error(`Server responded with  status : ${response.status}`);
            }
            setIsSubmitted(true);
            const data = await response.json();
            login(data);
            resetCredentials();
            setTimeout(()=>{
            if(data.groups.length===0){
                navigate('/menu-items');
            }else if(data.groups.includes("Delivery Crew")){
                navigate('/')
            }else{
                navigate('/about-me');
            }
            setError(false);
        },3000);
        }catch(err){
            setError(true);
            console.error(err.message);
        }
        
    }
     
    return(<main>
            <Heading>Login !!!</Heading>
            {(isSubmitted && !error) ?<div className={isSubmitted?"success alert submitted ":"success alert"}>Logged In succesfully</div>:""}
            <form className="login-form form" onSubmit={handleSubmit}>
                <div>
                    <label for='username'>Username: </label>
                    <input name="username" type="text" id='username' value={credentials.username} onChange={handleChange}/>
                </div>
                <div>
                        <label for='password'>Password: </label>
                        <input name="password" type="password" id='password' value={credentials.password} onChange={handleChange}/>
                </div>
                <div className="error error-message bold">{error?"invalid id or password":""}</div>
                <button  disabled={!(credentials.password && credentials.username)} className="login-btn">Login</button>
                <p>Dont have an account?? <NavLink to='/sign-up'>Sign Up</NavLink></p>
            </form>

    
        </main>
    )
}



export default LoginForm;
