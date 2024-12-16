export interface IUser {
  id: unknown;
  name: string;
  email: string;
  password: string;
}

export interface ITodo {
  id: unknown;
  user: unknown;
  title: string;
  description: string;
  createdAt?: Date;
}

export interface IToken {
  id: unknown;
  user: unknown;
  family: string;
  refreshToken: string;
}

type FilterOption<T> = T | { $gte?: T; $lte?: T };

export type QueryFilter<T> = { [P in keyof T]?: FilterOption<T[P]> };

export type QueryOptions = { sort: string };

export interface IRepository<T> {
  create(entity: Omit<T, "id">): Promise<T>;
  findOne(filter: QueryFilter<T>, options?: QueryOptions): Promise<T | null>;
  findAll(filter?: QueryFilter<T>, options?: QueryOptions): Promise<T[]>;
  update(filter: QueryFilter<T>, update: Partial<T>): Promise<void>;
  deleteOne(filter: QueryFilter<T>): Promise<void>;
  deleteAll(filter?: QueryFilter<T>): Promise<void>;
}
