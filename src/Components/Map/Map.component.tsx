import React, { FC } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer } from 'react-leaflet';
import { MapContent } from './MapContent.component.';
import { useGeo } from '../../Contexts/geolocation.context';
import { Profile } from '../../Models/profile.models';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

type Props = {
  localUsers: Profile[];
  radius: number;
  userActive?: boolean;
};

export const LeafletMap: FC<Props> = ({ localUsers, radius }) => {
  const { location, locationError } = useGeo();
  return (
    <>
      {!locationError?.message && location.lat && location.lng ? (
        <MapContainer
          style={{ width: '500px', height: '500px' }}
          center={[location.lat, location.lng]}
          zoom={13}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapContent localUsers={localUsers} radius={radius} />
        </MapContainer>
      ) : (
        <p>loading map...</p>
      )}
    </>
  );
};
