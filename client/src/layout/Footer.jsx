export default function Footer() {
    return (
        <>
            <div className="flex justify-between border-t border-black py-4 text-sm text-center max-[525px]:flex-col max-[525px]:gap-1">
                <h1>&copy; Genie, 2024. All rights reserved.</h1>
                <div className="flex max-[525px]:justify-center">
                    <h1>Developed by&nbsp;</h1>
                    <a
                        href="https://agarwalyash.me/"
                        target="_blank"
                        className="text-red-600 underline underline-offset-2 hover:text-green-600 transition-colors"
                    >
                        Yash A.
                    </a>
                </div>
            </div>
        </>
    );
}
