import { LevelContext } from "./context/LevelContext";
import { useContext} from "react";
const Heading = ({children}) =>{
    const level = useContext(LevelContext);
    const actualLevel = Math.min(level?level:1,6);
    const Tag = `h${actualLevel}`;
    return (
        <>
        <Tag>{children}</Tag>
        </>
    )
}


export default Heading;