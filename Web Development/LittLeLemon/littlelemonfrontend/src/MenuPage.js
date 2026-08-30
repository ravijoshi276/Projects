import {useState,useTransition,useRef} from 'react';
import Section from './Section';
import Heading from './Heading';
import placeholder_image from "./assets/images/menuitem-placeholder.png"
import backgroundImage from "./assets/images/Compressed-images/Paav-Bhaji.jpg"
import { useCart } from './context/CartContext';
import { NavLink,useOutletContext } from 'react-router';
import { useAuth } from './context/AuthContext';


function MenuPage(){
  const { group, user, isLoggedIn } = useAuth();
  const { menuData, categoryData } = useOutletContext();
  const { addToCart } = useCart();
  const [query, setQuery] = useState(""); 
  const [isPending, startTransition] = useTransition();

  // Filter items safely based on search query
  const itemData = menuData ? menuData.results.filter(item => {
    if(query.trim().length === 0){
        return item;
    } else if(item.title.toLowerCase().includes(query.trim().toLowerCase())){
        return item;
    }
  }) : null;

  const handleChange = (e) => {
    const value = e.target.value;
    startTransition(() => {   
      setQuery(value);
    });
  }

  // Generate Menu Sections and Cards
  const MenuCards = categoryData ? categoryData.results.map(category => {
    // Filter items belonging to this category
    const categoryItems = itemData ? itemData.filter(item => item.category === category.id) : [];

    // If no items match the search filter for this category, skip rendering the section
    if (categoryItems.length === 0) return null;

    return (
      <Section sectionclass={'menuitems mb-12'} key={category.id}>
        {/* Category Header */}
        <div className='menu-item-heading mb-6 border-b border-[#D9D9D9]/50 pb-2'>
          <Heading className="text-2xl font-bold text-[#495E57]">{category.title}</Heading>
        </div> 

        {/* Responsive Grid: 1 col on mobile, 2 cols on larger screens, centered */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 justify-center">
          {categoryItems.map(item => (
            <Menucard 
              key={item.id}
              id={item.id}
              title={item.title} 
              price={item.price} 
              image={item.image_url} 
              description={item.description} 
              addfunc={addToCart} 
              loggedin={isLoggedIn} 
              featured={Boolean(item.featured)} 
              backgroundImage={item.compressed_image}
            />
          ))}
        </div>
      </Section>
    );
  }).filter(Boolean) : <div className="text-center py-10 text-[#666666]">No data available</div>;

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-6 lg:px-8 py-8">
      
      {/* Header & Search Bar Section */}
      <div className='heading-with-search flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 bg-[#EDEFEE] p-6 rounded-2xl shadow-sm'>
          <Heading className="text-3xl font-extrabold text-[#495E57]">Menu Items</Heading>
          
          <div className='search-bar-cover flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-[#D9D9D9] shadow-sm w-full lg:w-80'>
              <span className="text-xs font-bold text-[#666666] uppercase tracking-wider">Search</span>
              <input 
                className='search-bar w-full bg-transparent text-[#333333] focus:outline-none text-sm placeholder:text-[#666666]/60' 
                type='text' 
                onChange={handleChange} 
                value={query} 
                placeholder='Search menu items...'
              />
          </div>
      </div>

      {/* Pending transition loader */}
      {isPending && (
        <div className="text-center py-6 text-sm font-semibold text-[#495E57] animate-pulse">
          Updating results......
        </div>
      )}

      {/* Conditional Rendering for Empty States or Content */}
      {itemData && itemData.length === 0 ? (
        <div className='empty-result text-center py-16 bg-white rounded-2xl border border-[#D9D9D9] shadow-sm'>
          <p className="text-lg font-bold text-[#333333]">No Matching Values</p>
          <p className="text-sm text-[#666666] mt-1">Try searching for something else.</p>
        </div>
      ) : !menuData ? (
        <div className="text-center py-16 text-[#666666] font-medium">Loading menu...</div>
      ) : (
        MenuCards
      )} 
      
    </main>
  );
}


const Menucard = ({ id, title, image, description, price, addfunc, loggedin, featured, backgroundImage }) => {
  const [isAdded, setIsAdded] = useState(false);  
  
  const imageurl = backgroundImage && backgroundImage.includes("/media/") 
    ? "./assets/images/" + backgroundImage.split("/media/", 2)[1] 
    : backgroundImage || "";

  const imgRef = useRef(null);

  const handleLoad = (e) => {
    const imgElement = e.target; 
    const coverElement = imgElement.parentElement; 
    
    imgElement.classList.remove('not-loaded');
    imgElement.classList.add('loaded');
    
    coverElement.classList.remove('not-loaded');
    coverElement.classList.add('loaded');
    coverElement.style.backgroundImage = 'none';
  }

  const handleClick = () => {
    setIsAdded(!isAdded);
    addfunc(id, price, title, image);
  }

  return (
    <article className="card group bg-white rounded-2xl border border-[#D9D9D9]/80 shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:border-[#495E57]/40 flex flex-col lg:flex-row lg:h-56 relative w-full">
      
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5 border border-[#F4CE14]/50">
          <svg className="w-4 h-4 fill-[#F4CE14]" viewBox="0 0 24 24">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span className="text-[11px] font-bold text-[#333333] tracking-wider uppercase">Featured</span>
        </div>
      )}

      
      <div 
        className="image-cover not-loaded w-full lg:w-52 h-48 lg:h-56 bg-[#EDEFEE] relative overflow-hidden flex-shrink-0" 
        style={{ backgroundImage: `url(${imageurl})` }}
      >
        <img 
          className="not-loaded w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          ref={imgRef} 
          src={image || placeholder_image} 
          alt={image ? title : 'placeholder'} 
          onLoad={handleLoad} 
          loading='lazy'
        />
      </div>

      {/* Content Section: Fills remaining space with built-in height clamping */}
      <div className="item flex-1 p-4 lg:p-5 flex flex-col justify-between bg-white h-full overflow-hidden">
        
        <div className='item-details space-y-1.5'>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-bold text-[#333333] tracking-tight group-hover:text-[#495E57] transition-colors truncate">
                {title}
              </h3>
              <span className="hidden lg:inline-block text-lg font-extrabold text-[#495E57] flex-shrink-0">
                ${price}
              </span>
            </div>

            {/* line-clamp-2 limits description text to 2 lines maximum to keep card heights uniform */}
            <p className='description text-[#666666] text-xs lg:text-sm leading-relaxed line-clamp-2'>
              {description ? description : "No description available."}
            </p>
            
            <div>
              <NavLink 
                to={"../menu-items/" + id} 
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#495E57] hover:text-[#394B45] transition-colors underline underline-offset-4"
              >
                View details &rarr;
              </NavLink>
            </div>
        </div>

        {/* Footer Actions */}
        <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-2 mt-3 pt-3 border-t border-[#D9D9D9]/40'>
            
            <div className="flex items-center justify-between lg:hidden">
              <span className='text-xs font-bold text-[#666666] uppercase tracking-wider'>Price</span>
              <span className="text-base font-extrabold text-[#495E57]">${price}</span>
            </div>
            <div className='flex w-full justify-between gap-[5%]'>
            <div className="flex items-center w-[40%]">
              {!loggedin ? (
                <span className='lemon msg text-[11px] font-medium text-[#666666] bg-[#EDEFEE] px-2.5 py-1 rounded-lg border border-[#D9D9D9]/50'>
                  🔒 Login to order
                </span>
              ) : isAdded ? (
                <NavLink 
                  className='w-[40%] bg-[#F4CE14] hover:bg-[#D4B10B] text-[#333333] px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm text-center' 
                  to='/cart'
                >
                  ✓ Go to Cart
                </NavLink>
              ) : null}
            </div>
            
            <button 
              className="w-[40%] lg:w-auto bg-[#495E57] hover:bg-[#394B45] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed" 
              onClick={handleClick} 
              disabled={isAdded || !loggedin}
            >
              {isAdded ? "Added" : "+ Add"}
            </button>
          </div>
        </div>

      </div>
    </article>
  );
};

export {Menucard,MenuPage};