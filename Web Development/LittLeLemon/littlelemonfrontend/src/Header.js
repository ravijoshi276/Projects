import logo from './assets/images/Asset 16@4x.png'
import { NavLink, useNavigate } from 'react-router';
import { useAuth } from "./context/AuthContext";
import { useCart } from './context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCartShopping,faCaretDown,faSun,faMoon}  from '@fortawesome/free-solid-svg-icons'
import { useTheme } from './context/ThemeContext';
import { useState } from 'react';

const BASE_URL = process.env.REACT_APP_API_URL;


const Header =({children})=>{
    const navigate =useNavigate();
    const {isLoggedIn,logout,token,group} =useAuth();
    const  {itemCount} =useCart();
    const {theme,toggleTheme} = useTheme();
    const [isHidden,setIsHidden]= useState(true);
    const [loggingOut, setLoggingOut] = useState(false);
    const handleLogout = async()=>{
        try{
            const response = await fetch(`${BASE_URL}/auth/token/logout`,{
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
    return <header className="flex  justify-center items-center mx-2 p-0.5 flex-wrap sm:p-1 md:flex-nowrap justify-between" >
        <div className=' w-1/4 p-1 grow sm:w-1/5 md:grow-0'><img src={logo} alt='LittleLemon Logo' className='h-full w-full object-contain'></img></div>
        {loggingOut?<div className='alert logout'>Logging out....</div>:""}
        <div className='flex h-full  mt-5 items-center justify-evenly  gap-5 grow sm:justify-end md:mt-0'>
            
             <button 
      type="button"
      className={`theme-toggle-btn ${theme!=="dark" ? 'active' : ''}`}
      aria-label="Toggle dark mode"
      aria-pressed={theme!=='dark'}
      onClick={()=>toggleTheme(theme)}
    >
      <span className="toggle-thumb" >{theme!=="dark"?<FontAwesomeIcon icon={faSun} size='sm' className='sun'/>:<FontAwesomeIcon icon={faMoon} size='sm' className='text-[var(--color-primary)]'/>}</span>
    </button>
  
            {isLoggedIn?(<div className={' text-center relative  '+(isHidden?"":'clicked')}><div className={"rounded-none bg-[var(--color--primary)] p-1.5 sm:p-2.5 account "+ (isHidden?'':' clicked')} onClick={handleClick} >Account<FontAwesomeIcon icon={faCaretDown} size='lg' className='cart'/></div><ul className={ "z-[1001] absolute "+ (isHidden?'hidden ':"profile-btns ")} onClick={handleClick}>
                {group !== 'user'?<li><NavLink className='nav-dashboard-btn' to='/dashboard'>Dashboard</NavLink></li>:""}
                <li><NavLink className='nav-dashboard-btn' to='/user/profile'>Profile</NavLink></li>
                <li><NavLink className='nav-dashboard-btn' to='/orders'>Orders</NavLink></li>
                <li><NavLink className='nav-dashboard-btn' to='user/reservations'>Reservations</NavLink></li>
                
                <li><button className='nav-dashboard-btn' onClick={handleLogout}>Log Out</button></li>
                </ul>
                </div>):(<div className='flex align-center  gap-5 grow min-w-[190px] max-w-[50%] sm:max-w-[45%]  text-center'>    
            
            <NavLink className= " grow px-3  rounded-lg border transition-all duration-200 btn-outline  " to='/login'>Login</NavLink>
            <NavLink className =" grow px-3  rounded-lg border border-transparent transition-all duration-200 btn-primary" to='/sign-up'>Sign Up</NavLink>
            </div>)}
            <div className='cart-cover'>
            <NavLink to={isLoggedIn?'/cart':'/login'} className='cart'><div className='cart-count'>{isLoggedIn?itemCount:""}</div><FontAwesomeIcon icon={faCartShopping} size='lg' className='cart'/></NavLink>
            </div>
        </div>
    </header>
}
export default Header;

