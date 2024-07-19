import { HttpService } from "./__index__";

class AdminService extends HttpService {
  constructor() {
    super({
      baseURL: "/admin",
    });
  }

  async CreateFacility(dto: any) {
    return await this.SendRequest<Partial<any>>({
      method: "post",
      path: "/facility",
      body: dto,
    });
  }

  async GetFacilities() {
    return await this.SendRequest<Partial<any>>({
      method: "get",
      path: "/facility",
    });
  }

  async GetResidentsByFacility(dto: any) {
    return await this.SendRequest<Partial<any>>({
      method: "get",
      path: `/facility/${dto.facilityId}/residents`,
    });
  }

  async GetServiceRequestByFacility(dto: any) {
    return await this.SendRequest<Partial<any>>({
      method: "get",
      path: `/facility/${dto.facilityId}/service-request`,
    });
  }

  async FindUsers(dto: any) {
    return await this.SendRequest<Partial<any>>({
      method: "get",
      path: `/user/search`,
      query: dto,
    });
  }

  async AddUserToFacility({ role, ...dto }: any) {
    return await this.SendRequest<Partial<any>>({
      method: "patch",
      path: `/facility/add-${role}`,
      body: dto,
    });
  }
}

export default new AdminService();
