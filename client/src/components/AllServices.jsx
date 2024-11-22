import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getServices, getServiceDetails } from "../utils/api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";

export default function AllServices() {
    const [servicesData, setServicesData] = useState([]);
    const [serviceDetails, setServiceDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scrollStates, setScrollStates] = useState({});
    const navigate = useNavigate();
    const scrollContainerRefs = useRef({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const services = await getServices();
                setServicesData(services);

                const details = {};
                for (const service of services) {
                    const serviceDetail = await getServiceDetails(
                        service.serviceName
                    );
                    details[service.serviceName] = serviceDetail;
                }
                setServiceDetails(details);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching services:", err);
                setError("Failed to load services");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const updateScrollStates = () => {
            const newScrollStates = {};
            Object.keys(scrollContainerRefs.current).forEach((key) => {
                const container = scrollContainerRefs.current[key];
                if (container) {
                    const hasScrollableContent =
                        container.scrollWidth > container.clientWidth;
                    const isAtStart = container.scrollLeft <= 0;
                    const isAtEnd =
                        container.scrollLeft + container.clientWidth >=
                        container.scrollWidth - 1;

                    newScrollStates[key] = {
                        hasScroll: hasScrollableContent,
                        showLeftArrow: !isAtStart && hasScrollableContent,
                        showRightArrow: !isAtEnd && hasScrollableContent,
                    };
                }
            });
            setScrollStates(newScrollStates);
        };

        // Initial check
        updateScrollStates();

        // Add resize observer to each container
        const observers = [];
        Object.keys(scrollContainerRefs.current).forEach((key) => {
            const container = scrollContainerRefs.current[key];
            if (container) {
                const observer = new ResizeObserver(updateScrollStates);
                observer.observe(container);
                observers.push(observer);
            }
        });

        // Add scroll listeners
        Object.keys(scrollContainerRefs.current).forEach((key) => {
            const container = scrollContainerRefs.current[key];
            if (container) {
                container.addEventListener("scroll", updateScrollStates);
            }
        });

        return () => {
            observers.forEach((observer) => observer.disconnect());
            Object.keys(scrollContainerRefs.current).forEach((key) => {
                const container = scrollContainerRefs.current[key];
                if (container) {
                    container.removeEventListener("scroll", updateScrollStates);
                }
            });
        };
    }, [servicesData, serviceDetails]);

    const scroll = (serviceName, subcatKey, direction) => {
        const container =
            scrollContainerRefs.current[`${serviceName}-${subcatKey}`];
        if (container) {
            const cardWidth = container.firstChild?.offsetWidth || 0;
            const gap = 16; // 1rem = 16px
            const scrollAmount =
                direction === "left" ? -(cardWidth + gap) : cardWidth + gap;
            container.scrollBy({
                left: scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const handleCategoryClick = (
        serviceName,
        subcategory,
        serviceType = ""
    ) => {
        const basePath = `/services/${serviceName}/${subcategory}`;
        const path = serviceType ? `${basePath}/${serviceType}` : basePath;
        navigate(path);
    };

    const renderCategories = (serviceName, serviceData) => {
        if (!serviceData?.subcategories) return null;

        return Object.entries(serviceData.subcategories)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([subcatName, subcatData]) => {
                // Handle services with service types
                if (subcatData.serviceTypes) {
                    return Object.entries(subcatData.serviceTypes)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([typeKey, typeData]) => (
                            <div
                                key={`${subcatName}-${typeKey}`}
                                className="mb-8"
                            >
                                <h3 className="text-xl font-bold mb-4">
                                    {subcatName} - {typeKey}
                                </h3>
                                <div className="relative">
                                    {scrollStates[
                                        `${serviceName}-${subcatName}-${typeKey}`
                                    ]?.showLeftArrow && (
                                        <button
                                            onClick={() =>
                                                scroll(
                                                    serviceName,
                                                    `${subcatName}-${typeKey}`,
                                                    "left"
                                                )
                                            }
                                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white hover:bg-gray-100 border border-black shadow-md"
                                            aria-label="Scroll left"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                    )}
                                    {scrollStates[
                                        `${serviceName}-${subcatName}-${typeKey}`
                                    ]?.showRightArrow && (
                                        <button
                                            onClick={() =>
                                                scroll(
                                                    serviceName,
                                                    `${subcatName}-${typeKey}`,
                                                    "right"
                                                )
                                            }
                                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white hover:bg-gray-100 border border-black shadow-md"
                                            aria-label="Scroll right"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    )}
                                    <div
                                        ref={(el) =>
                                            (scrollContainerRefs.current[
                                                `${serviceName}-${subcatName}-${typeKey}`
                                            ] = el)
                                        }
                                        className="grid auto-cols-[calc(100%-2rem)] sm:auto-cols-[calc(50%-1rem)] md:auto-cols-[calc(33.333%-1rem)] lg:auto-cols-[calc(25%-1rem)] xl:auto-cols-[calc(16.8%-1rem)] grid-flow-col gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
                                        style={{
                                            scrollSnapType: "x mandatory",
                                        }}
                                    >
                                        {typeData.categories
                                            ?.sort((a, b) =>
                                                a.name.localeCompare(b.name)
                                            )
                                            .map((category) => (
                                                <button
                                                    key={category.name}
                                                    onClick={() =>
                                                        handleCategoryClick(
                                                            serviceName,
                                                            subcatName,
                                                            typeKey
                                                        )
                                                    }
                                                    className="border border-black rounded-md hover:bg-gray-50 transition-all duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                                    style={{
                                                        scrollSnapAlign:
                                                            "start",
                                                    }}
                                                >
                                                    <h4 className="h-12 flex items-center justify-center">
                                                        {category.name}
                                                    </h4>
                                                    <img
                                                        src={`${
                                                            import.meta.env
                                                                .VITE_BACKEND_URL
                                                        }${
                                                            category.categoryImage
                                                        }`}
                                                        alt={category.name}
                                                        className="w-full h-44 object-cover bg-yellow-100"
                                                    />
                                                </button>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        ));
                }

                // Handle services with direct categories
                if (subcatData.categories) {
                    return (
                        <div key={subcatName} className="mb-8">
                            <h3 className="text-xl font-bold mb-4">
                                {subcatName}
                            </h3>
                            <div className="relative">
                                {scrollStates[`${serviceName}-${subcatName}`]
                                    ?.showLeftArrow && (
                                    <button
                                        onClick={() =>
                                            scroll(
                                                serviceName,
                                                subcatName,
                                                "left"
                                            )
                                        }
                                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white hover:bg-gray-100 border border-black shadow-md"
                                        aria-label="Scroll left"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                )}
                                {scrollStates[`${serviceName}-${subcatName}`]
                                    ?.showRightArrow && (
                                    <button
                                        onClick={() =>
                                            scroll(
                                                serviceName,
                                                subcatName,
                                                "right"
                                            )
                                        }
                                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white hover:bg-gray-100 border border-black shadow-md"
                                        aria-label="Scroll right"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                )}
                                <div
                                    ref={(el) =>
                                        (scrollContainerRefs.current[
                                            `${serviceName}-${subcatName}`
                                        ] = el)
                                    }
                                    className="grid auto-cols-[calc(100%-2rem)] sm:auto-cols-[calc(50%-1rem)] md:auto-cols-[calc(33.333%-1rem)] lg:auto-cols-[calc(25%-1rem)] xl:auto-cols-[calc(16.8%-1rem)] grid-flow-col gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
                                    style={{ scrollSnapType: "x mandatory" }}
                                >
                                    {subcatData.categories
                                        .sort((a, b) =>
                                            a.name.localeCompare(b.name)
                                        )
                                        .map((category) => (
                                            <button
                                                key={category.name}
                                                onClick={() =>
                                                    handleCategoryClick(
                                                        serviceName,
                                                        subcatName
                                                    )
                                                }
                                                className="border border-black rounded-md hover:bg-gray-50 transition-all duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                                style={{
                                                    scrollSnapAlign: "start",
                                                }}
                                            >
                                                <h4 className="h-12 flex items-center justify-center bg-gray-50">
                                                    {category.name}
                                                </h4>
                                                <img
                                                    src={`${
                                                        import.meta.env
                                                            .VITE_BACKEND_URL
                                                    }${category.categoryImage}`}
                                                    alt={category.name}
                                                    className="w-full h-44 object-cover bg-yellow-100"
                                                />
                                            </button>
                                        ))}
                                </div>
                            </div>
                        </div>
                    );
                }
            });
    };

    if (loading) {
        return (
            <div className="w-full h-[76vh] flex justify-center items-center">
                <ClipLoader />
            </div>
        );
    }

    if (error)
        return <div className="text-center text-red-500 p-4">{error}</div>;

    return (
        <div className="container mx-auto">
            <div className="space-y-12">
                {servicesData
                    .sort((a, b) => a.serviceName.localeCompare(b.serviceName))
                    .map((service) => (
                        <div
                            key={service._id}
                            className="border-t border-black pt-8"
                        >
                            <h2 className="text-3xl font-bold mb-6 font-[NeuwMachinaBold]">
                                {service.serviceName}
                            </h2>
                            {serviceDetails[service.serviceName] &&
                                renderCategories(
                                    service.serviceName,
                                    serviceDetails[service.serviceName]
                                )}
                        </div>
                    ))}
            </div>
        </div>
    );
}
