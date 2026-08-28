import Section from "./Section"
import Heading from "./Heading"
import { Link } from "react-router"
import { useAuth } from "./context/AuthContext";

export default function Homepage () {
    const {isLoggedIn,user,loading,group}= useAuth();
    return(
        <main className="mx-5 lg:mx-[5%]">
  {isLoggedIn ? (
    <div className="welcome-message text-base md:text-lg mb-6 font-sans">
      Welcome {group} <span className="lemon font-semibold text-[var(--color-secondary)]">{loading ? "Loading...." : user.first_name} !!!</span>
    </div>
  ) : ""}

  <Heading className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[var(--text-main)] mb-8 leading-tight">
    Welcome to <span className="text-[length:0.9em] text-[var(--color-secondary)]">Little Lemon!</span> Experience the true taste of authentic local flavors
  </Heading>
  
  {/* Hero Section */}
  <Section sectionclass="hero w-full mt-10 bg-[var(--color-primary)] text-white p-6 sm:p-10 lg:p-14 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12">
    
    {/* Text Layout Block */}
    <div className="flex-1 w-full space-y-6 min-w-0">
      <Heading className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[var(--color-secondary)] leading-tight tracking-wide break-words">
        Traditional Mediterranean Recipes. Served with a Modern Twist
      </Heading>
      
      <p className="subheading text-sm sm:text-base lg:text-lg text-[var(--bg-container)] leading-relaxed max-w-xl break-words opacity-90">
        A seasonal rotation of Italian, Greek, and Turkish flavors in the heart of Chicago
      </p>
      
      {/*Button Container */}
      <div className="cta-btn-group flex flex-col sm:flex-row sm:flex-wrap gap-4 pt-2 w-full">
        <Link 
          to='/book-table' 
          className="btn cta-btn inline-flex items-center justify-center text-center text-sm sm:text-base font-semibold rounded-md px-5 py-3.5 bg-[var(--color-secondary)] text-[var(--text-main)] hover:bg-[var(--color-secondary-hover)] hover:text-[var(--text-main)]  transition-all duration-200 w-full sm:w-auto min-w-[160px] max-w-full whitespace-normal break-words shadow-sm"
        >
          Book a table
        </Link>
        
        <Link 
          to='/menu-items' 
          className="btn cta-btn inline-flex items-center justify-center text-center text-sm sm:text-base font-semibold rounded-md px-5 py-3.5 border-2 border-[var(--bg-container)] text-[var(--bg-container)] hover:bg-[var(--bg-container)] hover:text-[var(--text-main)] transition-all duration-200 w-full sm:w-auto min-w-[160px] max-w-full whitespace-normal break-words shadow-sm"
        >
          Checkout Menu
        </Link>
      </div>
    </div>

    {/* Dynamic Image Block */}
    <div className="image-cover w-full md:w-1/2 max-w-[460px] aspect-[4/3] sm:aspect-[16/10] md:aspect-[4/3] rounded-xl overflow-hidden shadow-lg border border-white/10 shrink-0">
      <img 
        src={require('./assets/images/heroimage.jpg')} 
        alt="Little Lemon restaurant showcase"
        className="w-full h-full object-cover transform hover:scale-102 transition-transform duration-300"
      />
    </div>
  </Section> 
</main>

    );
    
}
