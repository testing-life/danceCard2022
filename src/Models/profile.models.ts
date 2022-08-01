import Dances, { DanceMap } from '../Constants/dances';

export interface BlockedUser {
  username: string;
  uid: string;
}

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
  blockedUsers: BlockedUser[];
  username: string;
};

export class Profile implements IProfile {
  active = true;
  chats = [];
  blockedUsers = [];
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
