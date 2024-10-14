import { useContext, useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getServiceDetails } from "../utils/api";
import { cart2, tick } from "../assets";
import ClipLoader from "react-spinners/ClipLoader";
import { CartContext } from "../context/CartContext";
import ServiceCart from "../components/ServiceCart";

const ServiceList = () => {
    const { serviceName, subcategory, serviceType } = useParams();
    const { cartServices, addToCart, removeFromCart } = useContext(CartContext);

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

                let servicesList = [];
                let categoriesList = [];

                if (data.subcategories && data.subcategories[subcategory]) {
                    const subcategoryData = data.subcategories[subcategory];

                    if (serviceType && subcategoryData.serviceTypes) {
                        const serviceTypeData =
                            subcategoryData.serviceTypes[serviceType];
                        if (serviceTypeData && serviceTypeData.categories) {
                            categoriesList = serviceTypeData.categories;
                            servicesList = serviceTypeData.categories.flatMap(
                                (cat) =>
                                    (cat.services || []).map((service) => ({
                                        ...service,
                                        category: cat.name,
                                    }))
                            );
                        }
                    } else if (subcategoryData.services) {
                        servicesList = subcategoryData.services;
                        // Assuming we don't have category objects in this case, we'll create minimal ones
                        categoriesList = [
                            ...new Set(
                                servicesList.map((service) => service.category)
                            ),
                        ].map((catName) => ({ name: catName }));
                    }
                } else if (data.services) {
                    servicesList = data.services;
                    // Assuming we don't have category objects in this case, we'll create minimal ones
                    categoriesList = [
                        ...new Set(
                            servicesList.map((service) => service.category)
                        ),
                    ].map((catName) => ({ name: catName }));
                }

                setServices(servicesList);
                setCategories(
                    categoriesList.sort((a, b) => a.name.localeCompare(b.name))
                );
            } catch (err) {
                console.error(err);
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

    if (loading)
        return (
            <div className="w-full h-[76vh] flex justify-center items-center">
                <ClipLoader />
            </div>
        );
    if (error) return <div>{error}</div>;

    return (
        <div className="relative flex gap-6 pt-10 pb-6">
            {/* Sidebar Component  */}

            <div className="sticky top-[7.5rem] w-1/4 self-start">
                <h2 className="text-2xl font-bold pb-4">{serviceName}</h2>
                <h3 className="text-4xl font-bold pb-8">
                    {serviceType || subcategory}
                </h3>
                <div className="p-8 rounded-md border border-black">
                    <h1 className="font-black text-lg text-nowrap mb-4">
                        Select a service
                    </h1>
                    <div className="grid grid-cols-3 gap-4 gap-y-5">
                        {categories.map((category) => (
                            <button
                                key={category.name}
                                onClick={() => scrollToCategory(category.name)}
                                className="w-full h-28 text-center text-sm"
                            >
                                <div>
                                    <img
                                        src={`${
                                            import.meta.env.VITE_BACKEND_URL
                                        }${category.categoryImage}`}
                                        alt={category.name}
                                        loading="lazy"
                                        className="w-full h-20 object-cover border border-dashed border-black rounded bg-gray-100 text-xs"
                                    />
                                    <h1 className="h-10 py-1 text-xs leading-4">
                                        {category.name}
                                    </h1>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Services Component  */}

            <div className="w-1/2 flex flex-col p-8 pb-0 rounded-md border border-black">
                {categories.map((category, index) => (
                    <div
                        key={category.name}
                        ref={(el) => (categoryRefs.current[category.name] = el)}
                        className={
                            index !== 0 ? "pt-8 border-t border-black" : ""
                        }
                    >
                        <h1 className="text-green-600 pb-2 text-lg font-bold">
                            {category.name}
                        </h1>
                        <div className="flex flex-col gap-8 mb-8">
                            {services
                                .filter(
                                    (service) =>
                                        service.category === category.name
                                )
                                .map(
                                    (
                                        service,
                                        serviceIndex,
                                        filteredServices
                                    ) => (
                                        <div key={serviceIndex}>
                                            <div className="flex justify-between">
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
                                                                    </strike>
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
                                                        src={`${
                                                            import.meta.env
                                                                .VITE_BACKEND_URL
                                                        }/${service.image}`}
                                                        alt={service.title}
                                                        loading="lazy"
                                                        className="w-36 h-24 object-cover object-top rounded border border-black text-sm bg-gray-100"
                                                    />
                                                    {!cartServices.find(
                                                        (cartService) =>
                                                            cartService._id ===
                                                            service._id
                                                    ) ? (
                                                        <button
                                                            onClick={() =>
                                                                addToCart(
                                                                    service
                                                                )
                                                            }
                                                            className="w-20 h-7 text-sm bg-yellow-300 text-black leading-[1] border border-black rounded -translate-y-4 hover:bg-amber-300 transition-colors duration-300"
                                                        >
                                                            Add
                                                        </button>
                                                    ) : (
                                                        <div className="w-20 h-7 flex items-center justify-center text-sm border border-black rounded -translate-y-4 overflow-hidden">
                                                            <button
                                                                onClick={() =>
                                                                    removeFromCart(
                                                                        service
                                                                    )
                                                                }
                                                                className="w-full h-full bg-yellow-300 text-black border-r border-black pt-1 pb-1.5 leading-[1] hover:bg-amber-300 transition-colors duration-300"
                                                            >
                                                                -
                                                            </button>
                                                            <span className="bg-[#FFFFEE] w-20 h-full leading-[1.625rem] text-center">
                                                                {
                                                                    cartServices.find(
                                                                        (
                                                                            cartService
                                                                        ) =>
                                                                            cartService._id ===
                                                                            service._id
                                                                    ).quantity
                                                                }
                                                            </span>
                                                            <button
                                                                onClick={() =>
                                                                    addToCart(
                                                                        service
                                                                    )
                                                                }
                                                                className="w-full h-full bg-yellow-300 text-black border-l border-black pt-1 pb-1.5 leading-[1] hover:bg-amber-300 transition-colors duration-300"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {serviceIndex <
                                                filteredServices.length - 1 && (
                                                <hr className="border-t border-dashed border-black" />
                                            )}
                                        </div>
                                    )
                                )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Cart Component  */}
            <div className="w-1/4 sticky top-[7.5rem] self-start overflow-hidden flex flex-col gap-6">
                <div className="h-96 flex flex-col items-center justify-center gap-4 p-4 rounded-md border border-black">
                    {cartServices.length === 0 ? (
                        <>
                            <div className="h-full w-full flex flex-col gap-4 justify-center items-center">
                                <img src={cart2} alt="" />
                                <p>No items in your cart.</p>
                            </div>
                        </>
                    ) : (
                        <ServiceCart />
                    )}
                </div>
                <div className="p-4 border border-black rounded-md">
                    <h1 className="font-bold">Quality Assured</h1>
                    <ul className="pt-4 pl-2">
                        <li className="flex gap-3">
                            <img src={tick} alt="" className="w-5 h-auto" />
                            4.5+ Rated
                        </li>
                        <li className="flex gap-3">
                            <img src={tick} alt="" className="w-5 h-auto" />
                            Luxury Experience
                        </li>
                        <li className="flex gap-3 items-center">
                            <img src={tick} alt="" className="w-5 h-auto" />
                            Premium Branded Products
                        </li>
                        <li className="flex gap-3 items-center">
                            <img src={tick} alt="" className="w-5 h-auto" />
                            Premium Branded Products
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ServiceList;
