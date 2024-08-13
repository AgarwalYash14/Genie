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
            <div className="w-[35rem] grid grid-cols-3 gap-2 p-3 text-center text-sm border border-dotted border-black content-center rounded-3xl overflow-hidden">
                <div className="border border-dotted border-black rounded-tl-2xl overflow-hidden hover:border-2 hover:border-dashed hover:border-orange-500">
                    <button className="w-full">
                        <img
                            src={WomenSalon}
                            alt=""
                            className="w-full h-28 object-cover border-b border-dotted border-black rounded-tl-2xl overflow-hidden hover:border-b-2 hover:border-dashed hover:border-orange-500"
                        />
                        <h1 className="p-1">Women&apos;s Salon & Spa</h1>
                    </button>
                </div>
                <div className="border border-dotted border-black">
                    <img
                        src={MenSalon}
                        alt=""
                        className="w-full h-28 object-cover border-b border-dotted border-black"
                    />
                    <h1 className="p-1">Men&apos;s Salon & Spa</h1>
                </div>
                <div className="border border-dotted border-black rounded-tr-2xl">
                    <img
                        src={AcRepair}
                        alt=""
                        className="w-full h-28 object-cover border-b border-dotted border-black rounded-tr-2xl overflow-hidden"
                    />
                    <h1 className="p-1">AC & Appliances Repair</h1>
                </div>
                <div className="border border-dotted border-black">
                    <img
                        src={CleaningControl}
                        alt=""
                        className="w-full h-28 object-cover border-b border-dotted border-black"
                    />
                    <h1 className="p-1">Cleaning & Pest Control</h1>
                </div>
                <div className="border border-dotted border-black">
                    <img
                        src={Electrician}
                        alt=""
                        className="w-full h-28 object-cover border-b border-dotted border-black"
                    />
                    <h1 className="p-1">
                        Electrician, Plumber &<br />
                        Carpenter
                    </h1>
                </div>
                <div className="border border-dotted border-black">
                    <img
                        src=""
                        alt=""
                        className="w-full h-28 object-cover border-b border-dotted border-black"
                    />
                    <h1 className="p-1"></h1>
                </div>
                <div className="border border-dotted border-black rounded-bl-2xl">
                    <img
                        src={Painting}
                        alt=""
                        className="w-full h-28 object-cover border-b border-dotted border-black"
                    />
                    <h1 className="p-1">Painting & Waterproofing</h1>
                </div>
                <div className="border border-dotted border-black">
                    <img
                        src=""
                        alt=""
                        className="w-full h-28 object-cover border-b border-dotted border-black"
                    />
                    <h1 className="p-1"></h1>
                </div>
                <div className="border border-dotted border-black rounded-br-2xl">
                    <img
                        src=""
                        alt=""
                        className="w-full h-28 object-cover border-b border-dotted border-black"
                    />
                    <h1 className="p-1"></h1>
                </div>
            </div>
        </>
    );
}
