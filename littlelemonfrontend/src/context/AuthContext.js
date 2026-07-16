import { useState,useContext,createContext ,useEffect} from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({children})=>{
    const [token,setToken]= useState(()=>localStorage.getItem('authToken'));
    const [user,setUser] = useState({first_name:null,last_name:null});
    const [loading,setLoading] = useState(true);
    const isLoggedIn = !!token;
   const fetchtUser = async(authtoken) =>{
        try{
            const response = await fetch("http://127.0.0.1:8000/auth/users/me",{
                method : 'GET',
                headers :{
                    'Authorization': `Token ${authtoken}`,

                }
            });
            if(response.ok){
                const userData = await response.json();
                setUser(userData);
               
            }
            
        }catch(error){
                logout();
        }finally{
            setLoading(false);
        } 
    }

    const login = async (newToken)=>{
            localStorage.setItem('authToken',newToken);
            setToken(newToken);
            setLoading(true);
            await fetchtUser(newToken);
        };
    const logout =()=>{
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
}
    //Automatically fetches user profile if token exists
    useEffect(()=>{
        if(token){
            fetchtUser(token);
        }else{
            setLoading(false);
        }
    },[token]);

    return(
        <AuthContext.Provider value ={{token,login,isLoggedIn,logout,user,loading}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth =()=>useContext(AuthContext);