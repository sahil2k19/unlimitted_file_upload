import React, {createContext, useState} from "react";

export const AppContext = createContext();

export const AppProvider = ({children}) =>{
    const [fetchFile, setFetchFile] = useState([]);


    return (
        <AppContext.Provider value={{fetchFile,setFetchFile}}>
            {children}
        </AppContext.Provider>
    )
}