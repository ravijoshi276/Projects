import Section from "./Section"
import Heading from "./Heading"
import { Link } from "react-router"
import { useAuth } from "./context/AuthContext";

export default function Homepage () {
    const {isLoggedIn,user,loading}= useAuth();
    return(
        <main>
             {isLoggedIn?<div className="welcome-message">Welcome  {loading?"Loading....":user.first_name} !!!</div>:""}
            <Heading>Welcome to Little Lemon! Experience the true taste of authentic local flavors</Heading>
            {/*hero Section */}
           
            <Section sectionclass='hero'>
                    <Heading>
                        Traditional Mediterranean Recipes. Served with a Modern Twist
                    </Heading>
                    <p className="subheading">
                        A seasonal rotation of Italian, Greek, and Turkish flavors in the heart of Chicago
                    </p>
                    <div>
                    <Link to='/menu-items' className="cta-btn">Checkout our menu</Link>
                    <Link to='/book-table' className="cta-btn">Book a table</Link>
                    </div>
                    {/*Hero Image*/}
                    <div className="imger-cover">
                    <img src={require('./assets/images/heroimage.jpg')} alt='Little Lemon restaurant'/>
                    </div>
            </Section> 
        
        
        </main>
    );
    
}
