import { useContext, useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getServiceDetails } from "../utils/api";
import { cart2, quality, tick } from "../assets";
import ClipLoader from "react-spinners/ClipLoader";
import { CartContext } from "../context/CartContext";
import ServiceCart from "../components/ServiceCart";
import { PackageOpen } from "lucide-react";

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
                        // Handle case with serviceTypes (e.g., Salon for Women)
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
                    } else if (subcategoryData.categories) {
                        // Handle case with direct categories (e.g., Spa for Women)
                        categoriesList = subcategoryData.categories;
                        servicesList = subcategoryData.categories.flatMap(
                            (cat) =>
                                (cat.services || []).map((service) => ({
                                    ...service,
                                    category: cat.name,
                                }))
                        );
                    } else if (subcategoryData.services) {
                        // Handle case with direct services
                        servicesList = subcategoryData.services;
                        categoriesList = [
                            ...new Set(
                                servicesList.map((service) => service.category)
                            ),
                        ].map((catName) => ({
                            name: catName,
                            categoryImage: subcategoryData.categoryImage || "",
                        }));
                    }
                }

                setServices(servicesList);
                setCategories(
                    categoriesList.sort((a, b) => a.name.localeCompare(b.name))
                );
            } catch (err) {
                console.error("Error fetching services:", err);
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
        <div className="relative grid grid-cols-4 gap-6 pb-6 max-xl:grid-cols-5 max-md:flex max-md:flex-col">
            {/* Sidebar Component  */}

            <div className="sticky top-28 self-start max-xl:col-span-2 max-md:static max-md:w-full max-md:text-center">
                <h2 className="text-2xl font-bold pb-2 max-md:pb-2">
                    {serviceName}
                </h2>
                <h3 className="text-4xl font-bold pb-8 max-md:pb-2">
                    {serviceType || subcategory}
                </h3>
                <div className="p-6 rounded-md border border-black max-md:hidden">
                    <h1 className="font-black text-lg text-nowrap mb-4 tracking-wide">
                        Select a service
                    </h1>
                    <div className="grid grid-cols-3 gap-4 gap-y-5 max-lg:grid-cols-2">
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

            <div className="col-span-2 flex flex-col rounded-md p-8 pb-0 border border-black max-xl:col-span-3">
                {categories.map((category, index) => (
                    <div
                        key={category.name}
                        ref={(el) => (categoryRefs.current[category.name] = el)}
                        className={
                            index !== 0
                                ? "scroll-mt-[6.5rem] pt-8 border-t border-black"
                                : "scroll-mt-40"
                        }
                    >
                        <div className="flex items-center pb-4 gap-2">
                            <PackageOpen size={17} color="#16a34a "/>
                            <h1 className="text-green-600 text-sm font-extrabold uppercase tracking-wide">
                                {category.name}
                            </h1>
                        </div>

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
                                            <div className="flex justify-between max-[]:">
                                                <div className="w-8/12">
                                                    <h4 className="font-semibold tracking-wide">
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
                                                <div className="w-36 flex flex-col items-center justify-end">
                                                    {service.image && (
                                                        <img
                                                            src={`${
                                                                import.meta.env
                                                                    .VITE_BACKEND_URL
                                                            }/${service.image}`}
                                                            alt={service.title}
                                                            className="w-36 h-24 object-cover object-top rounded border border-black text-sm bg-gray-100"
                                                        />
                                                    )}
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
                                                <hr className="border-t border-dashed border-black mt-6" />
                                            )}
                                        </div>
                                    )
                                )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Cart Component  */}
            <div className="sticky top-28 self-start overflow-hidden flex flex-col gap-6 max-xl:hidden">
                <div className="h-96 flex flex-col items-center justify-center gap-4 rounded-md border border-black overflow-hidden">
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
                <div className="relative p-4 border border-black rounded-md">
                    <h1 className="text-orange-600 font-black uppercase tracking-wide font-[NeuwMachinaBold]">
                        Quality Assured
                    </h1>
                    <img
                        src={quality}
                        alt=""
                        className="absolute top-4 right-4 w-8"
                    />
                    <ul className="pl-4 pt-3 pb-0 text-neutral-800">
                        <li className="flex gap-3 items-center">
                            <img src={tick} alt="" className="w-5 h-auto" />
                            4.5+ Rated Services
                        </li>
                        <li className="flex gap-3 items-center">
                            <img src={tick} alt="" className="w-5 h-auto" />
                            Luxury Experience Guaranteed
                        </li>
                        <li className="flex gap-3 items-center">
                            <img src={tick} alt="" className="w-5 h-auto" />
                            Premium Branded Products
                        </li>
                        <li className="flex gap-3 items-center">
                            <img src={tick} alt="" className="w-5 h-auto" />
                            Expert Professionals
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ServiceList;
