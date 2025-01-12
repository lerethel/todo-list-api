import ResourceToken from "../config/enums/resource-token.enum.js";

export class HttpException {
  constructor(public status: number, public token?: ResourceToken) {}
}
