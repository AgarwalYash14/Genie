import { useEffect, useState } from "react";
import { getServices } from "../utils/api";
import Services from "./Services";
import ServiceDetails from "./ServiceDetails";

export default function ServicesSection() {
    const [servicesData, setServicesData] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await getServices();
                setServicesData(data);
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        };

        fetchServices();
    }, []);
    return (
        <>
            <div className="flex gap-14 pb-4">
                <div className="w-[36rem] flex flex-col gap-4 p-4 text-center text-sm border border-dotted border-black content-center rounded-2xl">
                    {servicesData.map((service) => (
                        <Services
                            key={service._id}
                            serviceImage={service.serviceImage}
                            serviceName={service.serviceName}
                        />
                    ))}
                </div>
                <ServiceDetails />
            </div>
        </>
    );
}
