import React, { createContext, useState, useEffect, useContext } from 'react';
import { LatLngLiteral } from 'leaflet';
import * as geofire from 'geofire-common';

interface HashedLocation extends LatLngLiteral {
  hash: string;
}

type GeolocationConsumer = {
  location: LatLngLiteral;
  locationError: any;
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
    if (coords) {
      setLocation({
        lat: coords.lat,
        lng: coords.lng,
        hash: geofire.geohashForLocation([coords.lat, coords.lng]),
      });
    }
  };

  const onError = (error: any) => {
    setLocationError(error);
  };

  const updateLocation = (coords: any) => onChange(coords);

  useEffect(() => {
    // let watchId: any = undefined;
    // navigator.geolocation.getCurrentPosition(onChange, onError);
    // watchId = navigator.geolocation.watchPosition(onChange, onError);
    // return () => {
    //   navigator.geolocation.clearWatch(watchId);
    // };
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
