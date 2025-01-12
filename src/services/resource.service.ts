import ResourceRepository from "../database/repositories/resource.repository.js";
import Inject from "../decorators/inject.decorator.js";
import Injectable from "../decorators/injectable.decorator.js";
import { IRepository, IResource } from "../types/database.types.js";
import { IResourceService } from "../types/service.types.js";

@Injectable()
export default class ResourceService implements IResourceService {
  @Inject(ResourceRepository)
  protected readonly resourceRepository: IRepository<IResource>;

  async find(token: string): Promise<string | undefined> {
    return (await this.resourceRepository.findOne({ token }))?.text;
  }
}
