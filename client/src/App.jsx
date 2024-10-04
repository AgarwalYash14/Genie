import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import Layout from "./layout/layout";
import ServiceDetails from "./components/ServiceDetails";
import ServiceList from "./components/ServiceList";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<HomePage />} />
                        <Route path="/login" element={<HomePage />} />
                        <Route path="/register" element={<HomePage />} />
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
                    </Route>
                </Routes>
            </Router>
        </>
    );
}

export default App;
