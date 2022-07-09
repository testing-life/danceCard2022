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
import { RADIUS_IN_M } from '../../Constants/locatingParams';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

type Props = {
  localUsers: QueryDocumentSnapshot<DocumentData>[];
  radius?: number;
  userActive?: boolean;
};

export const MapContent: FC<Props> = ({ localUsers }) => {
  const [user] = useAuthState(auth);
  const map = useMap();
  const [position, setPosition] = useState<any>(null);

  useEffect(() => {
    map.locate({ setView: true, watch: true, enableHighAccuracy: true }).on('locationfound', function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [map]);

  const UserLocationMarker = () => {
    return position === null ? null : (
      <Marker position={position}>
        <Circle center={position} pathOptions={{ fillColor: 'blue' }} radius={RADIUS_IN_M} />
        <Popup>
          You are here. <br />
        </Popup>
      </Marker>
    );
  };

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <UserLocationMarker />
      {localUsers?.map(localUser => {
        const otherUser = localUser.data();
        return user?.uid !== otherUser.uid ? (
          <Marker key={otherUser.uid} position={[otherUser.lat, otherUser.lng]}>
            <Popup>You are here. {otherUser.username}</Popup>
          </Marker>
        ) : null;
      })}
    </>
  );
};