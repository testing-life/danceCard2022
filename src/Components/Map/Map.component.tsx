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

export const LeafletMap: FC<Props> = ({ localUsers }) => {
  const [user] = useAuthState(auth);
  // const defaultLocation: LatLngLiteral = {
  //   lat: 45.6982642,
  //   lng: 9.6772698,
  // };

  // const setDefaultLocation = (): LatLngLiteral => {
  //   return isObjectWithValue(props.centre, 'lat')
  //     ? props.centre
  //     : defaultLocation;
  // };
  const UserLocationMarker = () => {
    const [position, setPosition] = useState<any>(null);
    const [bbox, setBbox] = useState<any>([]);

    const map = useMap();

    useEffect(() => {
      map.locate({ setView: true, watch: true, enableHighAccuracy: true }).on('locationfound', function (e) {
        console.log('e.latlng', e.latlng, e);
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      });
    }, [map]);

    return position === null ? null : (
      <Marker position={position}>
        <Circle center={position} pathOptions={{ fillColor: 'blue' }} radius={5000} />
        <Popup>
          You are here. <br />
        </Popup>
      </Marker>
    );
  };

  console.log('localUsers', localUsers);
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
      <UserLocationMarker />
      {localUsers?.map(localUser => {
        const otherUser = localUser.data();
        return user?.uid !== otherUser.uid ? (
          <Marker position={[otherUser.lat, otherUser.lng]}>
            <Popup>You are here. {otherUser.username}</Popup>
          </Marker>
        ) : null;
      })}
    </MapContainer>
  );
};
