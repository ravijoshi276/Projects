import  footer_logo from './assets/images/Asset 20@4x.png'
import { NavLink } from 'react-router';
import { useAuth } from './context/AuthContext'
import Section from "./Section"
import Heading from "./Heading"

export default function Footer (){
    const {isLoggedIn} = useAuth();
    
    return (

<footer className="w-full mt-20 bg-[var(--bg-container)] text-[var(--text-main)] border-t border-[var(--border-color)]">
  
  {/* Inner constraint container to keep layout aligned with the main page grid */}
  <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 items-start">
    
    {/* COLUMN 1: Brand Identifier & Logo Showcase */}
    <Section sectionclass="flex flex-col items-start space-y-4">
      <div className="footer-logo w-36 h-auto max-w-full overflow-hidden">
        <img 
          src={footer_logo} 
          alt="Little Lemon Logo" 
          className="w-full h-full object-contain filter drop-shadow-sm" 
        />
      </div>
      <p className="text-xs md:text-sm text-[var(--text-muted)] leading-relaxed max-w-[200px]">
        Serving fresh, vibrant, traditional Mediterranean recipes with a modern twist.
      </p>
    </Section>

    {/* COLUMN 2: Private Account Operations (Rendered via Conditional Session Flags) */}
    {isLoggedIn && (
      <Section sectionclass="flex flex-col space-y-4 min-w-0">
        <Heading className="text-sm md:text-base font-serif font-bold tracking-wider uppercase text-[var(--color-primary)]">
          Your Account
        </Heading>
        <ul className="footer-links space-y-2.5 text-sm">
          <li>
            <NavLink 
              to='/profile' 
              className="font-medium text-[var(--text-main)] hover:text-[var(--text-link-hover)] transition-colors duration-200 block py-0.5"
            >
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink 
              to='/cart' 
              className="font-medium text-[var(--text-main)] hover:text-[var(--text-link-hover)] transition-colors duration-200 block py-0.5"
            >
              Cart
            </NavLink>
          </li>
          <li>
            <NavLink 
              to='/orders' 
              className="font-medium text-[var(--text-main)] hover:text-[var(--text-link-hover)] transition-colors duration-200 block py-0.5"
            >
              Orders
            </NavLink>
          </li>
        </ul>
      </Section>
    )}

    {/* COLUMN 3: Global Core Discoverability Hub */}
    <Section sectionclass="flex flex-col space-y-4 min-w-0">
      <Heading className="text-sm md:text-base font-serif font-bold tracking-wider uppercase text-[var(--color-primary)]">
        Quick Links
      </Heading>
      <ul className="footer-links space-y-2.5 text-sm">
        <li>
          <NavLink 
            to='/' 
            className="font-medium text-[var(--text-main)] hover:text-[var(--text-link-hover)] transition-colors duration-200 block py-0.5"
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink 
            to='/menu-items' 
            className="font-medium text-[var(--text-main)] hover:text-[var(--text-link-hover)] transition-colors duration-200 block py-0.5"
          >
            Menu Page
          </NavLink>
        </li>
        <li>
          <NavLink 
            to='/book-table' 
            className="font-medium text-[var(--text-main)] hover:text-[var(--text-link-hover)] transition-colors duration-200 block py-0.5"
          >
            Book Now
          </NavLink>
        </li>
        <li>
          <NavLink 
            to='/about-me' 
            className="font-medium text-[var(--text-main)] hover:text-[var(--text-link-hover)] transition-colors duration-200 block py-0.5"
          >
            About Us
          </NavLink>
        </li>
      </ul>
    </Section>

    {/* COLUMN 4: Contact & Geographical Location Information */}
    <Section sectionclass="flex flex-col space-y-4 w-full min-w-0">
      <Heading className="text-sm md:text-base font-serif font-bold tracking-wider uppercase text-[var(--color-primary)]">
        Contact Us
      </Heading>
      
      {/* Contact item block configurations with smart wrapping protection metrics */}
      <div className="space-y-3.5 text-sm text-[var(--text-main)]">
        <div className="flex flex-col space-y-0.5 break-words">
          <span className="font-semibold text-xs tracking-wider uppercase text-[var(--text-muted)]">Address</span>
          <span className="leading-relaxed">342 Olive Grove Way, Suite 100, San Francisco, CA 94110</span>
        </div>
        
        <div className="flex flex-col space-y-0.5">
          <span className="font-semibold text-xs tracking-wider uppercase text-[var(--text-muted)]">Phone Number</span>
          <a href="tel:4155550198" className="hover:text-[var(--text-link-hover)] transition-colors duration-150 inline-block w-fit">
            (415) 555-0198
          </a>
        </div>
        
        <div className="flex flex-col space-y-0.5 break-words">
          <span className="font-semibold text-xs tracking-wider uppercase text-[var(--text-muted)]">Email</span>
          <a href="mailto:hello@littlelemonrestaurant.com" className="hover:text-[var(--text-link-hover)] transition-colors duration-150 inline-block w-fit underline decoration-[var(--border-color)] underline-offset-4">
            hello@littlelemonrestaurant.com
          </a>
        </div>
      </div>
    </Section>

  </div>

  {/* Bottom copyright segment bar providing explicit system visual containment boundaries */}
  <div className="w-full border-t border-[var(--border-color)] bg-[var(--bg-surface)] py-4 px-6 text-center text-xs text-[var(--text-muted)] font-medium">
    &copy; {new Date().getFullYear()} Little Lemon Restaurant. All rights reserved.
  </div>
</footer>
)
}