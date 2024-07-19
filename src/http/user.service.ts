import { HttpService } from "./__index__";

class AdminService extends HttpService {
  constructor() {
    super({
      baseURL: "/user",
    });
  }

  async GetUserBySession() {
    return await this.SendRequest<Partial<any>>({
      method: "get",
      path: "",
    });
  }

  async CreateServiceRequest(dto: any) {
    return await this.SendRequest<Partial<any>>({
      method: "post",
      path: "/service-request",
      body: dto,
    });
  }

  async GetServiceRequests() {
    return await this.SendRequest<Partial<any>>({
      method: "get",
      path: "/service-request",
    });
  }

  async GetUserFacilities() {
    return await this.SendRequest<Partial<any>>({
      method: "get",
      path: "/facility",
    });
  }
}

export default new AdminService();
