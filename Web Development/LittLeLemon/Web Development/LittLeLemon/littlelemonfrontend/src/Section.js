import { LevelContext } from "./context/LevelContext";
import { useContext } from "react";
export default function Section ({sectionclass,children}) {
    const level = useContext(LevelContext);
    return (
        <section className={sectionclass}>
            <LevelContext value={level+1}>
                {children}
            </LevelContext>
        </section>
    )

}