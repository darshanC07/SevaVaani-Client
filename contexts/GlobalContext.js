import { createContext, useState } from "react";

export const GlobalStatesContext = createContext({
  messages: [],
  setMessages: ([messages]) => { },
  jobs: [],
  setJobs: () => { },
  isIemodelLoaded: false,
  setIeModel: () => { },
  showTranscription: false,
  setShowTranscription: (val) => { },
  transcriptionResult: [],
  setTranscriptionResult: ([]) => { },
  notifications: [],
  setNotifications: ([]) => { },
  context : null,
  setContext : (llamaContext)=>{}
});

export const GlobalStatesProvider = ({ children }) => {
  const [messages, setMessages] = useState([])
  const [notifications, setNotifications] = useState([])
  const [jobs, setJobs] = useState([])
  const [isIemodelLoaded, setIeModel] = useState(false)
  const [showTranscription, setShowTranscription] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState('');
  const [context,setContext] = useState(null)
  return (
    <GlobalStatesContext.Provider value={{ messages, setMessages, jobs, setJobs, isIemodelLoaded, setIeModel, showTranscription, setShowTranscription, transcriptionResult, setTranscriptionResult, notifications, setNotifications,context,setContext }}>
      {children}
    </GlobalStatesContext.Provider>
  );
}
