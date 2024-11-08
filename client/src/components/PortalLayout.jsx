import { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";

export default function PortalLayout({ isOpen, onClose, children }) {
    const portalRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                contentRef.current &&
                !contentRef.current.contains(event.target)
            ) {
                onClose();
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            // document.body.style.overflow = "hidden";
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.body.style.overflow = "auto";
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <>
            <div
                ref={portalRef}
                className="fixed w-screen h-screen top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-brightness-50 backdrop-blur-[2.5px] select-none z-50 overflow-hidden"
            >
                <div
                    ref={contentRef}
                    className="fixed max-h-[75%] bg-white outline-dotted outline-1 rounded-md left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-2xl overflow-auto"
                >
                    <div className="flex justify-end py-5 pr-5">
                        <div
                            onClick={onClose}
                            className="outline-dotted outline-1 rounded-lg p-1 hover:bg-stone-300 hover:outline transition-all duration-300"
                        >
                            <IoClose />
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </>
    );
}
