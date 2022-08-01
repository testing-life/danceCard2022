export interface Dance {
  label?: string;
  lead: boolean;
  follow: boolean;
}

export type DanceName =
  | 'lindy-hop'
  | 'blues'
  | 'fuston'
  | 'balboa'
  | 'collegiate-shag'
  | 'salsa'
  | 'bachata'
  | 'tango'
  | 'kizomba'
  | 'bal-folk';

export type DanceMap = {
  [key in DanceName]: Dance;
};

const Dances: DanceMap = {
  'lindy-hop': {
    lead: false,
    follow: false,
  },
  'blues': {
    lead: false,
    follow: false,
  },
  'fuston': {
    lead: false,
    follow: false,
  },
  'balboa': {
    lead: false,
    follow: false,
  },
  'collegiate-shag': {
    lead: false,
    follow: false,
  },
  'salsa': {
    lead: false,
    follow: false,
  },
  'bachata': {
    lead: false,
    follow: false,
  },
  'tango': {
    lead: false,
    follow: false,
  },
  'kizomba': {
    lead: false,
    follow: false,
  },
  'bal-folk': {
    lead: false,
    follow: false,
  },
};

export default Dances;
