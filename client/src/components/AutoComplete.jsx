import { Autocomplete, LoadScript } from "@react-google-maps/api";
import { MdLocationPin } from "react-icons/md";
import { useRef } from "react";

const libraries = ["places"];

const PlacesAutocomplete = () => {
    const autocompleteRef = useRef(null);

    const onLoad = (autocomplete) => {
        autocompleteRef.current = autocomplete;
    };

    const onPlaceChanged = () => {
        if (autocompleteRef.current !== null) {
            const place = autocompleteRef.current.getPlace();
            console.log(place);
        } else {
            console.log("Autocomplete is not loaded yet!");
        }
    };

    const options = {
        componentRestrictions: { country: "in" },
    };

    return (
        <LoadScript
            googleMapsApiKey={import.meta.env.VITE_PLACES_NEW_API_KEY}
            libraries={libraries}
            id="script-loader"
        >
            <div className="flex items-center ring-1 ring-black rounded outline-none focus-within:ring-1 focus-within:ring-blue-400 focus-within:border-0 transition-all overflow-hidden">
                <div className="px-3 py-1">
                    <MdLocationPin size="17px" />
                </div>
                <Autocomplete
                    onLoad={onLoad}
                    onPlaceChanged={onPlaceChanged}
                    options={options}
                >
                    <input
                        type="text"
                        placeholder="Enter a location"
                        className="text-sm text-ellipsis outline-none ring-1 ring-black px-3 py-2 bg-transparent focus-within:ring-1 focus-within:ring-blue-400 focus-within:border-0 transition-all"
                    />
                </Autocomplete>
            </div>
        </LoadScript>
    );
};

export default PlacesAutocomplete;
