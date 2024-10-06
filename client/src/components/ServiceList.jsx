import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getServiceDetails } from "../utils/api";
import { cart2 } from "../assets";

const ServiceList = () => {
    const { serviceName, subcategory, serviceType } = useParams();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const categoryRefs = useRef({});

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                const data = await getServiceDetails(serviceName);
                let servicesList;
                if (serviceType) {
                    servicesList =
                        data.subcategories[subcategory].serviceTypes[
                            serviceType
                        ].services;
                } else {
                    servicesList = data.subcategories[subcategory].services;
                }
                setServices(servicesList);

                // Extract unique categories and sort them
                const uniqueCategories = [
                    ...new Set(servicesList.map((service) => service.category)),
                ].sort();
                setCategories(uniqueCategories);
            } catch (err) {
                setError("Failed to load services");
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [serviceName, subcategory, serviceType]);

    const scrollToCategory = (category) => {
        categoryRefs.current[category]?.scrollIntoView({ behavior: "smooth" });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="relative flex gap-8 pt-10 pb-6">
            <div className="sticky top-[7.5rem] w-1/4 self-start">
                <h2 className="text-2xl font-bold pb-4">{serviceName}</h2>
                <h3 className="text-4xl font-bold pb-8">
                    {serviceType || subcategory}
                </h3>
                <div className="p-8 rounded-md border border-black">
                    <h1 className="font-black text-lg text-nowrap mb-4">
                        Select a service
                    </h1>
                    <div className="grid grid-cols-3 gap-4 gap-y-8">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => scrollToCategory(category)}
                                className="w-full h-28 text-center text-sm"
                            >
                                <div>
                                    <img
                                        src=""
                                        alt={category}
                                        className="h-20 border border-dashed border-black rounded bg-gray-100"
                                    />
                                    <h1 className="h-8 py-1">{category}</h1>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="w-1/2 flex flex-col p-8 pb-0 rounded-md border border-black">
                {categories.map((category, index) => (
                    <div
                        key={category}
                        ref={(el) => (categoryRefs.current[category] = el)}
                        className={
                            index !== 0 ? "pt-8 border-t border-black" : ""
                        }
                    >
                        <h1 className="text-green-600 pb-2 text-lg font-bold">
                            {category}
                        </h1>
                        <div className="flex flex-col gap-8 mb-8">
                            {services
                                .filter(
                                    (service) => service.category === category
                                )
                                .map(
                                    (
                                        service,
                                        serviceIndex,
                                        filteredServices
                                    ) => (
                                        <>
                                            <div
                                                key={serviceIndex}
                                                className="flex justify-between"
                                            >
                                                <div className="w-8/12">
                                                    <h4 className="font-bold">
                                                        {service.title}
                                                    </h4>

                                                    <div className="flex items-center gap-4">
                                                        {service.MRP ===
                                                        service.OurPrice ? (
                                                            <p>
                                                                ₹
                                                                {
                                                                    service.OurPrice
                                                                }
                                                            </p>
                                                        ) : (
                                                            <>
                                                                <p className="flex items-center gap-3">
                                                                    ₹
                                                                    {
                                                                        service.OurPrice
                                                                    }
                                                                    <strike className="text-sm text-zinc-400">
                                                                        ₹
                                                                        {
                                                                            service.MRP
                                                                        }
                                                                    </strike>{" "}
                                                                </p>
                                                            </>
                                                        )}
                                                    </div>
                                                    {service.time && (
                                                        <p className="text-sm text-gray-400 pt-2">
                                                            {service.time}
                                                        </p>
                                                    )}
                                                    <div className="text-sm py-2 text-zinc-500">
                                                        {service.description
                                                            .length > 1 ? (
                                                            <ul className="list-disc pl-5">
                                                                {service.description.map(
                                                                    (
                                                                        point,
                                                                        idx
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                idx
                                                                            }
                                                                        >
                                                                            {
                                                                                point
                                                                            }
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        ) : (
                                                            <p>
                                                                {
                                                                    service
                                                                        .description[0]
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <img
                                                        src={service.image}
                                                        alt={service.title}
                                                        className="w-36 h-24 object-contain rounded border text-sm bg-gray-100"
                                                    />

                                                    <button className="w-24 bg-yellow-300 text-black py-0.5 rounded -translate-y-4">
                                                        Add
                                                    </button>
                                                </div>
                                            </div>
                                            {serviceIndex <
                                                filteredServices.length - 1 && (
                                                <hr className="border-t border-dashed border-black" />
                                            )}
                                        </>
                                    )
                                )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="sticky top-[7.5rem] w-1/4 self-start">
                <div className="h-96 flex flex-col items-center justify-center gap-4 rounded-md border border-black">
                    <img src={cart2} alt="" />
                    <p>No items in your cart.</p>
                </div>
            </div>
        </div>
    );
};

export default ServiceList;
