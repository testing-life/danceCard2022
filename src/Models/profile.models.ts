import Dances, { Dance, DanceMap } from '../Constants/dances';

export type IProfile = {
  active: boolean;
  chats: string[];
  dances: DanceMap;
  docId: string;
  email: string;
  hash: string;
  lat: number;
  lng: number;
  uid: string;
  username: string;
};

export class Profile implements IProfile {
  active = true;
  chats = [];
  dances = Dances;
  docId = '';
  email = '';
  hash = '';
  lat = 0;
  lng = 0;
  uid = '';
  username = '';
  static create(): Profile {
    return new Profile();
  }
}
