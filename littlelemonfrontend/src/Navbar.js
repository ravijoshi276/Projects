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
        <Route path='/about-me' element ={<h1>About Page</h1>}></Route>
        
        {/*Protected Cart Route */}
        <Route element={<ProtectedRouteCart/>}>
        <Route element={<ReservationOutletContext />}>
            <Route path='user/reservations' element={<Reservations />}></Route>
            <Route path='user/reservations/:id' element={<SingleReservatioPage />}></Route>
        </Route>
            <Route path='/user/profile' element={<Profile />}></Route>
        
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