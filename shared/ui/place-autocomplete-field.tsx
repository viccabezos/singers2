"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { MapPin, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FormField } from "./form-field";

const libraries: ("places")[] = ["places"];

export interface PlaceResult {
  address: string;
  latitude: number | null;
  longitude: number | null;
}

interface PlaceAutocompleteFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (result: PlaceResult) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
  className?: string;
}

export function PlaceAutocompleteField({
  label,
  id,
  value,
  onChange,
  required = false,
  error,
  placeholder = "Search for a place...",
  className,
}: PlaceAutocompleteFieldProps) {
  const [inputValue, setInputValue] = useState(value);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Sync internal state when value prop changes (e.g., from map click)
  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value);
    }
  }, [value]); // Only react to value prop changes, not inputValue
  
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey || "",
    libraries,
  });

  const onLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  }, []);

  const onPlaceChanged = useCallback(() => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      
      if (place.geometry?.location) {
        const result: PlaceResult = {
          address: place.formatted_address || place.name || "",
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
        };
        setInputValue(result.address);
        onChange(result);
      }
    }
  }, [onChange]);

  const handleClear = useCallback(() => {
    setInputValue("");
    onChange({ address: "", latitude: null, longitude: null });
  }, [onChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    // If user clears or modifies without selecting, clear coordinates
    if (newValue !== value) {
      onChange({ address: newValue, latitude: null, longitude: null });
    }
  }, [onChange, value]);

  // If no API key, fall back to regular text input
  if (!apiKey) {
    return (
      <FormField label={label} htmlFor={id} required={required} error={error} className={className}>
        <div className="relative mt-1">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id={id}
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            required={required}
            className="pl-9 pr-9"
          />
          {inputValue && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear</span>
            </Button>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable address autocomplete
        </p>
      </FormField>
    );
  }

  // Loading state
  if (!isLoaded) {
    return (
      <FormField label={label} htmlFor={id} required={required} error={error} className={className}>
        <div className="relative mt-1">
          <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin" />
          <Input
            id={id}
            disabled
            placeholder="Loading Google Maps..."
            className="pl-9"
          />
        </div>
      </FormField>
    );
  }

  // Error loading Google Maps
  if (loadError) {
    return (
      <FormField label={label} htmlFor={id} required={required} error={error} className={className}>
        <div className="relative mt-1">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id={id}
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            required={required}
            className="pl-9"
          />
        </div>
        <p className="mt-1 text-xs text-destructive">
          Failed to load Google Maps. Address autocomplete unavailable.
        </p>
      </FormField>
    );
  }

  return (
    <FormField label={label} htmlFor={id} required={required} error={error} className={className}>
      <div className="relative mt-1">
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
        <Autocomplete
          onLoad={onLoad}
          onPlaceChanged={onPlaceChanged}
          options={{
            types: ["establishment", "geocode"],
            componentRestrictions: { country: "fr" }, // Restrict to France
          }}
        >
          <Input
            id={id}
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            required={required}
            className={cn("pl-9", inputValue && "pr-9")}
          />
        </Autocomplete>
        {inputValue && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 z-10"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </Button>
        )}
      </div>
    </FormField>
  );
}

