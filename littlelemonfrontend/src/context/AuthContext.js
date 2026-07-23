import { useState,useContext,createContext ,useEffect} from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({children})=>{
    const [token,setToken]= useState(()=>localStorage.getItem('authToken'));
    const [user,setUser] = useState({first_name:null,last_name:null});
    const [group,setGroup] = useState(null);
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
   

    const login = async (data)=>{
            localStorage.setItem('authToken',data.auth_token);
            const groups = data.groups;
            let detectedgroup = 'user';
            
            if(groups.length>0){
            if(groups.includes("Manager")){
                detectedgroup='manager';
            }else if (groups.includes("Delivery Crew")){
                detectedgroup="deliverycrew";
            }
            }
            setGroup(detectedgroup);
            console.log('auth',group);
            setToken(data.auth_token);
            setLoading(true);
            await fetchtUser(data.auth_token);
        };
    const logout =()=>{
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
        setGroup(null);
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
        <AuthContext.Provider value ={{token,login,isLoggedIn,logout,user,loading,group}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth =()=>useContext(AuthContext);