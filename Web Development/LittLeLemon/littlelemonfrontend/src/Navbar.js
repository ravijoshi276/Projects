import {Routes,Route,NavLink,BrowserRouter} from 'react-router';
import Homepage from './Hompage';
import {MenuPage} from './MenuPage';
import Header from './Header';
import LoginForm from './LoginForm';
import SignupForm from './SingupFrom';
import Cart from './Cart';
import ProtectedRouteCart from './ProtectedRouteCart';
import Orders from './Orders';
import Profile from './Profile';
import ProtectedRouteDashboard from './ProtectedRouteDashboard';
import SingleItemPage from './SingleItemPage';
import SingleMenuItemEdit from './SinglMenuItemEdit';
import MenuLayout from './MenuLayout';
import Dashboard from './Dashboard';
import ListMenuItems from './ListMenuItems';
import AddMenuItems from './AddMenuItems';
import EditManager from './EditManager';
import EditOrders from './EditOrders';
import EditDeliveryCrew from './EditDeliveryPerson';
import Footer from './Footer';
import ReservationForm from './ReservationForm';
import Reservations from './Reservations';
import ReservationOutletContext from './ReservationOutletContest';
import SingleReservatioPage  from './SingleReservationPage';
import About from './About';
import PasswordReset from './PasswordResert';
import { useState } from 'react';

export default function Navbar (){
return (<BrowserRouter>
<Header />
    {/*Navbar*/}
    <Navitems/>

    {/*Footer */}
      
    {/*Route to each page*/}
    <Routes>
        {/*Free Routes */}
        
        <Route path='/login' element={<LoginForm />}></Route>
        <Route path='/sign-up' element={<SignupForm />}></Route>
        <Route path='/' element ={<Homepage/>}></Route>
        <Route element={<MenuLayout/>}>
            <Route  path='/menu-items' element ={<MenuPage/>}></Route>
            <Route path='/menu-items/:id' element ={<SingleItemPage />}></Route>
        </Route>
        <Route path='/book-table' element ={<ReservationForm />}></Route>
        <Route path='/about-me' element ={<About />}></Route>
        
        {/*Protected Cart Route */}
        <Route element={<ProtectedRouteCart/>}>
        <Route element={<ReservationOutletContext />}>
            <Route path='user/reservations' element={<Reservations />}></Route>
            <Route path='user/reservations/:id' element={<SingleReservatioPage />}></Route>
        </Route>
            <Route path='/user/profile' element={<Profile />}></Route>
            <Route path='/reset-password' element={<PasswordReset />}></Route>

            <Route path='/orders' element={<Orders />}></Route>
            <Route path='/cart' element ={<Cart />}></Route>
        </Route>

        {/*Protected Dashboard Route */}
        <Route element={<ProtectedRouteDashboard/>}>
            <Route path='dashboard' element ={<Dashboard />}>
                <Route index element={<h1>Dashboard Home</h1>}/>
                <Route element={<MenuLayout />}>
                    <Route  path='menu-items' element={<ListMenuItems />}/>
                    <Route path='menu-items/:id' element={<SingleMenuItemEdit />} />
                    <Route path='menu-items/add' element ={<AddMenuItems />} />
                    <Route path='managers' element ={<EditManager />} />
                    <Route path='delivery-crew' element ={<EditDeliveryCrew />} />
                    <Route path='orders' element ={<EditOrders />} />
                </Route>
                
            </Route>
        </Route>
    
    </Routes>
    <Footer />
</BrowserRouter>
);
}


const Navitems = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const toggleMenu = () => setIsOpen(prev => !prev);
    const closeMenu = () => setIsOpen(false);

    // Optimized: Leverage react-router-dom's native class function cleanly
    const getLinkStyle = ({ isActive }) => `
        block text-center py-2 px-4 transition-all duration-200 w-full sm:w-auto sm:rounded-md font-medium
        ${isActive 
            ? 'bg-[var(--bg-active-container)] text-[var(--text-active)] ring-1 ring-[var(--border-color)]' 
            : 'bg-[var(--bg-container)] text-[var(--text-main)] hover:opacity-85'
        }
    `.trim();

    const links = [
        { to: "/", label: "Home" },
        { to: "/menu-items", label: "Menu" },
        { to: "/book-table", label: "Book Table" },
        { to: "/about-me", label: "About Us" }
    ];

    return (
        <nav className="sticky top-0 z-50 w-full bg-[var(--bg-surface)] border-b border-[var(--border-color)] px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between transition-colors duration-200">
            
            {/* Header Area (Brand & Accessible Toggle) */}
            <div className="flex items-center justify-between w-full sm:w-auto sm:hidden">
                <span className="text-xl font-bold tracking-tight text-[var(--text-main)]">
                    Little <span className='lemon'>Lemon</span>
                </span> 
                
                <button 
                    type="button" 
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isOpen}
                    onClick={toggleMenu}
                    className="sm:hidden bg-[var(--bg-container)] border border-[var(--border-color)] w-10 h-10 flex items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--border-color)] text-[var(--text-main)]"
                >
                    {isOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
</svg>

                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
</svg>

                    )}
                </button>
            </div>


            <ul 
                className={`
                    ${isOpen ? 'flex' : 'hidden'} 
                    flex-col w-full gap-2 mt-4 transition-all duration-500 ease-in-out border-none
                    sm:flex sm:flex-row sm:items-center sm:gap-4 sm:mt-0 sm:ml-auto sm:w-full sm:justify-evenly sm:border-solid border-[3px] border-[var(--border-color)] rounded-[20px] py-2
                `}
                onClick={closeMenu}
            >
                {links.map((link) => (
                    <li key={link.to} className="w-full sm:w-auto">
                        <NavLink to={link.to} className={getLinkStyle}>
                            {link.label}
                        </NavLink>
                    </li>
                ))}
            </ul>

        </nav>
    );
};

