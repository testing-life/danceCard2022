import React, { FC, useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L, { LatLngLiteral } from 'leaflet';
// import { isObjectWithValue } from '../../Utils/object';
// import CustomPopup from '../CustomPopup/CustomPopup.component';
import * as ROUTES from '../../Constants/routes';
import { TileLayer, useMap, Marker, Popup, Circle } from 'react-leaflet';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { auth } from '../../Firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useGeo } from '../../Contexts/geolocation.context';
import { RADIUS_IN_M } from '../../Constants/locatingParams';
import ProfilePopup from '../ProfilePopoup/ProfilePopup.component';
import { useProfile } from '../../Contexts/profile.context';
import './Map.component.css';
import { Link } from 'react-router-dom';

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

export const MapContent: FC<Props> = ({ localUsers, radius }) => {
  const [user] = useAuthState(auth);
  const map = useMap();
  const { profile, updateLocationInProfile } = useProfile();
  const [position, setPosition] = useState<LatLngLiteral>();
  const { updateLocation } = useGeo();

  useEffect(() => {
    map.locate({ setView: true, watch: true, enableHighAccuracy: true }).on('locationfound', function (e) {
      setPosition(e.latlng);
      updateLocation(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [map]);

  useEffect(() => {
    const updateLocation = (position: LatLngLiteral) => {
      updateLocationInProfile(position);
    };

    if (position && profile) {
      updateLocation(position);
    }
  }, [position]);

  const userIcon = L.divIcon({ className: 'my-div-icon', iconSize: [30, 30] });

  const UserLocationMarker = () => {
    return position === undefined ? null : (
      <Marker position={position} icon={userIcon}>
        <Circle center={position} pathOptions={{ fillColor: 'blue' }} radius={radius} />
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
      {localUsers?.map((otherUser: any) => {
        return user?.uid !== otherUser.uid && otherUser.active ? (
          <Marker key={otherUser.uid} position={[otherUser.lat, otherUser.lng]}>
            <Popup>
              {otherUser.username}
              <ProfilePopup dances={otherUser.dances} />
              {/* single chat ? */}
              <Link
                to={ROUTES.CHATS}
                state={{
                  targetUserDocID: otherUser.docId,
                  targetUserID: otherUser.uid,
                  targetUsername: otherUser.username,
                }}
              >
                Message
              </Link>
            </Popup>
          </Marker>
        ) : null;
      })}
    </>
  );
};
