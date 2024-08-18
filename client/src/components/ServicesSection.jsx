import { useEffect, useState } from "react";
import { getServices } from "../utils/api";
import Services from "./Services";
import ServiceDetails from "./ServiceDetails";
import SkeletonService from "./SkeletonService";
import { SkeletonTheme } from "react-loading-skeleton";

export default function ServicesSection() {
    const [servicesData, setServicesData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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
            <div className="flex gap-14 pb-4">
                <SkeletonTheme baseColor="#fef08a" highlightColor="#F5F5DC">
                    <div className="w-[36rem] flex flex-col gap-4 p-4 text-center text-sm border border-dotted border-black content-center rounded-2xl">
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
                                  />
                              ))}
                    </div>
                </SkeletonTheme>

                <ServiceDetails />
            </div>
        </>
    );
}
