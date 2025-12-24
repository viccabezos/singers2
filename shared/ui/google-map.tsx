"use client";

import { useCallback, useState, memo } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { Loader2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const libraries: ("places")[] = ["places"];

// Default to Capbreton area (Landes, Southwest France)
const DEFAULT_CENTER = { lat: 43.6417, lng: -1.4283 };
const DEFAULT_ZOOM = 11;
const LOCATION_ZOOM = 15;

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

// Minimal, clean map style
const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
};

export interface MapLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

interface GoogleMapDisplayProps {
  /** Location to display on the map */
  location?: MapLocation | null;
  /** Height of the map container */
  height?: string;
  /** Additional className for the container */
  className?: string;
  /** Whether to show an info window with the address */
  showInfoWindow?: boolean;
  /** Callback when map is clicked (for admin use) */
  onMapClick?: (lat: number, lng: number) => void;
  /** Zoom level (defaults to 15 for location, 5 for no location) */
  zoom?: number;
}

/**
 * A flexible Google Map display component.
 * 
 * Usage:
 * - Public site: Just pass location to display a marker
 * - Admin: Can also pass onMapClick to allow clicking on map to set location
 */
export const GoogleMapDisplay = memo(function GoogleMapDisplay({
  location,
  height = "300px",
  className,
  showInfoWindow = true,
  onMapClick,
  zoom,
}: GoogleMapDisplayProps) {
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey || "",
    libraries,
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (onMapClick && e.latLng) {
        onMapClick(e.latLng.lat(), e.latLng.lng());
      }
    },
    [onMapClick]
  );

  const handleMarkerClick = useCallback(() => {
    if (showInfoWindow && location?.address) {
      setInfoWindowOpen(true);
    }
  }, [showInfoWindow, location?.address]);

  // No API key - show placeholder
  if (!apiKey) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted rounded-lg border",
          className
        )}
        style={{ height }}
      >
        <div className="text-center text-muted-foreground p-4">
          <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Map unavailable</p>
          <p className="text-xs">Configure Google Maps API key</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (!isLoaded) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted rounded-lg border",
          className
        )}
        style={{ height }}
      >
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Error loading
  if (loadError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted rounded-lg border",
          className
        )}
        style={{ height }}
      >
        <div className="text-center text-destructive p-4">
          <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Failed to load map</p>
        </div>
      </div>
    );
  }

  const center = location
    ? { lat: location.latitude, lng: location.longitude }
    : DEFAULT_CENTER;

  const mapZoom = zoom ?? (location ? LOCATION_ZOOM : DEFAULT_ZOOM);

  return (
    <div className={cn("rounded-lg overflow-hidden border", className)} style={{ height }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={mapZoom}
        options={{
          ...mapOptions,
          cursor: onMapClick ? "crosshair" : undefined,
        }}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
      >
        {location && (
          <Marker
            position={{ lat: location.latitude, lng: location.longitude }}
            onClick={handleMarkerClick}
          >
            {showInfoWindow && infoWindowOpen && location.address && (
              <InfoWindow onCloseClick={() => setInfoWindowOpen(false)}>
                <div className="p-1 max-w-[200px]">
                  <p className="text-sm font-medium text-gray-900">
                    {location.address}
                  </p>
                </div>
              </InfoWindow>
            )}
          </Marker>
        )}
      </GoogleMap>
    </div>
  );
});

interface MapWithPlaceholderProps {
  location?: MapLocation | null;
  height?: string;
  className?: string;
  placeholderText?: string;
}

/**
 * A map that shows a nice placeholder when no location is set.
 * Good for public-facing pages.
 */
export function MapWithPlaceholder({
  location,
  height = "300px",
  className,
  placeholderText = "Location not specified",
}: MapWithPlaceholderProps) {
  if (!location?.latitude || !location?.longitude) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted/50 rounded-lg border border-dashed",
          className
        )}
        style={{ height }}
      >
        <div className="text-center text-muted-foreground p-4">
          <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">{placeholderText}</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleMapDisplay
      location={location}
      height={height}
      className={className}
      showInfoWindow
    />
  );
}

interface LocationPickerMapProps {
  /** Current location (if any) */
  location?: MapLocation | null;
  /** Callback when location is changed (via click or geocoding) */
  onLocationChange: (location: MapLocation) => void;
  /** Height of the map container */
  height?: string;
  /** Additional className for the container */
  className?: string;
}

/**
 * An interactive map for picking a location.
 * Click anywhere on the map to set the location with reverse geocoding.
 */
export function LocationPickerMap({
  location,
  onLocationChange,
  height = "300px",
  className,
}: LocationPickerMapProps) {
  const [isGeocoding, setIsGeocoding] = useState(false);
  
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey || "",
    libraries,
  });

  const handleMapClick = useCallback(
    async (lat: number, lng: number) => {
      // Immediately set the coordinates
      onLocationChange({
        latitude: lat,
        longitude: lng,
        address: location?.address || "",
      });

      // Try to reverse geocode to get the address
      if (isLoaded && window.google) {
        setIsGeocoding(true);
        try {
          const geocoder = new window.google.maps.Geocoder();
          const response = await geocoder.geocode({
            location: { lat, lng },
          });

          if (response.results && response.results[0]) {
            onLocationChange({
              latitude: lat,
              longitude: lng,
              address: response.results[0].formatted_address,
            });
          }
        } catch (error) {
          console.error("Geocoding failed:", error);
          // Keep the coordinates, just no address
        } finally {
          setIsGeocoding(false);
        }
      }
    },
    [isLoaded, onLocationChange, location?.address]
  );

  // No API key - show placeholder
  if (!apiKey) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted rounded-lg border",
          className
        )}
        style={{ height }}
      >
        <div className="text-center text-muted-foreground p-4">
          <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Map unavailable</p>
          <p className="text-xs">Configure Google Maps API key</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (!isLoaded) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted rounded-lg border",
          className
        )}
        style={{ height }}
      >
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Error loading
  if (loadError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted rounded-lg border",
          className
        )}
        style={{ height }}
      >
        <div className="text-center text-destructive p-4">
          <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Failed to load map</p>
        </div>
      </div>
    );
  }

  const mapLocation = location?.latitude && location?.longitude
    ? { latitude: location.latitude, longitude: location.longitude, address: location.address }
    : null;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative">
        <GoogleMapDisplay
          location={mapLocation}
          height={height}
          onMapClick={handleMapClick}
          showInfoWindow={false}
        />
        {isGeocoding && (
          <div className="absolute top-2 right-2 bg-background/90 rounded-md px-2 py-1 text-xs flex items-center gap-1 shadow-sm">
            <Loader2 className="h-3 w-3 animate-spin" />
            Getting address...
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Click on the map to set the location, or use the search field above.
      </p>
    </div>
  );
}

