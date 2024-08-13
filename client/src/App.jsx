import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import Layout from "./layout/layout";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<HomePage />} />
                        <Route path="/login" element={<HomePage />} />
                        <Route path="/register" element={<HomePage />} />
                    </Route>
                </Routes>
            </Router>
        </>
    );
}

export default App;
