import React,{ createContext,useContext,useState} from "react";

const UserUlContext=createContext();

//provider
export const UserProvider=({children})=>{
const[activeTab,setActiveTab]=useState("profile");  //default

return(
 <UserUlContext.Provider value={{activeTab,setActiveTab}}>
{children}
 </UserUlContext.Provider>

);
};

// Custom hook to use context
export const useUserUl=()=>useContext(UserUlContext)