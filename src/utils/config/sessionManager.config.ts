export enum SessionManagerKeys {
  ACCESS_TOKEN = "ACCESS_TOKEN",
}

type SessionManagerParams = {
  key: SessionManagerKeys;
  value: string;
};

export default class SessionManager {
  public static Eject(key: SessionManagerKeys) {
    return localStorage.removeItem(key);
  }

  public static Store(params: SessionManagerParams) {
    return localStorage.setItem(params.key, params.value);
  }

  public static Get(key: SessionManagerKeys) {
    return localStorage.getItem(key);
  }
}
