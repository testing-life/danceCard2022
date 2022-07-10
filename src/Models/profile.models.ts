import Dances, { Dance, DanceMap } from '../Constants/dances';

export type IProfile = {
  active: boolean;
  chats: string[];
  dances: DanceMap;
  docId: string;
  // dances: [string, DancePosition][] ;
};

export class Profile implements IProfile {
  active = true;
  chats = [];
  dances = Dances;
  docId = '';
  static create(): Profile {
    return new Profile();
  }
}
