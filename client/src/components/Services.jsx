const Services = ({ serviceImage, serviceName, onServiceClick }) => {
    return (
        <>
            <div onClick={() => onServiceClick(serviceName)}>
                <div className="w-full overflow-hidden rounded-md border border-black hover:shadow-lg hover:scale-105 duration-300 transition-transform">
                    <button className="w-full">
                        <img
                            src={`${
                                import.meta.env.VITE_BACKEND_URL
                            }/${serviceImage}`}
                            alt={serviceName}
                            loading="lazy"
                            className="w-full h-36 object-contain p-3 border-b border-black bg-yellow-100"
                        />
                        <h1 className="h-12 flex items-center justify-center px-4 text-sm">
                            {serviceName}
                        </h1>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Services;
