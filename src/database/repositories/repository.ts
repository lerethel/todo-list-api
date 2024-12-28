import { HydratedDocument, Model } from "mongoose";
import {
  IRepository,
  QueryFilter,
  QueryOptions,
} from "../../types/database.types.js";

export default abstract class Repository<T> implements IRepository<T> {
  constructor(private readonly model: Model<T>) {}

  private serialize(document: HydratedDocument<T>): T {
    return document.toObject({
      virtuals: true,
      flattenObjectIds: true,
      transform(document, returned) {
        delete returned._id;
      },
    });
  }

  private normalizeFilter(filter: Record<string, unknown>) {
    if (filter.id) {
      filter._id = filter.id;
      delete filter.id;
    }

    return filter;
  }

  async create(entity: Omit<T, "id">): Promise<T> {
    return this.serialize(await this.model.create(entity));
  }

  async findOne(
    filter: QueryFilter<T>,
    options?: QueryOptions
  ): Promise<T | null> {
    const document = await this.model
      .findOne(this.normalizeFilter(filter), null, options)
      .exec();
    return document ? this.serialize(document) : null;
  }

  async findAll(
    filter: QueryFilter<T> = {},
    options?: QueryOptions
  ): Promise<T[]> {
    return (
      await this.model.find(this.normalizeFilter(filter), null, options).exec()
    ).map(this.serialize);
  }

  async update(filter: QueryFilter<T>, update: Partial<T>): Promise<void> {
    await this.model.updateOne(this.normalizeFilter(filter), update).exec();
  }

  async deleteOne(filter: QueryFilter<T>): Promise<void> {
    await this.model.deleteOne(this.normalizeFilter(filter)).exec();
  }

  async deleteAll(filter: QueryFilter<T> = {}): Promise<void> {
    await this.model.deleteMany(this.normalizeFilter(filter)).exec();
  }
}
