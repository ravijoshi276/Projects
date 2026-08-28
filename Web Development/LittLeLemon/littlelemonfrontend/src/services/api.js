
//making headers
const makeHeaders = (token) =>({
    'Content-Type' : 'application/json',
    'Authorization': `Token ${token}`
});
const BASE_URL = process.env.REACT_APP_API_URL;

//Cart api
const cartApi ={
    getCart : async (token)=>{
        const response = await fetch(`${BASE_URL}/api/cart/menu-items`,{
            method: 'GET',
            headers : makeHeaders(token)
        } );
        if(!response.ok){
            throw new Error(`Failed to fetch cart`)
        }
        return response.json();
    },
    getAllCartItems : async (cartproducts)=>{
       
        const itemIds = cartproducts.map((item)=>item.menuitem);
        if (itemIds.length ===0) return [];
        const itemParams = itemIds.join(',');
        
        const response = await fetch(`${BASE_URL}/api/menu-items?ids=${itemParams}`);
        if (!response.ok) throw new Error('Failed to fetch cart products')
        return response.json();
        
    },
    updateCart : async(token,cartitem) =>{
        const response = await fetch(`${BASE_URL}/api/cart/menu-items`,{
            method: 'POST',
            headers : makeHeaders(token),
            body: [JSON.stringify(cartitem)]
        }
        )
        if (!response.ok){
            throw new Error(`Failed to update cart`)
        }
         return response.json();

    },
    deleteCart : async (token) =>{
        const response = await fetch(`${BASE_URL}/api/cart/menu-items`,{
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
const ordersApi={
    orderItems : async (token)=>{
        const response = await fetch(`${BASE_URL}/api/orders`,{
            method: 'POST',
            headers : makeHeaders(token),
         
        })
        if(!response.ok){
            throw new Error('Failed to create order');
        }

    },
    getOrders : async (token)=>{
        const response = await fetch(`${BASE_URL}/api/orders`,{
            method: 'GET',
            headers : makeHeaders(token),
         
        })
        if(!response.ok){
            throw new Error('Failed to get order');
        }
        return  response.json();

    },
    getAllOrders : async(orderItems)=>{
        const itemIds = orderItems.results.map(item=>item.orderitem.menuitem);
        if(itemIds.length===0){
            return []
        }
        const newitemsids=[...new Set(itemIds)];
        const ids = newitemsids.join(',');
        console.log(ids);
        const response = await fetch(`${BASE_URL}/api/menu-items?ids=${ids}`);
        if (!response.ok) throw new Error('Failed to fetch cart products')
        return  response.json();
    }

}

export {ordersApi, cartApi};