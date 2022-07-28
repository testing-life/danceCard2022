export interface MessageDetails {
  'fromName': string;
  'toName': string;
  'message': string;
  'timestamp': Date;
  'fromID': string;
}

export interface Message {
  'last_updated': Date;
  'members': string[];
  'messages': Message[];
  'docId': string;
}
