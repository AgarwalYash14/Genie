import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Layout() {
    return (
        <div>
            <div className="fixed w-full px-10 bg-[#FFFFEE] max-sm:px-5">
                <Navbar />
            </div>
            <Outlet />
            {/* <Footer /> */}
        </div>
    );
}
