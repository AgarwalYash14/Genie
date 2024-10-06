import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getServiceDetails } from "../utils/api";

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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!details) return <div>No details available</div>;

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
                    <div className="w-full grid grid-cols-3 gap-4">
                        {Object.keys(details.subcategories).map(
                            (subcategory) => (
                                <button
                                    key={subcategory}
                                    onClick={() =>
                                        handleSubcategorySelect(subcategory)
                                    }
                                    className="h-36 text-center mb-2 rounded border border-dashed border-black hover:shadow-lg hover:scale-105 transition-transform duration-300 overflow-hidden"
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
                                            className="w-full h-28 p-2 object-contain border-b bg-gray-100"
                                        />
                                        <h1 className="text-sm h-[1.625rem] px-4">
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
                                className="w-full text-left border border-dashed border-black hover:shadow-lg hover:scale-105 transition-transform duration-300 rounded"
                            >
                                <div className="w-[28rem] h-44 flex items-center gap-4">
                                    <img
                                        src={`${
                                            import.meta.env.VITE_BACKEND_URL
                                        }/${
                                            details.subcategories[
                                                selectedSubcategory
                                            ].serviceTypes[serviceType].image
                                        }`}
                                        alt={serviceType}
                                        className="w-36 h-full object-cover object-left-top border-r border-dashed border-black"
                                    />
                                    <div className="flex flex-col gap-1">
                                        <h1 className="font-bold text-lg">
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
