import React, { createContext, useState } from "react";

export const GlobalStatesContext = createContext({
  messages : [],
  setMessages : ([messages])=>{},
  jobs : [],
  setJobs : ()=>{},
  isIemodelLoaded : false,
  setIeModel : ()=>{}
});

export const GlobalStatesProvider = ({ children }) => {
  const [messages,setMessages] = useState([])
  const [jobs,setJobs] = useState([])
  const [isIemodelLoaded,setIeModel] = useState(false)
    return (
        <GlobalStatesContext.Provider value={{ messages, setMessages,jobs,setJobs,isIemodelLoaded,setIeModel }}>
            {children}
        </GlobalStatesContext.Provider>
    );
}
