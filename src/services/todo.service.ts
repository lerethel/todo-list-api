import { CreateTodoDto, FindTodoDto } from "../dto/todo.dto.js";
import Todo from "../models/todo.model.js";
import userStore from "../stores/user.store.js";

class TodoService {
  async create({ title, description }: CreateTodoDto) {
    const user = userStore.get();
    const todo = await Todo.create({ user, title, description });
    return { id: todo._id, title, description, timestamp: todo.timestamp };
  }

  async find({ page, limit, date, sort }: FindTodoDto) {
    const user = userStore.get();
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

    // Ignore { page } and { limit } for now to count the total number of pages.
    // This is faster than calling .countDocuments().
    const unslicedTodos = await selection.lean().exec();
    const totalPages = Math.ceil(unslicedTodos.length / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

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
      page,
      limit,
      total,
      totalPages,
    };
  }

  async update(id: string, { title, description }: CreateTodoDto) {
    const user = userStore.get();
    await Todo.updateOne({ user, _id: id }, { title, description }).exec();
    return { id, title, description };
  }

  async delete(id: string) {
    const user = userStore.get();
    await Todo.deleteOne({ user, _id: id }).exec();
  }
}

export default new TodoService();
