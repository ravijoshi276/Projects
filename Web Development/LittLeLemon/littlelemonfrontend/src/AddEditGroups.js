import { useState,useEffect,useTransition } from "react";
import { useAuth } from "./context/AuthContext";
import Heading from "./Heading";
import Section from "./Section";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrashCan}  from '@fortawesome/free-solid-svg-icons'

export default function AddEditGroups(props){
    const [managers,setMangers]=useState([]);
    const [error,setError] =useState(false);
    const[isDeleted,setIsDeleted] = useState(false);
    const [query,setQuery] = useState("");
    const [loading,setLoading] = useState(false);
    const [isAdded,setIsAdded] = useState(0);
    const [username,setUsername] = useState("");
    const [successfullyAdded,setSuccessfullAdded] = useState(false);
    const {token} = useAuth();
    const [isPending,startTransition] = useTransition();
    useEffect(()=>{
        const fetchAndStichData = async()=>{
            setLoading(true);
            setError(false)
            try{const response = await fetch(`${props.link}`,{
                method:"GET",
                headers:{
                    'Content-Type': 'application/JSON',
                    'Authorization': `Token ${token}`,
                }
        })
        if(!response.ok){
            throw new Error("Failed to fetch manager data",response.status);
        }
        const data = await response.json()
        setMangers(data);
           setLoading(false);
        }catch(err){
            setError(true);
        }finally{
            setLoading(false);
        }
    }
    fetchAndStichData()
},[token,props.link,isAdded])

    const handleAdd = async()=>{
        try{
            const response = await fetch(`${props.link}`,{
                method:"POST",
                headers:{
                    'Content-Type': 'application/JSON',
                    'Authorization': `Token ${token}`,
                },
                body : JSON.stringify({username:username.trim()})
        })
        if(!response.ok){
            throw new Error("Failed to fetch manager data",response.status);
        }
        setSuccessfullAdded(true);
        setTimeout(()=>{
            setSuccessfullAdded(false);
            setIsAdded(prev=>prev+1);
        
        },3000)

            
        }catch(err){
            console.log(err);
        }
    }
    const handleChange =(e)=>{
        const value =e.target.value;
        const name = e.target.name;
        startTransition(()=>{
            name==='username'?setUsername(value):setQuery(value);
        })

    }
    const deleteManager = async(id,username)=>{
        try{
            
            const response = await fetch(`${props.link}`,{
                method: 'DELETE',
                headers:{
                    'Content-Type': 'application/JSON',
                    'Authorization': `Token ${token}`,
                },
                body:JSON.stringify({username:username})
            })
            if(!response.ok){
                throw new Error("Failed to delete user")
            }
            setMangers(prev=>{return prev.filter(item=>item.id !==id)});
            setIsDeleted(true);
            setTimeout(()=>{
                setIsDeleted(false);
            },3000)
        }catch(err){
            console.error(err);
        }
    }
    const itemData =  managers.filter((item)=>{
        if(query.trim().length===0){
            return item;
        }else {
            const  uname = item.username.toLowerCase();
            const fname = item.first_name.toLowerCase();
            const lname = item.last_name.toLowerCase();
            const email = item.email.toLowerCase();
            const toSearch = query.trim().toLowerCase();
            if(uname.includes(toSearch) || fname.includes(toSearch) || lname.includes(toSearch) || email.includes(toSearch)){
                return item;

        }else{
            return null;
        }
    }
    })
     
    const managerCards = itemData.length>0? itemData.map((item)=><Card key={item.id} fname={item.first_name.length?item.first_name:"No Name"} lname={item.last_name} username={item.username} deletefunc={deleteManager} email={item.email.length?item.email : "no email"} id={item.id}/>):<div className='empty-result'>No Matching Values</div>;
    return( <main className={props.title +"-page"}>
        <div>
        <Heading>{props.title}</Heading>
        <div className='search-bar-cover'><span>Search </span><input className='search-bar' type='text' onChange={handleChange} value={query} placeholder="Search person"/></div>
        {isDeleted||successfullyAdded?<div className={successfullyAdded?"alert success":'alert'}>{props.title} {isDeleted?"Deleted Sucessfully":"Added Successfully"}</div>:""}
        </div>
        <div id="add-user">
            <span className="bold">Add {props.title}</span> 
            <input type="text" name="username" value={username}  placeholder="Enter Username" onChange={handleChange}></input> <button type="button" onClick={handleAdd} className="add-btn"  >Add</button>
        </div>
        <div>
            {isPending?<div>Loading........</div>:""}
            {loading && !error?<div>loading........</div>:error?<div>Some error occured</div>:managerCards}
    </div>
    </main>)
};

const Card = ({id,username,fname,lname,email,deletefunc})=>{

    return (<Section sectionclass='person-card'>
        
       <div className="person-card-header">  
        <Heading>{fname + " " + lname}</Heading>
        <button className='trash' onClick={()=>deletefunc(id,username)}><FontAwesomeIcon icon={faTrashCan} size='lg' className="trashcan" /></button>
        </div>
        <p><span>Username</span><span>{username}</span></p>
        <p><span>email</span><span>{email}</span></p>
    </Section>)
}