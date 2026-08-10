import logo from './assets/images/Asset 16@4x.png'
import { NavLink, useNavigate } from 'react-router';
import { useAuth } from "./context/AuthContext";
import { useCart } from './context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCartShopping,faLightbulb,faCaretDown}  from '@fortawesome/free-solid-svg-icons'
import { useTheme } from './context/ThemeContext';
import { useState } from 'react';

const Header =({children})=>{
    const navigate =useNavigate();
    const {isLoggedIn,logout,token,group} =useAuth();
    const  {itemCount} =useCart();
    const {theme,toggleTheme} = useTheme();
    const [isHidden,setIsHidden]= useState(true);
    const [loggingOut, setLoggingOut] = useState(false);
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
            setLoggingOut(true);
            setTimeout(()=>{
                setLoggingOut(false);
                navigate('/');
            },3000);
            
        }else{
            throw new Error("Failed to logout");
        }
        
    }catch(err){
        console.error("Failed to logout")
    }
    }
    const handleClick = ()=>{
        setIsHidden(prev=>!prev);
    }
    return <header className="Header">
        <div className='logocover'><img src={logo} alt='LittleLemon Logos'></img></div>
        {loggingOut?<div className='alert logout'>Logging out....</div>:""}
        <div className='header-buttons'>
            <div className='theme-button-cover'><button className='theme-toggle-btn' onClick={()=>toggleTheme(theme)}><FontAwesomeIcon icon={faLightbulb} size='lg' className='cart'/></button></div>
            
            {isLoggedIn?(<div className={isHidden?'profile-btn-holder':'profile-btn-holder clicked'}><div className={isHidden?'account':'account clicked'} onClick={handleClick} >Account<FontAwesomeIcon icon={faCaretDown} size='lg' className='cart'/></div><ul className={isHidden?'hidden':"profile-btns"} onClick={handleClick}>
                {group !== 'user'?<li><NavLink className='btns' to='/dashboard'>Dashboard</NavLink></li>:""}
                <li><NavLink className='btns' to='/user/profile'>Profile</NavLink></li>
                <li><NavLink className='btns' to='/orders'>Orders</NavLink></li>
                <li><button className='btns' onClick={handleLogout}>Log Out</button></li>
                </ul>
                </div>):(<div className='login-btns'>    
            
            <NavLink to='/login'>Login</NavLink>
            <NavLink to='/sign-up'>Sign Up</NavLink>
            </div>)}
            <div className='cart-cover'>
            <NavLink to={isLoggedIn?'/cart':'/login'} className='cart'><div className='cart-count'>{isLoggedIn?itemCount:""}</div><FontAwesomeIcon icon={faCartShopping} size='lg' className='cart'/></NavLink>
            </div>
        </div>
    </header>
}
export default Header;

