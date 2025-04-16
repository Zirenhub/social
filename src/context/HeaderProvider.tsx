import { createContext, useContext } from "react";

export type HeaderProps = { content: React.ReactNode; avatar?: boolean };

export type HeaderContextType = {
  header: HeaderProps | null;
  setHeader: (content: React.ReactNode, avatar?: boolean) => void;
};

export const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function useHeader() {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeader must be used within Providers and on mobile");
  }
  return context;
}
