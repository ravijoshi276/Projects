import {Routes,Route,NavLink,BrowserRouter} from 'react-router';
import Homepage from './Hompage';
import MenuPage from './MenuPage';
import Header from './Header';
import LoginForm from './LoginForm';
import SignupForm from './SingupFrom';
import Cart from './Cart';
import ProtectedRouteCart from './ProtectedRouteCart';

export default function Navbar (){
return (<BrowserRouter>
<Header />
    {/*Navbar*/}
    <Navitems/>
    {/*Route to each page*/}
    <Routes>
        {/*Free Routes */}
        <Route path='/login' element={<LoginForm />}></Route>
        <Route path='/sign-up' element={<SignupForm />}></Route>
        <Route path='/' element ={<Homepage/>}></Route>
        <Route path='/menu-items' element ={<MenuPage/>}></Route>
        <Route path='/book-table' element ={<h1>Book Table</h1>}></Route>
        <Route path='/about-me' element ={<h1>About Page</h1>}></Route>
        
        {/*Protected Cart Route */}
        <Route element={<ProtectedRouteCart/>}>
            <Route path='/cart' element ={<Cart />}></Route>
        </Route>
    
    </Routes>
</BrowserRouter>
);
}

//Navbar creation
const Navitems = ()=>{
    return (

<nav>
<NavLink to='/'>Home</NavLink>
<NavLink to='/menu-items'>Menu</NavLink>
<NavLink to='/book-table'>Book Table</NavLink>
<NavLink to='/about-me'>About Us</NavLink>
</nav>
)
}