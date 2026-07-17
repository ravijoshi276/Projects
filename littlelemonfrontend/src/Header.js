import logo from './assets/images/Asset 16@4x.png'
import { NavLink, useNavigate } from 'react-router';
import { useAuth } from "./context/AuthContext";
import { useCart } from './context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCartShopping}  from '@fortawesome/free-solid-svg-icons'


const Header =({children})=>{
    const navigate =useNavigate(null);
    const {isLoggedIn,logout,token} =useAuth();
    const  {itemCount} =useCart();
    const handleLogout = async()=>{
        try{
            const response = await fetch('http://localhost:8000/auth/token/logout',{
                method:'POST',
                headers :{
                    'Content-Type': 'application/JSON',
                    'Authorization': `Token ${token}`
                }
        })
        if (response.ok){
            logout();
            navigate('/');
        }else{
            throw new Error("Failed to logout");
        }
        
    }catch(err){
        console.error("Failed to logout")
    }
    }
    return <div className="Header">
        <div className='logocover'><img src={logo} alt='LittleLemon Logos'></img></div>
        
        <div className='header-buttons'>
            {isLoggedIn?<button className='btn' onClick={handleLogout}>Log Out</button>:(<div className='login-btns'>    
            <NavLink to='/login'>Login</NavLink>
            <NavLink to='/sign-up'>Sign Up</NavLink>
            </div>)}
            <div className='cart-cover'>
            <NavLink to={isLoggedIn?'/cart':'/login'} className='cart'><div className='cart-count'>{isLoggedIn?itemCount:""}</div><FontAwesomeIcon icon={faCartShopping} size='lg' className='cart'/></NavLink>
            </div>
        </div>
    </div>
}
export default Header;

