import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./context/AuthContext";
const LoginForm =()=>{
    const [credentials,setCredentials]= useState({
        username:'',password:''
    });
    const {login,group} = useAuth();
    const [error,setError]=useState(false);
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
            const data = await response.json();
            login(data);
            resetCredentials();
            if(group==="user"){
                navigate('/menu-items');
            }else if(group==="deliverycrew"){
                navigate('/')
            }else{
                navigate('/about-me');
            }
            setError(false);
            console.log("Success! Server Response: ",data);
            
        }catch(err){
            setError(true);
            console.error(err.message);
        }
        
    }
     
    return(
        <div>
            <h1>Login !!!</h1>
            <form className="login-form form" onSubmit={handleSubmit}>
                <div>
                    <label for='username'>Username: </label>
                    <input name="username" type="text" id='username' value={credentials.username} onChange={handleChange}/>
                </div>
                <div>
                        <label for='password'>password: </label>
                        <input name="password" type="password" id='password' value={credentials.password} onChange={handleChange}/>
                </div>
                <div className="error message">{error?"invalid id or password":""}</div>
                <button  disabled={!(credentials.password && credentials.username)}>Login</button>
            </form>

        </div>
    )
}



export default LoginForm;
