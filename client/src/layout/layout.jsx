import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="fixed w-full px-10 bg-[#FFFFEE] max-sm:px-5 z-50">
                <Navbar />
            </div>
            <div className="flex-grow px-10 pt-20 max-sm:px-5">
                <Outlet />
            </div>
            <div className="px-10 max-sm:px-5">
                <Footer />
            </div>
        </div>
    );
}
