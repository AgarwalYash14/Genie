import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import Layout from "./layout/layout";
import ServiceDetails from "./components/ServiceDetails";
import ServiceList from "./pages/ServiceList";
import { CartProvider } from "./context/CartContext";
import Cart from "./pages/Cart";

function App() {
    return (
        <>
            <CartProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<HomePage />} />
                            <Route
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
                            />
                            <Route path="/viewcart" element={<Cart />} />
                        </Route>
                    </Routes>
                </Router>
            </CartProvider>
        </>
    );
}

export default App;
