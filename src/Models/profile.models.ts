import Dances, { Dance, DanceMap } from '../Constants/dances';

export type IProfile = {
  active: boolean;
  chats: string[];
  dances: DanceMap;
  // dances: [string, DancePosition][] ;
};

export class Profile implements IProfile {
  active = true;
  chats = [];
  dances = Dances;
  static create(): Profile {
    return new Profile();
  }
}
