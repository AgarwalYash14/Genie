import React, { useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Loader, Locate, MapPin } from "lucide-react";

export const Location = () => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const getCurrentLocation = () => {
        setIsLoading(true);
        setError(null);

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                // Success callback
                (position) => {
                    const { latitude, longitude } = position.coords;

                    // Use Google Places to get a readable address
                    const geocoder = new window.google.maps.Geocoder();
                    geocoder.geocode(
                        { location: { lat: latitude, lng: longitude } },
                        (results, status) => {
                            setIsLoading(false);
                            if (status === "OK" && results[0]) {
                                setCurrentLocation({
                                    label: results[0].formatted_address,
                                    value: {
                                        description:
                                            results[0].formatted_address,
                                        place_id: results[0].place_id,
                                    },
                                });
                            } else {
                                setError("Unable to get location details");
                            }
                        }
                    );
                },
                // Error callback
                (error) => {
                    setIsLoading(false);
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            setError("Location access denied by user");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            setError("Location information is unavailable");
                            break;
                        case error.TIMEOUT:
                            setError("Location request timed out");
                            break;
                        default:
                            setError("An unknown error occurred");
                    }
                }
            );
        } else {
            setError("Geolocation is not supported by this browser");
            setIsLoading(false);
        }
    };

    return (
        <div className="w-96 min-h-80 p-10 pt-5 relative">
            {isLoading && (
                <div className="absolute top-7 right-4">
                    <Loader size={18} className="animate-spin" />
                </div>
            )}

            {error && <div className="text-red-500 mb-2">{error}</div>}

            <div className="w-full flex flex-col gap-2">
                <GooglePlacesAutocomplete
                    apiKey={import.meta.env.VITE_PLACES_NEW_API_KEY}
                    apiOptions={{ language: "en", region: "in" }}
                    selectProps={{
                        value: currentLocation,
                        onChange: setCurrentLocation,
                        placeholder: "Select a location",
                        className: "w-full flex-grow",
                    }}
                />
                <button
                    onClick={getCurrentLocation}
                    className="rounded text-blue-600 hover:bg-slate-200 transition-colors flex items-center gap-2 uppercase text-sm tracking-wide p-2"
                    disabled={isLoading}
                >
                    <Locate size={20} />
                    <h1>Use Current Location</h1>
                </button>
            </div>
        </div>
    );
};

export default Location;
