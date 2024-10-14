import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getServiceDetails } from "../utils/api";
import ClipLoader from "react-spinners/ClipLoader";

const ServiceDetails = ({ serviceName }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [selectedServiceType, setSelectedServiceType] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const data = await getServiceDetails(serviceName);
                setDetails(data);
            } catch (err) {
                setError("Failed to load service details");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [serviceName]);

    useEffect(() => {
        if (
            selectedSubcategory &&
            !details.subcategories[selectedSubcategory].serviceTypes
        ) {
            navigate(`/services/${serviceName}/${selectedSubcategory}`);
        }
    }, [selectedSubcategory, details, navigate, serviceName]);

    if (loading)
        return (
            <div className="w-[40rem] h-64 flex justify-center items-center">
                <ClipLoader />
            </div>
        );
    if (error)
        return (
            <div className="w-[40rem] h-64 flex justify-center items-center">
                {error}
            </div>
        );
    if (!details)
        return (
            <div className="w-[40rem] h-64 flex justify-center items-center">
                No details available
            </div>
        );

    const handleSubcategorySelect = (subcategory) => {
        setSelectedSubcategory(subcategory);
        setSelectedServiceType(null);
    };

    const handleServiceTypeSelect = (serviceType) => {
        setSelectedServiceType(serviceType);
        navigate(
            `/services/${serviceName}/${selectedSubcategory}/${serviceType}`
        );
    };

    return (
        <div className="p-10 pt-0">
            <h2 className="text-2xl text-center pb-8">{serviceName}</h2>

            {!selectedSubcategory ? (
                <div>
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.keys(details.subcategories).map(
                            (subcategory) => (
                                <button
                                    key={subcategory}
                                    onClick={() =>
                                        handleSubcategorySelect(subcategory)
                                    }
                                    className="w-44 h-40 text-center mb-2 rounded border border-dashed border-black hover:scale-105 transition-transform duration-300 overflow-hidden"
                                >
                                    <div className="h-full flex flex-col justify-between">
                                        <img
                                            src={`${
                                                import.meta.env.VITE_BACKEND_URL
                                            }/${
                                                details.subcategories[
                                                    subcategory
                                                ].image
                                            }`}
                                            alt={serviceName}
                                            loading="lazy"
                                            className="w-full h-28 p-2 object-contain border-b border-dashed border-black bg-gray-100 text-sm"
                                        />
                                        <h1 className="text-sm h-12 flex items-center justify-center px-4">
                                            {subcategory}
                                        </h1>
                                    </div>
                                </button>
                            )
                        )}
                    </div>
                </div>
            ) : !selectedServiceType ? (
                <div className="flex flex-col gap-4">
                    {details.subcategories[selectedSubcategory].serviceTypes &&
                    Object.keys(
                        details.subcategories[selectedSubcategory].serviceTypes
                    ).length > 0 ? (
                        Object.keys(
                            details.subcategories[selectedSubcategory]
                                .serviceTypes
                        ).map((serviceType) => (
                            <button
                                key={serviceType}
                                onClick={() =>
                                    handleServiceTypeSelect(serviceType)
                                }
                                className="w-full text-left border border-dashed border-black hover:scale-105 transition-all duration-300 rounded overflow-hidden"
                            >
                                <div className="w-[28rem] h-32 flex items-center gap-4">
                                    <img
                                        src={`${
                                            import.meta.env.VITE_BACKEND_URL
                                        }/${
                                            details.subcategories[
                                                selectedSubcategory
                                            ].serviceTypes[serviceType].image
                                        }`}
                                        alt={serviceType}
                                        loading="lazy"
                                        className="w-36 h-full object-cover object-left-top border-r border-dashed border-black"
                                    />
                                    <div className="flex flex-col gap-1">
                                        <h1 className="text-lg">
                                            {serviceType}
                                        </h1>
                                        <div>
                                            {serviceType ===
                                                "Salon Classic" && (
                                                <div className="flex gap-2">
                                                    <div className="text-sm bg-green-100 text-green-800 text-center uppercase px-2 py-1 rounded">
                                                        ₹
                                                    </div>
                                                    <div className="text-sm bg-zinc-100 text-zinc-700 text-center uppercase px-2 py-1 rounded">
                                                        Economical
                                                    </div>
                                                </div>
                                            )}
                                            {serviceType === "Salon Prime" && (
                                                <div className="flex gap-2">
                                                    <div className="text-sm bg-green-100 text-green-800 text-center uppercase px-2 py-1 rounded">
                                                        ₹₹
                                                    </div>
                                                    <div className="text-sm bg-zinc-100 text-zinc-700 text-center uppercase px-2 py-1 rounded">
                                                        Premium
                                                    </div>
                                                </div>
                                            )}
                                            {serviceType === "Salon Luxe" && (
                                                <div className="flex gap-2">
                                                    <div className="text-sm bg-green-100 text-green-800 text-center uppercase px-2 py-1 rounded">
                                                        ₹₹₹
                                                    </div>
                                                    <div className="text-sm bg-zinc-100 text-zinc-700 text-center uppercase px-2 py-1 rounded">
                                                        Top Partners
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div>No service types available</div>
                    )}
                </div>
            ) : null}
        </div>
    );
};

export default ServiceDetails;
