import Navbar from './Navbar';
import './App.css'
import useOnlineStatus from './useOnlineStatus';
import OfflineBlocker from './OfflineBlocker';
function App() {
  const isOnline = useOnlineStatus();
  return (
    <div className={isOnline==='offline'?"disable-interaction":"App"}>
     
      <Navbar/>
       <OfflineBlocker />
    
    </div>
  );
}

export default App;
