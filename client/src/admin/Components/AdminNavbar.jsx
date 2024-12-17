import { Link, useLocation } from "react-router-dom";
import {
    ClipboardList,
    IndianRupee,
    LayoutDashboard,
    PackageOpen,
} from "lucide-react";

export default function AdminNavbar() {
    const location = useLocation();

    const getButtonClass = (path) => {
        const isActive = location.pathname === path;
        return `bg-yellow-200 text-sm flex items-center gap-1 px-4 py-1.5 rounded-full font-medium transition-colors duration-300 ${
            isActive ? "bg-zinc-950 text-white" : "hover:text-green-800"
        }`;
    };

    return (
        <div className="flex items-center mb-12">
            <Link to="/admin" className={getButtonClass("/admin")}>
                <LayoutDashboard size={18} />
                Dashboard
            </Link>
            {/* <Link to="/admin/services" className={getButtonClass("/admin/services")}>
                <PackageOpen size={18} strokeWidth={1.5} />
                Services
            </Link> */}
            <Link
                to="/admin/bookings"
                className={getButtonClass("/admin/bookings")}
            >
                <ClipboardList size={18} strokeWidth={1.75} />
                Bookings
            </Link>
            {/* <Link to="/admin/payments" className={getButtonClass("/admin/payments")}>
                <IndianRupee size={16} />
                Payments
            </Link> */}
        </div>
    );
}
