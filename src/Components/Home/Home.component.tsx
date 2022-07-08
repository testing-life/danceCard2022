import React, { FunctionComponent, useEffect, useState, ChangeEvent } from 'react';
// import { LeafletMap } from '../Map/Map.component';
// import { useGeo } from '../../Contexts/geolocation.context';
// import Firebase from '../../Firebase/firebase';
// import { GeoQuery, GeoQuerySnapshot } from 'geofirestore';
// import { GeoFirestoreTypes } from 'geofirestore/dist/GeoFirestoreTypes';
// import { LatLngLiteral } from 'leaflet';
// import { useUser } from '../../Contexts/user.context';
// import { useProfile } from '../../Contexts/profile.context';
// import { Profile } from '../../Models/profile.models';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';

export const HomeComponent: FunctionComponent<any> = () => {
  // const { location, locationError } = useGeo();
  // const { user } = useUser();
  // const { profile, setProfile } = useProfile();
  // const [error, setError] = useState<string>();
  // const [localUsers, setLocalUsers] = useState<GeoFirestoreTypes.QueryDocumentSnapshot[]>([]);
  // const [radius, setRadius] = useState<number>(2);
  // const fetchLocalUsers = (place: LatLngLiteral, radius: number) => {
  //   const geoPoint = place && firebase.getGeoPoint(place.lat, place.lng);
  //   // const geoPoint = place && firebase.getGeoPoint(DEV_LOCATION.lat, DEV_LOCATION.lng);
  //   const query: GeoQuery = firebase.getUsers().near({ center: geoPoint, radius });
  //   query.onSnapshot((res: GeoQuerySnapshot) => {
  //     const usersWithoutCurrentUser = res.docs.filter(u => u.id !== user.uid).filter(user => user.data().active);

  //     setLocalUsers(usersWithoutCurrentUser);
  //   });
  // };

  // const radiusSliderHandler = (e: ChangeEvent<HTMLInputElement>) => {
  //   setRadius(+e.target.value);
  // };

  // useEffect(() => {
  //   if (Object.keys(location).length) {
  //     fetchLocalUsers(location, radius);
  //   }
  // }, [location, radius, locationError]);

  // const toggleVisiblity = () => {
  //   const newProfile: Profile = { ...profile, active: !profile.active };
  //   firebase
  //     .getUsers()
  //     .doc(user.uid)
  //     .set(newProfile, { merge: true })
  //     .then(
  //       docRef => {
  //         setProfile(newProfile);
  //       },
  //       (error: Error) => setError(error.message),
  //     );
  // };
  function LocationMarker() {
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
        <Popup>
          You are here. <br />
          Map bbox: <br />
          <b>Southffwest lng</b>: {bbox[0]} <br />
          <b>Southwest lat</b>: {bbox[1]} <br />
          <b>Northeast lng</b>: {bbox[2]} <br />
          <b>Northeast lat</b>: {bbox[3]}
        </Popup>
      </Marker>
    );
  }
  return (
    <div className="container">
      <p>home comp</p>
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
        <LocationMarker />
      </MapContainer>
      {/* {error && <p>{error}</p>}
      <div className="row">
        <p className="column">
          You're currently: {profile.active ? 'Visible! Happy to dance.' : 'Invisible. Having a quiet moment.'}{' '}
        </p>
        <button className="column" onClick={toggleVisiblity}>
          Toggle visibility
        </button>
      </div>
      <div className="row">
        <span>Search radius: {radius}km</span>
        <input
          type="range"
          name="radius"
          defaultValue={radius}
          min="1"
          step="1"
          max="20"
          onChange={radiusSliderHandler}
        />
      </div>
      {locationError && <p>{locationError.message}</p>}
      {!!Object.keys(location).length ? (
        <LeafletMap radius={radius} centre={location} markers={localUsers} userActive={profile.active} />
      ) : (
        <p>We do need geolocation to show the map. Please enable it in your browser and reload the page.</p>
      )} */}
    </div>
  );
};
