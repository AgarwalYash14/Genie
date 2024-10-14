import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
    return (
        <>
            <div className="fixed w-full px-10 bg-[#FFFFEE] max-sm:px-5 z-50">
                <Navbar />
            </div>
            <div className="px-10 pt-20 max-sm:px-5">
                <Outlet />
                <Footer />
            </div>
        </>
    );
}
