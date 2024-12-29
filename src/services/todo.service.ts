import todoRepository from "../database/repositories/todo.repository.js";
import { CreateTodoDto, FindTodoDto } from "../dto/todo.dto.js";
import { HttpException } from "../exceptions/http.exception.js";
import userStore from "../stores/user.store.js";
import { IRepository, ITodo, QueryFilter } from "../types/database.types.js";

class TodoService {
  constructor(private readonly todoRepo: IRepository<ITodo> = todoRepository) {}

  async create({ title, description }: CreateTodoDto) {
    const user = userStore.get();
    const { id, createdAt } = await this.todoRepo.create({
      user,
      title,
      description,
    });
    return { id, title, description, createdAt };
  }

  async find({ page, limit, date, sort = "-createdAt" }: FindTodoDto) {
    const user = userStore.get();
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
    const unslicedTodos = await this.todoRepo.findAll(query, { sort });
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

  async update(id: unknown, { title, description }: CreateTodoDto) {
    const user = userStore.get();

    if (!(await this.todoRepo.findOne({ user, id }))) {
      throw new HttpException(404, "Todo does not exist.");
    }

    await this.todoRepo.update({ user, id }, { title, description });
    return { id, title, description };
  }

  async delete(id: unknown) {
    const user = userStore.get();

    if (!(await this.todoRepo.findOne({ user, id }))) {
      throw new HttpException(404, "Todo does not exist.");
    }

    await this.todoRepo.deleteOne({ user, id });
  }
}

export default new TodoService();
