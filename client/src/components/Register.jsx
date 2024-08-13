import { useState } from "react";
import { register } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Register({ onRegisterSuccess, onClose }) {
    const [userData, setUserData] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await register(userData);
            console.log("Register Successful", response);
            onRegisterSuccess(response.user);
            onClose();
            navigate("/");
        } catch (error) {
            setError(error.msg || "An error occurred");
        }
    };

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-8 p-10 pt-8"
            >
                <h1 className="text-lg text-center">Register your Account</h1>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <input
                                type="text"
                                placeholder="Enter First Name"
                                name="first_name"
                                value={userData.first_name}
                                onChange={handleChange}
                                className="text-sm rounded-md p-2 border border-dashed outline-none"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <input
                                type="text"
                                placeholder="Enter Last Name"
                                name="last_name"
                                value={userData.last_name}
                                onChange={handleChange}
                                className="text-sm rounded-md p-2 border border-dashed outline-none"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <input
                                type="tel"
                                placeholder="Enter Mobile No"
                                autoComplete="off"
                                name="phone"
                                value={userData.phone}
                                onChange={handleChange}
                                className="text-sm rounded-md p-2 border border-dashed outline-none"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <input
                                type="email"
                                placeholder="Enter Email"
                                autoComplete="off"
                                name="email"
                                value={userData.email}
                                onChange={handleChange}
                                className="text-sm rounded-md p-2 border border-dashed outline-none"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <input
                                type="password"
                                placeholder="Password"
                                autoComplete="off"
                                name="password"
                                value={userData.password}
                                onChange={handleChange}
                                className="text-sm rounded-md p-2 border border-dashed outline-none"
                            />
                        </div>
                    </div>
                </div>
                {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                )}
                <button
                    type="submit"
                    className="bg-yellow-300 border border-dotted border-black p-2 rounded-lg shadow-inner hover:bg-blue-400 hover:text-white hover:rounded-full transition-colors"
                >
                    Register
                </button>
                <h1 className="text-sm text-center -mt-4">
                    Already have an account?{" "}
                    <a className="font-bold underline underline-offset-2">
                        Login
                    </a>
                </h1>
            </form>
        </>
    );
}
