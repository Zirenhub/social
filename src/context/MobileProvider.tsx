import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { HeaderContext, HeaderProps } from "./HeaderProvider";

const IsMobileContext = createContext(false);

export const IsMobileProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [header, setHeaderState] = useState<HeaderProps>({
    content: null,
    avatar: true,
  });

  const setHeader = (content: React.ReactNode, avatar = true) => {
    setHeaderState({ content, avatar });
  };

  const headerValue = useMemo(() => ({ header, setHeader }), [header]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleChange = () => setIsMobile(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <IsMobileContext.Provider value={isMobile}>
      {isMobile ? <HeaderContext.Provider value={headerValue}>{children}</HeaderContext.Provider> : children}
    </IsMobileContext.Provider>
  );
};

export const useIsMobile = () => useContext(IsMobileContext);
