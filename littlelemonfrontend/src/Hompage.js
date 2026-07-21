import Section from "./Section"
import Heading from "./Heading"
import { Link } from "react-router"
import { useAuth } from "./context/AuthContext";

export default function Homepage () {
    const {isLoggedIn,user,loading}= useAuth();
    return(
        <main>
             {isLoggedIn?<div className="welcome-message">Welcome  <span className="lemon">{loading?"Loading....":user.first_name} !!!</span></div>:""}
            <Heading>Welcome to <span className="lemon">Little Lemon!</span> Experience the true taste of authentic local flavors</Heading>
            {/*hero Section */}
           
            <Section sectionclass='hero'>
                    <Heading>
                        Traditional Mediterranean Recipes. Served with a Modern Twist
                    </Heading>
                    <p className="subheading">
                        A seasonal rotation of Italian, Greek, and Turkish flavors in the heart of Chicago
                    </p>
                    <div className="cta-btn-group">
                    <Link to='/menu-items' className="btn cta-btn ">Checkout Menu</Link>
                    <Link to='/book-table' className="btn cta-btn ">Book a table</Link>
                    </div>
                    {/*Hero Image*/}
                    <div className="imger-cover">
                    <img src={require('./assets/images/heroimage.jpg')} alt='Little Lemon restaurant'/>
                    </div>
            </Section> 
        
        
        </main>
    );
    
}
