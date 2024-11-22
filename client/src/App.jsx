// src/App.jsx
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useNavigate,
} from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import Layout from "./layout/layout";
import ServiceDetails from "./components/ServiceDetails";
import ServiceList from "./pages/ServiceList";
import { CartProvider } from "./context/CartContext";
import Cart from "./pages/Cart";
import { AnimatePresence } from "framer-motion";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Bookings from "./pages/Bookings";
import PortalLayout from "./components/PortalLayout";
import { PortalProvider } from "./context/PortalContext";

// Create a wrapper component that uses the auth context
function AppContent() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Or your loading component
    }

    return (
        <PortalProvider>
            <CartProvider isAuthenticated={isAuthenticated}>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<HomePage />} />
                        {/* <Route
                            path="/services/:serviceName"
                            element={<ServiceDetails />}
                        />
                        <Route
                            path="/services/:serviceName/:subcategory"
                            element={<ServiceList />}
                        />
                        <Route
                            path="/services/:serviceName/:subcategory/:serviceType"
                            element={<ServiceList />}
                        /> */}
                        <Route path="/services">
                            <Route
                                path=":serviceName"
                                element={<ServiceDetails />}
                            />
                            <Route
                                path=":serviceName/:subcategory"
                                element={<ServiceList />}
                            />
                            <Route
                                path=":serviceName/:subcategory/:serviceType"
                                element={<ServiceList />}
                            />
                            <Route
                                path=":serviceName/portal"
                                element={<PortalLayout />}
                            />
                        </Route>
                        <Route path="/viewcart" element={<Cart />} />
                        <Route path="/bookings" element={<Bookings />} />
                    </Route>
                </Routes>
            </CartProvider>
        </PortalProvider>
    );
}

function App() {
    return (
        <AnimatePresence mode="wait">
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </AnimatePresence>
    );
}

export default App;
