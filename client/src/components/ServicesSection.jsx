import { useEffect, useState } from "react";
import { getServices } from "../utils/api";
import Services from "./Services";
import SkeletonService from "./SkeletonService";
import { SkeletonTheme } from "react-loading-skeleton";
import PortalLayout from "./PortalLayout";

export default function ServicesSection() {
    const [servicesData, setServicesData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedService, setSelectedService] = useState(null);

    const handleServiceClick = (serviceName) => {
        setSelectedService(serviceName);
    };

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setIsLoading(true);
                const data = await getServices();
                setServicesData(data);
            } catch (error) {
                console.error("Error fetching services:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchServices();
    }, []);
    return (
        <>
            <div className="py-2">
                <h1 className="text-4xl py-4 font-[NeuwMachinaBold]">
                    OUR SERVICES
                </h1>
                <SkeletonTheme baseColor="#bfdbfe" highlightColor="#F5F5DC">
                    <div className="w-full grid grid-cols-6 gap-4 py-4 text-center text-sm border-t border-black">
                        {isLoading
                            ? Array(5)
                                  .fill()
                                  .map((_, index) => (
                                      <SkeletonService key={index} />
                                  ))
                            : servicesData.map((service) => (
                                  <Services
                                      key={service._id}
                                      serviceImage={service.serviceImage}
                                      serviceName={service.serviceName}
                                      onServiceClick={handleServiceClick} // Make sure this is defined and passed
                                  />
                              ))}
                    </div>
                </SkeletonTheme>
            </div>
            <PortalLayout
                isOpen={!!selectedService}
                onClose={() => setSelectedService(null)}
                serviceName={selectedService}
            />
        </>
    );
}
