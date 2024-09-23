export default function Footer() {
    return (
        <>
            <div className="flex justify-between border-t border-black py-4 text-sm text-center">
                <h1>&copy; Genie, 2024. All rights reserved.</h1>
                <div className="flex">
                    <h1>Made by&nbsp;</h1>
                    <a
                        href="https://agarwalyash.me/"
                        target="_blank"
                        className="text-red-600 font-bold underline underline-offset-2 hover:text-green-600 transition-colors"
                    >
                        Yash A.
                    </a>
                </div>
            </div>
        </>
    );
}
