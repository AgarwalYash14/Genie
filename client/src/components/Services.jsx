const Services = ({ serviceImage, serviceName, onServiceClick }) => {
    return (
        <>
            <div
                className="w-full "
                onClick={() => onServiceClick(serviceName)}
            >
                <div className="w-full overflow-hidden rounded-md border border-black hover:shadow-lg hover:scale-105 duration-300 transition-transform">
                    <button>
                        <img
                            src={`${
                                import.meta.env.VITE_BACKEND_URL
                            }/${serviceImage}`}
                            alt={serviceName}
                            className="h-[9.5rem] w-full object-cover border-b border-black"
                        />
                        <h1 className="px-2 h-14 flex items-center justify-center">
                            {serviceName}
                        </h1>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Services;
