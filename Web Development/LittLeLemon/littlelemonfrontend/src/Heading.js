import { LevelContext } from "./context/LevelContext";
import { useContext} from "react";
const Heading = ({children,className}) =>{
    const level = useContext(LevelContext);
    const actualLevel = Math.min(level?level:1,6);
    const Tag = `h${actualLevel}`;
    return (
        <>
        <Tag className={className}>{children}</Tag>
        </>
    )
}


export default Heading;