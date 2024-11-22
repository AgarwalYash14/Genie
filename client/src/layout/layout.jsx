import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="fixed h-28 w-full px-10 bg-[#FFFFEE] max-sm:px-5 z-50 scroll-pb-20">
                <Navbar />
            </div>
            <div className="mx-10 mt-28 max-sm:px-5">
                <Outlet />
            </div>
            <div className="mx-10 max-sm:px-5">
                <Footer />
            </div>
        </div>
    );
}
