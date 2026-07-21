import { useState } from "react";
import { useNavigate,NavLink } from "react-router";

function SignupForm(){
    const [formdata,setFromdata]=useState({
        first_name:'',
        last_name:'',
        username:'',
        email:'',
        password:'',
        re_password:''
    })
    const [error,setError] = useState(false);
    const [errorMessage,setErrormessage]= useState(false);
    const navigate = useNavigate();
    const [validatepassword,setValidatepassword] = useState(true);
    const validatePassword = (e)=>{
        if(e.target.value===formdata.password){
           setValidatepassword(true);
        }else{
            setValidatepassword(false);
        }
    }
    const handleChange = (e)=>{
        setFromdata((prev)=>({...prev,[e.target.name]:e.target.value}))
    }
    const handleSubmit = async(e)=>{
        e.preventDefault();
        setError(false);
        try{
            const response = await fetch('http://localhost:8000/auth/users/',{
                method:"POST",
                headers :{
                    'Content-Type': 'application/JSON',
                },
                body : JSON.stringify(formdata),
            });
            if (response.ok){
                
        setFromdata({first_name:'',
        last_name:'',
        username:'',
        email:'',
        password:'',
        re_password:''
    })
            navigate('/login');
            }else{
                setErrormessage(response.body);
                throw new Error(`Some Error occured ${response}`);
            }
            
        }catch(err){
            console.log("This is msg",errorMessage);
        setError(true);
        console.log(err);
        
            }
        }
    

    return(
        <main>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit} className="signup-form form">
                <div>
                    <label className="required" for='username'>Username</label>
                    <input type="text" name='username' id='username' className="required" value={formdata.username} onChange={handleChange} required></input>
                </div>
                {errorMessage?<div className="error">Username already exists</div>:""}
                <div>
                    <label className="required" for='firstname'>First Name: </label>
                    <input type="text" name='first_name' id='firstname' className="required" value={formdata.first_name} onChange={handleChange} required></input>
                </div>
                <div>
                    <label for='lastname'>Last Name: </label>
                    <input type="text" name='last_name' id='lastname' value={formdata.last_name} onChange={handleChange} ></input>
                </div>
                <div>
                    <label className="required" for='email'>Email: </label>
                    <input type="email" name='email' id='email' value={formdata.email} onChange={handleChange} required></input>
                </div>
                <div>
                    <label className="required" for='password'>Password: </label>
                    <input type="password" name='password' id='password' value={formdata.password} onChange={handleChange} required></input>
                </div>
                <div>
                    <label className="required" for='re_password'>Re-type Password: </label>
                    <input type="password" name='re_password' id='re_password' value={formdata.re_password} onChange={handleChange} onBlur={validatePassword} required></input>
                </div>
                <div className="error">{validatepassword?"":"password do not match"}</div>
                {error?<p className="error">Some error occured</p>:""}
                <button type="submit" disabled={!(formdata.username && formdata.first_name && formdata.email && formdata.password && validatepassword )} className="signup-btn">Create Account</button>
                <p>Already have an account?? <NavLink to='/login'>Login</NavLink></p>
            </form>
        </main>
    )
}

export default SignupForm;