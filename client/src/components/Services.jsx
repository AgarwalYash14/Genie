import {
    AcRepair,
    CleaningControl,
    Electrician,
    MenSalon,
    Painting,
    WomenSalon,
} from "../assets";

export default function Services() {
    return (
        <>
            <div className="w-96 flex flex-col gap-2 p-3 text-center text-sm border border-dotted border-black content-center rounded-3xl overflow-hidden">
                <div className="border border-dotted border-black rounded-t-2xl overflow-hidden hover:border-2 hover:border-dashed hover:border-orange-500">
                    <button className="w-full flex items-center gap-4">
                        <img
                            src={WomenSalon}
                            alt=""
                            className="w-32 h-20 object-cover  border-r border-dotted border-black rounded-tl-2xl overflow-hidden hover:border-b-2 hover:border-dashed hover:border-orange-500"
                        />
                        <h1 className="p-1">Women&apos;s Salon & Spa</h1>
                    </button>
                </div>
                <div className="border border-dotted border-black overflow-hidden hover:border-2 hover:border-dashed hover:border-orange-500">
                    <button className="w-full flex items-center gap-4">
                        <img
                            src={MenSalon}
                            alt=""
                            className="w-32 h-20 object-cover border-r border-dotted border-black"
                        />
                        <h1 className="p-1">Men&apos;s Salon & Spa</h1>
                    </button>
                </div>
                <div className="border border-dotted border-black overflow-hidden hover:border-2 hover:border-dashed hover:border-orange-500">
                    <button className="w-full flex items-center gap-4">
                        <img
                            src={AcRepair}
                            alt=""
                            className="w-32 h-20 object-cover border-r border-dotted border-black overflow-hidden"
                        />
                        <h1 className="p-1">AC & Appliances Repair</h1>
                    </button>
                </div>
                <div className="border border-dotted border-black overflow-hidden hover:border-2 hover:border-dashed hover:border-orange-500">
                    <button className="w-full flex items-center gap-4">
                        <img
                            src={CleaningControl}
                            alt=""
                            className="w-32 h-20 object-cover border-r border-dotted border-black"
                        />
                        <h1 className="p-1">Cleaning & Pest Control</h1>
                    </button>
                </div>
                <div className="border border-dotted border-black overflow-hidden hover:border-2 hover:border-dashed hover:border-orange-500">
                    <button className="w-full flex items-center gap-4">
                        <img
                            src={Electrician}
                            alt=""
                            className="w-32 h-20 object-cover border-r border-dotted border-black"
                        />
                        <h1 className="p-1">
                            Electrician, Plumber &<br />
                            Carpenter
                        </h1>
                    </button>
                </div>
                {/* <div className="border border-dotted border-black overflow-hidden hover:border-2 hover:border-dashed hover:border-orange-500">
                    <button className="w-full flex items-center gap-4">
                        <img
                            src=""
                            alt=""
                            className="h-20 object-cover border-b border-dotted border-black"
                        />
                        <h1 className="p-1"></h1>
                    </button>
                </div> */}
                <div className="border border-dotted border-black overflow-hidden hover:border-2 hover:border-dashed hover:border-orange-500">
                    <button className="w-full flex items-center gap-4">
                        <img
                            src={Painting}
                            alt=""
                            className="w-32 h-20 object-cover border-r border-dotted border-black"
                        />
                        <h1 className="p-1">Painting & Waterproofing</h1>
                    </button>
                </div>
                {/* <div className="border border-dotted border-black overflow-hidden hover:border-2 hover:border-dashed hover:border-orange-500">
                    <button className="w-full flex items-center gap-4">
                        <img
                            src=""
                            alt=""
                            className="h-20 object-cover border-b border-dotted border-black"
                        />
                        <h1 className="p-1"></h1>
                    </button>
                </div>
                <div className="border border-dotted border-black overflow-hidden hover:border-2 hover:border-dashed hover:border-orange-500">
                    <button className="w-full flex items-center gap-4">
                        <img
                            src=""
                            alt=""
                            className="h-20 object-cover border-b border-dotted border-black"
                        />
                        <h1 className="p-1"></h1>
                    </button>
                </div> */}
            </div>
        </>
    );
}
