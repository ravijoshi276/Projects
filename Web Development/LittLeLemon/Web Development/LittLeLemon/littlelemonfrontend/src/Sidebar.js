import {NavLink} from 'react-router';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCaretDown}  from '@fortawesome/free-solid-svg-icons'
import { useAuth } from './context/AuthContext';
    
export default function Sidebar(){
    const [isClickedMenu,setIsClickedMenu] = useState(false);
    const [isClickedGroups,setIsClickedGroups] = useState(false);
    const {group} = useAuth();
    const handleMenuclick= ()=>{
      
        setIsClickedMenu(prev => !prev);
      
      
    }
    const handleGroupsClick = ()=>{
            setIsClickedGroups(prev=>!prev)
    }
    return (<aside className='sidebar'>
    <NavLink to="../dashboard">Home</NavLink>
    {group=='manager'?<div id='menu'className={isClickedMenu?'sidebar-items bold clicked':"sidebar-items bold"} onClick={handleMenuclick}>Menu items <FontAwesomeIcon icon={faCaretDown} size='lg' className='cart'/></div>:""}
    <ul className={isClickedMenu?"edit-items ":"hidden"}>
        <li><NavLink to="./menu-items">Edit/Delete Items</NavLink></li>
        <li><NavLink to="./menu-items/add">Add Items</NavLink></li>
    </ul>
    {group==='manager'?<div id='groups' className={isClickedGroups?'sidebar-items bold clicked':"sidebar-items bold"} onClick={handleGroupsClick}>Groups<FontAwesomeIcon icon={faCaretDown} size='lg' className='cart'/></div>:""}
    <ul className={isClickedGroups?"edit-items ":"hidden"}>
        <li><NavLink to="./managers">Managers</NavLink></li>
        <li><NavLink to="./delivery-crew">Delivery Crew</NavLink></li>
    </ul>
    <div ><NavLink className='bold dashboard-orders' to="./orders">Orders</NavLink></div>
    </aside>)
}