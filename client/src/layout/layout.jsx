import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="w-full fixed max-sm:px-5 z-50">
                <Navbar />
            </div>
            <div className="flex-grow mx-10 mt-24 max-sm:px-5">
                <Outlet />
            </div>
            <div className="mt-auto mx-10 max-sm:px-5">
                <Footer />
            </div>
        </div>
    );
}
