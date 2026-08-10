import { useNavigate } from "react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faArrowLeft}  from '@fortawesome/free-solid-svg-icons'
export default function BackButton ({classNaame}){
    const navigate = useNavigate();
    return (<div className={classNaame}>
        <button type="button" onClick={()=>navigate(-1)}><FontAwesomeIcon icon={faArrowLeft} size="lg"></FontAwesomeIcon></button>
    </div>)
}