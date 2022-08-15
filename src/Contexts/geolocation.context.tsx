import React, { createContext, useState, useEffect, useContext } from 'react';
import { LatLngLiteral } from 'leaflet';
import * as geofire from 'geofire-common';

export interface HashedLocation extends LatLngLiteral {
  hash: string;
}

type GeolocationConsumer = {
  location: HashedLocation;
  locationError: { message?: string; code?: string };
  updateLocation: (coords: any) => void;
};

type Props = {
  children: React.ReactNode;
};

const GeolocationContext = createContext<GeolocationConsumer>({} as GeolocationConsumer);

export const GeolocationProvider = ({ ...props }: Props) => {
  const [location, setLocation] = useState<HashedLocation>({} as HashedLocation);
  const [locationError, setLocationError] = useState({});

  const onChange = (coords: any) => {
    const lat = coords.lat ?? coords.coords.latitude;
    const lng = coords.lng ?? coords.coords.longitude;
    if (coords) {
      setLocation({
        lat,
        lng,
        hash: geofire.geohashForLocation([lat, lng]),
      });
    }
  };

  const onError = (error: any) => {
    setLocationError(error);
  };

  const updateLocation = (coords: any) => onChange(coords);

  useEffect(() => {
    let watchId: any = undefined;
    watchId = navigator.geolocation.watchPosition(onChange, onError, { enableHighAccuracy: true });
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return <GeolocationContext.Provider value={{ location, locationError, updateLocation }} {...props} />;
};

const { Consumer: GeolocationConsumer } = GeolocationContext;

export const useGeo = () => {
  const context = useContext(GeolocationContext);
  if (context === undefined) {
    throw new Error('use with GeolocationProvider');
  }
  return context;
};
