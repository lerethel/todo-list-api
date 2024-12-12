import { CreateTodoDto, FindTodoDto } from "../dto/todo.dto.js";
import Todo from "../models/todo.model.js";

class TodoService {
  async create(user: string, { title, description }: CreateTodoDto) {
    const todo = await Todo.create({ user, title, description });
    return { id: todo._id, title, description, timestamp: todo.timestamp };
  }

  async find(user: string, { page, limit, date, sort }: FindTodoDto) {
    const selection = Todo.find({ user });

    if (date) {
      const [from, to] = date.split(":");
      selection.gte("timestamp", Date.parse(from));
      if (to) {
        selection.lte("timestamp", Date.parse(to));
      }
    }

    if (sort) {
      selection.sort(sort);
    }

    const pageAsNumber = +page;
    const limitAsNumber = +limit;

    // Ignore { page } and { limit } for now to count the total number of pages.
    // This is faster than calling .countDocuments().
    const unslicedTodos = await selection.lean().exec();
    const totalPages = Math.ceil(unslicedTodos.length / limitAsNumber);

    const startIndex = (pageAsNumber - 1) * limitAsNumber;
    const endIndex = startIndex + limitAsNumber;

    // Get the requested part of the list.
    const todos = unslicedTodos.slice(startIndex, endIndex);
    const total = todos.length;

    return {
      data: todos.map(({ _id, title, description, timestamp }) => ({
        id: _id,
        title,
        description,
        timestamp,
      })),
      page: pageAsNumber,
      limit: limitAsNumber,
      total,
      totalPages,
    };
  }

  async update(
    user: string,
    id: string,
    { title, description }: CreateTodoDto
  ) {
    await Todo.updateOne({ user, _id: id }, { title, description }).exec();
    return { id, title, description };
  }

  async delete(user: string, id: string) {
    await Todo.deleteOne({ user, _id: id }).exec();
  }
}

export default new TodoService();
