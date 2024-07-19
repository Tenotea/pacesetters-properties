import { HttpService } from "./__index__";

class AuthService extends HttpService {
  constructor() {
    super({
      baseURL: "/auth",
    });
  }

  async CreateUserAccount(dto: any) {
    return await this.SendRequest<Partial<any>>({
      method: "post",
      path: "/signup",
      body: dto,
    });
  }

  async CreateUserSession(dto: any) {
    return await this.SendRequest<Partial<any>>({
      method: "post",
      path: "/login",
      body: dto,
    });
  }
}

export default new AuthService();
