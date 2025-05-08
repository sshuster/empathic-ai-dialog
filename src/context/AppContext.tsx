
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CompanyInfo {
  name: string;
  industry: string;
  characteristics: string[];
  description: string;
}

export interface Persona {
  name: string;
  age: number;
  gender: string;
  location: string;
  jobTitle: string;
  interests: string[];
  challenges: string[];
  avatar: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'persona';
  text: string;
  timestamp: Date;
}

interface AppContextType {
  step: number;
  setStep: (step: number) => void;
  companyInfo: CompanyInfo;
  setCompanyInfo: (info: CompanyInfo) => void;
  persona: Persona | null;
  setPersona: (persona: Persona) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  isTyping: boolean;
  setIsTyping: (isTyping: boolean) => void;
  resetApp: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [step, setStep] = useState(1);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: '',
    industry: '',
    characteristics: [],
    description: ''
  });
  const [persona, setPersona] = useState<Persona | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const resetApp = () => {
    setStep(1);
    setCompanyInfo({
      name: '',
      industry: '',
      characteristics: [],
      description: ''
    });
    setPersona(null);
    setMessages([]);
  };

  return (
    <AppContext.Provider
      value={{
        step,
        setStep,
        companyInfo,
        setCompanyInfo,
        persona,
        setPersona,
        isGenerating,
        setIsGenerating,
        messages,
        addMessage,
        isTyping,
        setIsTyping,
        resetApp
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
