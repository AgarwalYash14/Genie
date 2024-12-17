import { useState, useEffect } from "react";
import {
    Plus,
    Edit,
    Trash2,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import PortalLayout from "../../components/PortalLayout";
import {
    getServices,
    createService,
    updateService,
    deleteService,
    getServiceDetailsById,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
    createServiceType,
    updateServiceType,
    deleteServiceType,
    createCategory,
    updateCategory,
    deleteCategory,
    createServiceDetail,
    updateServiceDetail,
    deleteServiceDetail
} from "../../utils/api";

const AdminServicesPage = () => {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedService, setSelectedService] = useState(null);
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
        useState(false);
    const [activeService, setActiveService] = useState(null);
    const [serviceDetails, setServiceDetails] = useState([]);
    const [expandedSubcategories, setExpandedSubcategories] = useState(
        new Set()
    );
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [selectedServiceType, setSelectedServiceType] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
    const [isServiceTypeModalOpen, setIsServiceTypeModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isServiceDetailsModalOpen, setIsServiceDetailsModalOpen] = useState(false);
    const [selectedServiceDetail, setSelectedServiceDetail] = useState(null);

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        if (activeService) {
            fetchServiceDetails(activeService._id);
        }
    }, [activeService]);

    const fetchServices = async () => {
        try {
            setIsLoading(true);
            const data = await getServices();
            // Sort services based on the 'order' property
            const sortedData = data.sort((a, b) => a.order - b.order);
            setServices(sortedData);
        } catch (error) {
            console.error("Error fetching services:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchServiceDetails = async (serviceId) => {
        try {
            const data = await getServiceDetailsById(serviceId);
            if (data) {
                setServiceDetails(data);
            }
        } catch (error) {
            console.error("Error fetching service details:", error);
            setServiceDetails(null);
        }
    };

    const handleAddService = () => {
        setSelectedService(null);
        setIsServiceModalOpen(true);
    };

    const handleEditService = (service) => {
        setSelectedService(service);
        setIsServiceModalOpen(true);
    };

    const handleDeleteService = (service) => {
        setSelectedService(service);
        setIsDeleteConfirmationOpen(true);
    };

    const confirmDeleteService = async () => {
        try {
            await deleteService(selectedService._id);
            fetchServices();
            setIsDeleteConfirmationOpen(false);
        } catch (error) {
            console.error("Error deleting service:", error);
        }
    };

    const toggleSubcategory = (subcategoryName) => {
        setExpandedSubcategories((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(subcategoryName)) {
                newSet.delete(subcategoryName);
            } else {
                newSet.add(subcategoryName);
            }
            return newSet;
        });
    };

    const handleAddSubcategory = () => {
        setSelectedSubcategory(null);
        setIsSubcategoryModalOpen(true);
    };

    const handleEditSubcategory = (subcategory) => {
        setSelectedSubcategory(subcategory);
        setIsSubcategoryModalOpen(true);
    };

    const handleDeleteSubcategory = async (subcategoryName) => {
        try {
            await deleteSubcategory(activeService._id, subcategoryName);
            fetchServiceDetails(activeService._id);
        } catch (error) {
            console.error("Error deleting subcategory:", error);
        }
    };

    const handleAddServiceType = (subcategoryName) => {
        setSelectedSubcategory(subcategoryName);
        setSelectedServiceType(null);
        setIsServiceTypeModalOpen(true);
    };

    const handleEditServiceType = (subcategoryName, serviceType) => {
        setSelectedSubcategory(subcategoryName);
        setSelectedServiceType(serviceType);
        setIsServiceTypeModalOpen(true);
    };

    const handleAddCategory = (subcategoryName) => {
        setSelectedSubcategory(subcategoryName);
        setSelectedCategory(null);
        setIsCategoryModalOpen(true);
    };

    const handleEditCategory = (subcategoryName, category) => {
        setSelectedSubcategory(subcategoryName);
        setSelectedCategory(category);
        setIsCategoryModalOpen(true);
    };

    const handleDeleteCategory = async (subcategoryName, category) => {
        try {
            await deleteCategory(activeService._id, subcategoryName, category._id);
            fetchServiceDetails(activeService._id);
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    const handleDeleteServiceType = async (subcategoryName, serviceType) => {
        try {
            await deleteServiceType(activeService._id, subcategoryName, serviceType);
            fetchServiceDetails(activeService._id);
        } catch (error) {
            console.error("Error deleting service type:", error);
        }
    };

    const handleAddServiceDetail = () => {
        setSelectedServiceDetail(null);
        setIsServiceDetailsModalOpen(true);
    };

    const handleEditServiceDetail = (detail) => {
        setSelectedServiceDetail(detail);
        setIsServiceDetailsModalOpen(true);
    };

    const handleDeleteServiceDetail = async (detailId) => {
        try {
            await deleteServiceDetail(activeService._id, detailId);
            fetchServiceDetails(activeService._id);
        } catch (error) {
            console.error("Error deleting service detail:", error);
        }
    };

    return (
        <div className="flex flex-col w-full">
            <div className="w-full flex justify-between items-center mb-6">
                <h1 className="text-4xl font-[NeuwMachinaBold] truncate">
                    SERVICES MANAGEMENT
                </h1>
                <button
                    onClick={handleAddService}
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition whitespace-nowrap"
                >
                    <Plus size={20} />
                    Add New Service
                </button>
            </div>

            <div className="grid grid-cols-1 min-[425px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 text-center text-sm">
                {isLoading
                    ? Array(6)
                          .fill()
                          .map((_, index) => <SkeletonService key={index} />)
                    : services.map((service) => (
                          <div
                              key={service._id}
                              className={`relative flex flex-col items-center border rounded-lg hover:shadow-lg ${
                                  activeService?._id === service._id
                                      ? "border-yellow-500"
                                      : "border-neutral-500"
                              }`}
                              onClick={() => setActiveService(service)}
                          >
                              {activeService?._id === service._id && (
                                  <>
                                      <div
                                          className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 z-10 
                                          border-l-[12px] border-l-transparent 
                                          border-r-[12px] border-r-transparent 
                                          border-t-[12px] border-t-yellow-500"
                                      />
                                      <div
                                          className="absolute -bottom-[0.6875rem] left-1/2 transform -translate-x-1/2 w-0 h-0 z-10 
                                          border-l-[12px] border-l-transparent 
                                          border-r-[12px] border-r-transparent 
                                          border-t-[12px] border-t-yellow-200"
                                      />
                                  </>
                              )}
                              <img
                                  src={`${import.meta.env.VITE_BACKEND_URL}/${
                                      service.serviceImage
                                  }`}
                                  alt={service.serviceName}
                                  className="bg-yellow-100 w-full h-36 object-contain rounded-t-lg p-4 shadow-inner border-b border-neutral-500"
                              />
                              <h2 className="bg-yellow-200 w-full h-8 flex items-center justify-center p-6 text-xs uppercase tracking-wide font-semibold rounded-b-lg">
                                  {service.serviceName}
                              </h2>
                              <div className="bg-neutral-700 text-white absolute top-0 right-0 flex flex-col border-l border-b border-neutral-500 rounded-bl-lg rounded-tr-lg overflow-hidden">
                                  <button
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditService(service);
                                      }}
                                      className="p-2 pb-1.5 hover:bg-neutral-600 transition"
                                  >
                                      <Edit size={12} />
                                  </button>
                                  <button
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteService(service);
                                      }}
                                      className="p-2 pt-1.5 hover:bg-neutral-600 transition"
                                  >
                                      <Trash2 size={12} />
                                  </button>
                              </div>
                          </div>
                      ))}
            </div>

            {/* Service Details Section */}
            {activeService && (
                <div className="relative mt-4">
                    <div className="bg-yellow-200 rounded-lg shadow-lg p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-[NeuwMachinaBold] text-neutral-800">
                                {activeService.serviceName} Details
                            </h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleAddServiceDetail}
                                    className="flex items-center gap-2 bg-green-500 text-white px-3 py-1.5 rounded-md hover:bg-green-600 transition text-sm"
                                >
                                    <Plus size={16} />
                                    Add Service Detail
                                </button>
                                    <button
                                        onClick={handleAddSubcategory}
                                        className="flex items-center gap-2 bg-green-500 text-white px-3 py-1.5 rounded-md hover:bg-green-600 transition text-sm"
                                    >
                                        <Plus size={16} />
                                        Add Subcategory
                                    </button>
                            </div>
                                </div>

                        {/* Subcategories */}
                        {serviceDetails?.subcategories && (
                            <div className="space-y-4">
                                {Object.entries(serviceDetails.subcategories).map(([subcategoryName, subcategory]) => (
                                    <div
                                        key={subcategoryName}
                                        className="border border-neutral-200 rounded-lg bg-white"
                                    >
                                        <div className="flex justify-between items-center p-4">
                                            <div className="flex items-center gap-4">
                                                {subcategory.image && (
                                                    <img
                                                        src={`${import.meta.env.VITE_BACKEND_URL}/${subcategory.image}`}
                                                        alt={subcategoryName}
                                                        className="w-16 h-16 p-1 object-contain rounded bg-neutral-100"
                                                    />
                                                )}
                                                <h4 className="text-lg font-medium">{subcategoryName}</h4>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEditSubcategory(subcategoryName, subcategory)}
                                                    className="p-1.5 hover:bg-neutral-100 rounded"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSubcategory(subcategoryName)}
                                                    className="p-1.5 hover:bg-neutral-100 rounded text-red-500"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => toggleSubcategory(subcategoryName)}
                                                    className="p-1.5 hover:bg-neutral-100 rounded"
                                                >
                                                    {expandedSubcategories.has(subcategoryName) ? (
                                                        <ChevronUp size={20} />
                                                    ) : (
                                                        <ChevronDown size={20} />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Expandable Content */}
                                        {expandedSubcategories.has(subcategoryName) && (
                                            <div className="border-t border-neutral-200 p-4">
                                                {/* Service Types */}
                                                {subcategory.serviceTypes && (
                                                    <div className="space-y-4">
                                                    <div className="flex justify-between items-center mb-3">
                                                            <h5 className="font-medium">Service Types</h5>
                                                        <button
                                                                onClick={() => handleAddServiceType(subcategoryName)}
                                                            className="flex items-center gap-1 text-sm text-green-600"
                                                        >
                                                            <Plus size={14} />
                                                            Add Type
                                                        </button>
                                                    </div>
                                                        {Object.entries(subcategory.serviceTypes).map(([typeKey, typeData]) => (
                                                            <div key={typeKey} className="border rounded-lg p-4">
                                                                <div className="flex justify-between items-center">
                                                                    <div className="flex items-center gap-3">
                                                                        {typeData.image && (
                                                                            <img
                                                                                src={`${import.meta.env.VITE_BACKEND_URL}/${typeData.image}`}
                                                                                alt={typeKey}
                                                                                className="w-12 h-12 object-contain rounded bg-neutral-50"
                                                                            />
                                                                        )}
                                                                        <h6 className="font-medium">{typeKey}</h6>
                                                                    </div>
                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            onClick={() => handleEditServiceType(subcategoryName, typeKey)}
                                                                            className="p-1 hover:bg-neutral-100 rounded"
                                                                        >
                                                                            <Edit size={14} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeleteServiceType(subcategoryName, typeKey)}
                                                                            className="p-1 hover:bg-neutral-100 rounded text-red-500"
                                                                        >
                                                                            <Trash2 size={14} />
                                                                        </button>
                                                                    </div>
                                                </div>

                                                                {/* Categories under Service Type */}
                                                                <div className="mt-4">
                                                    <div className="flex justify-between items-center mb-3">
                                                                        <h6 className="text-sm font-medium">Categories</h6>
                                                        <button
                                                                            onClick={() => handleAddCategory(subcategoryName, typeKey)}
                                                                            className="flex items-center gap-1 text-xs text-green-600"
                                                                        >
                                                                            <Plus size={12} />
                                                            Add Category
                                                        </button>
                                                    </div>
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                        {typeData.categories?.map((category, idx) => (
                                                                            <ServiceCategoryCard
                                                                                key={idx}
                                                                                category={category}
                                                                                onEdit={() => handleEditCategory(subcategoryName, typeKey, category)}
                                                                                onDelete={() => handleDeleteCategory(subcategoryName, typeKey, category)}
                                                                            />
                                                                        ))}
                                                </div>
                                            </div>
                                    </div>
                                ))}
                            </div>
                        )}

                                                {/* Direct Categories */}
                                                {subcategory.categories && (
                                                    <div className="mt-4">
                                                        <div className="flex justify-between items-center mb-3">
                                                            <h5 className="font-medium">Categories</h5>
                                                            <button
                                                                onClick={() => handleAddCategory(subcategoryName)}
                                                                className="flex items-center gap-1 text-sm text-green-600"
                                                            >
                                                                <Plus size={14} />
                                                                Add Category
                                                            </button>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            {subcategory.categories.map((category, idx) => (
                                                                <ServiceCategoryCard
                                                key={idx}
                                                                    category={category}
                                                                    onEdit={() => handleEditCategory(subcategoryName, category)}
                                                                    onDelete={() => handleDeleteCategory(subcategoryName, category)}
                                            />
                                                            ))}
                                                        </div>
                                                    </div>
                                    )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                </div>
                            )}
                    </div>
                </div>
            )}

            {/* Service Modal (Add/Edit) */}
            <PortalLayout
                isOpen={isServiceModalOpen}
                onClose={() => setIsServiceModalOpen(false)}
            >
                <ServiceModal
                    service={selectedService}
                    activeService={activeService}
                    onClose={() => setIsServiceModalOpen(false)}
                    onRefresh={fetchServices}
                />
            </PortalLayout>

            {/* Delete Confirmation Modal */}
            <PortalLayout
                isOpen={isDeleteConfirmationOpen}
                onClose={() => setIsDeleteConfirmationOpen(false)}
            >
                <DeleteConfirmationModal
                    serviceName={selectedService?.serviceName}
                    onConfirm={confirmDeleteService}
                    onCancel={() => setIsDeleteConfirmationOpen(false)}
                />
            </PortalLayout>

            {/* Add these modals */}
            <PortalLayout
                isOpen={isSubcategoryModalOpen}
                onClose={() => setIsSubcategoryModalOpen(false)}
            >
                <SubcategoryModal
                    subcategory={selectedSubcategory}
                    activeService={activeService}
                    onClose={() => setIsSubcategoryModalOpen(false)}
                    onRefresh={() => fetchServiceDetails(activeService?._id)}
                />
            </PortalLayout>

            <PortalLayout
                isOpen={isServiceTypeModalOpen}
                onClose={() => setIsServiceTypeModalOpen(false)}
            >
                <ServiceTypeModal
                    serviceType={selectedServiceType}
                    subcategoryName={selectedSubcategory}
                    activeService={activeService}
                    onClose={() => setIsServiceTypeModalOpen(false)}
                    onRefresh={() => fetchServiceDetails(activeService?._id)}
                />
            </PortalLayout>

            <PortalLayout
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
            >
                <CategoryModal
                    category={selectedCategory}
                    subcategoryName={selectedSubcategory}
                    serviceType={selectedServiceType}
                    activeService={activeService}
                    onClose={() => setIsCategoryModalOpen(false)}
                    onRefresh={() => fetchServiceDetails(activeService?._id)}
                />
            </PortalLayout>

            <PortalLayout
                isOpen={isServiceDetailsModalOpen}
                onClose={() => setIsServiceDetailsModalOpen(false)}
            >
                <ServiceDetailsModal
                    service={activeService}
                    detail={selectedServiceDetail}
                    activeService={activeService}
                    onClose={() => setIsServiceDetailsModalOpen(false)}
                    onRefresh={() => fetchServiceDetails(activeService?._id)}
                />
            </PortalLayout>
        </div>
    );
};

// Service Modal Component
const ServiceModal = ({ service, onClose, onRefresh, activeService }) => {
    const [formData, setFormData] = useState({
        serviceName: service ? service.serviceName : "",
        serviceImage: null,
        order: service ? service.order : null,
        description: service ? service.description : "",
        time: service ? service.time : "",
        price: service ? service.price : "",
        MRP: service ? service.MRP : ""
    });
    const [imagePreview, setImagePreview] = useState(
        service?.serviceImage
            ? `${import.meta.env.VITE_BACKEND_URL}/${service.serviceImage}`
            : null
    );

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, serviceImage: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append("serviceName", formData.serviceName);
        formDataToSend.append("order", formData.order || 0);
        if (formData.serviceImage) {
            formDataToSend.append("serviceImage", formData.serviceImage);
        }

        try {
            if (service) {
                await updateService(service._id, formDataToSend);
            } else {
                await createService(formDataToSend);
            }
            onRefresh();
            onClose();
        } catch (error) {
            console.error("Error saving service:", error);
        }
    };

    return (
        <div className="p-8 pt-0 w-">
            <h2 className="text-lg font-bold mb-6 uppercase tracking-wide text-center">
                {service ? "Edit Service" : "Add New Service"}
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2">Service Name</label>
                    <input
                        type="text"
                        value={formData.serviceName}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                serviceName: e.target.value,
                            }))
                        }
                        className="w-full border rounded-md p-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Order</label>
                    <input
                        type="number"
                        value={formData.order || ""}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                order: parseInt(e.target.value),
                            }))
                        }
                        className="w-full border rounded-md p-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Service Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full border rounded-md p-2"
                        required={!service}
                    />
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Service Preview"
                            className="mt-4 w-full h-48 object-contain rounded-md"
                        />
                    )}
                </div>
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-200 px-4 py-2 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                        {service ? "Update" : "Create"}
                    </button>
                </div>
            </form>
        </div>
    );
};

// Delete Confirmation Modal
const DeleteConfirmationModal = ({ serviceName, onConfirm, onCancel }) => {
    return (
        <div className="p-8 pt-0 w-96">
            <h2 className="text-lg font-bold mb-6 uppercase tracking-wide text-center">
                Confirm Deletion
            </h2>
            <p className="mb-12">
                Are you sure you want to delete the service{" "}
                <strong className="tracking-wide">{serviceName}</strong> ?
            </p>
            <div className="flex justify-end gap-2">
                <button
                    onClick={onCancel}
                    className="bg-gray-200 text-sm uppercase px-4 py-1.5 rounded-md"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="bg-red-500 text-white text-sm uppercase px-4 py-1.5 rounded-md hover:bg-red-600"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

// Skeleton Component for Loading State
const SkeletonService = () => (
    <div className="animate-pulse">
        {/* Main Services Grid */}
        <div className="grid grid-cols-1 min-[425px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {[...Array(6)].map((_, idx) => (
                <div
                    key={idx}
                    className="flex flex-col items-center border rounded-lg p-4"
                >
                    <div className="w-full h-36 bg-gray-200 rounded-md mb-4"></div>
                    <div className="w-full h-8 bg-gray-200 rounded"></div>
                </div>
            ))}
        </div>

        {/* Service Details Skeleton */}
        <div className="mt-4">
            <div className="border rounded-lg p-6 space-y-6">
                {/* Subcategories */}
                {[...Array(3)].map((_, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-gray-200 rounded"></div>
                            <div className="w-48 h-6 bg-gray-200 rounded"></div>
                        </div>

                        {/* Service Types */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                            {[...Array(3)].map((_, serviceIdx) => (
                                <div
                                    key={serviceIdx}
                                    className="border rounded-lg p-4"
                                >
                                    <div className="w-full h-24 bg-gray-200 rounded mb-2"></div>
                                    <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// Add these new components for better organization
const ServiceCategoryCard = ({ category }) => (
    <div className="bg-white border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-3">
            <h5 className="font-semibold text-neutral-800">{category.name}</h5>
            {category.categoryImage && (
                <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/${
                        category.categoryImage
                    }`}
                    alt={category.name}
                    className="w-10 h-10 object-contain rounded bg-neutral-50"
                />
            )}
        </div>

        <div className="space-y-2">
            {category.services?.map((service, idx) => (
                <ServiceCard key={idx} service={service} compact />
            ))}
        </div>
    </div>
);

const ServiceCard = ({ service, compact = false }) => (
    <div
        className={`${
            compact ? "bg-neutral-50" : "bg-white border border-neutral-200"
        } rounded-lg p-3`}
    >
        <div className="flex justify-between">
            <h6 className="font-medium text-neutral-800">{service.title}</h6>
            <div className="text-sm">
                <span className="text-green-600 font-medium">
                    ₹{service.OurPrice}
                </span>
                {service.MRP && (
                    <span className="ml-2 text-neutral-400 line-through">
                        ₹{service.MRP}
                    </span>
                )}
            </div>
        </div>
        {service.time && (
            <p className="text-sm text-neutral-500 mt-1">{service.time}</p>
        )}
        {service.description && (
            <ul className="text-sm text-neutral-600 mt-2 list-disc pl-4">
                {service.description.map((desc, idx) => (
                    <li key={idx}>{desc}</li>
                ))}
            </ul>
        )}
    </div>
);

// Add these new modal components
const SubcategoryModal = ({ subcategory, activeService, onClose, onRefresh }) => {
    const [formData, setFormData] = useState({
        name: subcategory?.name || "",
        image: null,
    });
    const [imagePreview, setImagePreview] = useState(
        subcategory?.image
            ? `${import.meta.env.VITE_BACKEND_URL}/${subcategory.image}`
            : null
    );

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        if (formData.image) {
            formDataToSend.append("image", formData.image);
        }

        try {
            if (subcategory) {
                await updateSubcategory(
                    activeService._id,
                    subcategory.name,
                    formDataToSend
                );
            } else {
                await createSubcategory(activeService._id, formDataToSend);
            }
            onRefresh();
            onClose();
        } catch (error) {
            console.error("Error saving subcategory:", error);
        }
    };

    return (
        <div className="p-8 pt-0">
            <h2 className="text-lg font-bold mb-6 uppercase tracking-wide text-center">
                {subcategory ? "Edit Subcategory" : "Add New Subcategory"}
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2">Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                        className="w-full border rounded-md p-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full border rounded-md p-2"
                    />
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="mt-2 w-32 h-32 object-contain rounded"
                        />
                    )}
                </div>
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-200 px-4 py-2 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                        {subcategory ? "Update" : "Create"}
                    </button>
                </div>
            </form>
        </div>
    );
};

const ServiceTypeModal = ({
    serviceType,
    subcategoryName,
    activeService,
    onClose,
    onRefresh,
}) => {
    const [formData, setFormData] = useState({
        name: serviceType?.name || "",
        image: null,
    });
    const [imagePreview, setImagePreview] = useState(
        serviceType?.image
            ? `${import.meta.env.VITE_BACKEND_URL}/${serviceType.image}`
            : null
    );

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        if (formData.image) {
            formDataToSend.append("image", formData.image);
        }

        try {
            if (serviceType) {
                await updateServiceType(
                    activeService._id,
                    subcategoryName,
                    serviceType.name,
                    formDataToSend
                );
            } else {
                await createServiceType(
                    activeService._id,
                    subcategoryName,
                    formDataToSend
                );
            }
            onRefresh();
            onClose();
        } catch (error) {
            console.error("Error saving service type:", error);
        }
    };

    return (
        <div className="p-8 pt-0">
            <h2 className="text-lg font-bold mb-6 uppercase tracking-wide text-center">
                {serviceType ? "Edit Service Type" : "Add New Service Type"}
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2">Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                        className="w-full border rounded-md p-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full border rounded-md p-2"
                    />
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="mt-2 w-32 h-32 object-contain rounded"
                        />
                    )}
                </div>
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-200 px-4 py-2 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                        {serviceType ? "Update" : "Create"}
                    </button>
                </div>
            </form>
        </div>
    );
};

const CategoryModal = ({
    category,
    subcategoryName,
    serviceType,
    activeService,
    onClose,
    onRefresh,
}) => {
    const [formData, setFormData] = useState({
        name: category?.name || "",
        image: null,
        services: category?.services || [],
    });
    const [imagePreview, setImagePreview] = useState(
        category?.categoryImage
            ? `${import.meta.env.VITE_BACKEND_URL}/${category.categoryImage}`
            : null
    );

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        if (formData.image) {
            formDataToSend.append("image", formData.image);
        }
        formDataToSend.append("services", JSON.stringify(formData.services));

        try {
            if (category) {
                await updateCategory(
                    activeService._id,
                    subcategoryName,
                    serviceType,
                    category._id,
                    formDataToSend
                );
            } else {
                await createCategory(
                    activeService._id,
                    subcategoryName,
                    serviceType,
                    formDataToSend
                );
            }
            onRefresh();
            onClose();
        } catch (error) {
            console.error("Error saving category:", error);
        }
    };

    return (
        <div className="p-8 pt-0">
            <h2 className="text-lg font-bold mb-6 uppercase tracking-wide text-center">
                {category ? "Edit Category" : "Add New Category"}
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2">Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                        className="w-full border rounded-md p-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full border rounded-md p-2"
                    />
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="mt-2 w-32 h-32 object-contain rounded"
                        />
                    )}
                </div>
                {/* Add service list management here */}
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-200 px-4 py-2 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                        {category ? "Update" : "Create"}
                    </button>
                </div>
            </form>
        </div>
    );
};

const ServiceDetailsModal = ({ service, detail, activeService, onClose, onRefresh }) => {
    const [formData, setFormData] = useState({
        title: detail?.title || "",
        description: detail?.description || [],
        time: detail?.time || "",
        OurPrice: detail?.OurPrice || "",
        MRP: detail?.MRP || "",
        image: null
    });
    const [imagePreview, setImagePreview] = useState(
        detail?.image ? `${import.meta.env.VITE_BACKEND_URL}/${detail.image}` : null
    );
    const [descriptionInput, setDescriptionInput] = useState("");

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const addDescription = () => {
        if (descriptionInput.trim()) {
            setFormData(prev => ({
                ...prev,
                description: [...prev.description, descriptionInput.trim()]
            }));
            setDescriptionInput("");
        }
    };

    const removeDescription = (index) => {
        setFormData(prev => ({
            ...prev,
            description: prev.description.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'description') {
                formDataToSend.append(key, JSON.stringify(formData[key]));
            } else if (formData[key] !== null) {
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            if (detail) {
                await updateServiceDetail(service._id, detail._id, formDataToSend);
            } else {
                await createServiceDetail(service._id, formDataToSend);
            }
            onRefresh();
            onClose();
        } catch (error) {
            console.error("Error saving service detail:", error);
        }
    };

    return (
        <div className="p-8 pt-0">
            <h2 className="text-lg font-bold mb-6 uppercase tracking-wide text-center">
                {detail ? "Edit Service Detail" : "Add New Service Detail"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2">Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full border rounded-md p-2"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2">Time</label>
                    <input
                        type="text"
                        value={formData.time}
                        onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                        className="w-full border rounded-md p-2"
                        placeholder="e.g., 45 mins"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-2">Our Price (₹)</label>
                        <input
                            type="number"
                            value={formData.OurPrice}
                            onChange={(e) => setFormData(prev => ({ ...prev, OurPrice: e.target.value }))}
                            className="w-full border rounded-md p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2">MRP (₹)</label>
                        <input
                            type="number"
                            value={formData.MRP}
                            onChange={(e) => setFormData(prev => ({ ...prev, MRP: e.target.value }))}
                            className="w-full border rounded-md p-2"
                        />
                    </div>
                </div>

                <div>
                    <label className="block mb-2">Description Points</label>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={descriptionInput}
                            onChange={(e) => setDescriptionInput(e.target.value)}
                            className="flex-1 border rounded-md p-2"
                            placeholder="Add a description point"
                        />
                        <button
                            type="button"
                            onClick={addDescription}
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                        >
                            Add
                        </button>
                    </div>
                    <ul className="space-y-2">
                        {formData.description.map((desc, index) => (
                            <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                <span>{desc}</span>
                                <button
                                    type="button"
                                    onClick={() => removeDescription(index)}
                                    className="text-red-500 hover:text-red-600"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <label className="block mb-2">Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full border rounded-md p-2"
                    />
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="mt-2 w-32 h-32 object-contain rounded"
                        />
                    )}
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-200 px-4 py-2 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                        {detail ? "Update" : "Create"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminServicesPage;
