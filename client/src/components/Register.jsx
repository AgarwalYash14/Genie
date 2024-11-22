import { useState } from "react";
import { register } from "../utils/api";

export default function Register({
    onRegisterSuccess,
    onClose,
    onSwitchToLogin,
}) {
    const [userData, setUserData] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

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
        } catch (error) {
            setError(error.msg || "An error occurred");
        }
    };

    const handleSwitchToLogin = (e) => {
        e.preventDefault();
        onClose();
        onSwitchToLogin();
    };

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="w-96 flex flex-col gap-8 p-10 pt-0"
            >
                <h1 className="text-lg text-center">Register your Account</h1>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <div className="w-full flex gap-2">
                            <input
                                type="text"
                                placeholder="Enter First Name"
                                name="first_name"
                                value={userData.first_name}
                                onChange={handleChange}
                                className="w-1/2 text-sm rounded-md p-2 text-ellipsis border border-dashed outline-none"
                            />
                            <input
                                type="text"
                                placeholder="Enter Last Name"
                                name="last_name"
                                value={userData.last_name}
                                onChange={handleChange}
                                className="w-1/2 text-sm rounded-md p-2 text-ellipsis border border-dashed outline-none"
                            />
                        </div>
                        <input
                            type="tel"
                            placeholder="Enter Mobile No"
                            pattern="[0-9]{10}"
                            maxLength="10"
                            autoComplete="off"
                            name="phone"
                            value={userData.phone}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                if (
                                    !/[0-9]/.test(e.key) &&
                                    e.key !== "Backspace" &&
                                    e.key !== "Delete" &&
                                    e.key !== "ArrowLeft" &&
                                    e.key !== "ArrowRight" &&
                                    e.key !== "Tab"
                                ) {
                                    e.preventDefault();
                                }
                            }}
                            className="text-sm rounded-md p-2 border border-dashed outline-none"
                        />
                        <input
                            type="email"
                            placeholder="Enter Email"
                            autoComplete="off"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            className="text-sm rounded-md p-2 border border-dashed outline-none"
                        />
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
                    <span
                        onClick={handleSwitchToLogin}
                        className="font-bold tracking-wide underline underline-offset-2"
                    >
                        Login
                    </span>
                </h1>
            </form>
        </>
    );
}
