import logo from './assets/images/Asset 16@4x.png'
import { NavLink, useNavigate } from 'react-router';
import { useAuth } from "./context/AuthContext";
import { useCart } from './context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCartShopping}  from '@fortawesome/free-solid-svg-icons'
import { useContext } from 'react';

const Header =({children})=>{
    const navigate =useNavigate(null);
    const {isLoggedIn,logout} =useAuth();
    const  {itemCount} =useCart();
    const handleLogout = ()=>{
        logout();
        navigate('/');
    }
    return <div className="Header">
        <div className='logocover'><img src={logo} alt='LittleLemon Logos'></img></div>
        
        <div className='header-buttons'>
            {isLoggedIn?<button className='btn' onClick={handleLogout}>Log Out</button>:(<div className='login-btns'>    
            <NavLink to='/login'>Login</NavLink>
            <NavLink to='/sign-up'>Sign Up</NavLink>
            </div>)}
            <div className='cart-cover'>
            <NavLink to={isLoggedIn?'/cart':'/login'} className='cart'><diV className='cart-count'>{isLoggedIn?itemCount:""}</diV><FontAwesomeIcon icon={faCartShopping} size='lg' className='cart'/></NavLink>
            </div>
        </div>
    </div>
}
export default Header;

