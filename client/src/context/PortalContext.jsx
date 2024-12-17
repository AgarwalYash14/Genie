import { createContext, useCallback, useState } from "react";

const PortalContext = createContext();

export default PortalContext;

export function PortalProvider({ children }) {
    const [showAddress, setShowAddress] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const openAddress = () => setShowAddress(true);
    const closeAddress = useCallback(() => setShowAddress(false), []);

    const openLogin = () => setShowLogin(true);
    const closeLogin = useCallback(() => setShowLogin(false), []);

    const openRegister = () => setShowRegister(true);
    const closeRegister = useCallback(() => setShowRegister(false), []);

    return (
        <PortalContext.Provider
            value={{
                showAddress,
                openAddress,
                closeAddress,
                showLogin,
                openLogin,
                closeLogin,
                showRegister,
                openRegister,
                closeRegister,
            }}
        >
            {children}
        </PortalContext.Provider>
    );
}
