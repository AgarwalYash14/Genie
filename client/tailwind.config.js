/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            transitionProperty: {
                bottom: "bottom",
            },
            transitionDuration: {
                400: "400ms",
            },
            transitionTimingFunction: {
                ease: "ease",
            },
        },
    },
    plugins: [],
};
