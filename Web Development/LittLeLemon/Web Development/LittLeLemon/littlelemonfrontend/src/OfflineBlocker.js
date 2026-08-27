import useOnlineStatus from "./useOnlineStatus";

export default function OfflineBlocker(){
    const isOnline = useOnlineStatus();
    
    //Returns null if status is not offline 
    if(isOnline!=='offline') return null;

    return <div className="offline-blocker">
        <div className="alert">
            {isOnline==='online'?<h2>Back Online</h2>:<h2>Connection Lost</h2>}
            {isOnline==='offline'?<p>Please Check your internet</p>:""}
        </div>
    </div>

}