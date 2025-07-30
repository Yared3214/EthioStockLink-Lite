// context/UserRegistrationContext.tsx
import React, { createContext, useContext, useState } from 'react';

type RegistrationData = {
  name: string;
  email: string;
  password: string;
  age: string;
  gender: string;
  experience: string;
};

type ContextType = {
  data: Partial<RegistrationData>;
  setData: (data: Partial<RegistrationData>) => void;
  resetData: () => void;
};

const UserRegistrationContext = createContext<ContextType | undefined>(undefined);

export const RegistrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setInternalData] = useState<Partial<RegistrationData>>({});

  const setData = (newData: Partial<RegistrationData>) => {
    setInternalData((prev) => ({ ...prev, ...newData }));
  };

  const resetData = () => setInternalData({});

  return (
    <UserRegistrationContext.Provider value={{ data, setData, resetData }}>
      {children}
    </UserRegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const ctx = useContext(UserRegistrationContext);
  if (!ctx) throw new Error("useRegistration must be used within RegistrationProvider");
  return ctx;
};
