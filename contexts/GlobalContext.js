import React, { createContext, useState } from "react";

export const GlobalStatesContext = createContext({
  messages : [],
  setMessages : ()=>{},
  jobs : [],
  setJobs : ()=>{},
  iemodel : null,
  setIeModel : ()=>{}
});

export const GlobalStatesProvider = ({ children }) => {
  const [messages,setMessages] = useState([])
  const [jobs,setJobs] = useState([])
  const [iemodel,setIeModel] = useState(null)
    return (
        <GlobalStatesContext.Provider value={{ messages, setMessages,jobs,setJobs,iemodel,setIeModel }}>
            {children}
        </GlobalStatesContext.Provider>
    );
}
