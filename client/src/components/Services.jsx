import { arrow } from "../assets";

const Services = ({ serviceImage, serviceName }) => {
    return (
        <>
            <div className="relative">
                <div className="absolute top-1/2 -translate-y-1/2 -z-10">
                    <img src={arrow} alt="arrow" />
                </div>
                <div className="w-full outline-1 outline-dotted rounded-xl overflow-hidden hover:outline-2 hover:outline-black hover:translate-x-12 hover:bg-amber-50 hover:shadow-xl transition-all bg-[#FFFFEE]">
                    <button className="flex items-center">
                        <img
                            src={`${
                                import.meta.env.VITE_BACKEND_URL
                            }/${serviceImage}`}
                            alt={serviceName}
                            className="w-32 h-20 object-cover"
                        />
                        <h1 className="p-4">{serviceName}</h1>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Services;
