import  footer_logo from './assets/images/Asset 20@4x.png'
import { NavLink } from 'react-router';
import { useAuth } from './context/AuthContext'

export default function Footer (){
    const {isLoggedIn} = useAuth();
    
    return (<footer>
        <section>
        <div className='footer-logo'>
            <img src={footer_logo} alt="Little Lemon Logo" />
        </div>
        </section>
        <section >
            <h6>Quick Links</h6>
            <div className='footer-links'>
            {isLoggedIn?<ul>
                <li><NavLink to='/profile'>Profile</NavLink></li>
                <li><NavLink to='/cart'>Cart</NavLink></li>
                <li><NavLink to='/orders'>Orders</NavLink></li>

            </ul>:""}
            <ul>
                <li><NavLink to='/'>Home</NavLink></li>
                <li><NavLink to='/menu-items'>Menu Page</NavLink></li>
                <li><NavLink to='/book-table'>Book Now</NavLink></li>
                <li><NavLink to='/about-me'>About Us</NavLink></li>

            </ul>
            </div>
            
        </section>
        <section>
            <h6>Contact Us</h6>
            <div><span className='fw-500'>Address:</span><span> 342 Olive Grove Way, Suite 100, San Francisco, CA 94110</span></div><div>

<span className='fw-500'>Phone Number:</span><span> (415) 555-0198 </span></div><div>

<span className='fw-500'>Email:</span> <span> hello@littlelemonrestaurant.com</span></div>
        </section>
        </footer>)
}