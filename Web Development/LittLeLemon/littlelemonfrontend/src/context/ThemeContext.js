import { useState,useContext,createContext,useEffect } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider ({children}){
    const [theme,setTheme]= useState(()=>{
        const currentTheme =localStorage.getItem('theme');
        if(currentTheme){
            return currentTheme;
        }
        return 'light';
})
const toggleTheme = (theme)=>{
    setTheme(theme==='light'?'dark':'light');
}
/*Set theme every time theme changes*/
useEffect(()=>{
    document.documentElement.setAttribute('data-theme',theme);
    localStorage.setItem('theme',theme);

},[theme]);
return (<ThemeContext.Provider value ={{theme,toggleTheme}}>
    {children}
</ThemeContext.Provider>)
}

export const useTheme =()=>useContext(ThemeContext);