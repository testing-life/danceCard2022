import React, { FC, useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// import { isObjectWithValue } from '../../Utils/object';
// import CustomPopup from '../CustomPopup/CustomPopup.component';
// import * as ROUTES from '../../Constants/routes';
// import { Profile } from '../../Models/profile.models';
import { MapContainer, TileLayer, useMap, Marker, Popup, Circle } from 'react-leaflet';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { auth } from '../../Firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useGeo } from '../../Contexts/geolocation.context';
import { MapContent } from './MapContent.component.';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

type Props = {
  localUsers: QueryDocumentSnapshot<DocumentData>[];
  radius: number;
  userActive?: boolean;
};

export const LeafletMap: FC<Props> = ({ localUsers, radius }) => {
  return (
    <MapContainer
      style={{ width: '500px', height: '500px' }}
      center={[49.1951, 16.6068]}
      zoom={13}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapContent localUsers={localUsers} radius={radius} />
    </MapContainer>
  );
};
