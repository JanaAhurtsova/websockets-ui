export interface AuthReq {
    type: 'reg';
    data: AuthData;
    id: number;
}

export interface AuthData {
  name: string;
  password: string;
}

export interface AuthResp {
  type: 'reg';
  data: {
    name: string;
    index: number;
    error: boolean;
    errorText: string;
  };
  id: number;
}

export interface Player {
  id: number;
  name: string;
  password: string;
}
