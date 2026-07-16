
//making headers
const makeHeaders = (token) =>({
    'Content-Type' : 'application/json',
    'Authorization': `Token ${token}`
});
//Cart api
const cartApi ={
    getCart : async (token)=>{
        const response = await fetch("http://localhost:8000///api/cart/menu-items",{
            method: 'GET',
            headers : makeHeaders(token)
        } );
        if(!response.ok){
            throw new Error("Failed to fetch cart")
        }
        return response.json();
    },
    getAllCartItems : async (cartproducts)=>{
       
        const itemIds = cartproducts.map((item)=>item.menuitem);
        if (itemIds.length ===0) return [];
        const itemParams = itemIds.join(',');
        
        const response = await fetch(`http://127.0.0.1:8000/api/menu-items?ids=${itemParams}`);
        if (!response.ok) throw new Error('Failed to fetch cart products')
        return response.json();
        
    },
    updateCart : async(token,cartitem) =>{
        const response = await fetch("http://localhost:8000///api/cart/menu-items",{
            method: 'POST',
            headers : makeHeaders(token),
            body: [JSON.stringify(cartitem)]
        }
        )
        if (!response.ok){
            throw new Error("Failed to update cart")
        }
         return response.json();

    },
    deleteCart : async (token) =>{
        const response = await fetch("http://localhost:8000///api/cart/menu-items",{
            method: 'POST',
            headers : makeHeaders(token),
         
        }
        )
        if(!response.ok){
            throw new Error('Failed to delete cart')
        }
        return []
    }

}
export default cartApi;