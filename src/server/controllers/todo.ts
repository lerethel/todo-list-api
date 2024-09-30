import type { ValidatedHandler } from "../types.js";

import Todo from "../models/todo.js";
import * as validate from "../utils/validate.js";

export const createTodo: ValidatedHandler = [
  validate.todoTitle,
  validate.todoDescription,
  validate.sendErrorsIfExist,
  async (req, res) => {
    const { title, description } = req.body;
    const todo = await Todo.create({ user: req.user, title, description });
    res.status(201).json({ id: todo._id, title, description });
  },
];

export const getTodos: ValidatedHandler = [
  validate.todoPageQuery,
  validate.todoLimitQuery,
  validate.todoSortQuery,
  validate.todoDateQuery,
  validate.sendErrorsIfExist,
  async (req, res) => {
    const { page, limit, date, sort } = req.query as Record<string, string>;
    const selection = Todo.find({ user: req.user });

    if (date) {
      const [startDate, stopDate] = date.split(":");
      selection.gte("timestamp", Date.parse(startDate));
      if (stopDate) {
        selection.lte("timestamp", Date.parse(stopDate));
      }
    }

    if (sort) {
      selection.sort(sort);
    }

    const pageAsNumber = parseInt(page);
    const limitAsNumber = parseInt(limit);

    const todos = await selection
      .skip((pageAsNumber - 1) * limitAsNumber)
      .limit(limitAsNumber)
      .lean()
      .exec();

    const total = todos.length;

    if (!total) {
      return res.sendStatus(404);
    }

    res.json({
      data: todos.map(({ _id, title, description, timestamp }) => {
        return { id: _id, title, description, timestamp };
      }),
      page: pageAsNumber,
      limit: limitAsNumber,
      total,
    });
  },
];

export const updateTodo: ValidatedHandler = [
  validate.todoTitle,
  validate.todoDescription,
  validate.todoIdParam,
  validate.sendErrorsIfExist,
  async (req, res) => {
    const { title, description } = req.body;
    await Todo.updateOne(
      { user: req.user, _id: req.params.id },
      { title, description }
    ).exec();

    res.status(200).json({ id: req.params.id, title, description });
  },
];

export const deleteTodo: ValidatedHandler = [
  validate.todoIdParam,
  validate.sendErrorsIfExist,
  async (req, res) => {
    await Todo.deleteOne({ user: req.user, _id: req.params.id }).exec();
    res.sendStatus(204);
  },
];
