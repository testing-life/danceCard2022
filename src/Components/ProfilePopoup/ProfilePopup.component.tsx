import React, { FC } from 'react';
import { DanceMap } from '../../Constants/dances';
import { getFilteredKeys } from '../../Utils/object';

type Props = {
  dances: DanceMap;
};

type keys = 'follow' | 'lead';

const ProfilePopup: FC<Props> = ({ dances }: Props) => {
  const following = getFilteredKeys<DanceMap, keys>(dances, 'follow');
  const leading = getFilteredKeys<DanceMap, keys>(dances, 'lead');
  return (
    <>
      <p>
        Leading:
        {leading.length ? leading.map((dance, index) => <span key={index}>{dance}, </span>) : 'No dances'}
      </p>
      <p>
        Following:
        {following.length ? following.map((dance, index) => <span key={index}>{dance}, </span>) : 'No dances'}
      </p>
    </>
  );
};

export default ProfilePopup;
