import { Routes, Route } from "react-router-dom";
import AdminSidebar from "../Components/AdminSidebar";
import AdminNavbar from "../Components/AdminNavbar";
import AdminServicesPage from "./AdminServicesPage";
import AdminDashboard from "./AdminDashboard";
import AdminBookings from "./AdminBookings";

export default function Main() {
    return (
        <div className="flex items-start gap-10 px-10 py-5">
            <AdminSidebar />
            <div className="w-full flex flex-col">
                <AdminNavbar />
                <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/services" element={<AdminServicesPage />} />
                    <Route path="/bookings" element={<AdminBookings />} />
                    <Route path="*" element={<div>Page not found</div>} />
                </Routes>
            </div>
        </div>
    );
}
