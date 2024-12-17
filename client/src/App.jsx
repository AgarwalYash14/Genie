// src/App.jsx
import "./App.css";
import { Routes, Route } from "react-router-dom";
import PortalLayout from "./components/PortalLayout";
import Layout from "./layout/layout";
import HomePage from "./pages/HomePage";
import ServiceList from "./pages/ServiceList";
import ServiceDetails from "./components/ServiceDetails";
import Cart from "./pages/Cart";
import Bookings from "./pages/Bookings";
import Admin from "./admin/Pages/Main";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AdminServicesPage from "./admin/Pages/AdminServicesPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PortalProvider } from "./context/PortalContext";
import { CartProvider } from "./context/CartContext";
import { AnimatePresence } from "framer-motion";

function AppContent() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <PortalProvider>
            <CartProvider isAuthenticated={isAuthenticated}>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<HomePage />} />
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
                        <Route path="*" element={<h1>Not Found</h1>} />
                    </Route>

                    {/* Protected Admin Routes */}
                    <Route
                        path="/admin/*"
                        element={
                            <ProtectedAdminRoute>
                                <Routes>
                                    <Route path="*" element={<Admin />} />
                                </Routes>
                            </ProtectedAdminRoute>
                        }
                    />
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
