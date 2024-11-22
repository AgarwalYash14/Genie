import { createContext, useCallback, useState } from "react";

const PortalContext = createContext();

export default PortalContext;

export function PortalProvider({ children }) {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const openLogin = () => setShowLogin(true);
    const closeLogin = useCallback(() => setShowLogin(false), []);

    const openRegister = () => setShowRegister(true);
    const closeRegister = useCallback(() => setShowRegister(false), []);

    return (
        <PortalContext.Provider
            value={{
                showLogin,
                showRegister,
                openLogin,
                closeLogin,
                openRegister,
                closeRegister,
            }}
        >
            {children}
        </PortalContext.Provider>
    );
}
