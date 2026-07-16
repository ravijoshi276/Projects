import { useState } from "react";
import { useNavigate } from "react-router";

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
            if (!response.ok){
                throw new Error(`Server responded with :  ${response.status}`);
                setError(true);
            }
            setFromdata({first_name:'',
        last_name:'',
        username:'',
        email:'',
        password:'',
        re_password:''
    })
            navigate('/login');
            
        }

    catch(err){
        
    }
}
    return(
        <div>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit} className="signup-from form">
                <div>
                    <label for='username'>Username</label>
                    <input type="text" name='username' id='username' className="required" value={formdata.username} onChange={handleChange} required></input>
                </div>
                <div>
                    <label for='firstname'>First Name: </label>
                    <input type="text" name='first_name' id='firstname' className="required" value={formdata.first_name} onChange={handleChange} required></input>
                </div>
                <div>
                    <label for='lastname'>Last Name: </label>
                    <input type="text" name='last_name' id='lastname' value={formdata.last_name} onChange={handleChange} ></input>
                </div>
                <div>
                    <label for='email'>Email: </label>
                    <input type="email" name='email' id='email' value={formdata.email} onChange={handleChange} required></input>
                </div>
                <div>
                    <label for='password'>Password: </label>
                    <input type="password" name='password' id='password' value={formdata.password} onChange={handleChange} required></input>
                </div>
                <div>
                    <label for='re_password'>Re-type Password: </label>
                    <input type="password" name='re_password' id='re_password' value={formdata.re_password} onChange={handleChange} onBlur={validatePassword} required></input>
                    <div>{validatepassword?"":"password do not match"}</div>
                </div>
                <button type="submit" disabled={!(formdata.username && formdata.first_name && formdata.email && formdata.password && validatepassword )}>Sign Up</button>
            </form>
        </div>
    )
}

export default SignupForm;