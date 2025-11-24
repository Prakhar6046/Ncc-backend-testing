import { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";

const GooglePlacesInput = ({
  label,
  control,
  fieldName,
  error,
  required,
  setValue,
}: any) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.google && window.google.maps) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
      const map = new window.google.maps.Map(document.createElement("div"));
      placesService.current = new window.google.maps.places.PlacesService(map);
    }
  }, []);

  const handleAutocomplete = (value: string) => {
    if (value && autocompleteService.current) {
      autocompleteService.current.getPlacePredictions(
        { input: value },
        (predictions: any) => {
          setSuggestions(predictions || []);
        }
      );
    } else {
      setSuggestions([]);
    }
  };

  const handlePlaceSelect = (
    placeId: string,
    description: string,
    onChange: any
  ) => {
    if (!placesService.current) return;

    placesService.current.getDetails(
      { placeId, fields: ["geometry", "formatted_address"] },
      (place, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          place &&
          place.geometry &&
          place.geometry.location
        ) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          const locationData = {
            description,
            lat,
            lng,
          };

          onChange(locationData);
          setValue(fieldName, locationData);
          setSuggestions([]);
        }

        setSuggestions([]);
      }
    );
  };

  return (
    <Controller
      name={fieldName}
      control={control}
      rules={{ required }}
      render={({ field: { onChange, value } }) => (
        <div className="position-relative">
          <label className="form-label">{label}</label>
          <input
            ref={inputRef}
            type="text"
            className="form-control"
            value={value?.description || ""}
            onChange={(e) => {
              const inputVal = e.target.value;
              onChange({ description: inputVal });
              handleAutocomplete(inputVal);
            }}
            autoComplete="off"
          />
          {error && <p className="text-danger mt-1">This field is required</p>}

          {suggestions.length > 0 && (
            <ul
              className="list-group position-absolute w-100 z-3 bg-white border rounded shadow-sm"
              style={{ top: "100%", zIndex: 1000 }}
            >
              {suggestions.map((sug) => (
                <li
                  key={sug.place_id}
                  className="list-group-item list-group-item-action"
                  onClick={() =>
                    handlePlaceSelect(sug.place_id, sug.description, onChange)
                  }
                  style={{ cursor: "pointer" }}
                >
                  {sug.description}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    />
  );
};

export default GooglePlacesInput;
