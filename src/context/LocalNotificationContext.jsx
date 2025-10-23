import React,{createContext,useContext,useState} from "react";

const LocalNotificationContext=createContext();

export const LocalNotificationProvider=({children})=>{
    const[message,setMessage]=useState();
    const[type,setType]=useState("info");

    const showNotification=(msg,type="info",duration=3000)=>{
       setType(type);
       setMessage(msg);
       setTimeout(()=>setMessage(""),duration);

    };

    return (
        <LocalNotificationContext.Provider value={{message,type,showNotification}}>
            {children}
        </LocalNotificationContext.Provider>
    );


};
export const useLocalNotification=()=>useContext(LocalNotificationContext);