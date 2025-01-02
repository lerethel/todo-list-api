import TodoRepository from "../database/repositories/todo.repository.js";
import Inject from "../decorators/inject.decorator.js";
import Injectable from "../decorators/injectable.decorator.js";
import {
  CreateTodoDto,
  CreateTodoReturnDto,
  FindTodoDto,
  FindTodoReturnDto,
  UpdateTodoReturnDto,
} from "../dto/todo.dto.js";
import { HttpException } from "../exceptions/http.exception.js";
import { IRepository, ITodo, QueryFilter } from "../types/database.types.js";
import { ITodoService, IUserStoreService } from "../types/service.types.js";
import UserStoreService from "./user-store.service.js";

@Injectable()
export default class TodoService implements ITodoService {
  @Inject(TodoRepository)
  protected readonly todoRepository: IRepository<ITodo>;

  @Inject(UserStoreService)
  protected readonly userStoreService: IUserStoreService;

  async create({
    title,
    description,
  }: CreateTodoDto): Promise<CreateTodoReturnDto> {
    const user = this.userStoreService.get();
    const { id, createdAt } = await this.todoRepository.create({
      user,
      title,
      description,
    });
    return { id, title, description, createdAt };
  }

  async find({
    page,
    limit,
    date,
    sort = "-createdAt",
  }: FindTodoDto): Promise<FindTodoReturnDto> {
    const user = this.userStoreService.get();
    const query: QueryFilter<ITodo> = { user };

    if (date) {
      const [from, to] = date.split(":");
      query.createdAt = { $gte: new Date(from) };
      if (to) {
        query.createdAt.$lte = new Date(to);
      }
    }

    // Ignore { page } and { limit } for now to count the total number of pages.
    // This is faster than calling .countDocuments().
    const unslicedTodos = await this.todoRepository.findAll(query, { sort });
    const totalPages = Math.ceil(unslicedTodos.length / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Get the requested part of the list.
    const todos = unslicedTodos.slice(startIndex, endIndex);
    const total = todos.length;

    return {
      data: todos.map(({ id, title, description, createdAt }) => ({
        id,
        title,
        description,
        createdAt,
      })),
      page,
      limit,
      total,
      totalPages,
    };
  }

  async update(
    id: unknown,
    { title, description }: CreateTodoDto
  ): Promise<UpdateTodoReturnDto> {
    const user = this.userStoreService.get();

    if (!(await this.todoRepository.findOne({ user, id }))) {
      throw new HttpException(404, "Todo does not exist.");
    }

    await this.todoRepository.update({ user, id }, { title, description });
    return { id, title, description };
  }

  async delete(id: unknown): Promise<void> {
    const user = this.userStoreService.get();

    if (!(await this.todoRepository.findOne({ user, id }))) {
      throw new HttpException(404, "Todo does not exist.");
    }

    await this.todoRepository.deleteOne({ user, id });
  }
}
