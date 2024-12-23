import { bg } from "../assets";
import { TbArrowUpRight } from "react-icons/tb";

export default function Hero() {
    return (
        <>
            <div className="flex flex-col gap-8 pb-6 max-md:gap-4">
                <h1
                    className="text-center text-7xl font-[NeuwMachina]"
                    style={{
                        fontSize: "clamp(1.25rem, 0.4286rem + 4.1071vw, 7rem)",
                    }}
                >
                    Convenient service for
                    <br /> ordering apartment cleaning
                </h1>
                <div className="relative flex -z-10">
                    <div className="relative overflow-hidden">
                        <div className="relative w-10/12 max-lg:w-full">
                            <img
                                src={bg}
                                alt=""
                                className="w-screen object-cover rounded-[3rem] rounded-r-[3rem] max-md:rounded-3xl"
                            />
                            <div className="max-lg:hidden">
                                <h1 className="before:content-[''] before:absolute before:bottom-36 before:right-0 before:h-20 before:w-20 before:bg-transparent before:rounded-br-[3rem] before:shadow-[0_34px_0_0_#FFFFEE]"></h1>
                                <h1 className="before:content-[''] before:absolute before:bottom-36 before:right-0 before:h-[1.6rem] before:w-[0.3rem] before:bg-[#FFFFEE] before:rounded-lr-full"></h1>
                                <h1 className="before:content-[''] before:absolute before:bottom-0 before:right-[7.975rem] before:h-20 before:w-20 before:bg-transparent before:rounded-br-[3rem] before:shadow-[0_34px_0_0_#FFFFEE]"></h1>
                                <h1 className="before:content-[''] before:absolute before:bottom-0 before:right-[7.975rem] before:h-6 before:w-1 before:bg-[#FFFFEE] before:rounded-lr-full"></h1>
                            </div>
                        </div>
                        <div className="relative max-md:hidden">
                            <h1 className="before:content-[''] before:absolute before:-top-[10.2rem] before:-left-0 before:h-20 before:w-20 before:bg-transparent before:rounded-bl-[3rem] before:shadow-[0_34px_0_0_#FFFFEE]"></h1>
                            <h1 className="before:content-[''] before:absolute before:-top-[6rem] before:left-0 before:h-[1.6rem] before:w-[0.3rem] before:bg-[#FFFFEE] before:rounded-lr-full"></h1>
                            <h1 className="before:content-[''] before:absolute before:bottom-0 before:left-[20.97rem] before:h-20 before:w-20 before:bg-transparent before:rounded-bl-[3rem] before:shadow-[0_34px_0_0_#FFFFEE]"></h1>
                            <h1 className="before:content-[''] before:absolute before:bottom-0 before:left-[20.97rem] before:h-[1.6rem] before:w-[0.3rem] before:bg-[#FFFFEE] before:rounded-lr-full"></h1>

                            <h1 className="absolute bg-[#FFFFEE] flex items-center gap-4 bottom-0 left-0 text-zinc-800 text-2xl px-20 py-6 rounded-tr-[3rem] underline underline-offset-4 max-md:text-xl:">
                                Learn more
                                <TbArrowUpRight size="35px" />
                            </h1>
                        </div>
                        <div className="max-md:static w-full max-md:flex max-md:flex-col">
                            <div className="absolute top-[26%] right-10 space-y-8 -translate-y-1/3 text-zinc-500 text-base text-[1.1vw] max-lg:static max-lg:translate-y-0">
                                <h1>Easy to book</h1>
                                <h1>Verified housekeepers</h1>
                                <h1>Secure payments</h1>
                                <h1>Responsibility</h1>
                            </div>

                            <div className="relative">
                                <div
                                    className="absolute right-0 bottom-0 px-40 py-[4.5rem] bg-[#FFFFEE]
                                            before:content-[''] before:absolute before:top-0 before:bottom-0 
                                            before:-left-[3rem] before:w-[6rem] before:bg-[#FFFFEE] before:rounded-tl-[2.25rem]"
                                ></div>
                                <div className="absolute bottom-0 right-0 z-[10000]">
                                    <button className="font-[NeuwMachinaBold] text-amber-50 text-3xl px-[3.75rem] py-12 rounded-[1.75rem] bg-blue-400 cursor-pointer">
                                        <a href="/ah">Book a Service</a>
                                    </button>
                                    <div className="max-lg:hidden">
                                        <h1 className="before:content-[''] before:absolute before:bottom-0 before:-left-[5.8rem] before:h-20 before:w-20 before:bg-transparent before:rounded-br-[3rem] before:shadow-[0_34px_0_0_#FFFFEE]"></h1>
                                        <h1 className="before:content-[''] before:absolute before:bottom-0 before:-left-4 before:h-[1.6rem] before:w-[0.3rem] before:bg-[#FFFFEE] before:rounded-lr-full"></h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-zinc-950 text-[#FFFFEE] flex items-center justify-center rounded-3xl p-6 gap-12 max-lg:flex-col max-lg:gap-0">
                    <div className="flex justify-center gap-32 px-32 py-6 border border-t-0 border-b-0 max-sm:flex-col max-sm:gap-8 max-lg:border-0 max-lg:border-b max-2xl:gap-20 max-2xl:px-20 max-xl:gap-14 max-xl:px-10 max-lg:px-8">
                        <div className="text-center">
                            <h1
                                className="font-[NeuwMachina] text-7xl"
                                style={{
                                    fontSize:
                                        "clamp(2.5rem, 2.2143rem + 1.4286vw, 4.5rem)",
                                }}
                            >
                                10+
                            </h1>
                            <span>services offered</span>
                        </div>
                        <div className="text-center">
                            <h1
                                className="font-[NeuwMachina] text-7xl"
                                style={{
                                    fontSize:
                                        "clamp(2.5rem, 2.2143rem + 1.4286vw, 4.5rem)",
                                }}
                            >
                                150k+
                            </h1>
                            <span>users</span>
                        </div>
                        <div className="text-center">
                            <h1
                                className="font-[NeuwMachina] text-7xl"
                                style={{
                                    fontSize:
                                        "clamp(2.5rem, 2.2143rem + 1.4286vw, 4.5rem)",
                                }}
                            >
                                3k+
                            </h1>
                            <span>housekeepers</span>
                        </div>
                    </div>
                    <div>
                        <h1
                            className="font-[NeuwMachina] text-5xl py-6 max-lg:text-center max-lg:leading-[1.25]"
                            style={{
                                fontSize:
                                    "clamp(1.75rem, 1.4286rem + 1.6071vw, 4rem)",
                            }}
                        >
                            Ready for
                            <br />a clean up?
                        </h1>
                    </div>
                </div>
            </div>
        </>
    );
}
