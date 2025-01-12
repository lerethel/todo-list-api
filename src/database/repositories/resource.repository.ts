import Injectable from "../../decorators/injectable.decorator.js";
import { IResource } from "../../types/database.types.js";
import resourceModel from "../models/resource.model.js";
import Repository from "./repository.js";

@Injectable(resourceModel)
export default class ResourceRepository extends Repository<IResource> {}
