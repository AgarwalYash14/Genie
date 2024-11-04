import { useEffect, useState, useCallback, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { bookings, cart, logo } from "../assets";
import { HiUser } from "react-icons/hi2";

import Autocomplete from "../components/AutoComplete";
import Login from "../components/Login";
import Register from "../components/Register";
import PortalLayout from "../components/PortalLayout";
import { getUserDetails, logout } from "../utils/api";

import { CartContext } from "../context/CartContext";

const libraries = ["places"];

export default function Navbar() {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const { getCartCount } = useContext(CartContext);

    const checkUserLoggedIn = useCallback(async () => {
        try {
            const userData = await getUserDetails();
            if (userData.isAuthenticated) {
                setIsLoggedIn(true);
                setUser(userData.user);
            }
            console.log(userData);
        } catch (error) {
            console.error("Error fetching user details:", error);
            handleLogout();
        }
    }, []);

    useEffect(() => {
        checkUserLoggedIn();
    }, [checkUserLoggedIn]);

    useEffect(() => {}, [location]);

    const openLogin = () => {
        setShowLogin(true);
    };

    const closeLogin = useCallback(() => {
        setShowLogin(false);
    }, []);

    const openRegister = () => {
        setShowRegister(true);
    };

    const closeRegister = useCallback(() => {
        setShowRegister(false);
    }, []);

    const handleLoginSuccess = useCallback(
        (userData) => {
            setIsLoggedIn(true);
            setUser(userData);
            closeLogin();
        },
        [closeLogin]
    );

    const handleRegisterSuccess = useCallback(
        (userData) => {
            setIsLoggedIn(true);
            setUser(userData);
            closeRegister();
        },
        [closeRegister]
    );

    const handleLogout = useCallback(async () => {
        try {
            await logout();
            setIsLoggedIn(false);
            setUser(null);
            // navigate("/");
        } catch (error) {
            console.error("Logout failed", error);
        }
    }, [navigate]);

    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const count = getCartCount();
        setCartCount(count);
    }, [getCartCount]);

    return (
        <>
            <nav className="flex items-center justify-between py-5 select-none z-40">
                <div className="flex items-center gap-1">
                    <img src={logo} alt="" className="h-12" />
                    <Link
                        to="/"
                        className="text-[2.5rem] leading-[1] logo hover:text-green-600 transition-colors duration-300"
                    >
                        GENIE
                    </Link>
                </div>
                <div className="hidden md:flex">
                    <Autocomplete libraries={libraries} />
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
                    <div className="flex gap-2 hover:text-orange-500">
                        <img src={bookings} alt="Bookings" className="h-6" />
                        <span className="h-6">Bookings</span>
                    </div>
                    <div className="w-[0.09rem] h-6 bg-black rounded-full"></div>
                    {isLoggedIn ? (
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
            <hr className="-border-1 border-black" />
            <PortalLayout isOpen={showLogin} onClose={closeLogin}>
                <Login
                    onLoginSuccess={handleLoginSuccess}
                    onClose={closeLogin}
                />
            </PortalLayout>
            <PortalLayout isOpen={showRegister} onClose={closeRegister}>
                <Register
                    onRegisterSuccess={handleRegisterSuccess}
                    onClose={closeRegister}
                />
            </PortalLayout>
        </>
    );
}
