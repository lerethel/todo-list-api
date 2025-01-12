export class HttpException {
  constructor(public status: number, public token?: string) {}
}
