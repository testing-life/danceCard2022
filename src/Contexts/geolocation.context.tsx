import React, { createContext, useState, useEffect, useContext } from 'react';
import { LatLngLiteral } from 'leaflet';
import * as geofire from 'geofire-common';

interface HashedLocation extends LatLngLiteral {
  hash: string;
}

type GeolocationConsumer = {
  location: LatLngLiteral;
  locationError: any;
};

type Props = {
  children: React.ReactNode;
};

const GeolocationContext = createContext<GeolocationConsumer>({} as GeolocationConsumer);

export const GeolocationProvider = ({ ...props }: Props) => {
  const [location, setLocation] = useState<HashedLocation>({} as HashedLocation);
  const [locationError, setLocationError] = useState({});

  const onChange = ({ coords }: any) => {
    setLocation({
      lat: coords.latitude,
      lng: coords.longitude,
      hash: geofire.geohashForLocation([coords.latitude, coords.longitude]),
    });
  };

  const onError = (error: any) => {
    setLocationError(error);
  };

  useEffect(() => {
    // let watchId: any = undefined;
    navigator.geolocation.getCurrentPosition(onChange, onError);
    // watchId = navigator.geolocation.watchPosition(onChange, onError);

    // return () => {
    //   navigator.geolocation.clearWatch(watchId);
    // };
  }, []);

  return <GeolocationContext.Provider value={{ location, locationError }} {...props} />;
};

const { Consumer: GeolocationConsumer } = GeolocationContext;

export const useGeo = () => {
  const context = useContext(GeolocationContext);
  if (context === undefined) {
    throw new Error('use with GeolocationProvider');
  }
  return context;
};
