import { useEffect, useState, useCallback, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { bookings, cart, logo } from "../assets";
import { HiUser } from "react-icons/hi2";

import Login from "../components/Login";
import Register from "../components/Register";
import PortalLayout from "../components/PortalLayout";

import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import PortalContext from "../context/PortalContext";
import { MdLocationPin } from "react-icons/md";
import Location from "../components/Location";

export default function Navbar() {
    const navigate = useNavigate();

    const {
        showAddress,
        openAddress,
        closeAddress,
        showLogin,
        openLogin,
        closeLogin,
        showRegister,
        openRegister,
        closeRegister,
    } = useContext(PortalContext);

    const { isAuthenticated, user, login, logout, setIsAuthenticated } = useAuth();
    const { getCartCount } = useContext(CartContext);

    const [top, setTop] = useState(true);

    useEffect(() => {
        const scrollHandler = () => {
            window.scrollY > 10 ? setTop(false) : setTop(true);
        };
        window.addEventListener("scroll", scrollHandler);
        return () => window.removeEventListener("scroll", scrollHandler);
    }, [top]);

    const handleLoginSuccess = useCallback(
        (userData) => {
            login(userData);
            closeLogin();
        },
        [closeLogin, login]
    );

    const handleRegisterSuccess = useCallback(
        (userData) => {
            login(userData);
            closeRegister();
        },
        [closeRegister, login]
    );

    const handleLogout = useCallback(async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Logout failed", error);
        }
    }, [logout, navigate]);

    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        setCartCount(getCartCount());
    }, [getCartCount]);

    return (
        <>
            <div
                className={`bg-[#FFFFEE] px-10 ${
                    !top && `shadow-xl border-b border-black`
                }`}
            >
                <nav
                    className={` w-full flex items-center justify-between py-3 select-none z-40 border-b border-black ${
                        !top && `border-b-0`
                    }`}
                >
                    <div className="flex items-center gap-0.5">
                        <div className="pt-2">
                            <img src={logo} alt="" className="h-10" />
                        </div>
                        <Link
                            to="/"
                            className="text-2xl tracking-tighter font-semibold logo  hover:text-green-600 transition-colors duration-300"
                        >
                            GENIE
                        </Link>
                        {isAuthenticated && user?.role === "admin" && (
                            <Link
                                to="/admin"
                                className="text-xs uppercase font-semibold font-[NeuwMachina] tracking-wide mt-0.5 mx-2 bg-orange-200 border border-orange-600 rounded-md px-2 py-0.5 hover:text-orange-600 transition-colors duration-300"
                            >
                                Admin
                            </Link>
                        )}
                    </div>
                    <div className="hidden md:flex">
                        <div className="flex items-center ring-1 ring-black rounded outline-none focus-within:ring-1 focus-within:ring-blue-400 focus-within:border-0 transition-all overflow-hidden">
                            <div className="px-3 py-1">
                                <MdLocationPin size="17px" />
                            </div>
                            <input
                                onClick={openAddress}
                                type="text"
                                value=""
                                placeholder="Enter a location"
                                className="text-sm text-ellipsis outline-none ring-1 ring-black px-3 py-2 bg-transparent focus-within:ring-1 focus-within:ring-blue-400 focus-within:border-0 transition-all"
                            />
                        </div>
                    </div>
                    <div className="hidden items-center gap-8 md:flex">
                        <Link to="/viewcart">
                            <div className="flex items-center gap-2 hover:text-orange-500">
                                <img
                                    id="cart"
                                    name="cart"
                                    src={cart}
                                    alt="Cart"
                                    className="h-6"
                                />
                                <div className="flex items-center gap-1 w-20 h-6">
                                    <span>Cart</span>
                                    <div className="flex">
                                        (
                                        <span className="pt-[0.055rem]">
                                            {cartCount}
                                        </span>
                                        )
                                    </div>
                                </div>
                            </div>
                        </Link>
                        {isAuthenticated && user ? (
                            <Link to="/bookings">
                                <div className="flex gap-2 hover:text-orange-500">
                                    <img
                                        src={bookings}
                                        alt="Bookings"
                                        className="h-6"
                                    />
                                    <span className="h-6">Bookings</span>
                                </div>
                            </Link>
                        ) : null}
                        <div className="w-[0.09rem] h-6 bg-black rounded-full"></div>
                        {isAuthenticated && user ? (
                            <>
                                <div>
                                    <span className="h-6">
                                        Hi, {user?.first_name}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-1 rounded border-2 border-black hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <div
                                    onClick={openLogin}
                                    className="flex gap-2 hover:text-orange-500"
                                >
                                    <span className="h-6 ">Login</span>
                                </div>
                                <div
                                    onClick={openRegister}
                                    className="group relative px-4 py-1 rounded flex items-center justify-center gap-1 border-2 border-black overflow-hidden hover:rounded-full hover:text-white duration-200 transition-all"
                                >
                                    <div className="w-full h-full relative flex items-center justify-center gap-2 z-50">
                                        <HiUser htmlFor="user" size="18px" />
                                        <label htmlFor="user" className="h-6">
                                            Register
                                        </label>
                                    </div>
                                    <div className="absolute -bottom-full h-full w-full bg-blue-400 group-hover:bottom-0 transition-bottom duration-400 ease"></div>
                                </div>
                            </>
                        )}
                    </div>
                </nav>
            </div>
            <PortalLayout isOpen={showAddress} onClose={closeAddress}>
                <Location />
            </PortalLayout>
            <PortalLayout isOpen={showLogin} onClose={closeLogin}>
                <Login
                    onLoginSuccess={handleLoginSuccess}
                    onClose={closeLogin}
                    onSwitchToRegister={openRegister}
                />
            </PortalLayout>
            <PortalLayout isOpen={showRegister} onClose={closeRegister}>
                <Register
                    onRegisterSuccess={handleRegisterSuccess}
                    onClose={closeRegister}
                    onSwitchToLogin={openLogin}
                    openLogin={openLogin}
                />
            </PortalLayout>
        </>
    );
}
