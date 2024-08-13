import { useState } from "react";
import { login } from "../utils/api";

export default function Login({ onLoginSuccess, onClose }) {
    const [userData, setUserData] = useState({
        emailOrPhone: "",
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
            const loginData = {
                email: userData.emailOrPhone.includes("@")
                    ? userData.emailOrPhone
                    : undefined,
                phone: !userData.emailOrPhone.includes("@")
                    ? userData.emailOrPhone
                    : undefined,
                password: userData.password,
            };

            const response = await login(loginData);
            console.log("Login Successful", response);

            onLoginSuccess(response.user);
            onClose();
        } catch (error) {
            setError(error.msg || "Invalid Credentials");
        }
    };

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-8 p-10 pt-8"
            >
                <h1 className="text-lg text-center">Login to your Account</h1>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <input
                                id="validatingEmail"
                                type="text"
                                placeholder="Enter Email / Phone No"
                                autoComplete="off"
                                name="emailOrPhone"
                                value={userData.emailOrPhone}
                                onChange={handleChange}
                                className="text-sm rounded-md p-2 border border-dashed outline-none"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <input
                                id="validatingPassword"
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
                    <div className="flex gap-1 select-none">
                        <input
                            type="checkbox"
                            name="RememberMe"
                            id="RememberMe"
                            className="outline-none"
                        />
                        <label
                            htmlFor="RememberMe"
                            className="text-sm font-thin"
                        >
                            Remember Me
                        </label>
                    </div>
                </div>
                {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                )}
                <button
                    type="submit"
                    className="bg-yellow-300 border border-dotted border-black p-2 rounded-lg shadow-inner hover:bg-blue-400 hover:text-white hover:rounded-full transition-colors"
                >
                    Login
                </button>
                <h1 className="text-sm text-center -mt-4">
                    Don&apos;t have an account?{" "}
                    <a className="font-bold underline underline-offset-2">
                        Register Now
                    </a>
                </h1>
            </form>
        </>
    );
}
